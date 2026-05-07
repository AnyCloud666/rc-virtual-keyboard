# rc-virtual-keyboard

一个面向 React 的虚拟键盘组件库，适合收银、触控屏、自助终端、移动端输入接管、拼音候选、数字计算、手写输入等场景。

## 特性

- 开箱即用的 `VirtualKeyboard`
- 可组合的 `CompositionKeyboard`
- 独立键盘组件：数字、字母、符号、功能、编辑、设置、手写板、Emoji
- 支持拼音候选、数字计算候选、手写识别候选
- 支持浮动、固定上方、固定下方、固定左侧、固定右侧等位置模式
- 支持输入框级别的 `data-vkb-*` 行为控制
- 支持主题变量覆盖
- 提供 `useInput` 和若干基础 hooks，方便自定义接入

## 安装

```bash
npm install rc-virtual-keyboard
# or
pnpm add rc-virtual-keyboard
# or
yarn add rc-virtual-keyboard
```

## 环境要求

- Node.js: 建议 `18.x`、`20.x`、`22.x`，当前仓库也已兼容 `24.x`
- React: `>=16.9.0`
- ReactDOM: `>=16.9.0`

## 最小使用示例

```tsx
import { useState } from 'react';
import { VirtualKeyboard } from 'rc-virtual-keyboard';
import 'rc-virtual-keyboard/style.css';

export default function Demo() {
  const [value, setValue] = useState('');

  return (
    <>
      <input
        value={value}
        placeholder="点击后使用虚拟键盘输入"
        onChange={(e) => setValue(e.target.value)}
      />

      <div>当前值：{value || '未输入'}</div>
      <VirtualKeyboard />
    </>
  );
}
```

## 核心概念

### `VirtualKeyboard`

完整的浮动虚拟键盘容器，包含：

- 外部唤起图标
- 拖动能力
- 自动吸附到焦点输入框
- 多种位置模式
- 内部组合键盘

如果你想快速接入，优先使用它。

### `CompositionKeyboard`

只包含键盘本体，不包含外层唤起图标和拖拽容器。

适合：

- 嵌入到固定区域
- 文档页或演示页
- 业务侧自己管理显示/隐藏和定位

### 单独键盘组件

库中也导出了多个独立键盘组件，适合和 `useInput` 组合使用：

- `NumberKeyboard`
- `LetterKeyboard`
- `SymbolKeyboard`
- `EmojiKeyboard`
- `FunctionKeyboard`
- `EditKeyboard`
- `SettingKeyboard`
- `WriteKeyboard`

## `VirtualKeyboard` 进阶示例

```tsx
import { useState } from 'react';
import { VirtualKeyboard } from 'rc-virtual-keyboard';
import 'rc-virtual-keyboard/style.css';

export default function Demo() {
  const [value, setValue] = useState('');

  return (
    <>
      <input
        value={value}
        placeholder="支持浮动模式与自动吸附"
        onChange={(e) => setValue(e.target.value)}
      />

      <VirtualKeyboard
        width="560px"
        height="340px"
        numberKeyboardLayoutMode="desc"
        focusShow
        themeMode="light"
        positionMode="float"
      />
    </>
  );
}
```

### 常用属性

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| `width` | 键盘宽度 | `string` | `500px` |
| `height` | 键盘高度 | `string` | `320px` |
| `zIndex` | 层级 | `string \| number` | `9999` |
| `showDragHandle` | 是否显示拖拽句柄 | `boolean` | `true` |
| `showIcon` | 是否显示外部唤起图标 | `boolean` | `true` |
| `show` | 是否显示键盘 | `boolean` | `false` |
| `themeMode` | 主题模式 | `string` | `light` |
| `positionMode` | 位置模式 | `string` | `float` |
| `focusShow` | 输入框聚焦时是否自动显示键盘 | `boolean` | `true` |
| `pushInputIntoView` | `fixedBottom` 模式下，将被键盘遮挡的输入框推回可视区域 | `boolean` | `false` |
| `numberKeyboardLayoutMode` | 数字键盘排列方式 | `'asc' \| 'desc'` | `asc` |
| `getContainer` | 指定虚拟键盘挂载节点，返回空时回退当前渲染位置 | `() => HTMLElement \| null` | - |
| `virtualKeyboardTab` | 自定义 tab 列表 | `KeyboardTabItem[]` | 内置全部 tab |
| `theme` | 自定义主题变量 | `Partial<Theme>` | - |
| `useKeydownAudio` | 是否启用按键音效 | `'Y' \| 'N'` | `'Y'` |
| `keydownAudioUrl` | 按键音效地址 | `string` | 内置打包音频资源 |
| `onFunctionKey` | 功能键统一覆写入口，返回 `true` 阻止默认行为 | `(context) => boolean \| void` | - |
| `functionKeyHandlers` | 按单个 `F1-F12` 覆写默认行为 | `Partial<Record<'F1' ... 'F12', (context) => boolean \| void>>` | - |
| `functionKeyDefaults` | 功能键默认行为配置 | `{ helpUrl?: string; focusSelector?: string }` | - |

### 浮动模式行为

当 `positionMode="float"` 时，当前版本支持这些行为：

- 输入框获得焦点后，键盘优先吸附到输入框下方 `12px`
- 下方空间不够时，自动尝试放到输入框上方
- 横向优先与输入框左侧对齐，右侧空间不够时改为右对齐
- 视口空间不足时，自动限制最大高度并转为内部滚动
- 手动拖动过键盘后，自动跟随会暂停
- 再聚焦新的输入框时，会恢复自动吸附

### 固定底部模式下顶起输入框

当 `positionMode="fixedBottom"` 且输入框可能被键盘遮挡时，可以开启 `pushInputIntoView`：

```tsx
<VirtualKeyboard
  positionMode="fixedBottom"
  pushInputIntoView
/>
```

启用后会优先尝试滚动最近的可滚动容器；如果可滚动空间不足，会临时补充底部空间，再把当前输入框推回可视区域。

## `CompositionKeyboard` 使用示例

```tsx
import { useState } from 'react';
import { CompositionKeyboard } from 'rc-virtual-keyboard';
import 'rc-virtual-keyboard/style.css';

export default function Demo() {
  const [value, setValue] = useState('');

  return (
    <div style={{ width: 560, margin: '0 auto' }}>
      <input
        value={value}
        placeholder="组合键盘会接管当前焦点输入框"
        onChange={(e) => setValue(e.target.value)}
      />

      <div style={{ margin: '12px 0' }}>当前值：{value || '未输入'}</div>

      <CompositionKeyboard
        style={{ width: '100%', height: 340 }}
        width="100%"
        height="340px"
        showDragHandle={false}
        showHiddenHandle={false}
      />
    </div>
  );
}
```

### 适合使用 `CompositionKeyboard` 的场景

- 你希望把键盘直接渲染在页面中的某个固定区域
- 你不需要外部唤起图标
- 你想自己决定布局、显示和隐藏时机

## 结合 `useInput` 使用独立键盘组件

如果你不想用完整的 `VirtualKeyboard`，可以自己组织输入框和键盘。

```tsx
import { useState } from 'react';
import { NumberKeyboard, keys, useInput } from 'rc-virtual-keyboard';
import 'rc-virtual-keyboard/style.css';

export default function Demo() {
  const [value, setValue] = useState('');
  const {
    inputValue,
    chinese,
    onMouseDown,
    onClick,
    onKeyDown,
    onKeyUp,
    onSelectChinese,
    isKeyActive,
  } = useInput({
    defaultActiveKeyboard: keys.numberType,
  });

  return (
    <>
      <input
        value={value}
        placeholder="点击后使用数字键盘输入"
        onChange={(e) => setValue(e.target.value)}
      />

      <div style={{ margin: '12px 0' }}>当前值：{value || '未输入'}</div>

      <NumberKeyboard
        inputValue={inputValue}
        chinese={chinese}
        onMouseDown={onMouseDown}
        onClick={onClick}
        onKeyDown={onKeyDown}
        onKeyUp={onKeyUp}
        onSelectChinese={onSelectChinese}
        isKeyActive={isKeyActive}
      />
    </>
  );
}
```

## `useInput`

`useInput` 是自定义输入逻辑的核心 hook。

它负责：

- 接管当前焦点输入框
- 输入、删除、光标操作
- 中文拼音候选
- 英文单词候选
- 手写识别候选
- 模拟 `input / change / keydown / keyup / keypress` 事件

### 常用入参

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| `themeMode` | 主题模式 | `string` | `light` |
| `positionMode` | 位置模式 | `string` | `float` |
| `defaultActiveKeyboard` | 默认激活键盘 | `string` | `number` |
| `focusShow` | 输入框获得焦点时是否自动显示键盘 | `boolean` | `true` |
| `autoPopup` | `focusShow` 的兼容别名 | `boolean` | `true` |
| `useKeydownAudio` | 是否启用按键音效 | `'Y' \| 'N'` | `'Y'` |
| `keydownAudioUrl` | 按键音效地址 | `string` | 内置打包音频资源 |
| `onChangeShow` | 键盘显示/隐藏回调 | `(show: boolean) => void` | - |
| `onThemeModeChange` | 主题变化回调 | `(mode: string) => void` | - |
| `onPositionModeChange` | 位置变化回调 | `(mode: string) => void` | - |
| `onFunctionKey` | 功能键统一覆写入口，返回 `true` 阻止默认行为 | `(context) => boolean \| void` | - |
| `functionKeyHandlers` | 按单个 `F1-F12` 覆写默认行为 | `Partial<Record<'F1' ... 'F12', (context) => boolean \| void>>` | - |
| `functionKeyDefaults` | 功能键默认行为配置 | `{ helpUrl?: string; focusSelector?: string }` | - |
| `onPinyin2Chinese` | 自定义拼音转中文 | `(value: string) => { pinyin: string; chinese: string[] }` | 内置实现 |
| `onEnglishWords` | 自定义英文候选 | `(value: string) => string[]` | 内置实现 |
| `onImageToWord` | 自定义手写识别 | `(url: string, options?) => Promise<string[]>` | 内置实现 |

### 常用返回值

| 名称 | 说明 |
| --- | --- |
| `inputMode` | 当前输入模式，`zh` 或 `en` |
| `inputValue` | 当前组合输入中的临时值 |
| `chinese` | 当前候选词列表 |
| `activeKeyboard` | 当前激活键盘 |
| `vkbThemeMode` | 当前主题模式 |
| `vkbPositionMode` | 当前位置模式 |
| `onClick` | 键位点击逻辑 |
| `onMouseDown` | 键盘根节点交互保护 |
| `onSelectChinese` | 候选词选择逻辑 |
| `onChangeInputMode` | 切换中英文模式 |
| `setActiveKeyboard` | 切换当前键盘 |
| `onRecognition` | 手写识别入口 |
| `onKeyDown` | 模拟键盘按下 |
| `onKeyUp` | 模拟键盘抬起 |
| `isKeyActive` | 当前键位高亮判断 |
| `capsLockActive` | Caps Lock 状态 |

## `data-vkb-*` 输入框属性

可以直接在输入框上用 dataset 控制行为。

```tsx
<VirtualKeyboard focusShow={false} />

<input data-vkb-show />
<input data-vkb-auto-popup={false} />
<input data-vkb-blur-hidden={false} />
<input data-vkb-type="number" />
<input data-vkb-follow-focus="false" />
<input data-vkb-disabled="true" />
```

### 属性说明

| 属性 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `data-vkb-show` | boolean attribute | inherit | 在全局 `focusShow=false` 时，为当前输入框单独开启自动展示键盘 |
| `data-vkb-auto-popup` | boolean \| `'false'` | inherit | 覆盖自动弹出策略；设为 `false` 时，聚焦不自动弹出 |
| `data-vkb-blur-hidden` | boolean \| `'false'` | `true` | 设为 `false` 时，失焦后仍保持键盘展示 |
| `data-vkb-type` | `string` | - | 指定输入类型，例如 `number` |
| `data-vkb-follow-focus` | `'true' \| 'false'` | `true` | 浮动模式下是否跟随当前输入框自动吸附 |
| `data-vkb-disabled` | `'true' \| 'false'` | `false` | 禁止虚拟键盘接管该输入框 |

### 推荐使用方式

- 想全局关闭自动弹出，再给少数输入框开启：使用 `focusShow={false}` + `data-vkb-show`
- 想让键盘失焦后保持展示：使用 `data-vkb-blur-hidden={false}`
- 想在浮动模式下保留当前键盘位置：使用 `data-vkb-follow-focus="false"`
- 想接管数字输入：优先使用 `data-vkb-type="number"`，而不是原生 `type="number"`

## `F1-F12` 默认行为与覆写

当前版本为功能键提供了“默认浏览器行为 + 外部覆写”机制。

### 默认行为

| 功能键 | 默认行为 |
| --- | --- |
| `F1` | 打开 `functionKeyDefaults.helpUrl`，未配置时仅派发事件 |
| `F2` | 仅派发事件，默认无副作用 |
| `F3` | 优先用当前选中文本、输入选区或候选词执行页内查找 |
| `F4` | 仅派发事件，默认无副作用 |
| `F5` | 刷新当前页面 |
| `F6` | 聚焦 `functionKeyDefaults.focusSelector` 或页面内首个可用输入框 |
| `F7` | 切换组件内部的 `caretBrowsingEnabled` 状态 |
| `F8` | 仅派发事件，默认无副作用 |
| `F9` | 仅派发事件，默认无副作用 |
| `F10` | 仅派发事件，默认无副作用 |
| `F11` | 基于 Fullscreen API 切换全屏 |
| `F12` | 仅派发事件，默认无副作用 |

### 浏览器限制

- `F6`、`F10`、`F12` 这类浏览器 chrome / 系统级行为，网页无法真正控制
- `F3` 依赖 `window.find`，兼容性受浏览器实现影响
- `F11` 依赖 Fullscreen API，可能被浏览器策略拦截
- `F5` 会直接刷新页面，如有未保存数据，建议业务覆写

### React 中覆写

```tsx
<VirtualKeyboard
  functionKeyDefaults={{
    helpUrl: '/help',
    focusSelector: '#global-search',
  }}
  onFunctionKey={({ key }) => {
    if (key.code === 'F5') {
      reloadTableData();
      return true;
    }
  }}
  functionKeyHandlers={{
    F12: () => {
      setDebugDrawerOpen(true);
      return true;
    },
  }}
/>
```

### 通过全局事件覆写

会在 `window` 上派发可取消事件 `vkb:function-key`。外部可通过 `preventDefault()` 阻止默认行为。

```ts
window.addEventListener('vkb:function-key', (event) => {
  const customEvent = event as CustomEvent;

  if (customEvent.detail?.key?.code === 'F11') {
    customEvent.preventDefault();
    openBigScreenMode();
  }
});
```

## 数字键盘候选区

数字键盘内置了计算候选能力。

例如输入：

- `1+1`
- `777+8`
- `6-1+`

候选区会根据当前有效表达式给出结果，例如：

- `2`
- `1+1=2`
- `785`
- `777+8=785`
- `5`
- `6-1=5`

点击候选结果后，会替换当前表达式，而不是追加到输入框末尾。

## 字母键盘候选区

字母键盘支持：

- 中英文模式切换
- 拼音候选
- 英文单词候选
- 大小写状态

如果你想自定义拼音结果，可以传入 `onPinyin2Chinese`：

```tsx
const keyboard = useInput({
  onPinyin2Chinese(value) {
    return {
      pinyin: value,
      chinese: ['你好', '拟好', '霓号'],
    };
  },
});
```

## 手写键盘

`WriteKeyboard` 支持手写板候选。

如果你希望替换默认识别逻辑，可以通过 `useInput` 传入 `onImageToWord`：

```tsx
const keyboard = useInput({
  async onImageToWord(url, options) {
    // 调用你自己的 OCR 或识别服务
    return ['示例', '候选词'];
  },
});
```

## 导出的组件与 hooks

### 组件

```ts
import {
  VirtualKeyboard,
  CompositionKeyboard,
  NumberKeyboard,
  LetterKeyboard,
  SymbolKeyboard,
  EmojiKeyboard,
  FunctionKeyboard,
  EditKeyboard,
  SettingKeyboard,
  WriteKeyboard,
  DragBlock,
  WordTempList,
} from 'rc-virtual-keyboard';
```

### hooks

```ts
import {
  useInput,
  useContinuousTrigger,
  useHorizontalDragScroll,
  useTouchClickGuard,
  useIsMobile,
} from 'rc-virtual-keyboard';
```

### 组合键盘 tab

```ts
import {
  LetterKeyboardTab,
  NumberKeyboardTab,
  EmojiKeyboardTab,
  FunctionKeyboardTab,
  SymbolKeyboardTab,
  EditKeyboardTab,
  SettingKeyboardTab,
  WriteKeyboardTab,
} from 'rc-virtual-keyboard';
```

## 主题变量

可以通过 `theme` 或 CSS 变量覆盖键盘外观。

### 常用变量

| 变量 | 说明 | 默认值 |
| --- | --- | --- |
| `--vkb-background` | 键盘背景色 | `#f2f5fa` |
| `--vkb-key-background` | 按键背景色 | `#ffffff` |
| `--vkb-key-color` | 按键文字颜色 | `#000000` |
| `--vkb-key-active-background` | 按键激活背景色 | `#dce1e7` |
| `--vkb-key-active-font-color` | 按键激活文字颜色 | `#1677ff` |
| `--vkb-key-border-color` | 按键边框颜色 | `#f0f0f0` |
| `--vkb-key-gap` | 按键间距 | `6px` |
| `--vkb-key-borer-radius` | 圆角 | `4px` |
| `--vkb-key-font-size` | 按键字号 | `14px` |
| `--vkb-key-font-family` | 按键字体 | `'Microsoft YaHei', 'PingFang SC', sans-serif` |
| `--vkb-keyboard-tab` | 顶部 tab 高度 | `40px` |
| `--vkb-keyboard-svg-size` | 图标大小 | `26px` |

### 主题示例

```tsx
<VirtualKeyboard
  theme={{
    '--vkb-background': '#10131a',
    '--vkb-key-background': '#161b22',
    '--vkb-key-color': '#f5f7fa',
    '--vkb-key-active-background': '#253041',
    '--vkb-key-active-font-color': '#4ea1ff',
  }}
/>
```

## 常见问题

### 1. 为什么不建议直接用 `type="number"`？

因为原生 `number` 输入在不同浏览器里对选区、光标和字符处理差异比较大。更推荐这样写：

```tsx
<input type="text" data-vkb-type="number" />
```

### 2. 想关闭全局自动弹出，只让少数输入框能弹出怎么办？

```tsx
<VirtualKeyboard focusShow={false} />
<input data-vkb-show />
```

### 3. 想让浮动键盘保持当前位置，不随着焦点变化自动吸附怎么办？

```tsx
<input data-vkb-follow-focus="false" />
```

### 4. 想让输入框失焦后键盘仍然保持展示怎么办？

```tsx
<input data-vkb-blur-hidden={false} />
```

## 本地开发

```bash
# 安装依赖
pnpm install

# 启动文档开发环境
pnpm run dev -- --host 0.0.0.0

# 构建组件库
pnpm run build

# 监听模式构建组件库
pnpm run build:watch

# 构建文档站点
pnpm run docs:build

# 本地预览文档构建结果
pnpm run docs:preview
```

## 本地 npm 打包命令

```bash
# 安装依赖
npm install

# 本地打包组件库
npm run build

# 监听模式下持续打包
npm run build:watch

# 打包文档站点
npm run docs:build

# 本地预览文档构建结果
npm run docs:preview
```

## 发布命令

```bash
# 发布前建议先校验
npm run lint:es
npm run build

# 按发版类型更新版本号
# 小版本（补丁修复）
npm version patch

# 中版本（向下兼容的新功能）
# npm version minor

# 大版本（不兼容变更）
# npm version major

# 登录 npm（如尚未登录）
npm login

# 发布到 npm
npm publish --access public
```

说明：

- `package.json` 中已配置 `prepublishOnly`，执行 `npm publish` 前会自动再跑一次 `npm run build`
- 小版本更新使用 `npm version patch`
- 中版本更新使用 `npm version minor`
- 大版本更新使用 `npm version major`
- 当前包名为 `rc-virtual-keyboard`
- 当前发布包只包含 `dist/` 目录下的产物

## 发布产物

发布包包含：

- `dist/index.js`：ESM 入口
- `dist/index.cjs`：CommonJS 入口
- `dist/index.d.ts`：类型声明
- `dist/style.css`：打包后的样式文件

## 文档站点

- 本地开发：`pnpm run dev -- --host 0.0.0.0`
- 生产构建：`pnpm run docs:build`
- 线上文档：`https://anycloud666.github.io/rc-virtual-keyboard`

## License

MIT
