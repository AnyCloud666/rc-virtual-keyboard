---
order: 0
toc: content
group:
  title: 基础
  order: 0
nav:
  title: 组件
  order: 1
  second:
    title: 字母键
    order: 1
---

# 字母键

常用的字母键盘

```jsx
import { useState } from 'react';
import { LetterKeyboard, useInput, keys } from 'react-virtual-keyboard';

export default () => {
  const [value, setValue] = useState('');
  const {
    onClick,
    inputMode,
    inputValue,
    chinese,
    onChangeInputMode,
    onSelectChinese,
  } = useInput({
    defaultActiveKeyboard: keys.letterType,
    onEnter: () => {
      console.log('回车了');
    },
  });
  return (
    <>
      <div style={{ margin: '0 auto', textAlign: 'center' }}>
        <input
          placeholder="可使用虚拟键盘"
          value={value}
          onInput={(e) => {
            {
              /* console.log('value', e.target.value); */
            }
            setValue(e.target.value);
          }}
        />
        value: {value}
      </div>
      <div style={{ width: 500, height: 320, margin: '0 auto' }}>
        <LetterKeyboard
          inputValue={inputValue}
          chinese={chinese}
          inputMode={inputMode}
          onClick={onClick}
          onChangeInputMode={onChangeInputMode}
          onSelectChinese={onSelectChinese}
          onMouseDown={(e) => {
            // 防止失去焦点
            e?.preventDefault?.();
          }}
        />
      </div>
    </>
  );
};
```

## 属性

| 属性       | 说明                           | 类型          | 默认值 |
| ---------- | ------------------------------ | ------------- | ------ |
| inputMode  | 输入模式                       | zh \| en      | en     |
| inputValue | 输入的值                       | string        | ''     |
| chinese    | 中文输入状态获得的结果         | string\[\]    | \[\]   |
| style      | 外部传入的样式，作用于整个容器 | CSSProperties | -      |

## 方法

| 方法              | 说明                                                                  | 类型                                                        | 默认值 |
| ----------------- | --------------------------------------------------------------------- | ----------------------------------------------------------- | ------ |
| onClick           | 点击事件                                                              | (e: VKB.KeyboardAttributeType) => void                      | -      |
| onChangeInputMode | 改变输入模式                                                          | (mode:'zh' \| 'en')=>void                                   | -      |
| onMouseDown       | 鼠标按下事件,如果不想失去输入框的焦点，应该实现该方法，并阻止默认事件 | (e: React.MouseEvent\<HTMLDivElement, MouseEvent\>) => void | -      |
| onChangeInputMode | 改变输入模式                                                          | (mode:'zh'\|'en')=>void                                     | -      |
| onSelectChinese   | 选择的中文                                                            | (chinese:string)=>void                                      | -      |

## 支持的样式 token

| token                         | 说明               | 类型   | 默认值  |
| ----------------------------- | ------------------ | ------ | ------- |
| --vkb-key-gap                 | 间隔               | string | 6px     |
| --vkb-key-border-width        | 按键边框线宽度     | string | 1px     |
| --vkb-keyboard-svg-size       | 内部 `svg` 大小    | string | 26px    |
| --vkb-key-shadow-width        | 按键 `shadow` 宽度 | string | 4px     |
| --vkb-key-borer-radius        | 按键圆角           | string | 4px     |
| --vkb-key-background          | 按键背景色         | string | #ffffff |
| --vkb-key-border-color        | 按键边框颜色       | string | #f0f0f0 |
| --vkb-key-shadow-color        | 按键 shadow 颜色   | string | #f0f0f0 |
| --vkb-key-active-font-color   | 按键活动字体颜色   | string | #1677ff |
| --vkb-key-active-background   | 按键背活动景色     | string | #dce1e7 |
| --vkb-key-active-shadow-color | 按键活动 shadow    | string | #dce1e7 |
| --vkb-key-active-border-color | 按键活动边框颜色   | string | #dce1e7 |
| --vkb-key-color               | 按键字体颜色       | string | #000    |
