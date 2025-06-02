import { useEventListener } from 'ahooks';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Simulate } from 'react-dom/test-utils';
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
  VKB_KEYDOWN_MODE,
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
import { pinyin2ChineseV1 } from '../utils/pinyin';

let audio: HTMLAudioElement;

const useInput = ({
  themeMode = LightTheme.code,
  positionMode = FloatPosition.code,
  defaultActiveKeyboard = numberType,
  useKeydownAudio = 'Y',
  keydownAudioUrl = '/audio/typing-sound-02-229861.mp3',
  autoPopup = true,
  onChange,
  onEnter,
  onChangeShow,
  onThemeModeChange,
  onPositionModeChange,
  onUseKeydownAudioChange,
  onKeydownAudioUrlChange,
  onPinyin2Chinese = pinyin2ChineseV1,
  onImageToWord = imgToWordV1,
}: {
  /** 主题模式 */
  themeMode?: string;
  /** 位置模式 */
  positionMode?: string;
  /** 默认活跃的键盘 */
  defaultActiveKeyboard?: string;
  /** 使用按键音效 */
  useKeydownAudio?: 'Y' | 'N';
  /** 按键音效url */
  keydownAudioUrl?: string;
  /** 自动弹出 */
  autoPopup?: boolean;
  /** enter 方法回调 */
  onEnter?: () => void;
  /** 输入回调 */
  onChange?: (e: VKB.KeyboardAttributeType) => void;
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
  /** 无效 type */
  const invalidInputType = [
    'week',
    'month',
    'time',
    'datetime-local',
    'date',
    'datetime',
    'submit',
    'reset',
    'range',
    'radio',
    'image',
    'hidden',
    'file',
    'color',
    'checkbox',
    'button',
  ];
  /** 有效 type */
  const effectiveInputType = ['text', 'search', 'tel', 'password', 'url'];
  /** 需处理 type */
  const needHandleInputType = ['number', 'email'];
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

  /** 失去焦点 */
  const onBlur = useCallback(() => {
    activeInputRef.current = null;
    inputType.current = '';
  }, []);
  /** 获得焦点 */
  const onFocus = useCallback((e: FocusEvent) => {
    const activeElement = e.target as HTMLInputElement;
    const vkbAutoPopup = activeElement?.dataset?.vkbAutoPopup ?? 'true';
    if (autoPopup && vkbAutoPopup === 'true') {
      onChangeShow && onChangeShow(true);
    }
  }, []);

  /** 寻找聚焦有效的input */
  const findFocusElement = (e: MouseEvent) => {
    const activeElement = e.target as HTMLInputElement;
    const vkbDisabled = activeElement.dataset?.vkbDisabled;
    const vkbType = activeElement.dataset?.vkbType ?? '';
    const vkbAutoPopup = activeElement.dataset?.vkbAutoPopup ?? 'true';
    if (
      activeElement?.tagName === 'INPUT' &&
      [...effectiveInputType, ...needHandleInputType].includes(
        activeElement?.type ?? '',
      ) &&
      vkbDisabled !== 'true'
    ) {
      inputType.current = vkbType;
      activeInputRef.current = activeElement;
      if (!cacheInputFocus.current.has(activeElement)) {
        if (autoPopup && vkbAutoPopup === 'true') {
          onChangeShow && onChangeShow(true);
        }
        cacheInputFocus.current.add(activeElement);
        activeInputRef.current.addEventListener('blur', onBlur);
        activeInputRef.current.addEventListener('focus', onFocus);
      }
    }
  };
  useEventListener('click', findFocusElement, { target: document.body });

  /**
   * 禁用类型
   *
   * @param {HTMLInputElement} inputEl
   * @return {*}
   */
  const validateInputType = (inputEl: HTMLInputElement) => {
    return [...invalidInputType, ...needHandleInputType].includes(inputEl.type);
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

  /** 触发 input 事件 */
  const emitInputEvent = () => {
    if (!activeInputRef.current) return;
    Simulate?.change?.(activeInputRef.current);
    Simulate?.input?.(activeInputRef.current);
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
  const onInput = async (e: VKB.KeyboardAttributeType) => {
    if (activeInputRef.current && typeof e.key === 'string') {
      let value = activeInputRef.current.value;
      const selectionStart = activeInputRef.current.selectionStart || 0;
      const selectionEnd = activeInputRef.current.selectionEnd || 0;
      const vkbNotEmpty = activeInputRef.current.dataset?.vkbNotEmpty;
      const vkbNotEmptyTrim = activeInputRef.current.dataset?.vkbNotEmptyTrim;
      const vkbNotInput =
        activeInputRef.current.dataset?.vkbNotInput?.split(',');
      // 处理类型
      // if (!(await handleInputType(activeInputRef.current))) return;

      if (validateInputType(activeInputRef.current)) {
        console.error('disabled type', [
          ...invalidInputType,
          ...needHandleInputType,
        ]);
        console.error(
          'if you need type="number" please use data-vkb-type="number" replace',
        );
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
        const value = inputValue + e.key;
        const transformMsg = (onPinyin2Chinese && onPinyin2Chinese(value)) || {
          pinyin: value,
          chinese: [],
        };
        setInputValue(value);
        setChinese([value, ...transformMsg.chinese]);
        jumpDelete.current = false;
      } else {
        // 处理 type = 'number' 时输入的其他字符
        if (isAllowInputNumber(inputType.current, value, e.key)) return;

        if (selectionStart === selectionEnd) {
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

        // 修改 value
        activeInputRef.current.value = value;

        activeInputRef.current.setSelectionRange(
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
        console.error('disabled type: ', [
          ...invalidInputType,
          ...needHandleInputType,
        ]);
        console.error(
          'if you need type="number" please use data-vkb-type="number" replace',
        );
        return;
      }

      if (inputMode === ZH) {
        const value = inputValue.slice(0, inputValue.length - 1);
        const transformMsg = (onPinyin2Chinese && onPinyin2Chinese(value)) || {
          pinyin: value,
          chinese: [],
        };
        setInputValue(value);
        setChinese([value, ...transformMsg.chinese]);

        if (value) return;

        if (!value && !jumpDelete.current) {
          jumpDelete.current = true;
          return;
        }
      }

      // 获取光标位置
      const selectionStart = activeInputRef.current.selectionStart ?? 0;
      const selectionEnd = activeInputRef.current.selectionEnd ?? 0;
      const value = activeInputRef.current.value;

      const tempValue =
        value.slice(
          0,
          selectionStart - (selectionStart === selectionEnd ? 1 : 0),
        ) + value.slice(selectionEnd);
      activeInputRef.current.value = tempValue;
      activeInputRef.current.setSelectionRange(
        selectionStart - (selectionStart === selectionEnd ? 1 : 0),
        selectionStart === selectionEnd ? selectionEnd - 1 : selectionStart,
      );

      emitInputEvent();
    }
  };

  /** 光标操作 */
  const onCursor = (e: VKB.KeyboardAttributeType) => {
    if (activeInputRef.current) {
      if (validateInputType(activeInputRef.current)) {
        console.error('disabled type: ', [
          ...invalidInputType,
          ...needHandleInputType,
        ]);
        console.error(
          'if you need type="number" please use data-vkb-type="number" replace',
        );
        return;
      }

      const selectionStart = activeInputRef.current.selectionStart ?? 0;

      const selectionEnd = activeInputRef.current.selectionEnd ?? 0;

      let index = 0;
      const value = activeInputRef.current.value;
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
      !needHandleInputType.includes(inputType.current)
    ) {
      let value = activeInputRef.current.value;
      const selectionEnd = activeInputRef.current.selectionEnd || 1;

      value =
        value.slice(0, selectionEnd) + chinese + value.slice(selectionEnd);

      // 修改 value
      activeInputRef.current.value = value;
      activeInputRef.current.setSelectionRange(
        chinese.length + selectionEnd,
        chinese.length + selectionEnd,
      );

      emitInputEvent();

      onChange &&
        onChange({
          code: '-1',
          key: value,
          keyCode: -1,
          keyType: 'chinese',
        });
    } else {
      console.error('input type = email or number not allow input chinese');
    }
    setInputValue('');
    setChinese([]);
  };

  /** 拷贝 */
  const onCopy = async () => {
    if (activeInputRef.current) {
      const selectionStart = activeInputRef.current.selectionStart ?? 0;
      const selectionEnd = activeInputRef.current.selectionEnd ?? 0;
      if (selectionStart === selectionEnd) {
        console.warn('no have copy content');
        return;
      }
      const value = activeInputRef.current.value.slice(
        selectionStart,
        selectionEnd,
      );
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(value);
        console.log('copy success');
      } else if (document.queryCommandSupported('copy')) {
        activeInputRef.current.select();
        document.execCommand('copy');
        activeInputRef.current.setSelectionRange(value.length, value.length);
        console.log('copy success');
      } else {
        console.error('copy error');
      }
    }
  };

  /** 粘贴 */
  const onPaste = async () => {
    if (activeInputRef.current) {
      const selectionStart = activeInputRef.current.selectionStart ?? 0;
      const selectionEnd = activeInputRef.current.selectionEnd ?? 0;
      let value = activeInputRef.current.value;

      if (navigator.clipboard) {
        const text = await navigator.clipboard.readText();
        value =
          value.slice(0, selectionStart) + text + value.slice(selectionEnd);
        activeInputRef.current.value = value;
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
        onEnter && onEnter();
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
    }
  };

  /** 设置类 */
  const onSetting = (e: VKB.KeyboardAttributeType) => {
    switch (e.code) {
      case LightTheme.code:
      case DarkTheme.code:
        setVkbThemeMode(e.code);
        onThemeModeChange && onThemeModeChange(e.code);
        localStorage?.setItem(VKB_THEME_MODE, e.code);
        break;
      case FixedBottomPosition.code:
      case FixedTopPosition.code:
      case FixedLeftPosition.code:
      case FixedRightPosition.code:
      case FloatPosition.code:
        setVkbPositionMode(e.code);
        onPositionModeChange && onPositionModeChange(e.code);
        localStorage?.setItem(VKB_THEME_MODE, e.code);
        break;
      case BackgroundAudio.code:
        localStorage?.setItem(
          VKB_KEYDOWN_MODE,
          vkbKeydownAudio === 'Y' ? 'N' : 'Y',
        );
        setVkbKeydownAudio(vkbKeydownAudio === 'Y' ? 'N' : 'Y');
        onUseKeydownAudioChange &&
          onUseKeydownAudioChange(vkbKeydownAudio === 'Y' ? 'N' : 'Y');
        break;
    }
  };

  /** 点击事件分发 */
  const onClick = (e: VKB.KeyboardAttributeType) => {
    onChange && onChange(e);
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
  };
};

export default useInput;
