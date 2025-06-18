---
order: 0
toc: content
group:
  title: 进阶
  order: 1
nav:
  title: 组件
  order: 1
  second:
    title: 组合虚拟键盘
    order: 1
---

# 组合虚拟键盘

## 简单案例

```jsx
import { useState } from 'react';
import {
  useVirtualKeyboard,
  keys,
  LetterKeyboardTab,
  NumberKeyboardTab,
  SymbolKeyboardTab,
  EditKeyboardTab,
  SettingKeyboardTab,
  WriteKeyboardTab,
} from 'rc-virtual-keyboard';

export default () => {
  const [value, setValue] = useState('');
  const { VirtualKeyboard, VirtualKeyboardProvider } = useVirtualKeyboard();

  return (
    <>
      {/* <div>可使用右侧虚拟键盘</div> */}
      <input
        placeholder="可使用右侧虚拟键盘"
        onInput={(e) => {
          setValue(e.target.value);
          console.log('value', e.target.value);
        }}
      />
      <div>value：{value}</div>
      <VirtualKeyboardProvider>
        <VirtualKeyboard />
      </VirtualKeyboardProvider>
    </>
  );
};
```

## 属性

| 属性               | 说明                                              | 类型              | 默认值         |
| ------------------ | ------------------------------------------------- | ----------------- | -------------- |
| width              | 宽度                                              | string            | 500px          |
| height             | 高度                                              | string            | 320px          |
| zIndex             | 层级                                              | string\| number   | 9999           |
| showDragHandle     | 显示移动句柄 & 允许移动                           | boolean           | true           |
| show               | 是否显示                                          | boolean           | false          |
| virtualKeyboardTab | 自定义键盘 tab 内容                               | KeyboardTabItem[] | all            |
| theme              | 自定义主题,当使用了主题变量时，主题变量的权重更高 | Partial\<Theme\>  | 参考默认 token |
| themeMode          | 主题模式                                          | string            | light          |
| positionMode       | 位置模式                                          | string            | float          |

## 方法

| 方法            | 说明                                     | 类型                               | 默认值 |
| --------------- | ---------------------------------------- | ---------------------------------- | ------ |
| setShow         | 显示 ,传入的必须是 setStatus 重新 render | (show: boolean) => void            | -      |
| setThemeMode    | 设置主题模式                             | (mode:string)=>void                | -      |
| setPositionMode | 设置位置模式                             | (mode:string)=>void                | -      |
| onChange        | 操作时的回调,通过 ctx 重写 onChange 实现 | onChange?: (value: string) => void | -      |
| onEnter         | 回车 通过 ctx 重写 onEnter 实现          | onEnter?: () => void               | -      |

## 支持的样式 token

| token                         | 说明             | 类型   | 默认值                                                    |
| ----------------------------- | ---------------- | ------ | --------------------------------------------------------- |
| --vkb-key-gap                 | 间隔             | string | 6px                                                       |
| --vkb-key-border-width        | 按键边框线宽度   | string | 1px                                                       |
| --vkb-keyboard-svg-size       | 内部 svg 大小    | string | 26px                                                      |
| --vkb-key-shadow-width        | 按键 shadow 宽度 | string | 4px                                                       |
| --vkb-key-borer-radius        | 按键圆角         | string | 4px                                                       |
| --vkb-key-tips-font-size      | 提示文字大小     | string | 12px                                                      |
| --vkb-keyboard-tab            | tab 高度         | string | 40px                                                      |
| --vkb-key-background          | 按键背景色       | string | `<input type='color' value='#ffffff' readOnly />` #ffffff |
| --vkb-key-border-color        | 按键边框颜色     | string | `<input type='color' value='#f0f0f0' readOnly />` #f0f0f0 |
| --vkb-key-shadow-color        | 按键 shadow 颜色 | string | `<input type='color' value='#f0f0f0' readOnly />` #f0f0f0 |
| --vkb-key-active-font-color   | 按键活动字体颜色 | string | `<input type='color' value='#1677ff' readOnly />` #1677ff |
| --vkb-key-active-background   | 按键背活动景色   | string | `<input type='color' value='#dce1e7' readOnly />` #dce1e7 |
| --vkb-key-active-shadow-color | 按键活动 shadow  | string | `<input type='color' value='#dce1e7' readOnly />` #dce1e7 |
| --vkb-key-active-border-color | 按键活动边框颜色 | string | `<input type='color' value='#dce1e7' readOnly />` #dce1e7 |
| --vkb-background              | 键盘背景色       | string | `<input type='color' value='#f2f5fa' readOnly />` #f2f5fa |
| --vkb-key-color               | 字体颜色         | string | `<input type='color' value='#000000' readOnly />` #000000 |
| --vkb-key-tips-color          | 提示颜色         | string | `<input type='color' value='#cccccc' readOnly />` #cccccc |
| --vkb-key-scroll-bar-color    | 滚动条颜色       | string | `<input type='color' value='#cccccc' readOnly />` #cccccc |

## 默认的 virtualKeyboardTab

```js
const tabs: VKB.KeyboardTabItem[] = [
  LetterKeyboardTab,
  NumberKeyboardTab,
  SymbolKeyboardTab,
  EditKeyboardTab,
  SettingKeyboardTab,
  WriteKeyboardTab,
];
```
