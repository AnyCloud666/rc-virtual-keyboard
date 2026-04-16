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
  Space,
  StartSelect,
  Tab,
  VKB_POSITION_MODE,
  VKB_THEME_MODE,
  ZH,
  controlsType,
  letterType,
  numberType,
  settingType,
} from '../keys';
import { VKB } from '../typing';
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

const useInput = ({
  themeMode = LightTheme.code,
  positionMode = FloatPosition.code,
  defaultActiveKeyboard = numberType,
  focusShow,
  useKeydownAudio = 'Y',
  keydownAudioUrl = '/audio/typing-sound-02-229861.mp3',
  autoPopup = true,
  onChangeShow,
  onThemeModeChange,
  onPositionModeChange,
  onUseKeydownAudioChange,
  onKeydownAudioUrlChange,
  onPinyin2Chinese = pinyin2ChineseV2,
  onImageToWord = imgToWordV1,
}: {
  /** 主题模式 */
  themeMode?: string;
  /** 位置模式 */
  positionMode?: string;
  /** 默认活跃的键盘 */
  defaultActiveKeyboard?: string;
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
  /** 主题改变 */
  onThemeModeChange?: (mode: string) => void;
  /** 位置模式改变 */
  onPositionModeChange?: (mode: string) => void;
  /** 开启按键音效 */
  onUseKeydownAudioChange?: (mode: 'Y' | 'N') => void;
  onKeydownAudioUrlChange?: (url: string) => void;
  /** 拼音转汉字，自定义实现拼音转汉字，默认采用最简单的单字输入模式 */
  onPinyin2Chinese?: (value: string) => { pinyin: string; chinese: string[] };
  /** 图片转文字，自定义实现图片转文字，默认采用 tesseract.js 识别图片文字 */
  onImageToWord?: (url: string) => Promise<string[]>;
}) => {
  /** 光标选择模式 */
  const cursorMode = useRef('index');
  /** input type 为 number，email 造成的一些异常 selection 相关属性无法使用 */
  const inputType = useRef('');
  /** 当前活动的input */
  const activeInputRef = useRef<HTMLInputElement | null>(null);
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
  /** 删除inputValue 不立马删除targetValue中的值 */
  const jumpDelete = useRef(false);
  /** 焦点状态 */
  const cacheInputFocus = useRef(new WeakSet());
  /** blur 延迟定时器，避免输入框切换时闪烁 */
  const blurTimer = useRef<number>();
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

  const shouldShowOnFocus = (inputEl: HTMLInputElement) => {
    const vkbShow = inputEl.dataset?.vkbShow;
    const vkbAutoPopup = inputEl.dataset?.vkbAutoPopup;

    if (vkbShow === 'true') return true;
    if (vkbShow === 'false') return false;
    if (vkbAutoPopup === 'true') return true;
    if (vkbAutoPopup === 'false') return false;

    return enableFocusShow;
  };

  const shouldHideOnBlur = (inputEl: HTMLInputElement | null) => {
    if (!inputEl) return true;

    return inputEl.dataset?.vkbBlurHidden !== 'false';
  };

  const bindInputListener = (inputEl: HTMLInputElement) => {
    if (!cacheInputFocus.current.has(inputEl)) {
      cacheInputFocus.current.add(inputEl);
      inputEl.addEventListener('blur', onBlur);
      inputEl.addEventListener('focus', onFocus);
    }
  };

  const activateInput = (
    inputEl: HTMLInputElement,
    options?: { syncShow?: boolean },
  ) => {
    inputType.current = inputEl.dataset?.vkbType ?? '';
    activeInputRef.current = inputEl;
    bindInputListener(inputEl);

    if (options?.syncShow) {
      onChangeShow && onChangeShow(shouldShowOnFocus(inputEl));
    }
  };

  /** 失去焦点 */
  const onBlur = useCallback(
    (e: FocusEvent) => {
      window.clearTimeout(blurTimer.current);
      blurTimer.current = window.setTimeout(() => {
        const nextActiveElement = document.activeElement;
        const currentInput = e.target as HTMLInputElement | null;

        if (isSupportedInput(nextActiveElement)) {
          return;
        }

        if (activeInputRef.current === currentInput) {
          activeInputRef.current = null;
          inputType.current = '';
        }

        if (shouldHideOnBlur(currentInput)) {
          onChangeShow && onChangeShow(false);
        }
      }, 0);
    },
    [onChangeShow],
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
    [onChangeShow, enableFocusShow],
  );

  /** 寻找聚焦有效的input */
  const findFocusElement = (e: MouseEvent | FocusEvent) => {
    const activeElement = e.target as HTMLInputElement;

    if (isSupportedInput(activeElement)) {
      activateInput(activeElement, { syncShow: true });
    }
  };
  useEventListener('click', findFocusElement, { target: document.body });
  useEventListener('focusin', findFocusElement, { target: document.body });

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
      const result = await onImageToWord(url);
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
        inputMode === ZH &&
        e.key !== Space.code &&
        activeKeyboard === letterType
      ) {
        updateChineseCandidates(inputValue + e.key);
        jumpDelete.current = false;
      } else {
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
          selectionStart + 1,
          selectionStart + 1,
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

      if (inputMode === ZH) {
        const value = inputValue.slice(0, inputValue.length - 1);
        updateChineseCandidates(value);

        if (value) return;

        if (!value && !jumpDelete.current) {
          jumpDelete.current = true;
          return;
        }
      }

      // 获取光标位置
      const { selectionStart, selectionEnd, value, isCollapsed } =
        getSelectionInfo(activeInputRef.current);

      const tempValue =
        value.slice(0, selectionStart - (isCollapsed ? 1 : 0)) +
        value.slice(selectionEnd);
      applyInputValue(
        activeInputRef.current,
        tempValue,
        selectionStart - (isCollapsed ? 1 : 0),
        isCollapsed ? selectionEnd - 1 : selectionStart,
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
            index = selectionEnd - 1 > 0 ? selectionEnd - 1 : 0;
            activeInputRef.current.setSelectionRange(index, index);
            break;
          case ArrowRight.code:
            index = selectionEnd + 1 > maxLength ? maxLength : selectionEnd + 1;
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
            index = selectionStart - 1 > 0 ? selectionStart - 1 : 0;
            activeInputRef.current.setSelectionRange(index, selectionEnd);
            break;
          case ArrowRight.code:
            if (selectionEnd < maxLength) {
              index =
                selectionEnd + 1 > maxLength ? maxLength : selectionEnd + 1;
              activeInputRef.current.setSelectionRange(selectionStart, index);
            } else {
              index =
                selectionStart + 1 > maxLength ? maxLength : selectionStart + 1;
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
  };

  /** 选择输入的中文 */
  const onSelectChinese = (chinese: string) => {
    if (
      activeInputRef.current &&
      !NEED_HANDLE_INPUT_TYPES.includes(inputType.current)
    ) {
      let { value, selectionEnd } = getSelectionInfo(activeInputRef.current);
      selectionEnd = selectionEnd || 1;

      value =
        value.slice(0, selectionEnd) + chinese + value.slice(selectionEnd);

      // 选择中文候选词后，同样通过原生 setter 回填输入框。
      applyInputValue(
        activeInputRef.current,
        value,
        chinese.length + selectionEnd,
        chinese.length + selectionEnd,
      );

      // 通知 React / 业务侧当前值已经变化。
      emitInputEvent();
    } else {
      console.error('input type = email or number not allow input chinese');
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
    // setInputValue('');
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
        // onEnter && onEnter();
        // TODO
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

  /**
   * 点击事件分发
   *
   * @description
   * 先执行当前键位对应的输入/控制逻辑，再补发键盘事件，
   * 让外部组件有机会监听到更接近真实键盘输入的事件流。
   */
  const onClick = (e: VKB.KeyboardAttributeType) => {
    if (e.keyType === controlsType) {
      onControl(e);
    } else if (e.keyType === settingType) {
      onSetting(e);
    } else {
      onInput(e);
    }
    if (audio && vkbKeydownAudio === 'Y') {
      audio.pause();
      audio.play();
    }

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
  const createBackgroundAudio = () => {
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
  };

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
  }, []);

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
  };
};

export default useInput;
