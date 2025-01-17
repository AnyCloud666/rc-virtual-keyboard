---
order: 3
toc: content
group:
  title: 基础
  order: 0
nav:
  title: 组件
  order: 1
  second:
    title: 编辑键
    order: 1
---

# 编辑键

常用的编辑键盘

```jsx
import { EditKeyboard } from 'rc-virtual-keyboard';

export default () => {
  const onClick = (e) => {
    console.log('EditKeyboard e: ', e);
  };
  return (
    <div style={{ width: 500, height: 320, margin: '0 auto' }}>
      <EditKeyboard onClick={onClick} />
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
