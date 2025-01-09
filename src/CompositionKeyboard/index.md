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
    title: 组合键盘
    order: 0
---

# 组合键盘

```jsx
import { useState } from 'react';
import {
  CompositionKeyboard,
  LetterKeyboardTab,
  NumberKeyboardTab,
  SymbolKeyboardTab,
  EditKeyboardTab,
  SettingKeyboardTab,
  WriteKeyboardTab,
} from 'rc-virtual-keyboard';
export default () => {
  const { themeMode, setThemeMode } = useState('light');
  const { positionMode, setPositionMode } = useState('float');
  const { show, setShow } = useState(false);
  const onChange = (e) => {
    console.log('e: ++++++', e);
  };

  return (
    <>
      <input
        onInput={(e) => {
          console.log('e: ', e.target.value);
        }}
      />
      <div style={{ width: 500, height: 320, margin: '0 auto' }}>
        <CompositionKeyboard
          themeMode={themeMode}
          virtualKeyboardTab={[
            LetterKeyboardTab,
            NumberKeyboardTab,
            SymbolKeyboardTab,
            WriteKeyboardTab,
            EditKeyboardTab,
            SettingKeyboardTab,
          ]}
          showDragHandle={false}
          showHiddenHandle={false}
          onChange={onChange}
          onThemeModeChange={setThemeMode}
          onPositionModeChange={setPositionMode}
        />
      </div>
    </>
  );
};
```

## 属性

| 属性                  | 说明       | 类型          | 默认值          |
| --------------------- | ---------- | ------------- | --------------- |
| showDragHandle        | 显示拖拽   | boolean       | true            |
| showHiddenHandle      | 显示隐藏   | boolean       | true            |
| style                 | 样式       | CSSProperties | -               |
| defaultActiveKeyboard | 默认键盘   | string        | number          |
| moveLabel             | 移动 label | ReactNode     | \<MoveSvg \/>   |
| hiddenLabel           | 隐藏 label | ReactNode     | \<BottomSvg \/> |
| themeMode             | 主题模式   | string        | light           |
| positionMode          | 位置模式   | string        | float           |

## 方法

| 方法                 | 说明              | 类型                                   | 默认值 |
| -------------------- | ----------------- | -------------------------------------- | ------ |
| onEnter              | enter 方法回调    | ()=>void                               | -      |
| onChange             | 输入回调          | (e: VKB.KeyboardAttributeType) => void | -      |
| onChangeShow         | 显示/隐藏虚拟键盘 | (b: boolean) => void                   | -      |
| onThemeModeChange    | 主题改变          | (mode: string) => void                 | -      |
| onPositionModeChange | 位置模式改变      | (mode: string) => void                 | -      |

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
