import type { ComponentDoc } from './types';
import {
  EditKeyboardDemo,
  EmojiKeyboardDemo,
  FunctionKeyboardDemo,
  SettingKeyboardDemo,
  SymbolKeyboardDemo,
} from './demos';
import { sharedThemeTokens } from './shared';

export const panelComponentDocs: ComponentDoc[] = [
  {
    key: 'symbol-keyboard',
    path: '/components/symbol-keyboard',
    title: 'SymbolKeyboard',
    menuLabel: 'SymbolKeyboard',
    description: '按分类展示中英文、网络、数学、特殊与货币符号。',
    importCode: `import { SymbolKeyboard } from 'rc-virtual-keyboard';`,
    usageCode: `import { SymbolKeyboard } from 'rc-virtual-keyboard';\n\n<SymbolKeyboard\n  onClick={(key) => console.log('click', key.key)}\n  onKeyDown={(key) => console.log('down', key.code)}\n  onKeyUp={(key) => console.log('up', key.code)}\n/>;`,
    props: [
      { name: 'onClick', type: '(key) => void', defaultValue: '必填', description: '符号点击回调' },
      { name: 'onKeyDown / onKeyUp', type: '(key) => void', defaultValue: '-', description: '按下与抬起阶段回调' },
      { name: 'isKeyActive', type: '(key) => boolean', defaultValue: '-', description: '自定义激活态' },
    ],
    methods: [
      { name: 'onClick', signature: '(key: KeyboardAttributeType) => void', description: '点击任意符号时回调' },
      { name: 'onKeyDown / onKeyUp', signature: '(key: KeyboardAttributeType) => void', description: '按键生命周期回调' },
    ],
    tokens: sharedThemeTokens,
    renderDemo: SymbolKeyboardDemo,
  },
  {
    key: 'emoji-keyboard',
    path: '/components/emoji-keyboard',
    title: 'EmojiKeyboard',
    menuLabel: 'EmojiKeyboard',
    description: '内置常用、手势、爱心、动物、食物等 emoji 分类。',
    importCode: `import { EmojiKeyboard } from 'rc-virtual-keyboard';`,
    usageCode: `import { EmojiKeyboard } from 'rc-virtual-keyboard';\n\n<EmojiKeyboard\n  onClick={(key) => console.log('click', key.key)}\n  onKeyDown={(key) => console.log('down', key.code)}\n  onKeyUp={(key) => console.log('up', key.code)}\n/>;`,
    props: [
      { name: 'onClick', type: '(key) => void', defaultValue: '必填', description: 'emoji 选中回调' },
      { name: 'onKeyDown / onKeyUp', type: '(key) => void', defaultValue: '-', description: '按下与抬起阶段回调' },
      { name: 'isKeyActive', type: '(key) => boolean', defaultValue: '-', description: '自定义激活态' },
    ],
    methods: [
      { name: 'onClick', signature: '(key: KeyboardAttributeType) => void', description: '点击 emoji 时回调' },
      { name: 'onKeyDown / onKeyUp', signature: '(key: KeyboardAttributeType) => void', description: '按键生命周期回调' },
    ],
    tokens: sharedThemeTokens,
    renderDemo: EmojiKeyboardDemo,
  },
  {
    key: 'function-keyboard',
    path: '/components/function-keyboard',
    title: 'FunctionKeyboard',
    menuLabel: 'FunctionKeyboard',
    description: '用于触发 F1 到 F12 功能键，默认行为由 useInput/VirtualKeyboard 接管，并支持外部覆写。',
    importCode: `import { FunctionKeyboard } from 'rc-virtual-keyboard';`,
    usageCode: `import { FunctionKeyboard, keys, useInput } from 'rc-virtual-keyboard';\n\nexport default function Demo() {\n  const { onClick, onKeyDown, onKeyUp, isKeyActive } = useInput({\n    defaultActiveKeyboard: keys.functionType,\n  });\n\n  return (\n    <FunctionKeyboard\n      onClick={onClick}\n      onKeyDown={onKeyDown}\n      onKeyUp={onKeyUp}\n      isKeyActive={isKeyActive}\n    />\n  );\n}`,
    props: [
      { name: 'onClick', type: '(key) => void', defaultValue: '-', description: '功能键点击回调' },
      { name: 'onKeyDown / onKeyUp', type: '(key) => void', defaultValue: '-', description: '按键按下与抬起回调' },
      { name: 'isKeyActive', type: '(key) => boolean', defaultValue: '-', description: '自定义激活态' },
    ],
    methods: [
      { name: 'onClick', signature: '(key: KeyboardAttributeType) => void', description: '点击 F1-F12 触发' },
      { name: 'onKeyDown / onKeyUp', signature: '(key: KeyboardAttributeType) => void', description: '按键生命周期回调' },
    ],
    tokens: sharedThemeTokens,
    sections: [
      {
        title: '默认行为',
        description:
          "FunctionKeyboard 本身负责渲染 F1-F12 按键并派发 onClick / onKeyDown / onKeyUp。\n真正的默认浏览器行为由 useInput、CompositionKeyboard、VirtualKeyboard 统一接管。\n\nF1: 打开帮助链接，未配置时仅派发事件\nF2: 仅派发事件\nF3: 使用当前选中文本、输入选区、候选词或临时输入值执行页内查找\nF4: 仅派发事件\nF5: 刷新页面\nF6: 聚焦配置的搜索框或页面内首个可用输入框\nF7: 切换内部 caretBrowsingEnabled 状态\nF8: 仅派发事件\nF9: 仅派发事件\nF10: 仅派发事件\nF11: 切换全屏\nF12: 仅派发事件",
      },
      {
        title: '覆写方式',
        description:
          "推荐在 VirtualKeyboard、CompositionKeyboard 或 useInput 这一层覆写功能键默认行为。\n\n1. functionKeyHandlers: 适合只覆写少量按键\n2. onFunctionKey: 适合统一收口所有 F1-F12\n3. window 事件 vkb:function-key: 适合全局监听或非 React 场景\n\n返回 true 表示已处理当前按键，组件不会继续执行默认行为。",
        code:
          "import { VirtualKeyboard } from 'rc-virtual-keyboard';\n\nexport default function Demo() {\n  return (\n    <VirtualKeyboard\n      functionKeyDefaults={{\n        helpUrl: '/help/keyboard',\n        focusSelector: '#global-search',\n      }}\n      onFunctionKey={({ key }) => {\n        if (key.code === 'F8') {\n          console.log('global override', key.code);\n          return true;\n        }\n      }}\n      functionKeyHandlers={{\n        F5: async () => {\n          await reloadTableData();\n          return true;\n        },\n        F12: () => {\n          setDebugDrawerOpen(true);\n          return true;\n        },\n      }}\n    />\n  );\n}",
      },
      {
        title: 'F1',
        description:
          '默认行为：打开 functionKeyDefaults.helpUrl。\n典型用途：帮助中心、操作说明、快捷键面板。\n限制：未配置 helpUrl 时不会自动跳转。',
        code:
          "<VirtualKeyboard\n  functionKeyDefaults={{\n    helpUrl: '/help/keyboard',\n  }}\n  functionKeyHandlers={{\n    F1: () => {\n      setHelpModalOpen(true);\n      return true;\n    },\n  }}\n/>",
      },
      {
        title: 'F2',
        description:
          '默认行为：仅派发事件。\n典型用途：重命名、进入编辑态、修改当前项。\n限制：没有内置副作用，需要业务自行实现。',
        code:
          "<VirtualKeyboard\n  functionKeyHandlers={{\n    F2: () => {\n      setRenameDialogOpen(true);\n      return true;\n    },\n  }}\n/>",
      },
      {
        title: 'F3',
        description:
          '默认行为：优先用当前选中文本、输入框选区文本、候选词或临时输入值执行页内查找。\n典型用途：页内查找、站内搜索、搜索框聚焦。\n限制：默认行为依赖 window.find，不同浏览器兼容性不同。',
        code:
          "<VirtualKeyboard\n  functionKeyHandlers={{\n    F3: () => {\n      setSearchPanelOpen(true);\n      searchInputRef.current?.focus();\n      return true;\n    },\n  }}\n/>",
      },
      {
        title: 'F4',
        description:
          '默认行为：仅派发事件。\n典型用途：打开命令面板、最近记录、快捷菜单。\n限制：不会模拟地址栏、关闭标签页等浏览器行为。',
        code:
          "<VirtualKeyboard\n  functionKeyHandlers={{\n    F4: () => {\n      setCommandPaletteOpen(true);\n      return true;\n    },\n  }}\n/>",
      },
      {
        title: 'F5',
        description:
          '默认行为：刷新当前页面。\n典型用途：刷新整个页面或重载业务数据。\n限制：默认行为会直接触发页面刷新，存在未保存数据丢失风险。',
        code:
          "<VirtualKeyboard\n  functionKeyHandlers={{\n    F5: async () => {\n      await reloadTableData();\n      return true;\n    },\n  }}\n/>",
      },
      {
        title: 'F6',
        description:
          '默认行为：聚焦 functionKeyDefaults.focusSelector 对应元素；未配置时回退到首个可用输入框。\n典型用途：聚焦搜索框、扫码输入框、主录入框。\n限制：网页不能真正聚焦浏览器地址栏，只能聚焦页面内元素。',
        code:
          "<VirtualKeyboard\n  functionKeyDefaults={{\n    focusSelector: '#global-search',\n  }}\n  functionKeyHandlers={{\n    F6: () => {\n      orderInputRef.current?.focus();\n      return true;\n    },\n  }}\n/>",
      },
      {
        title: 'F7',
        description:
          '默认行为：切换内部 caretBrowsingEnabled 状态。\n典型用途：切换键盘导航模式、辅助模式、精细选择模式。\n限制：不会开启浏览器原生 caret browsing，只维护组件内部状态。',
        code:
          "<VirtualKeyboard\n  functionKeyHandlers={{\n    F7: ({ caretBrowsingEnabled }) => {\n      setKeyboardAssistMode(!caretBrowsingEnabled);\n      return true;\n    },\n  }}\n/>",
      },
      {
        title: 'F8',
        description:
          '默认行为：仅派发事件。\n典型用途：播放/暂停、暂停扫描、切换某个业务状态。\n限制：没有内置副作用。',
        code:
          "<VirtualKeyboard\n  functionKeyHandlers={{\n    F8: () => {\n      togglePlayback();\n      return true;\n    },\n  }}\n/>",
      },
      {
        title: 'F9',
        description:
          '默认行为：仅派发事件。\n典型用途：提交校验、刷新局部区域、打开统计。\n限制：没有内置副作用。',
        code:
          "<VirtualKeyboard\n  functionKeyHandlers={{\n    F9: () => {\n      validateCurrentForm();\n      return true;\n    },\n  }}\n/>",
      },
      {
        title: 'F10',
        description:
          '默认行为：仅派发事件。\n典型用途：打开顶部菜单、更多操作、工具菜单。\n限制：网页无法打开浏览器或系统菜单栏。',
        code:
          "<VirtualKeyboard\n  functionKeyHandlers={{\n    F10: () => {\n      setToolbarMenuOpen(true);\n      return true;\n    },\n  }}\n/>",
      },
      {
        title: 'F11',
        description:
          '默认行为：使用 Fullscreen API 切换全屏。\n典型用途：全屏、大屏展示、沉浸模式。\n限制：可能被浏览器策略或权限限制拦截。',
        code:
          "<VirtualKeyboard\n  functionKeyHandlers={{\n    F11: () => {\n      setCustomFullscreen(true);\n      return true;\n    },\n  }}\n/>",
      },
      {
        title: 'F12',
        description:
          '默认行为：仅派发事件。\n典型用途：打开调试面板、日志抽屉、诊断信息。\n限制：网页无法主动打开浏览器开发者工具。',
        code:
          "<VirtualKeyboard\n  functionKeyHandlers={{\n    F12: () => {\n      setDebugDrawerOpen(true);\n      return true;\n    },\n  }}\n/>",
      },
      {
        title: '全局事件示例',
        description:
          '如果你不方便直接改 React 组件树，也可以通过 window 上的 vkb:function-key 事件统一拦截。',
        code:
          "useEffect(() => {\n  const handler = (event: Event) => {\n    const customEvent = event as CustomEvent;\n\n    if (customEvent.detail?.key?.code === 'F11') {\n      customEvent.preventDefault();\n      openBigScreenMode();\n    }\n  };\n\n  window.addEventListener('vkb:function-key', handler);\n  return () => window.removeEventListener('vkb:function-key', handler);\n}, []);",
      },
    ],
    renderDemo: FunctionKeyboardDemo,
  },
  {
    key: 'edit-keyboard',
    path: '/components/edit-keyboard',
    title: 'EditKeyboard',
    menuLabel: 'EditKeyboard',
    description: '光标控制与编辑动作面板，包含移动、选择、复制、粘贴等操作。',
    importCode: `import { EditKeyboard } from 'rc-virtual-keyboard';`,
    usageCode: `import { EditKeyboard } from 'rc-virtual-keyboard';\n\n<EditKeyboard\n  onClick={(key) => console.log('click', key.code)}\n  onKeyDown={(key) => console.log('down', key.code)}\n  onKeyUp={(key) => console.log('up', key.code)}\n/>;`,
    props: [
      { name: 'onClick', type: '(key) => void', defaultValue: '-', description: '编辑动作回调' },
      { name: 'onKeyDown / onKeyUp', type: '(key) => void', defaultValue: '-', description: '按下与抬起阶段回调' },
      { name: 'isKeyActive', type: '(key) => boolean', defaultValue: '-', description: '自定义激活态' },
    ],
    methods: [
      { name: 'onClick', signature: '(key: KeyboardAttributeType) => void', description: '点击移动、开始选择、复制、粘贴等操作时触发' },
      { name: 'onKeyDown / onKeyUp', signature: '(key: KeyboardAttributeType) => void', description: '按键生命周期回调' },
    ],
    tokens: sharedThemeTokens,
    renderDemo: EditKeyboardDemo,
  },
  {
    key: 'setting-keyboard',
    path: '/components/setting-keyboard',
    title: 'SettingKeyboard',
    menuLabel: 'SettingKeyboard',
    description: '用于调整主题、位置、尺寸、字体和数字键布局的设置面板。',
    importCode: `import { SettingKeyboard } from 'rc-virtual-keyboard';`,
    usageCode: `import { SettingKeyboard } from 'rc-virtual-keyboard';\n\n<SettingKeyboard\n  themeMode="light"\n  positionMode="float"\n  vkbKeydownAudio="Y"\n  width="500px"\n  height="320px"\n  fontSize="14px"\n  fontFamily="'Microsoft YaHei', 'PingFang SC', sans-serif"\n  numberKeyboardLayoutMode="asc"\n  onWidthChange={(value) => console.log(value)}\n  onClick={(key) => console.log('click', key.code)}\n  onKeyDown={(key) => console.log('down', key.code)}\n  onKeyUp={(key) => console.log('up', key.code)}\n/>;`,
    props: [
      { name: 'themeMode', type: 'string', defaultValue: '必填', description: '当前主题模式' },
      { name: 'positionMode', type: 'string', defaultValue: '必填', description: '当前停靠位置模式' },
      { name: 'vkbKeydownAudio', type: 'string', defaultValue: '必填', description: '当前音效开关状态' },
      { name: 'width / height', type: 'string', defaultValue: '必填', description: '当前宽高' },
      { name: 'fontSize / fontFamily', type: 'string', defaultValue: '必填', description: '当前字体配置' },
      { name: 'numberKeyboardLayoutMode', type: "'asc' | 'desc'", defaultValue: '必填', description: '数字键布局模式' },
      { name: 'onWidthChange / onHeightChange', type: '(value: string) => void', defaultValue: '必填', description: '尺寸变化回调' },
      { name: 'onFontSizeChange / onFontFamilyChange', type: '(value: string) => void', defaultValue: '必填', description: '字体变化回调' },
      { name: 'onNumberKeyboardLayoutModeChange', type: "(mode: 'asc' | 'desc') => void", defaultValue: '-', description: '数字键布局切换回调' },
      { name: 'onUsePinyinLearningChange', type: "(mode: 'Y' | 'N') => void", defaultValue: '-', description: '拼音学习开关切换回调，通常由 CompositionKeyboard / VirtualKeyboard 透传' },
      { name: 'onClick', type: '(key) => void', defaultValue: '必填', description: '主题、位置、音效项点击回调' },
      { name: 'onKeyDown / onKeyUp', type: '(key) => void', defaultValue: '-', description: '按下与抬起阶段回调，仅作用于主题、位置、音效键项' },
    ],
    methods: [
      { name: 'onWidthChange / onHeightChange', signature: '(value: string) => void', description: '拖动滑块或点击尺寸步进按钮时触发' },
      { name: 'onFontSizeChange / onFontFamilyChange', signature: '(value: string) => void', description: '修改字体参数时触发' },
      { name: 'onNumberKeyboardLayoutModeChange', signature: "(mode: 'asc' | 'desc') => void", description: '数字键顺序切换回调' },
      { name: 'onUsePinyinLearningChange', signature: "(mode: 'Y' | 'N') => void", description: '切换拼音学习设置时触发' },
      { name: 'onClick', signature: '(key: KeyboardAttributeType) => void', description: '主题、位置、音效功能项点击回调' },
      { name: 'onKeyDown / onKeyUp', signature: '(key: KeyboardAttributeType) => void', description: '主题、位置、音效键项的按键生命周期回调' },
    ],
    tokens: sharedThemeTokens,
    sections: [
      {
        title: '拼音学习开关',
        description:
          "SettingKeyboard 里新增了“拼音学习”设置项。\n默认开启时，会根据用户在中文拼音模式下选择过的候选词，动态调整后续候选排序；关闭后仍保留静态拼音候选，但不再记录新的学习历史，也不再使用本地学习数据重排。",
      },
      {
        title: '接入方式',
        description:
          "SettingKeyboard 本身只负责展示开关和触发回调，真正的状态通常由 CompositionKeyboard 或 VirtualKeyboard 托管。\n如果你是单独使用 SettingKeyboard，需要自行处理 onUsePinyinLearningChange 并把状态同步回上层。",
        code:
          "const [enabled, setEnabled] = useState<'Y' | 'N'>('Y');\n\n<SettingKeyboard\n  themeMode=\"light\"\n  positionMode=\"float\"\n  vkbKeydownAudio=\"Y\"\n  width=\"500px\"\n  height=\"320px\"\n  fontSize=\"14px\"\n  fontFamily=\"'Microsoft YaHei', 'PingFang SC', sans-serif\"\n  numberKeyboardLayoutMode=\"asc\"\n  onWidthChange={() => undefined}\n  onHeightChange={() => undefined}\n  onFontSizeChange={() => undefined}\n  onFontFamilyChange={() => undefined}\n  onUsePinyinLearningChange={setEnabled}\n  onClick={() => undefined}\n/>",
      },
    ],
    renderDemo: SettingKeyboardDemo,
  },
];
