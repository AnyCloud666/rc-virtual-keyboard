---
order: 2
toc: content
group:
  title: 基础
  order: 0
nav:
  title: 组件
  order: 1
  second:
    title: Fn 键
    order: 1
---

# Fn 键

常用的功能键盘，包含 `F1-F12`。

```jsx
import { FunctionKeyboard } from 'rc-virtual-keyboard';

export default () => {
  const onClick = (e) => {
    console.log('FunctionKeyboard e: ', e);
  };
  const onKeyDown = (e) => {
    console.log('FunctionKeyboard down: ', e.code);
  };
  const onKeyUp = (e) => {
    console.log('FunctionKeyboard up: ', e.code);
  };

  return (
    <div style={{ width: 500, height: 320, margin: '0 auto' }}>
      <FunctionKeyboard
        onClick={onClick}
        onKeyDown={onKeyDown}
        onKeyUp={onKeyUp}
      />
    </div>
  );
};
```

## 属性

| 属性      | 说明         | 类型                                   | 默认值 |
| --------- | ------------ | -------------------------------------- | ------ |
| onClick   | 点击事件     | (e: VKB.KeyboardAttributeType) => void | -      |
| onKeyDown | 按键按下事件 | (e: VKB.KeyboardAttributeType) => void | -      |
| onKeyUp   | 按键抬起事件 | (e: VKB.KeyboardAttributeType) => void | -      |

## 方法

| 方法      | 说明         | 类型                                   | 默认值 |
| --------- | ------------ | -------------------------------------- | ------ |
| onClick   | 点击事件     | (e: VKB.KeyboardAttributeType) => void | -      |
| onKeyDown | 按键按下事件 | (e: VKB.KeyboardAttributeType) => void | -      |
| onKeyUp   | 按键抬起事件 | (e: VKB.KeyboardAttributeType) => void | -      |

## 说明

- 当前布局为 `一行三个`
- 共 4 行：
  - `F1 F2 F3`
  - `F4 F5 F6`
  - `F7 F8 F9`
  - `F10 F11 F12`
- 点击时会按功能键事件处理，不会向输入框插入普通文本
- 默认浏览器行为由 `useInput` / `CompositionKeyboard` / `VirtualKeyboard` 接管
- 支持通过 `onFunctionKey`、`functionKeyHandlers` 或全局事件 `vkb:function-key` 覆写默认行为

## 默认行为

| 键位 | 默认行为 |
| ----- | -------- |
| `F1` | 打开帮助链接，未配置时仅派发事件 |
| `F2` | 仅派发事件 |
| `F3` | 使用当前选中文本、选区文本或候选词执行页内查找 |
| `F4` | 仅派发事件 |
| `F5` | 刷新页面 |
| `F6` | 聚焦配置的搜索框或首个可用输入框 |
| `F7` | 切换内部 `caretBrowsingEnabled` 状态 |
| `F8` | 仅派发事件 |
| `F9` | 仅派发事件 |
| `F10` | 仅派发事件 |
| `F11` | 切换全屏 |
| `F12` | 仅派发事件 |

## 覆写方式

功能键默认行为不直接挂在 `FunctionKeyboard` 组件本身，而是由 `useInput`、`CompositionKeyboard`、`VirtualKeyboard` 统一接管。

推荐优先使用这 3 种方式：

1. `functionKeyHandlers`
   适合只改某几个功能键
2. `onFunctionKey`
   适合统一收口所有 `F1-F12` 逻辑
3. `window` 事件 `vkb:function-key`
   适合非 React 或全局监听场景

### 单键覆写模板

```tsx
import { VirtualKeyboard } from 'rc-virtual-keyboard';

export default function Demo() {
  return (
    <VirtualKeyboard
      functionKeyHandlers={{
        F5: ({ key }) => {
          console.log('override', key.code);
          return true;
        },
      }}
    />
  );
}
```

- 返回 `true` 表示“我已经处理了这个按键”，组件不会继续执行默认行为
- 返回 `false`、`undefined` 或不返回时，会继续走默认行为

### 统一覆写模板

```tsx
import { VirtualKeyboard } from 'rc-virtual-keyboard';

export default function Demo() {
  return (
    <VirtualKeyboard
      onFunctionKey={({ key }) => {
        if (key.code === 'F8') {
          console.log('global override F8');
          return true;
        }
      }}
    />
  );
}
```

### 全局事件覆写模板

```tsx
useEffect(() => {
  const handler = (event: Event) => {
    const customEvent = event as CustomEvent;

    if (customEvent.detail?.key?.code === 'F11') {
      customEvent.preventDefault();
      openBigScreenMode();
    }
  };

  window.addEventListener('vkb:function-key', handler);
  return () => window.removeEventListener('vkb:function-key', handler);
}, []);
```

## 单个按键说明

### `F1`

- 默认行为：打开 `functionKeyDefaults.helpUrl`
- 典型用途：帮助中心、操作说明、快捷键面板
- 限制说明：未配置 `helpUrl` 时不会自动跳转

```tsx
<VirtualKeyboard
  functionKeyDefaults={{
    helpUrl: '/help/keyboard',
  }}
  functionKeyHandlers={{
    F1: () => {
      setHelpModalOpen(true);
      return true;
    },
  }}
/>
```

### `F2`

- 默认行为：仅派发事件
- 典型用途：重命名、进入编辑态、修改当前项
- 限制说明：没有内置副作用，需要业务自行实现

```tsx
<VirtualKeyboard
  functionKeyHandlers={{
    F2: () => {
      setRenameDialogOpen(true);
      return true;
    },
  }}
/>
```

### `F3`

- 默认行为：优先用当前选中文本、输入框选区文本、候选词或临时输入值执行页内查找
- 典型用途：页内查找、站内搜索、搜索框聚焦
- 限制说明：默认行为依赖 `window.find`，不同浏览器兼容性不同

```tsx
<VirtualKeyboard
  functionKeyHandlers={{
    F3: () => {
      setSearchPanelOpen(true);
      searchInputRef.current?.focus();
      return true;
    },
  }}
/>
```

### `F4`

- 默认行为：仅派发事件
- 典型用途：打开命令面板、最近记录、快捷菜单
- 限制说明：不会模拟地址栏、关闭标签页等浏览器行为

```tsx
<VirtualKeyboard
  functionKeyHandlers={{
    F4: () => {
      setCommandPaletteOpen(true);
      return true;
    },
  }}
/>
```

### `F5`

- 默认行为：刷新当前页面
- 典型用途：刷新整个页面或重载业务数据
- 限制说明：默认行为会直接触发页面刷新，存在未保存数据丢失风险

```tsx
<VirtualKeyboard
  functionKeyHandlers={{
    F5: async () => {
      await reloadTableData();
      return true;
    },
  }}
/>
```

### `F6`

- 默认行为：聚焦 `functionKeyDefaults.focusSelector` 对应元素；未配置时回退到首个可用输入框
- 典型用途：聚焦搜索框、扫码输入框、主录入框
- 限制说明：网页不能真正聚焦浏览器地址栏，只能聚焦页面内元素

```tsx
<VirtualKeyboard
  functionKeyDefaults={{
    focusSelector: '#global-search',
  }}
  functionKeyHandlers={{
    F6: () => {
      orderInputRef.current?.focus();
      return true;
    },
  }}
/>
```

### `F7`

- 默认行为：切换内部 `caretBrowsingEnabled` 状态
- 典型用途：切换键盘导航模式、辅助模式、精细选择模式
- 限制说明：不会开启浏览器原生 caret browsing，只维护组件内部状态

```tsx
<VirtualKeyboard
  functionKeyHandlers={{
    F7: ({ caretBrowsingEnabled }) => {
      setKeyboardAssistMode(!caretBrowsingEnabled);
      return true;
    },
  }}
/>
```

### `F8`

- 默认行为：仅派发事件
- 典型用途：播放/暂停、暂停扫描、切换某个业务状态
- 限制说明：没有内置副作用

```tsx
<VirtualKeyboard
  functionKeyHandlers={{
    F8: () => {
      togglePlayback();
      return true;
    },
  }}
/>
```

### `F9`

- 默认行为：仅派发事件
- 典型用途：提交校验、刷新局部区域、打开统计
- 限制说明：没有内置副作用

```tsx
<VirtualKeyboard
  functionKeyHandlers={{
    F9: () => {
      validateCurrentForm();
      return true;
    },
  }}
/>
```

### `F10`

- 默认行为：仅派发事件
- 典型用途：打开顶部菜单、更多操作、工具菜单
- 限制说明：网页无法打开浏览器或系统菜单栏

```tsx
<VirtualKeyboard
  functionKeyHandlers={{
    F10: () => {
      setToolbarMenuOpen(true);
      return true;
    },
  }}
/>
```

### `F11`

- 默认行为：使用 Fullscreen API 切换全屏
- 典型用途：全屏、大屏展示、沉浸模式
- 限制说明：可能被浏览器策略或权限限制拦截

```tsx
<VirtualKeyboard
  functionKeyHandlers={{
    F11: () => {
      setCustomFullscreen(true);
      return true;
    },
  }}
/>
```

### `F12`

- 默认行为：仅派发事件
- 典型用途：打开调试面板、日志抽屉、诊断信息
- 限制说明：网页无法主动打开浏览器开发者工具

```tsx
<VirtualKeyboard
  functionKeyHandlers={{
    F12: () => {
      setDebugDrawerOpen(true);
      return true;
    },
  }}
/>
```

## 推荐实践

- `F1`、`F5`、`F11` 这种有明显浏览器语义的按键，若业务要接管，建议始终返回 `true`
- `F3`、`F6` 这种和输入/焦点相关的按键，建议结合业务主搜索框或主录入框一起配置
- `F2`、`F4`、`F8`、`F9`、`F10`、`F12` 更适合映射为业务快捷动作
- 如果项目里存在未保存表单，建议优先覆写 `F5`
- 如果需要全局埋点，可以在 `onFunctionKey` 里统一记录，再按需交给 `functionKeyHandlers`

## 支持的样式 token

| token                         | 说明             | 类型   | 默认值  |
| ----------------------------- | ---------------- | ------ | ------- |
| --vkb-key-gap                 | 间隔             | string | 6px     |
| --vkb-key-border-width        | 按键边框线宽度   | string | 1px     |
| --vkb-key-shadow-width        | 按键 shadow 宽度 | string | 4px     |
| --vkb-key-borer-radius        | 按键圆角         | string | 4px     |
| --vkb-key-background          | 按键背景色       | string | #ffffff |
| --vkb-key-border-color        | 按键边框颜色     | string | #f0f0f0 |
| --vkb-key-shadow-color        | 按键 shadow 颜色 | string | #f0f0f0 |
| --vkb-key-active-font-color   | 按键活动字体颜色 | string | #1677ff |
| --vkb-key-active-background   | 按键背活动景色   | string | #dce1e7 |
| --vkb-key-active-shadow-color | 按键活动 shadow  | string | #dce1e7 |
| --vkb-key-active-border-color | 按键活动边框颜色 | string | #dce1e7 |
