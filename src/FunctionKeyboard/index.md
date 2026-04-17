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

  return (
    <div style={{ width: 500, height: 320, margin: '0 auto' }}>
      <FunctionKeyboard onClick={onClick} />
    </div>
  );
};
```

## 属性

| 属性 | 说明 | 类型 | 默认值 |
| ---- | ---- | ---- | ------ |
| -    | -    | -    | -      |

## 方法

| 方法    | 说明     | 类型                                   | 默认值 |
| ------- | -------- | -------------------------------------- | ------ |
| onClick | 点击事件 | (e: VKB.KeyboardAttributeType) => void | -      |

## 说明

- 当前布局为 `一行三个`
- 共 4 行：
  - `F1 F2 F3`
  - `F4 F5 F6`
  - `F7 F8 F9`
  - `F10 F11 F12`
- 点击时会按功能键事件处理，不会向输入框插入普通文本

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
