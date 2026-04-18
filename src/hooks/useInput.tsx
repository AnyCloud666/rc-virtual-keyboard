import { useEventListener } from 'ahooks';
import { useCallback, useEffect, useRef, useState } from 'react';
import {
  ArrowDown,
  ArrowLeft,
  ArrowLeftFirst,
  ArrowRight,
  ArrowRightEnd,
  ArrowUp,
  BackgroundAudio,
  Backspace,
  CapsLock,
  Clear,
  Copy,
  DarkTheme,
  EN,
  Enter,
  FixedBottomPosition,
  FixedLeftPosition,
  FixedRightPosition,
  FixedTopPosition,
  FloatPosition,
  LightTheme,
  Paste,
  SelectAll,
  Shift,
  Space,
  StartSelect,
  Tab,
  VKB_POSITION_MODE,
  VKB_THEME_MODE,
  ZH,
  controlsType,
  functionType,
  letterType,
  numberType,
  settingType,
} from '../keys';
import { VKB } from '../typing';
import { english2WordsV1 } from '../utils/english';
import { imgToWordV1 } from '../utils/imgToWord';
import { pinyin2ChineseV2 } from '../utils/pinyin';
import {
  Simulate,
  SimulateEventData,
  setNativeInputValue,
} from '../utils/simulate';
import {
  EFFECTIVE_INPUT_TYPES,
  INVALID_INPUT_TYPES,
  NEED_HANDLE_INPUT_TYPES,
} from './constants';

let audio: HTMLAudioElement;

const isHighSurrogate = (value: string, index: number) => {
  const code = value.charCodeAt(index);
  return code >= 0xd800 && code <= 0xdbff;
};

const isLowSurrogate = (value: string, index: number) => {
  const code = value.charCodeAt(index);
  return code >= 0xdc00 && code <= 0xdfff;
};

const getPreviousCursorIndexFallback = (value: string, index: number) => {
  if (index <= 0) return 0;

  if (
    index >= 2 &&
    isLowSurrogate(value, index - 1) &&
    isHighSurrogate(value, index - 2)
  ) {
    return index - 2;
  }

  return index - 1;
};

const getNextCursorIndexFallback = (value: string, index: number) => {
  if (index >= value.length) return value.length;

  if (
    index + 1 < value.length &&
    isHighSurrogate(value, index) &&
    isLowSurrogate(value, index + 1)
  ) {
    return index + 2;
  }

  return index + 1;
};

type SegmentLike = {
  index?: number;
  segment: string;
};

const getGraphemeBoundaries = (value: string) => {
  const boundaries = [0];

  if (
    typeof Intl !== 'undefined' &&
    typeof (
      Intl as typeof Intl & {
        Segmenter?: new (
          locales?: string | string[],
          options?: { granularity?: 'grapheme' | 'word' | 'sentence' },
        ) => { segment(input: string): Iterable<SegmentLike> };
      }
    ).Segmenter === 'function'
  ) {
    const segmenter = new (
      Intl as typeof Intl & {
        Segmenter: new (
          locales?: string | string[],
          options?: { granularity?: 'grapheme' | 'word' | 'sentence' },
        ) => { segment(input: string): Iterable<SegmentLike> };
      }
    ).Segmenter(undefined, {
      granularity: 'grapheme',
    });

    for (const item of segmenter.segment(value)) {
      if (typeof item.index === 'number') {
        boundaries.push(item.index + item.segment.length);
      }
    }
  } else {
    let cursor = 0;

    while (cursor < value.length) {
      cursor = getNextCursorIndexFallback(value, cursor);
      boundaries.push(cursor);
    }
  }

  if (boundaries[boundaries.length - 1] !== value.length) {
    boundaries.push(value.length);
  }

  return [...new Set(boundaries)].sort((a, b) => a - b);
};

const getPreviousCursorIndex = (value: string, index: number) => {
  const boundaries = getGraphemeBoundaries(value);

  for (let i = boundaries.length - 1; i >= 0; i -= 1) {
    if (boundaries[i] < index) {
      return boundaries[i];
    }
  }

  return 0;
};

const getNextCursorIndex = (value: string, index: number) => {
  const boundaries = getGraphemeBoundaries(value);

  for (let i = 0; i < boundaries.length; i += 1) {
    if (boundaries[i] > index) {
      return boundaries[i];
    }
  }

  return value.length;
};

const useInput = ({
  themeMode = LightTheme.code,
  positionMode = FloatPosition.code,
  defaultActiveKeyboard = numberType,
  keyboardVisible = true,
  focusShow,
  useKeydownAudio = 'Y',
  keydownAudioUrl = '/audio/typing-sound-02-229861.mp3',
  autoPopup = true,
  onChangeShow,
  onActiveInputChange,
  onThemeModeChange,
  onPositionModeChange,
  onUseKeydownAudioChange,
  onKeydownAudioUrlChange,
  onPinyin2Chinese = pinyin2ChineseV2,
  onEnglishWords = english2WordsV1,
  onImageToWord = imgToWordV1,
}: {
  /** 主题模式 */
  themeMode?: string;
  /** 位置模式 */
  positionMode?: string;
  /** 默认活跃的键盘 */
  defaultActiveKeyboard?: string;
  /** 当前键盘是否处于可见状态 */
  keyboardVisible?: boolean;
  /** 输入框 focus 时是否自动显示键盘，全局关闭后可通过 data-vkb-show 单独开启 */
  focusShow?: boolean;
  /** 使用按键音效 */
  useKeydownAudio?: 'Y' | 'N';
  /** 按键音效url */
  keydownAudioUrl?: string;
  /** 自动弹出，兼容旧参数 */
  autoPopup?: boolean;
  /** 显示/隐藏 */
  onChangeShow?: (s: boolean) => void;
  /** 当前激活输入框变化 */
  onActiveInputChange?: (input: HTMLInputElement | null) => void;
  /** 主题改变 */
  onThemeModeChange?: (mode: string) => void;
  /** 位置模式改变 */
  onPositionModeChange?: (mode: string) => void;
  /** 开启按键音效 */
  onUseKeydownAudioChange?: (mode: 'Y' | 'N') => void;
  onKeydownAudioUrlChange?: (url: string) => void;
  /** 拼音转汉字，自定义实现拼音转汉字，默认采用最简单的单字输入模式 */
  onPinyin2Chinese?: (value: string) => { pinyin: string; chinese: string[] };
  /** 英文字母转单词候选 */
  onEnglishWords?: (value: string) => string[];
  /** 图片转文字，自定义实现图片转文字，默认采用 tesseract.js 识别图片文字 */
  onImageToWord?: (
    url: string,
    options?: VKB.ImageRecognitionOptions,
  ) => Promise<string[]>;
}) => {
  /** 光标选择模式 */
  const cursorMode = useRef('index');
  /** input type 为 number，email 造成的一些异常 selection 相关属性无法使用 */
  const inputType = useRef('');
  /** 当前活动的input */
  const activeInputRef = useRef<HTMLInputElement | null>(null);
  /** 最近一次有效激活的 input，供候选回填时兜底使用 */
  const lastActiveInputRef = useRef<HTMLInputElement | null>(null);
  /** 当前活动的键盘 */
  const [activeKeyboard, setActiveKeyboard] = useState<string>(
    defaultActiveKeyboard,
  );
  /** 输入模式 默认英文en ,中文zh */
  const [inputMode, setInputMode] = useState<VKB.InputMode>(EN);
  /** 输入的值 */
  const [inputValue, setInputValue] = useState('');
  /** 当前拼音转成的中文 */
  const [chinese, setChinese] = useState<string[]>([]);
  /** 当前高亮的按键 code */
  const [activeKeyCodes, setActiveKeyCodes] = useState<string[]>([]);
  /** 实体键盘 caps lock 状态 */
  const [capsLockActive, setCapsLockActive] = useState(false);
  /** 删除inputValue 不立马删除targetValue中的值 */
  const jumpDelete = useRef(false);
  /** 焦点状态 */
  const cacheInputFocus = useRef(new WeakSet());
  /** blur 延迟定时器，避免输入框切换时闪烁 */
  const blurTimer = useRef<number>();
  /** 键盘交互保护窗口，避免移动端长按时误判为真正失焦 */
  const keyboardInteractionUntilRef = useRef(0);
  /** 监听器引用，避免回调依赖形成循环 */
  const onBlurHandlerRef = useRef<(e: FocusEvent) => void>();
  const onFocusHandlerRef = useRef<(e: FocusEvent) => void>();
  /** focus 弹出配置，autoPopup 作为兼容别名保留 */
  const enableFocusShow = focusShow ?? autoPopup;

  /** 颜色主题 */
  const [vkbThemeMode, setVkbThemeMode] = useState(
    themeMode ?? localStorage?.getItem(VKB_THEME_MODE) ?? 'float',
  );
  /** 键盘位置 */
  const [vkbPositionMode, setVkbPositionMode] = useState(
    positionMode ?? localStorage?.getItem(VKB_POSITION_MODE) ?? 'float',
  );
  /** 按键音效 */
  const [vkbKeydownAudio, setVkbKeydownAudio] = useState(useKeydownAudio);

  const activateKeyCode = useCallback((code: string) => {
    setActiveKeyCodes((prev) => (prev.includes(code) ? prev : [...prev, code]));
  }, []);

  const playKeydownAudio = useCallback(() => {
    if (!audio || vkbKeydownAudio !== 'Y' || !keyboardVisible) {
      return;
    }

    audio.pause();
    audio.currentTime = 0;
    void audio.play().catch(() => undefined);
  }, [keyboardVisible, vkbKeydownAudio]);

  const markKeyboardInteraction = useCallback((duration = 1200) => {
    keyboardInteractionUntilRef.current = Date.now() + duration;
  }, []);

  const releaseKeyCode = useCallback((code: string, delay = 0) => {
    window.setTimeout(() => {
      setActiveKeyCodes((prev) => prev.filter((item) => item !== code));
    }, delay);
  }, []);

  const isKeyActive = useCallback(
    (key: VKB.KeyboardAttributeType) => activeKeyCodes.includes(key.code),
    [activeKeyCodes],
  );

  const resolvePhysicalKeyCodes = useCallback((e: KeyboardEvent) => {
    const nextCodes = new Set<string>();
    const normalizedKey = typeof e.key === 'string' ? e.key : '';
    const digitMatch = e.code.match(/^Digit(\d)$/);
    const functionMatch = e.code.match(/^F([1-9]|1[0-2])$/);
    const isPhysicalShift =
      e.code === 'ShiftLeft' || e.code === 'ShiftRight' || e.key === 'Shift';
    const isPhysicalCapsLock = e.code === 'CapsLock' || e.key === 'CapsLock';

    if (digitMatch) {
      nextCodes.add(`Numpad${digitMatch[1]}`);
    }

    if (functionMatch) {
      nextCodes.add(`F${functionMatch[1]}`);
    }

    if (/^Numpad\d$/.test(e.code) || /^Key[A-Z]$/.test(e.code)) {
      nextCodes.add(e.code);
    }

    switch (e.code) {
      case Backspace.code:
      case Enter.code:
      case Tab.code:
      case Space.code:
      case CapsLock.code:
      case ArrowUp.code:
      case ArrowDown.code:
      case ArrowLeft.code:
      case ArrowRight.code:
        nextCodes.add(e.code);
        break;
      case 'Home':
        nextCodes.add(ArrowLeftFirst.code);
        break;
      case 'End':
        nextCodes.add(ArrowRightEnd.code);
        break;
    }

    if (isPhysicalShift) {
      nextCodes.add(Shift.code);
    }

    if (isPhysicalCapsLock) {
      nextCodes.add(CapsLock.code);
    }

    switch (normalizedKey) {
      case '-':
        nextCodes.add('NumpadSubtract');
        break;
      case '+':
        nextCodes.add('NumpadAdd');
        break;
      case '*':
        nextCodes.add('NumpadMultiply');
        break;
      case '/':
        nextCodes.add('NumpadDivide');
        break;
      case '.':
        nextCodes.add('NumpadDecimal');
        break;
      case '%':
        nextCodes.add('NumpadPercentage');
        break;
    }

    return [...nextCodes];
  }, []);

  const isSupportedInput = (
    target: EventTarget | null,
  ): target is HTMLInputElement => {
    const activeElement = target as HTMLInputElement | null;

    return !!(
      activeElement?.tagName === 'INPUT' &&
      [...EFFECTIVE_INPUT_TYPES, ...NEED_HANDLE_INPUT_TYPES].includes(
        activeElement?.type ?? '',
      ) &&
      activeElement.dataset?.vkbDisabled !== 'true'
    );
  };

  const shouldShowOnFocus = useCallback((inputEl: HTMLInputElement) => {
    const vkbShow = inputEl.dataset?.vkbShow;
    const vkbAutoPopup = inputEl.dataset?.vkbAutoPopup;

    if (vkbShow === 'true') return true;
    if (vkbShow === 'false') return false;
    if (vkbAutoPopup === 'true') return true;
    if (vkbAutoPopup === 'false') return false;

    return enableFocusShow;
  }, [enableFocusShow]);

  const shouldHideOnBlur = (inputEl: HTMLInputElement | null) => {
    if (!inputEl) return true;

    return inputEl.dataset?.vkbBlurHidden !== 'false';
  };

  const bindInputListener = useCallback((inputEl: HTMLInputElement) => {
    if (!cacheInputFocus.current.has(inputEl)) {
      cacheInputFocus.current.add(inputEl);
      inputEl.addEventListener('blur', (event) => {
        onBlurHandlerRef.current?.(event as FocusEvent);
      });
      inputEl.addEventListener('focus', (event) => {
        onFocusHandlerRef.current?.(event as FocusEvent);
      });
    }
  }, []);

  const activateInput = useCallback((
    inputEl: HTMLInputElement,
    options?: { syncShow?: boolean },
  ) => {
    const hasSwitchedInput =
      !!activeInputRef.current && activeInputRef.current !== inputEl;

    if (hasSwitchedInput) {
      setInputValue('');
      setChinese([]);
      jumpDelete.current = false;
    }

    inputType.current = inputEl.dataset?.vkbType ?? '';
    activeInputRef.current = inputEl;
    lastActiveInputRef.current = inputEl;
    onActiveInputChange?.(inputEl);
    bindInputListener(inputEl);

    if (options?.syncShow) {
      if (shouldShowOnFocus(inputEl)) {
        onChangeShow && onChangeShow(true);
      }
    }
  }, [bindInputListener, onActiveInputChange, onChangeShow, shouldShowOnFocus]);

  /** 失去焦点 */
  const onBlur = useCallback(
    (e: FocusEvent) => {
      window.clearTimeout(blurTimer.current);
      blurTimer.current = window.setTimeout(() => {
        const nextActiveElement = document.activeElement;
        const currentInput = e.target as HTMLInputElement | null;
        const isKeyboardInteractionActive =
          Date.now() < keyboardInteractionUntilRef.current;

        if (isSupportedInput(nextActiveElement)) {
          return;
        }

        if (isKeyboardInteractionActive && currentInput) {
          currentInput.focus({ preventScroll: true });
          return;
        }

        // 输入框一旦真正失焦，就清空当前中英文组合输入的待选区，
        // 避免候选内容残留到下一次输入或切换到其他输入框时产生干扰。
        setInputValue('');
        setChinese([]);

        if (activeInputRef.current === currentInput) {
          activeInputRef.current = null;
          inputType.current = '';
          onActiveInputChange?.(null);
        }

        if (shouldHideOnBlur(currentInput)) {
          onChangeShow && onChangeShow(false);
        }
      }, 0);
    },
    [onActiveInputChange, onChangeShow],
  );
  /** 获得焦点 */
  const onFocus = useCallback(
    (e: FocusEvent) => {
      window.clearTimeout(blurTimer.current);
      const activeElement = e.target as HTMLInputElement;

      if (!isSupportedInput(activeElement)) {
        return;
      }

      activateInput(activeElement, { syncShow: true });
    },
    [activateInput],
  );

  useEffect(() => {
    onBlurHandlerRef.current = onBlur;
    onFocusHandlerRef.current = onFocus;
  }, [onBlur, onFocus]);

  /** 寻找聚焦有效的input */
  const findFocusElement = (e: MouseEvent | FocusEvent) => {
    const activeElement = e.target as HTMLInputElement;

    if (isSupportedInput(activeElement)) {
      activateInput(activeElement, { syncShow: true });
    }
  };
  useEventListener('click', findFocusElement, { target: document.body });
  useEventListener('focusin', findFocusElement, { target: document.body });
  useEventListener(
    'keydown',
    (e: KeyboardEvent) => {
      setCapsLockActive(e.getModifierState?.('CapsLock') ?? false);
      if (
        (e.code === 'ShiftLeft' ||
          e.code === 'ShiftRight' ||
          e.key === 'Shift') &&
        !e.repeat
      ) {
        setInputMode((prev) => (prev === EN ? ZH : EN));
      }
      const physicalCodes = resolvePhysicalKeyCodes(e);
      physicalCodes.forEach((code) => activateKeyCode(code));

      if (physicalCodes.length > 0 && !e.repeat) {
        playKeydownAudio();
      }
    },
    { target: window },
  );
  useEventListener(
    'keyup',
    (e: KeyboardEvent) => {
      setCapsLockActive(e.getModifierState?.('CapsLock') ?? false);
      resolvePhysicalKeyCodes(e).forEach((code) => releaseKeyCode(code));
    },
    { target: window },
  );

  /**
   * 禁用类型
   *
   * @param {HTMLInputElement} inputEl
   * @return {*}
   */
  const validateInputType = (inputEl: HTMLInputElement) => {
    return [...INVALID_INPUT_TYPES, ...NEED_HANDLE_INPUT_TYPES].includes(
      inputEl.type,
    );
  };

  const reportInvalidInputType = () => {
    console.error('disabled type', [
      ...INVALID_INPUT_TYPES,
      ...NEED_HANDLE_INPUT_TYPES,
    ]);
    console.error(
      'if you need type="number" please use data-vkb-type="number" replace',
    );
  };

  const getSelectionInfo = (inputEl: HTMLInputElement) => {
    const selectionStart = inputEl.selectionStart ?? 0;
    const selectionEnd = inputEl.selectionEnd ?? 0;

    return {
      value: inputEl.value,
      selectionStart,
      selectionEnd,
      isCollapsed: selectionStart === selectionEnd,
    };
  };

  const applyInputValue = (
    inputEl: HTMLInputElement,
    value: string,
    selectionStart?: number,
    selectionEnd?: number,
  ) => {
    setNativeInputValue(inputEl, value);

    if (
      typeof selectionStart === 'number' &&
      typeof selectionEnd === 'number' &&
      typeof inputEl.setSelectionRange === 'function'
    ) {
      inputEl.setSelectionRange(selectionStart, selectionEnd);
    }
  };

  const updateChineseCandidates = (value: string) => {
    const transformMsg = (onPinyin2Chinese && onPinyin2Chinese(value)) || {
      pinyin: value,
      chinese: [],
    };

    setInputValue(value);
    setChinese([value, ...transformMsg.chinese]);
  };

  /**
   * 更新字母键候选
   *
   * @description
   * 中文模式走拼音转汉字，英文模式走单词前缀匹配。
   * 为了保持两种模式交互一致，候选首位始终保留原始输入值，用户可以直接回填原文。
   */
  const updateLetterCandidates = (value: string) => {
    if (!value) {
      setInputValue('');
      setChinese([]);
      return;
    }

    if (inputMode === ZH) {
      updateChineseCandidates(value);
      return;
    }

    const words = onEnglishWords?.(value) || [];
    setInputValue(value);
    setChinese([value, ...words.filter((word) => word !== value)]);
  };

  /**
   * 当前是否处于字母组合输入模式
   *
   * @description
   * 仅在字母键盘下对英文字母/拼音字母进入候选态，
   * 其余键位仍然保持原来的直接输入行为。
   */
  const shouldUseLetterComposition = (key: string) => {
    return activeKeyboard === letterType && /^[a-zA-Z]$/.test(key);
  };

  /**
   * 提交当前候选值
   *
   * @param {string} [appendText]
   * @return {boolean}
   *
   * @description
   * 当输入区存在内容时，中文模式优先提交第一个中文候选，
   * 若没有中文候选则回退到原始输入；英文模式保持默认候选提交逻辑。
   */
  const commitCurrentCandidate = (appendText = '') => {
    if (!activeInputRef.current || !inputValue) return false;

    const candidate =
      inputMode === ZH
        ? chinese[1] || chinese[0] || inputValue
        : chinese[0] || inputValue;
    onSelectChinese(candidate, appendText);
    return true;
  };

  /**
   * 是否允许输入 数字 . + -
   * 且 + - 必须在最前面
   * true 允许 false 不允许
   */
  const isAllowInputNumber = (type: string, str: string, value: string) => {
    if (type === 'number') {
      return !/^[-+]?(\d+)?(\.)?(\d+)?$/.test(str + value);
    }
    return false;
  };

  /**
   * 触发输入相关事件
   *
   * @description
   * 这里不再依赖 react-dom/test-utils，而是派发自定义模拟事件。
   * 顺序保持为先 input 再 change，尽量贴近 React / antd 对输入值变更的感知方式。
   */
  const emitInputEvent = () => {
    if (!activeInputRef.current) return;
    Simulate?.input?.(activeInputRef.current);
    Simulate?.change?.(activeInputRef.current);
  };

  /** 识别 */
  const onRecognition = async (url: string) => {
    try {
      const result = await onImageToWord(url, {
        inputMode,
      });
      setChinese([...new Set(result)]);
    } catch (error) {
      console.log('error: ', error);
      setChinese([]);
    }
  };

  /** 输入 */
  const onInput = (e: VKB.KeyboardAttributeType) => {
    if (activeInputRef.current && typeof e.key === 'string') {
      let { value, selectionStart, selectionEnd, isCollapsed } =
        getSelectionInfo(activeInputRef.current);
      const vkbNotEmpty = activeInputRef.current.dataset?.vkbNotEmpty;
      const vkbNotEmptyTrim = activeInputRef.current.dataset?.vkbNotEmptyTrim;
      const vkbNotInput =
        activeInputRef.current.dataset?.vkbNotInput?.split(',');
      // 处理类型
      // if (!(await handleInputType(activeInputRef.current))) return;

      if (validateInputType(activeInputRef.current)) {
        reportInvalidInputType();
        return;
      }

      if (vkbNotInput?.includes(e.key)) {
        return;
      }
      if (vkbNotEmpty === 'true' && e.code === Space.code) {
        return;
      }
      if (
        vkbNotEmptyTrim === 'true' &&
        e.code === Space.code &&
        (selectionStart === 0 || selectionEnd === value.length)
      ) {
        return;
      }
      if (
        shouldUseLetterComposition(e.key) &&
        ((inputMode === ZH && e.key !== Space.code) || inputMode === EN)
      ) {
        updateLetterCandidates(inputValue + e.key.toLowerCase());
        jumpDelete.current = false;
      } else if (
        inputMode === EN &&
        inputValue &&
        activeKeyboard === letterType &&
        e.code === Space.code
      ) {
        commitCurrentCandidate(' ');
      } else {
        const insertedLength = e.key.length;

        // 处理 type = 'number' 时输入的其他字符
        if (isAllowInputNumber(inputType.current, value, e.key)) return;

        if (isCollapsed) {
          // 相同进行插入
          value =
            value.slice(0, selectionStart) +
            e.key +
            value.slice(selectionStart);
        } else {
          // 不同的将选中的进行的进行替换为最新的
          value =
            value.slice(0, selectionStart) + e.key + value.slice(selectionEnd);
        }

        // 通过原生 setter 更新 value，尽量保证 React 受控组件、
        // antd InputNumber / Form 等场景能正确感知到值变化。
        applyInputValue(
          activeInputRef.current,
          value,
          selectionStart + insertedLength,
          selectionStart + insertedLength,
        );

        emitInputEvent();
      }
    }
  };

  /** 删除 */
  const onBackspace = (e: VKB.KeyboardAttributeType) => {
    if (activeInputRef.current) {
      if (validateInputType(activeInputRef.current)) {
        reportInvalidInputType();
        return;
      }

      if (inputMode === ZH || inputMode === EN) {
        const value = inputValue.slice(0, inputValue.length - 1);
        updateLetterCandidates(value);

        if (value) return;

        if (!value && !jumpDelete.current) {
          jumpDelete.current = true;
          return;
        }
      }

      // 获取光标位置
      const { selectionStart, selectionEnd, value, isCollapsed } =
        getSelectionInfo(activeInputRef.current);
      const deleteStart = isCollapsed
        ? getPreviousCursorIndex(value, selectionStart)
        : selectionStart;

      const tempValue = value.slice(0, deleteStart) + value.slice(selectionEnd);
      applyInputValue(
        activeInputRef.current,
        tempValue,
        deleteStart,
        deleteStart,
      );

      // 删除后补发输入事件，驱动上层受控状态同步。
      emitInputEvent();
    }
  };

  /** 光标操作 */
  const onCursor = (e: VKB.KeyboardAttributeType) => {
    if (activeInputRef.current) {
      if (validateInputType(activeInputRef.current)) {
        reportInvalidInputType();
        return;
      }

      const { selectionStart, selectionEnd, value } = getSelectionInfo(
        activeInputRef.current,
      );
      let index = 0;
      const maxLength = value.length;

      // TODO: 待优化
      if (cursorMode.current === 'index') {
        switch (e.code) {
          case ArrowUp.code:
          case ArrowLeftFirst.code:
            activeInputRef.current.setSelectionRange(0, 0);
            break;
          case ArrowLeft.code:
            index = getPreviousCursorIndex(value, selectionEnd);
            activeInputRef.current.setSelectionRange(index, index);
            break;
          case ArrowRight.code:
            index = getNextCursorIndex(value, selectionEnd);
            activeInputRef.current.setSelectionRange(index, index);
            break;
          case ArrowDown.code:
          case ArrowRightEnd.code:
            activeInputRef.current.setSelectionRange(maxLength, maxLength);
            break;
          case SelectAll.code:
            activeInputRef.current.setSelectionRange(0, maxLength);
            break;
          case StartSelect.code:
            cursorMode.current = 'select';
            break;
        }
      } else {
        switch (e.code) {
          case ArrowUp.code:
          case ArrowLeftFirst.code:
            activeInputRef.current.setSelectionRange(0, selectionEnd);
            break;
          case ArrowLeft.code:
            index = getPreviousCursorIndex(value, selectionStart);
            activeInputRef.current.setSelectionRange(index, selectionEnd);
            break;
          case ArrowRight.code:
            if (selectionEnd < maxLength) {
              index = getNextCursorIndex(value, selectionEnd);
              activeInputRef.current.setSelectionRange(selectionStart, index);
            } else {
              index = getNextCursorIndex(value, selectionStart);
              activeInputRef.current.setSelectionRange(index, selectionEnd);
            }

            break;
          case ArrowDown.code:
          case ArrowRightEnd.code:
            activeInputRef.current.setSelectionRange(
              selectionEnd,
              value.length,
            );
            break;
          case SelectAll.code:
            activeInputRef.current.setSelectionRange(0, maxLength);
            break;
          case StartSelect.code:
            cursorMode.current = 'index';
            break;
        }
      }
    }
  };

  /** 模拟tab键 */
  const onTab = () => {
    try {
      const inputs = document.getElementsByTagName('input') || [];
      const inputList = Array.from(inputs).filter(
        (el) => !el.hasAttribute('disabled'),
      );
      if (document.activeElement?.tagName !== 'INPUT') {
        inputList[0]?.focus();
      } else {
        const curIndex = inputList.findIndex(
          (el) => el === document.activeElement,
        );
        if (curIndex + 1 <= inputList.length - 1) {
          inputList[curIndex + 1]?.focus();
        } else inputList[0]?.focus();
      }
    } catch (error) {
      console.log('error: ', error);
    }
  };

  /** 切换输入模式 */
  const onChangeInputMode = (mode: VKB.InputMode) => {
    setInputMode(mode);
    setInputValue('');
    setChinese([]);
  };

  /** 选择输入的中文 */
  const onSelectChinese = (
    chinese: string,
    appendText = '',
    options?: { replaceText?: string },
  ) => {
    const targetInput = activeInputRef.current ?? lastActiveInputRef.current;

    if (
      targetInput &&
      !NEED_HANDLE_INPUT_TYPES.includes(inputType.current)
    ) {
      let { value, selectionStart, selectionEnd } = getSelectionInfo(
        targetInput,
      );
      const replaceText = options?.replaceText;
      let insertStart = selectionStart;
      let insertEnd = selectionEnd;

      if (replaceText) {
        const beforeCursor = value.slice(0, selectionEnd);
        const replaceStart =
          beforeCursor.lastIndexOf(replaceText) !== -1
            ? beforeCursor.lastIndexOf(replaceText)
            : value.lastIndexOf(replaceText);

        if (replaceStart !== -1) {
          insertStart = replaceStart;
          insertEnd = replaceStart + replaceText.length;
        }
      }

      value =
        value.slice(0, insertStart) +
        chinese +
        appendText +
        value.slice(insertEnd);
      const insertedText = chinese + appendText;

      // 选择中文候选词后，同样通过原生 setter 回填输入框。
      applyInputValue(
        targetInput,
        value,
        insertedText.length + insertStart,
        insertedText.length + insertStart,
      );

      // 通知 React / 业务侧当前值已经变化。
      Simulate?.input?.(targetInput);
      Simulate?.change?.(targetInput);
    }
    setInputValue('');
    setChinese([]);
  };

  /** 拷贝 */
  const onCopy = async () => {
    if (activeInputRef.current) {
      const { selectionStart, selectionEnd, value } = getSelectionInfo(
        activeInputRef.current,
      );
      if (selectionStart === selectionEnd) {
        console.warn('no have copy content');
        return;
      }
      const copiedValue = value.slice(selectionStart, selectionEnd);
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(copiedValue);
        console.log('copy success');
      } else if (document.queryCommandSupported('copy')) {
        activeInputRef.current.select();
        document.execCommand('copy');
        activeInputRef.current.setSelectionRange(
          copiedValue.length,
          copiedValue.length,
        );
        console.log('copy success');
      } else {
        console.error('copy error');
      }
    }
  };

  /** 粘贴 */
  const onPaste = async () => {
    if (activeInputRef.current) {
      let { selectionStart, selectionEnd, value } = getSelectionInfo(
        activeInputRef.current,
      );

      if (navigator.clipboard) {
        const text = await navigator.clipboard.readText();
        value =
          value.slice(0, selectionStart) + text + value.slice(selectionEnd);
        // 粘贴内容后走统一的原生赋值 + 事件派发逻辑。
        applyInputValue(activeInputRef.current, value);
        emitInputEvent();
        console.log('paste success');
      } else if (document.queryCommandSupported('paste')) {
        activeInputRef.current.focus();
        const r = document.execCommand('paste');
        emitInputEvent();
        console.log(`paste ${r ? 'success' : 'error'}`);
      } else {
        console.error(
          'paste error navigator.clipboard and document.execCommand not support,You may need https',
        );
      }
    }
  };

  /** 清空临时输入区域 */
  const onClear = () => {
    setInputValue('');
    setChinese([]);
  };

  /** 控制类 */
  const onControl = (e: VKB.KeyboardAttributeType) => {
    switch (e.code) {
      // 删除
      case Backspace.code:
        onBackspace(e);
        break;
      // tab
      case Tab.code:
        onTab();
        break;
      // 回车
      case Enter.code:
        if (!commitCurrentCandidate()) {
          // onEnter && onEnter();
          // TODO
        }
        break;
      // 复制
      case Copy.code:
        onCopy();
        break;
      // 粘贴
      case Paste.code:
        onPaste();
        break;
      // 剪切板
      // case Clipboard.code:
      //   onClipboard();
      //   break;
      case ArrowUp.code:
      case ArrowLeft.code:
      case StartSelect.code:
      case ArrowRight.code:
      case ArrowDown.code:
      case ArrowLeftFirst.code:
      case ArrowRightEnd.code:
      case SelectAll.code:
        onCursor(e);
        break;
      case Clear.code:
        onClear();
        break;
    }
  };

  /** 设置类 */
  const onSetting = (e: VKB.KeyboardAttributeType) => {
    switch (e.code) {
      case LightTheme.code:
      case DarkTheme.code:
        setVkbThemeMode(e.code);
        onThemeModeChange && onThemeModeChange(e.code);
        break;
      case FixedBottomPosition.code:
      case FixedTopPosition.code:
      case FixedLeftPosition.code:
      case FixedRightPosition.code:
      case FloatPosition.code:
        setVkbPositionMode(e.code);
        onPositionModeChange && onPositionModeChange(e.code);
        break;
      case BackgroundAudio.code:
        setVkbKeydownAudio(vkbKeydownAudio === 'Y' ? 'N' : 'Y');
        onUseKeydownAudioChange &&
          onUseKeydownAudioChange(vkbKeydownAudio === 'Y' ? 'N' : 'Y');
        break;
    }
  };

  /** 功能键 */
  const onFunction = (e: VKB.KeyboardAttributeType) => {
    const keyboardEventInit = {
      bubbles: true,
      cancelable: true,
      key: e.key,
      code: e.code,
    };

    if (activeInputRef.current) {
      Simulate?.keyDown?.(activeInputRef.current, {
        key: e.key,
        code: e.code,
        keyCode: e.keyCode,
        which: e.keyCode,
      });
      Simulate?.keyUp?.(activeInputRef.current, {
        key: e.key,
        code: e.code,
        keyCode: e.keyCode,
        which: e.keyCode,
      });
      return;
    }

    window.dispatchEvent(new KeyboardEvent('keydown', keyboardEventInit));
    window.dispatchEvent(new KeyboardEvent('keyup', keyboardEventInit));
  };

  /**
   * 点击事件分发
   *
   * @description
   * 先执行当前键位对应的输入/控制逻辑，再补发键盘事件，
   * 让外部组件有机会监听到更接近真实键盘输入的事件流。
   */
  const onClick = (e: VKB.KeyboardAttributeType) => {
    markKeyboardInteraction();
    if (e.keyType === controlsType) {
      onControl(e);
    } else if (e.keyType === functionType) {
      onFunction(e);
    } else if (e.keyType === settingType) {
      onSetting(e);
    } else {
      onInput(e);
    }
    playKeydownAudio();

    if (!activeInputRef.current) return;
    Simulate?.keyPress?.(activeInputRef.current, {
      keyCode: e.keyCode,
      which: e.keyCode,
      code: e.code,
      key: e.key,
      charCode:
        typeof e.key === 'string' && e.key.length === 1
          ? e.key.charCodeAt(0)
          : undefined,
    } as SimulateEventData);
  };
  /**
   * 鼠标按下事件，模拟 keyDown
   *
   * @description
   * 虚拟键盘本质是点击 DOM，不会天然触发输入框的 keydown。
   * 这里补发一个模拟事件，兼容依赖键盘事件的上层组件。
   */
  const onKeyDown = (e: VKB.KeyboardAttributeType) => {
    markKeyboardInteraction();
    activateKeyCode(e.code);
    if (!activeInputRef.current) return;
    Simulate?.keyDown?.(activeInputRef.current, {
      keyCode: e.keyCode,
      which: e.keyCode,
      code: e.code,
      key: e.key,
    } as SimulateEventData);
  };
  /**
   * 鼠标抬起事件，模拟 keyUp
   *
   * @description
   * 与 onKeyDown 配套使用，补齐完整的键盘事件链路。
   */
  const onKeyUp = (e: VKB.KeyboardAttributeType) => {
    markKeyboardInteraction();
    releaseKeyCode(e.code, 120);
    if (!activeInputRef.current) return;
    Simulate?.keyUp?.(activeInputRef.current, {
      keyCode: e.keyCode,
      which: e.keyCode,
      code: e.code,
      key: e.key,
    } as SimulateEventData);
  };

  /** 通过事件冒泡的形式递归向上寻找，没有找到则不阻止冒泡 */
  const checkStopPropagation = (
    target: any,
    targetId: string,
    outId: string,
  ): boolean => {
    if (!target) return true;
    if (target.id === targetId) {
      return false;
    }
    if (target.id === outId) {
      return true;
    }
    return checkStopPropagation(target.parentNode, targetId, outId);
  };

  /** 整个键盘的鼠标按下事件，整个键盘的触摸事件，用来对虚拟键盘进行移动 */
  const onMouseDown = (
    e:
      | React.MouseEvent<HTMLDivElement, MouseEvent>
      | React.TouchEvent<HTMLDivElement>,
  ) => {
    markKeyboardInteraction();
    const isStop = checkStopPropagation(
      e.target,
      'keyboard-tab-move',
      'keyboard-tab',
    );
    e?.preventDefault?.();
    if (isStop) {
      e?.stopPropagation?.();
    }
  };

  /** 创建按键背景音乐 */
  const createBackgroundAudio = useCallback(() => {
    if (!keydownAudioUrl) return;
    audio = document.body.querySelector(
      '#keyboard-bg-audio',
    ) as HTMLAudioElement;
    if (!audio) {
      audio = document.createElement('audio');
      document.body.appendChild(audio);
      audio.id = 'keyboard-bg-audio';
    }
    audio.src = keydownAudioUrl;
  }, [keydownAudioUrl]);

  useEffect(() => {
    setVkbThemeMode(themeMode);
  }, [themeMode]);

  useEffect(() => {
    setVkbPositionMode(positionMode);
  }, [positionMode]);

  useEffect(() => {
    setVkbKeydownAudio(useKeydownAudio);
  }, [useKeydownAudio]);

  useEffect(() => {
    createBackgroundAudio();
  }, [createBackgroundAudio]);

  return {
    inputMode,
    inputValue,
    vkbThemeMode,
    vkbPositionMode,
    vkbKeydownAudio,
    chinese,
    activeKeyboard,
    onClick,
    onMouseDown,
    onSelectChinese,
    onChangeInputMode,
    setActiveKeyboard,
    onRecognition,
    onKeyDown,
    onKeyUp,
    isKeyActive,
    capsLockActive,
  };
};

export default useInput;
