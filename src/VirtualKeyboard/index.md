# 组合虚拟键盘

## 简单案例

```jsx
import { useState } from 'react';
import { useVirtualKeyboard, keys } from 'react-virtual-keyboard';

export default () => {
  const [show, setShow] = useState(false);
  const [themeMode, setThemeMode] = useState(
    localStorage?.getItem(keys.VKB_THEME_MODE) ?? 'light',
  );
  const [positionMode, setPositionMode] = useState(
    localStorage?.getItem(keys.VKB_POSITION_MODE) ?? 'float',
  );
  const [value, setValue] = useState('');
  const { VirtualKeyboard, InitVirtualKeyBoardCtx, VirtualKeyboardProvide } =
    useVirtualKeyboard();

  return (
    <>
      {/* <div>可使用左侧虚拟键盘</div> */}
      <input
        placeholder="可使用左侧虚拟键盘"
        onInput={(e) => {
          setValue(e.target.value);
          console.log('value', e.target.value);
        }}
      />
      <div>value：{value}</div>
      <VirtualKeyboardProvide
        value={{
          ...InitVirtualKeyBoardCtx,
          width: '500px',
          height: '320px',
          show,
          setShow,
          themeMode,
          setThemeMode,
          positionMode,
          setPositionMode,
          theme: {},
        }}
      >
        <VirtualKeyboard />
      </VirtualKeyboardProvide>
    </>
  );
};
```

## 属性

| 属性               | 说明                                              | 类型              | 默认值         |
| ------------------ | ------------------------------------------------- | ----------------- | -------------- |
| width              | 宽度                                              | string            | 500px          |
| height             | 高度                                              | string            | 320px          |
| zIndex             | 层级                                              | string \| number  | 9999           |
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

| token                         | 说明             | 类型   | 默认值                                          |
| ----------------------------- | ---------------- | ------ | ----------------------------------------------- |
| --vkb-key-gap                 | 间隔             | string | 6px                                             |
| --vkb-key-border-width        | 按键边框线宽度   | string | 1px                                             |
| --vkb-keyboard-svg-size       | 内部 svg 大小    | string | 26px                                            |
| --vkb-key-shadow-width        | 按键 shadow 宽度 | string | 4px                                             |
| --vkb-key-borer-radius        | 按键圆角         | string | 4px                                             |
| --vkb-key-tips-font-size      | 提示文字大小     | string | 12px                                            |
| --vkb-keyboard-tab            | tab 高度         | string | 40px                                            |
| --vkb-key-background          | 按键背景色       | string | #ffffff                                         |
| --vkb-key-border-color        | 按键边框颜色     | string | #f0f0f0                                         |
| --vkb-key-shadow-color        | 按键 shadow 颜色 | string | #f0f0f0                                         |
| --vkb-key-active-font-color   | 按键活动字体颜色 | string | #1677ff                                         |
| --vkb-key-active-background   | 按键背活动景色   | string | #dce1e7                                         |
| --vkb-key-active-shadow-color | 按键活动 shadow  | string | #dce1e7                                         |
| --vkb-key-active-border-color | 按键活动边框颜色 | string | #dce1e7                                         |
| --vkb-background              | 键盘背景色       | string | #f2f5fa                                         |
| --vkb-key-color               | 字体颜色         | string | <input type='color' value=' #000000' /> #000000 |
| --vkb-key-tips-color          | 提示颜色         | string | <input type='color' value='#cccccc' /> #cccccc  |
| --vkb-key-scroll-bar-color    | 滚动条颜色       | string | <input type='color' value='#cccccc' /> #cccccc  |

## 默认的 virtualKeyboardTab

```js
const tabs: VKB.KeyboardTabItem[] = [
  {
    id: 'letter',
    label: <KeyboardSvg />,
    name: '字母键',
    Component: ({
      inputMode,
      inputValue,
      chinese,
      onClick,
      onMouseDown,
      onChangeInputMode,
      onSelectChinese,
    }) => (
      <LetterKeyboard
        inputValue={inputValue}
        chinese={chinese}
        inputMode={inputMode}
        onClick={onClick}
        onMouseDown={onMouseDown}
        onChangeInputMode={onChangeInputMode}
        onSelectChinese={onSelectChinese}
      />
    ),
  },
  {
    id: 'number',
    label: <NumberSvg />,
    name: '数字键',
    Component: ({ onClick }) => <NumberKeyboard onClick={onClick} />,
  },
  {
    id: 'symbol',
    label: <SymbolSvg />,
    name: '符号键',
    Component: ({ onClick }) => <SymbolKeyboard onClick={onClick} />,
  },
  {
    id: 'edit',
    label: <EditSvg />,
    name: '编辑键',
    Component: ({ onClick }) => <EditKeyboard onClick={onClick} />,
  },
  {
    id: 'setting',
    label: <SettingSvg />,
    name: '设置',
    Component: ({ themeMode, positionMode, onClick }) => (
      <SettingKeyBoard
        themeMode={themeMode}
        positionMode={positionMode}
        onClick={onClick}
      />
    ),
  },
  {
    id: 'write',
    label: <WriteSvg />,
    name: '手写板',
    Component: ({ onClick }) => <WriteKeyboard onClick={onClick} />,
  },
];
```
