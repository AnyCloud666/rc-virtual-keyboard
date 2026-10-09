---
order: 1
toc: content
group:
  title: 基础
  order: 0
nav:
  title: 组件
  order: 1
  second:
    title: 数字键
    order: 1
---

# 数字键

常用的数字键盘

```jsx
import { NumberKeyboard } from 'rc-virtual-keyboard';

export default () => {
  const onClick = (e) => {
    console.log('NumberKeyboard e: ', e);
  };
  const onKeyDown = (e) => {
    console.log('NumberKeyboard down: ', e.code);
  };
  const onKeyUp = (e) => {
    console.log('NumberKeyboard up: ', e.code);
  };
  return (
    <div style={{ width: 500, height: 320, margin: '0 auto' }}>
      <NumberKeyboard
        numberKeyboardLayoutMode="desc"
        onClick={onClick}
        onKeyDown={onKeyDown}
        onKeyUp={onKeyUp}
      />
    </div>
  );
};
```

支持两种数字排列：

- `asc`
  - `123 / 456 / 789`
- `desc`
  - `789 / 456 / 123`

## 属性

| 属性                     | 说明         | 类型                               | 默认值 |
| ------------------------ | ------------ | ---------------------------------- | ------ |
| numberKeyboardLayoutMode | 数字键盘排列 | `'asc' \| 'desc'`                  | `asc`  |
| onClick                  | 点击事件     | `(e: KeyboardAttributeType)=>void` | -      |
| onKeyDown                | 按键按下事件 | `(e: KeyboardAttributeType)=>void` | -      |
| onKeyUp                  | 按键抬起事件 | `(e: KeyboardAttributeType)=>void` | -      |

## 方法

| 方法      | 说明         | 类型                                   | 默认值 |
| --------- | ------------ | -------------------------------------- | ------ |
| onClick   | 点击事件     | (e: VKB.KeyboardAttributeType) => void | -      |
| onKeyDown | 按键按下事件 | (e: VKB.KeyboardAttributeType) => void | -      |
| onKeyUp   | 按键抬起事件 | (e: VKB.KeyboardAttributeType) => void | -      |

## 支持的样式 token

| token                         | 说明             | 类型   | 默认值  |
| ----------------------------- | ---------------- | ------ | ------- |
| --vkb-key-gap                 | 间隔             | string | 6px     |
| --vkb-key-border-width        | 按键边框线宽度   | string | 1px     |
| --vkb-keyboard-svg-size       | 内部 svg 大小    | string | 26px    |
| --vkb-key-shadow-width        | 按键 shadow 宽度 | string | 4px     |
| --vkb-key-borer-radius        | 按键圆角         | string | 4px     |
| --vkb-key-background          | 按键背景色       | string | #ffffff |
| --vkb-key-border-color        | 按键边框颜色     | string | #f0f0f0 |
| --vkb-key-shadow-color        | 按键 shadow 颜色 | string | #f0f0f0 |
| --vkb-key-active-font-color   | 按键活动字体颜色 | string | #1677ff |
| --vkb-key-active-background   | 按键背活动景色   | string | #dce1e7 |
| --vkb-key-active-shadow-color | 按键活动 shadow  | string | #dce1e7 |
| --vkb-key-active-border-color | 按键活动边框颜色 | string | #dce1e7 |
