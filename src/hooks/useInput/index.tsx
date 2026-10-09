import { useEventListener } from 'ahooks';
import { useCallback, useEffect, useRef, useState } from 'react';
import { DEFAULT_KEYDOWN_AUDIO_URL } from '../../assets/defaultKeydownAudio';
import {
  EN,
  FloatPosition,
  LightTheme,
  ZH,
  numberType,
} from '../../keys';
import { VKB } from '../../typing';
import { english2WordsV1 } from '../../utils/english';
import { pinyin2ChineseV3 } from '../../utils/pinyin';
import { getStoredVkbConfig } from '../../utils/vkbConfig';
import {
  buildFunctionKeyContext,
  dispatchFunctionKeyEvent,
  dispatchWindowFunctionKeyEvent,
  focusFunctionTarget,
  getFunctionSearchText,
  resolvePhysicalKeyCodes,
  runDefaultFunctionKeyAction,
} from './functionKeyUtils';
import { createFocusHandlers } from './focusHandlers';
import { createInteractionHandlers } from './interactionHandlers';

let audio: HTMLAudioElement;

/**
 * useInput 的入参配置。
 * 这一层只声明对外能力，具体交互细节下沉到各子模块实现。
 */
type UseInputOptions = {
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
  /** 功能键统一覆写入口，返回 true 表示阻止默认行为 */
  onFunctionKey?: VKB.FunctionKeyHandler;
  /** 功能键按键级覆写入口，返回 true 表示阻止默认行为 */
  functionKeyHandlers?: VKB.FunctionKeyHandlerMap;
  /** 功能键默认行为配置 */
  functionKeyDefaults?: VKB.FunctionKeyDefaults;
  /** 是否开启拼音学习 */
  enablePinyinLearning?: boolean;
  /** 拼音转汉字，自定义实现拼音转汉字，默认采用最简单的单字输入模式 */
  onPinyin2Chinese?: (value: string) => { pinyin: string; chinese: string[] };
  /** 英文字母转单词候选 */
  onEnglishWords?: (value: string) => string[];
};

/**
 * 输入接管主 hook。
 * 负责串联焦点管理、候选生成、功能键行为、实体键盘联动和设置状态同步，
 * 具体实现拆分到 useInput 目录下的子模块中，入口层只保留装配与编排。
 */
const useInput = ({
  themeMode = LightTheme.code,
  positionMode = FloatPosition.code,
  defaultActiveKeyboard = numberType,
  keyboardVisible = true,
  focusShow,
  useKeydownAudio = 'Y',
  keydownAudioUrl = DEFAULT_KEYDOWN_AUDIO_URL,
  autoPopup = true,
  onChangeShow,
  onActiveInputChange,
  onThemeModeChange,
  onPositionModeChange,
  onUseKeydownAudioChange,
  onKeydownAudioUrlChange,
  onFunctionKey,
  functionKeyHandlers,
  functionKeyDefaults,
  enablePinyinLearning = true,
  onPinyin2Chinese = pinyin2ChineseV3,
  onEnglishWords = english2WordsV1,
}: UseInputOptions) => {
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
  /** F7 维护的页面内光标浏览模式 */
  const [caretBrowsingEnabled, setCaretBrowsingEnabled] = useState(false);
  /** 删除inputValue 不立马删除targetValue中的值 */
  const jumpDelete = useRef(false);
  /** 焦点状态 */
  const cacheInputFocus = useRef(new WeakSet());
  /** blur 延迟定时器，避免输入框切换时闪烁 */
  const blurTimer = useRef<number>();
  /** 键盘指针交互窗口，只在确实点击了虚拟键盘时用于抢回焦点 */
  const keyboardPointerUntilRef = useRef(0);
  /** 键盘内部触摸会话，长按期间保持激活，避免移动端被误判为真正失焦 */
  const keyboardTouchSessionRef = useRef(false);
  /** 监听器引用，避免回调依赖形成循环 */
  const onBlurHandlerRef = useRef<(e: FocusEvent) => void>();
  const onFocusHandlerRef = useRef<(e: FocusEvent) => void>();
  /** 异步拼音学习重排请求序号，避免旧请求覆盖当前输入 */
  const pinyinLearningRequestIdRef = useRef(0);
  /** focus 弹出配置，autoPopup 作为兼容别名保留 */
  const enableFocusShow = focusShow ?? autoPopup;
  const storedConfig = getStoredVkbConfig();

  /** 颜色主题 */
  const [vkbThemeMode, setVkbThemeMode] = useState(
    themeMode ?? storedConfig.themeMode,
  );
  /** 键盘位置 */
  const [vkbPositionMode, setVkbPositionMode] = useState(
    positionMode ?? storedConfig.positionMode,
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

  const markKeyboardPointerInteraction = useCallback((duration = 180) => {
    keyboardPointerUntilRef.current = Date.now() + duration;
  }, []);

  const releaseKeyboardPointerInteraction = useCallback((duration = 48) => {
    keyboardPointerUntilRef.current = Date.now() + duration;
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
  /**
   * 基于当前输入上下文构建功能键执行上下文。
   * 统一给默认行为、自定义 handler 和 window 事件复用，避免三套取值口径不一致。
   */
  const getCurrentFunctionKeyContext = useCallback(
    (
      key: VKB.KeyboardAttributeType,
      nextCaretBrowsingEnabled = caretBrowsingEnabled,
    ) => {
      return buildFunctionKeyContext({
        key,
        activeInput: activeInputRef.current,
        lastActiveInput: lastActiveInputRef.current,
        inputValue,
        chinese,
        caretBrowsingEnabled: nextCaretBrowsingEnabled,
      });
    },
    [caretBrowsingEnabled, chinese, inputValue],
  );

  /** 派发组件层功能键事件，供调用方在键盘内部链路中覆写默认行为。 */
  const dispatchCurrentFunctionKeyEvent = useCallback(
    (
      key: VKB.KeyboardAttributeType,
      nextCaretBrowsingEnabled = caretBrowsingEnabled,
    ) => {
      return dispatchFunctionKeyEvent(
        getCurrentFunctionKeyContext(key, nextCaretBrowsingEnabled),
      );
    },
    [caretBrowsingEnabled, getCurrentFunctionKeyContext],
  );

  /** 提取 F3 等功能键会用到的搜索文本，优先复用当前输入上下文。 */
  const getCurrentFunctionSearchText = useCallback(() => {
    return getFunctionSearchText({
      activeInput: activeInputRef.current,
      chinese,
      inputValue,
    });
  }, [chinese, inputValue]);

  /** 提取 F6 等功能键的聚焦目标，优先使用最近一次有效输入框。 */
  const focusCurrentFunctionTarget = useCallback(() => {
    return focusFunctionTarget({
      focusSelector: functionKeyDefaults?.focusSelector,
      activeInput: activeInputRef.current,
      lastActiveInput: lastActiveInputRef.current,
    });
  }, [functionKeyDefaults?.focusSelector]);

  /** 执行内置功能键默认行为，并把需要的上下文收敛在入口层。 */
  const runCurrentDefaultFunctionKeyAction = useCallback(
    (key: VKB.KeyboardAttributeType) => {
      return runDefaultFunctionKeyAction({
        key,
        functionKeyDefaults,
        getSearchText: getCurrentFunctionSearchText,
        focusTarget: focusCurrentFunctionTarget,
        caretBrowsingEnabled,
        setCaretBrowsingEnabled,
      });
    },
    [
      caretBrowsingEnabled,
      functionKeyDefaults,
      focusCurrentFunctionTarget,
      getCurrentFunctionSearchText,
    ],
  );

  const { onBlur, onFocus, findFocusElement } = createFocusHandlers({
    enableFocusShow,
    activeInputRef,
    lastActiveInputRef,
    inputType,
    jumpDelete,
    cacheInputFocus,
    blurTimer,
    keyboardPointerUntilRef,
    keyboardTouchSessionRef,
    onBlurHandlerRef,
    onFocusHandlerRef,
    pinyinLearningRequestIdRef,
    setInputValue,
    setChinese,
    onChangeShow,
    onActiveInputChange,
  });

  useEffect(() => {
    onBlurHandlerRef.current = onBlur;
    onFocusHandlerRef.current = onFocus;
  }, [onBlur, onFocus]);
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

  const {
    onClick,
    onMouseDown,
    onMouseUp,
    onSelectChinese,
    onChangeInputMode,
    onKeyDown,
    onKeyUp,
  } = createInteractionHandlers({
    inputMode,
    activeKeyboard,
    inputValue,
    chinese,
    caretBrowsingEnabled,
    vkbKeydownAudio,
    keyboardVisible,
    enablePinyinLearning,
    onPinyin2Chinese,
    onEnglishWords,
    activeInputRef,
    lastActiveInputRef,
    inputType,
    cursorMode,
    jumpDelete,
    keyboardPointerUntilRef,
    keyboardTouchSessionRef,
    pinyinLearningRequestIdRef,
    setInputValue,
    setChinese,
    setInputMode,
    setVkbThemeMode,
    setVkbPositionMode,
    setVkbKeydownAudio,
    setCaretBrowsingEnabled,
    activateKeyCode,
    releaseKeyCode,
    playKeydownAudio,
    markKeyboardPointerInteraction,
    releaseKeyboardPointerInteraction,
    getCurrentFunctionKeyContext,
    dispatchCurrentFunctionKeyEvent,
    dispatchWindowFunctionKeyEvent,
    runCurrentDefaultFunctionKeyAction,
    onFunctionKey,
    functionKeyHandlers,
    onThemeModeChange,
    onPositionModeChange,
    onUseKeydownAudioChange,
  });

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

  /**
   * 返回给键盘组件层的交互面。
   * 按“输入状态 / 样式状态 / 交互回调 / 实体键盘状态”分组，方便上层按需消费。
   */
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
    onMouseUp,
    onSelectChinese,
    onChangeInputMode,
    setActiveKeyboard,
    onKeyDown,
    onKeyUp,
    isKeyActive,
    capsLockActive,
  };
};

export default useInput;
