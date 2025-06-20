import { ReactNode } from 'react';

declare namespace VKB {
  type InputMode = 'zh' | 'en';

  /**
   *  number:数字
   *  letter:字母
   *  symbol:符号
   *  controls:操作
   *  edit: 表情
   *  write: 手写
   *  setting: 设置
   */
  type KeyType =
    | 'number'
    | 'letter'
    | 'symbol'
    | 'controls'
    | 'edit'
    | 'emjo'
    | 'write'
    | 'setting'
    | 'chinese';

  type KeyboardTabItem = {
    id: KeyType;
    label: ReactNode;
    name: string;
    Component: (props: {
      themeMode: string;
      inputMode: InputMode;
      positionMode: string;
      vkbKeydownAudio: string;
      inputValue: string;
      chinese: string[];
      onMouseDown: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
      onClick: (e: VKB.KeyboardAttributeType) => void;
      onChangeInputMode: (mode: InputMode) => void;
      onChangeInputMode: (mode: VKB.InputMode) => void;
      onSelectChinese: (chinese: string) => void;
      onRecognition: (url: string) => void;
      onKeyDown: (e: VKB.KeyboardAttributeType) => void;
      onKeyUp: (e: VKB.KeyboardAttributeType) => void;
    }) => JSX.Element;
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
    /** icon 宽度 */
    iconWidth?: string;
    /** icon 高度 */
    iconHeight?: string;
    /** 层级 */
    zIndex?: string | number;
    /** 按键音效 url */
    keydownAudioUrl?: string;
    /** 自定义键盘内容 */
    virtualKeyboardTab?: KeyboardTabItem[];
    /** 自定义主题,当使用了主题变量时，主题变量的权重更高 */
    theme?: Partial<Theme>;
  };

  type KeyBoardCtxType = KeyBoardCtxTypBase & {
    /** 显示移动句柄 & 允许移动 */
    showDragHandle?: boolean;
    /** 是否显示 */
    show?: boolean;
    /** 当前输入框的值 */
    value?: string;
    /** 主题模式 */
    themeMode?: string;
    /** 位置模式 */
    positionMode?: string;
    /** 按键音效 */
    useKeydownAudio?: 'Y' | 'N';
    /** 显示 ,传入的必须是 setStatus 重新 render */
    setShow?: (s: boolean) => void;
    /** 设置主题模式 */
    setThemeMode?: (mode: string) => void;
    /** 设置位置模式 */
    setPositionMode?: (mode: string) => void;
    /** 设置是否使用按键音效 */
    setUseKeydownAudio?: (use: 'Y' | 'N') => void;
    /** 设置按键音效 url */
    setKeydownAudioUrl?: (url: string) => void;
  };
}
