---
order: 5
toc: content
group:
  title: 基础
  order: 0
nav:
  title: 组件
  second:
    title: 设置组合键盘
    order: 1
---

# 设置组合键盘

在组合键盘时使用改组件，对组件进行配置，单独使用无效

```jsx
import { SettingKeyboard } from 'rc-virtual-keyboard';

export default () => {
  const onClick = (e) => {
    console.log('SettingKeyboard e: ', e);
  };
  return (
    <div style={{ width: 500, height: 320, margin: '0 auto' }}>
      <SettingKeyboard onClick={onClick} />
    </div>
  );
};
```

## 属性

| 属性         | 说明     | 类型                                                       | 默认值 |
| ------------ | -------- | ---------------------------------------------------------- | ------ |
| themeMode    | 主题模式 | light\| dark \| 自定义                                     | light  |
| positionMode | 位置模式 | fixedBottom\| fixedTop \| fixedLeft \| fixedRight \| float | float  |

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
