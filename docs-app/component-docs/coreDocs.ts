import type { ComponentDoc } from './types';
import {
  CompositionKeyboardDemo,
  LetterKeyboardDemo,
  NumberKeyboardDemo,
  VirtualKeyboardDemo,
} from './demos';
import { sharedThemeTokens } from './shared';

export const coreComponentDocs: ComponentDoc[] = [
  {
    key: 'virtual-keyboard',
    path: '/components/virtual-keyboard',
    title: 'VirtualKeyboard',
    menuLabel: 'VirtualKeyboard',
    description: '完整的对外入口组件，包含拖拽浮标、布局容器、主题与本地缓存能力。',
    importCode: `import { VirtualKeyboard } from 'rc-virtual-keyboard';\nimport 'rc-virtual-keyboard/style.css';`,
    usageCode: `import { useState } from 'react';\nimport { VirtualKeyboard } from 'rc-virtual-keyboard';\nimport 'rc-virtual-keyboard/style.css';\n\nexport default function Demo() {\n  const [value, setValue] = useState('');\n\n  return (\n    <>\n      <input value={value} onChange={(e) => setValue(e.target.value)} />\n      <VirtualKeyboard numberKeyboardLayoutMode="asc" />\n    </>\n  );\n}`,
    props: [
      { name: 'width', type: 'string', defaultValue: '500px', description: '键盘容器宽度' },
      { name: 'height', type: 'string', defaultValue: '320px', description: '键盘容器高度' },
      { name: 'fontSize', type: 'string', defaultValue: '14px', description: '按键字体大小' },
      { name: 'fontFamily', type: 'string', defaultValue: 'Microsoft YaHei / PingFang SC', description: '按键字体族' },
      { name: 'showDragHandle', type: 'boolean', defaultValue: 'true', description: '是否显示拖拽句柄' },
      { name: 'showIcon', type: 'boolean', defaultValue: 'true', description: '是否显示外部悬浮入口图标' },
      { name: 'show', type: 'boolean', defaultValue: 'false', description: '是否默认展开键盘' },
      { name: 'themeMode', type: 'string', defaultValue: 'light', description: '主题模式' },
      { name: 'positionMode', type: 'string', defaultValue: '桌面 float / 移动端 fixedBottom', description: '键盘停靠模式' },
      { name: 'focusShow', type: 'boolean', defaultValue: '由内部 hook 控制', description: '输入框聚焦时是否自动弹出' },
      { name: 'numberKeyboardLayoutMode', type: "'asc' | 'desc'", defaultValue: 'asc', description: '数字键布局顺序' },
      { name: 'getContainer', type: '() => HTMLElement | null', defaultValue: '-', description: '自定义虚拟键盘挂载节点，返回空时回退当前渲染位置' },
      { name: 'virtualKeyboardTab', type: 'KeyboardTabItem[]', defaultValue: '内置全部 tab', description: '自定义 tab 集合' },
      { name: 'theme', type: 'Partial<Theme>', defaultValue: '-', description: '通过 CSS 变量覆写主题' },
      { name: 'useKeydownAudio', type: "'Y' | 'N'", defaultValue: 'Y', description: '是否启用按键音效' },
      { name: 'keydownAudioUrl', type: 'string', defaultValue: '内置打包音频资源', description: '按键音效地址' },
      { name: 'onFunctionKey', type: '(context) => boolean | void', defaultValue: '-', description: '统一覆写 F1-F12 默认行为，返回 true 阻止默认行为' },
      { name: 'functionKeyHandlers', type: "Partial<Record<'F1' ... 'F12', (context) => boolean | void>>", defaultValue: '-', description: '按单个功能键覆写默认行为' },
      { name: 'functionKeyDefaults', type: '{ helpUrl?: string; focusSelector?: string }', defaultValue: '-', description: '配置 F1 帮助链接和 F6 默认聚焦目标' },
    ],
    methods: [
      { name: 'setShow', signature: '(visible: boolean) => void', description: '通过上下文控制显示或隐藏' },
      { name: 'setThemeMode', signature: '(mode: string) => void', description: '切换 light / dark 等主题模式' },
      { name: 'setPositionMode', signature: '(mode: string) => void', description: '切换停靠位置' },
      { name: 'setWidth / setHeight', signature: '(value: string) => void', description: '动态修改尺寸' },
      { name: 'setFontSize / setFontFamily', signature: '(value: string) => void', description: '动态修改按键字号和字体' },
      { name: 'setNumberKeyboardLayoutMode', signature: "(mode: 'asc' | 'desc') => void", description: '切换数字键顺序' },
      { name: 'setUseKeydownAudio / setKeydownAudioUrl', signature: "(value: 'Y' | 'N' | string) => void", description: '控制按键音效开关和资源地址' },
    ],
    tokens: sharedThemeTokens,
    sections: [
      {
        title: '功能键说明',
        description:
          "VirtualKeyboard 是最推荐的功能键接入入口。\n当你通过这个组件接管页面输入时，F1-F12 默认行为也会一起生效。\n\nF1: 打开帮助链接，未配置时仅派发事件\nF2: 仅派发事件\nF3: 使用当前选中文本、输入选区、候选词或临时输入值执行页内查找\nF4: 仅派发事件\nF5: 刷新页面\nF6: 聚焦配置的搜索框或页面内首个可用输入框\nF7: 切换内部 caretBrowsingEnabled 状态\nF8: 仅派发事件\nF9: 仅派发事件\nF10: 仅派发事件\nF11: 切换全屏\nF12: 仅派发事件",
      },
      {
        title: '功能键覆写',
        description:
          "如果你的业务需要接管功能键，优先在 VirtualKeyboard 这一层传入 onFunctionKey、functionKeyHandlers、functionKeyDefaults。\n\nonFunctionKey: 统一拦截所有 F1-F12\nfunctionKeyHandlers: 精确覆写单个功能键\nfunctionKeyDefaults: 配置默认帮助链接和默认聚焦目标\n\n返回 true 表示已处理当前按键，不再继续执行默认行为。",
        code:
          "import { VirtualKeyboard } from 'rc-virtual-keyboard';\n\nexport default function Demo() {\n  return (\n    <VirtualKeyboard\n      functionKeyDefaults={{\n        helpUrl: '/help/keyboard',\n        focusSelector: '#global-search',\n      }}\n      onFunctionKey={({ key }) => {\n        if (key.code === 'F8') {\n          togglePlayback();\n          return true;\n        }\n      }}\n      functionKeyHandlers={{\n        F5: async () => {\n          await reloadTableData();\n          return true;\n        },\n        F11: () => {\n          setBigScreenMode(true);\n          return true;\n        },\n      }}\n    />\n  );\n}",
      },
      {
        title: '常见场景',
        description:
          "F1 常用于帮助中心或操作说明。\nF3 常用于打开搜索面板或站内搜索。\nF5 如果页面有未保存数据，建议优先业务覆写。\nF6 适合聚焦搜索框、扫码框、主录入框。\nF11 适合切换大屏展示或沉浸模式。\nF12 常用于打开调试抽屉、日志面板、诊断信息。",
      },
    ],
    renderDemo: VirtualKeyboardDemo,
  },
  {
    key: 'composition-keyboard',
    path: '/components/composition-keyboard',
    title: 'CompositionKeyboard',
    menuLabel: 'CompositionKeyboard',
    description: '组合键盘主体，负责 tab 切换、输入联动、主题和布局调度。',
    importCode: `import { CompositionKeyboard } from 'rc-virtual-keyboard';`,
    usageCode: `import { CompositionKeyboard } from 'rc-virtual-keyboard';\n\nexport default function Demo() {\n  return (\n    <CompositionKeyboard\n      width="500px"\n      height="320px"\n      onChangeShow={() => undefined}\n    />\n  );\n}`,
    props: [
      { name: 'style', type: 'CSSProperties', defaultValue: '-', description: '组件根节点内联样式' },
      { name: 'showDragHandle', type: 'boolean', defaultValue: 'true', description: '是否展示拖拽区域' },
      { name: 'showHiddenHandle', type: 'boolean', defaultValue: 'true', description: '是否展示收起按钮' },
      { name: 'defaultActiveKeyboard', type: 'string', defaultValue: 'number', description: '默认激活的 tab' },
      { name: 'virtualKeyboardTab', type: 'KeyboardTabItem[]', defaultValue: '内置 tab 集合', description: '自定义 tab 列表' },
      { name: 'moveLabel / hiddenLabel', type: 'ReactNode', defaultValue: '内置 SVG', description: '顶部操作图标内容' },
      { name: 'themeMode', type: 'string', defaultValue: 'light', description: '当前主题模式' },
      { name: 'positionMode', type: 'string', defaultValue: 'float', description: '当前位置模式' },
      { name: 'width / height', type: 'string', defaultValue: '500px / 320px', description: '当前键盘尺寸' },
      { name: 'fontSize / fontFamily', type: 'string', defaultValue: '14px / 默认字体', description: '当前按键字体配置' },
      { name: 'focusShow', type: 'boolean', defaultValue: '-', description: '控制焦点联动弹出行为' },
      { name: 'useKeydownAudio / keydownAudioUrl', type: "('Y' | 'N') / string", defaultValue: 'Y / 默认 mp3', description: '控制按键音效' },
      { name: 'onFunctionKey', type: '(context) => boolean | void', defaultValue: '-', description: '统一覆写 F1-F12 默认行为，返回 true 阻止默认行为' },
      { name: 'functionKeyHandlers', type: "Partial<Record<'F1' ... 'F12', (context) => boolean | void>>", defaultValue: '-', description: '按单个功能键覆写默认行为' },
      { name: 'functionKeyDefaults', type: '{ helpUrl?: string; focusSelector?: string }', defaultValue: '-', description: '配置 F1 帮助链接和 F6 默认聚焦目标' },
    ],
    methods: [
      { name: 'onChangeShow', signature: '(visible: boolean) => void', description: '收起或展开键盘时触发' },
      { name: 'onThemeModeChange', signature: '(mode: string) => void', description: '主题模式切换回调' },
      { name: 'onPositionModeChange', signature: '(mode: string) => void', description: '位置模式切换回调' },
      { name: 'onWidthChange / onHeightChange', signature: '(value: string) => void', description: '尺寸变化回调' },
      { name: 'onFontSizeChange / onFontFamilyChange', signature: '(value: string) => void', description: '字体配置变化回调' },
      { name: 'onNumberKeyboardLayoutModeChange', signature: "(mode: 'asc' | 'desc') => void", description: '数字键顺序切换回调' },
      { name: 'onUseKeydownAudioChange / onKeydownAudioUrlChange', signature: "(value: 'Y' | 'N' | string) => void", description: '音效设置变更回调' },
    ],
    tokens: sharedThemeTokens,
    sections: [
      {
        title: '功能键说明',
        description:
          "CompositionKeyboard 也会接管 F1-F12 默认行为。\n和 VirtualKeyboard 的区别是：它只负责键盘本体，不包含外部悬浮入口和拖拽浮标，更适合嵌入到业务布局中。\n\nF1: 打开帮助链接，未配置时仅派发事件\nF2: 仅派发事件\nF3: 使用当前选中文本、输入选区、候选词或临时输入值执行页内查找\nF4: 仅派发事件\nF5: 刷新页面\nF6: 聚焦配置的搜索框或页面内首个可用输入框\nF7: 切换内部 caretBrowsingEnabled 状态\nF8: 仅派发事件\nF9: 仅派发事件\nF10: 仅派发事件\nF11: 切换全屏\nF12: 仅派发事件",
      },
      {
        title: '功能键覆写',
        description:
          "如果你把 CompositionKeyboard 嵌入到自定义面板、弹窗或固定布局中，建议直接在这里传入功能键覆写配置。\n这样不需要额外包一层 VirtualKeyboard，也能完整接管 F1-F12。",
        code:
          "import { CompositionKeyboard } from 'rc-virtual-keyboard';\n\nexport default function Demo() {\n  return (\n    <CompositionKeyboard\n      width=\"100%\"\n      height=\"340px\"\n      functionKeyDefaults={{\n        helpUrl: '/help/embedded-keyboard',\n        focusSelector: '#page-search',\n      }}\n      functionKeyHandlers={{\n        F3: () => {\n          setSearchPanelOpen(true);\n          return true;\n        },\n        F12: () => {\n          setDebugDrawerOpen(true);\n          return true;\n        },\n      }}\n    />\n  );\n}",
      },
      {
        title: '覆写建议',
        description:
          "如果只改少量按键，优先用 functionKeyHandlers。\n如果想统一打点、埋点或权限判断，优先用 onFunctionKey。\n如果需要 F1 和 F6 的默认行为但只想换目标地址或焦点元素，优先用 functionKeyDefaults。\n如果接入场景不是 React 组件树最外层，也可以用 window 上的 vkb:function-key 事件做全局拦截。",
      },
    ],
    renderDemo: CompositionKeyboardDemo,
  },
  {
    key: 'number-keyboard',
    path: '/components/number-keyboard',
    title: 'NumberKeyboard',
    menuLabel: 'NumberKeyboard',
    description: '数字输入面板，支持 asc / desc 两种数字排列。',
    importCode: `import { NumberKeyboard } from 'rc-virtual-keyboard';`,
    usageCode: `import { NumberKeyboard } from 'rc-virtual-keyboard';\n\n<NumberKeyboard\n  numberKeyboardLayoutMode="desc"\n  onClick={(key) => console.log(key)}\n/>;`,
    props: [
      { name: 'numberKeyboardLayoutMode', type: "'asc' | 'desc'", defaultValue: 'asc', description: '数字排列方式' },
      { name: 'onClick', type: '(key) => void', defaultValue: '-', description: '按键点击回调' },
      { name: 'onKeyDown / onKeyUp', type: '(key) => void', defaultValue: '-', description: '按下与抬起阶段回调' },
      { name: 'isKeyActive', type: '(key) => boolean', defaultValue: '-', description: '自定义按键激活态' },
    ],
    methods: [
      { name: 'onClick', signature: '(key: KeyboardAttributeType) => void', description: '点击数字、删除、回车等按键时触发' },
      { name: 'onKeyDown', signature: '(key: KeyboardAttributeType) => void', description: '按键开始触发时回调' },
      { name: 'onKeyUp', signature: '(key: KeyboardAttributeType) => void', description: '按键结束时回调' },
    ],
    tokens: sharedThemeTokens,
    renderDemo: NumberKeyboardDemo,
  },
  {
    key: 'letter-keyboard',
    path: '/components/letter-keyboard',
    title: 'LetterKeyboard',
    menuLabel: 'LetterKeyboard',
    description: '字母键盘，支持中英文模式切换、拼音候选和大小写状态。',
    importCode: `import { LetterKeyboard } from 'rc-virtual-keyboard';`,
    usageCode: `import { useMemo, useState } from 'react';\nimport { LetterKeyboard } from 'rc-virtual-keyboard';\n\nconst pinyinMap: Record<string, string[]> = {\n  nihao: ['你好'],\n  jianpan: ['键盘', '键盘组件'],\n  zujian: ['组件', '组件库'],\n};\n\nfunction queryCandidates(input: string) {\n  const normalized = input.toLowerCase().replace(/[^a-z]/g, '');\n  if (!normalized) return [];\n  return pinyinMap[normalized] ?? [];\n}\n\nexport default function Demo() {\n  const [mode, setMode] = useState<'zh' | 'en'>('zh');\n  const [value, setValue] = useState('');\n  const [composingValue, setComposingValue] = useState('');\n  const chinese = useMemo(\n    () => queryCandidates(composingValue),\n    [composingValue],\n  );\n\n  const commitCurrentWord = (appendText = '') => {\n    const nextWord = mode === 'zh' ? chinese[0] || composingValue : composingValue;\n    if (!nextWord) return;\n\n    setValue((prev) => \`\${prev}\${nextWord}\${appendText}\`);\n    setComposingValue('');\n  };\n\n  return (\n    <>\n      <input value={value} onChange={(e) => setValue(e.target.value)} />\n      <LetterKeyboard\n        inputMode={mode}\n        inputValue={composingValue}\n        chinese={chinese}\n        onChangeInputMode={(nextMode) => {\n          setMode(nextMode);\n          setComposingValue('');\n        }}\n        onSelectChinese={(word) => {\n          setValue((prev) => \`\${prev}\${word}\`);\n          setComposingValue('');\n        }}\n        onClick={(key) => {\n          if (key.code === 'Backspace') {\n            if (composingValue) {\n              setComposingValue((prev) => prev.slice(0, -1));\n              return;\n            }\n            setValue((prev) => prev.slice(0, -1));\n            return;\n          }\n          if (key.code === 'Enter') {\n            commitCurrentWord();\n            return;\n          }\n          if (key.key === ' ') {\n            if (composingValue) {\n              commitCurrentWord(' ');\n              return;\n            }\n            setValue((prev) => \`\${prev} \`);\n            return;\n          }\n          if (/^[a-zA-Z]$/.test(key.key)) {\n            setComposingValue((prev) => \`\${prev}\${key.key.toLowerCase()}\`);\n            return;\n          }\n          if (key.key.length === 1) {\n            setValue((prev) => \`\${prev}\${key.key}\`);\n          }\n        }}\n      />\n    </>\n  );\n}`,
    props: [
      { name: 'inputMode', type: "'zh' | 'en'", defaultValue: '必填', description: '当前输入模式' },
      { name: 'inputValue', type: 'string', defaultValue: '-', description: '顶部候选区展示的拼音或文本' },
      { name: 'chinese', type: 'string[]', defaultValue: '[]', description: '候选词列表' },
      { name: 'capsLockActive', type: 'boolean', defaultValue: 'false', description: '是否处于大写模式' },
      { name: 'onClick', type: '(key) => void', defaultValue: '-', description: '字母键点击回调' },
      { name: 'onMouseDown', type: '(event) => void', defaultValue: '-', description: '根节点 mouseDown 回调' },
      { name: 'onChangeInputMode', type: "(mode: 'zh' | 'en') => void", defaultValue: '-', description: '中英文模式切换回调' },
      { name: 'onSelectChinese', type: '(word: string) => void', defaultValue: '-', description: '候选词选中回调' },
      { name: 'onKeyDown / onKeyUp', type: '(key) => void', defaultValue: '-', description: '按键生命周期回调' },
      { name: 'isKeyActive', type: '(key) => boolean', defaultValue: '-', description: '自定义按键激活态' },
    ],
    methods: [
      { name: 'onChangeInputMode', signature: "(mode: 'zh' | 'en') => void", description: '点击中/英切换键时触发' },
      { name: 'onSelectChinese', signature: '(word: string) => void', description: '点击候选字词时触发，通常和你自己的拼写/拼音查询方法配合使用' },
      { name: 'onClick', signature: '(key: KeyboardAttributeType) => void', description: '普通字母、空格、退格、回车等按键回调' },
    ],
    tokens: sharedThemeTokens,
    renderDemo: LetterKeyboardDemo,
  },
];
