import { CSSProperties, InputHTMLAttributes, ReactNode } from 'react';

declare namespace VKB {
  type InputMode = 'zh' | 'en';
  type NumberKeyboardLayoutMode = 'asc' | 'desc';
  type PinyinLearningMode = 'Y' | 'N';
  type ImageRecognitionOptions = {
    inputMode?: InputMode;
  };
  type StoredConfig = {
    themeMode: string;
    positionMode: string;
    width: string;
    height: string;
    fontSize: string;
    fontFamily: string;
    useKeydownAudio: 'Y' | 'N';
    numberKeyboardLayoutMode: NumberKeyboardLayoutMode;
    usePinyinLearning: PinyinLearningMode;
  };

  type FunctionKeyCode =
    | 'F1'
    | 'F2'
    | 'F3'
    | 'F4'
    | 'F5'
    | 'F6'
    | 'F7'
    | 'F8'
    | 'F9'
    | 'F10'
    | 'F11'
    | 'F12';

  type FunctionKeyContext = {
    key: KeyboardAttributeType;
    activeInput: HTMLInputElement | null;
    lastActiveInput: HTMLInputElement | null;
    inputValue: string;
    chinese: string[];
    caretBrowsingEnabled: boolean;
  };

  type FunctionKeyHandler = (context: FunctionKeyContext) => boolean | void;

  type FunctionKeyHandlerMap = Partial<
    Record<FunctionKeyCode, FunctionKeyHandler>
  >;

  type FunctionKeyDefaults = {
    /** F1 默认帮助链接 */
    helpUrl?: string;
    /** F6 默认聚焦目标，优先用于搜索框/主输入框 */
    focusSelector?: string;
  };

  type KeyboardTabComponentProps = {
    themeMode?: string;
    inputMode?: InputMode;
    positionMode?: string;
    vkbKeydownAudio?: string;
    width?: string;
    height?: string;
    fontSize?: string;
    fontFamily?: string;
    numberKeyboardLayoutMode?: NumberKeyboardLayoutMode;
    enablePinyinLearning?: boolean;
    capsLockActive?: boolean;
    inputValue?: string;
    chinese?: string[];
    onMouseDown?: (
      e:
        | React.MouseEvent<HTMLDivElement, MouseEvent>
        | React.TouchEvent<HTMLDivElement>,
    ) => void;
    onClick?: (e: VKB.KeyboardAttributeType) => void;
    isKeyActive?: (key: VKB.KeyboardAttributeType) => boolean;
    onWidthChange?: (width: string) => void;
    onHeightChange?: (height: string) => void;
    onFontSizeChange?: (fontSize: string) => void;
    onFontFamilyChange?: (fontFamily: string) => void;
    onNumberKeyboardLayoutModeChange?: (mode: NumberKeyboardLayoutMode) => void;
    onUsePinyinLearningChange?: (mode: PinyinLearningMode) => void;
    onChangeInputMode?: (mode: VKB.InputMode) => void;
    onSelectChinese?: (
      chinese: string,
      appendText?: string,
      options?: { replaceText?: string },
    ) => void;
    onRecognition?: (url: string) => void;
    onKeyDown?: (e: VKB.KeyboardAttributeType) => void;
    onKeyUp?: (e: VKB.KeyboardAttributeType) => void;
  };

  /**
   *  number:数字
   *  letter:字母
   *  function:功能键
   *  symbol:符号
   *  controls:操作
   *  edit: 表情
   *  write: 手写
   *  setting: 设置
   */
  type KeyType =
    | 'number'
    | 'letter'
    | 'function'
    | 'symbol'
    | 'controls'
    | 'edit'
    | 'emjo'
    | 'write'
    | 'stroke'
    | 'setting'
    | 'chinese';

  type KeyboardTabItem = {
    id: KeyType;
    label: ReactNode;
    name: string;
    Component: (props: KeyboardTabComponentProps) => JSX.Element;
  };

  /** 单个键盘属性 */
  type KeyboardAttributeType = {
    /** 对应的键盘code */
    code: string;
    /** 对应的字符串 */
    key: string;
    /** 对应的渲染内容 */
    renderKey?: string | ReactNode;
    /** 对应的键码 */
    keyCode: number;
    /** 键类型 */
    keyType: KeyType;
    /** 描述 */
    description?: string;
  };

  /** 键盘主题 */
  type Theme = {
    '--vkb-key-color': string;
    /** 键盘背景色 */
    '--vkb-background': string;
    /** 按键背景色 */
    '--vkb-key-background': string;
    /** 按键背活动景色 */
    '--vkb-key-active-background': string;
    /** 按键活动字体颜色 */
    '--vkb-key-active-font-color': string;
    /** 按键边框颜色 */
    '--vkb-key-border-color': string;
    /* 按键活动边框颜色 */
    '--vkb-key-active-border-color': string;
    /** 按键边框线宽度 */
    '--vkb-key-border-width': string;
    /** 按键边框颜色 */
    '--vkb-key-shadow-color': string;
    /** 按键活动 shadow */
    '--vkb-key-active-shadow-color': string;
    /** 按键 shadow 宽度 */
    '--vkb-key-shadow-width': string;
    /** 提示颜色 */
    '--vkb-key-tips-color': string;
    /** 提示文字大小 */
    '--vkb-key-tips-font-size': string;
    /** 滚动条颜色 */
    '--vkb-key-scroll-bar-color': string;
    /** 按键间隔 */
    '--vkb-key-gap': string;
    /** 按键圆角 */
    '--vkb-key-borer-radius': string;
    /** 按键文字大小 */
    '--vkb-key-font-size': string;
    /** 按键字体 */
    '--vkb-key-font-family': string;
    /** tab 高度 */
    '--vkb-keyboard-tab': string;
    /** 内部 svg 大小 */
    '--vkb-keyboard-svg-size': string;
  };

  type ThemeKeys = keyof Theme;

  type KeyBoardCtxTypBase = {
    /** 宽度 */
    width?: string;
    /** 高度 */
    height?: string;
    /** 按键文字大小 */
    fontSize?: string;
    /** 按键字体 */
    fontFamily?: string;
    /** icon 宽度 */
    iconWidth?: string;
    /** icon 高度 */
    iconHeight?: string;
    /** 层级 */
    zIndex?: string | number;
    /** 按键音效 url */
    keydownAudioUrl?: string;
    /** 输入框 focus 时是否自动显示键盘 */
    focusShow?: boolean;
    /** fixedBottom 模式下，自动将被键盘遮挡的输入框顶回可视区域 */
    pushInputIntoView?: boolean;
    /** 数字键盘排列 */
    numberKeyboardLayoutMode?: NumberKeyboardLayoutMode;
    /** 是否开启拼音学习 */
    enablePinyinLearning?: boolean;
    /** 自定义键盘内容 */
    virtualKeyboardTab?: KeyboardTabItem[];
    /** 自定义主题,当使用了主题变量时，主题变量的权重更高 */
    theme?: Partial<Theme>;
    /** 功能键统一覆写入口，返回 true 表示阻止默认行为 */
    onFunctionKey?: FunctionKeyHandler;
    /** 功能键按键级覆写入口，返回 true 表示阻止默认行为 */
    functionKeyHandlers?: FunctionKeyHandlerMap;
    /** 功能键默认行为配置 */
    functionKeyDefaults?: FunctionKeyDefaults;
  };

  type VirtualKeyboardProps = KeyBoardCtxTypBase & {
    /** 显示移动句柄 & 允许移动 */
    showDragHandle?: boolean;
    /** 是否显示外部唤起 icon */
    showIcon?: boolean;
    /** 是否显示 */
    show?: boolean;
    /** 主题模式 */
    themeMode?: string;
    /** 位置模式 */
    positionMode?: string;
    /** 按键音效 */
    useKeydownAudio?: 'Y' | 'N';
    /** 是否开启拼音学习 */
    usePinyinLearning?: PinyinLearningMode;
    /** 指定虚拟键盘挂载节点，返回值为空时回退到当前渲染位置 */
    getContainer?: () => HTMLElement | null;
  };

  type VirtualInputProps = Omit<
    InputHTMLAttributes<HTMLInputElement>,
    'readOnly' | 'size' | 'prefix'
  > & {
    wrapperClassName?: string;
    wrapperStyle?: CSSProperties;
    prefix?: ReactNode;
    suffix?: ReactNode;
  };

  type KeyBoardCtxType = VirtualKeyboardProps & {
    /** 当前输入框的值 */
    value?: string;
    /** Caps Lock 状态 */
    capsLockActive?: boolean;
    /** 显示 ,传入的必须是 setStatus 重新 render */
    setShow?: (s: boolean) => void;
    /** 设置主题模式 */
    setThemeMode?: (mode: string) => void;
    /** 设置位置模式 */
    setPositionMode?: (mode: string) => void;
    /** 设置宽度 */
    setWidth?: (width: string) => void;
    /** 设置高度 */
    setHeight?: (height: string) => void;
    /** 设置按键文字大小 */
    setFontSize?: (fontSize: string) => void;
    /** 设置按键字体 */
    setFontFamily?: (fontFamily: string) => void;
    /** 设置数字键盘排列 */
    setNumberKeyboardLayoutMode?: (mode: NumberKeyboardLayoutMode) => void;
    /** 设置是否开启拼音学习 */
    setUsePinyinLearning?: (use: PinyinLearningMode) => void;
    /** 设置是否使用按键音效 */
    setUseKeydownAudio?: (use: 'Y' | 'N') => void;
    /** 设置按键音效 url */
    setKeydownAudioUrl?: (url: string) => void;
  };
}
