---
order: 4
toc: content
group:
  title: 基础
  order: 0
nav:
  title: 组件
  order: 1
  second:
    title: 手写键
    order: 1
---

# 手写键

默认采用 `tesseract.js` 图片转文字

由于识别度较低,可自定义实现 `onImageToWord:(url:string)=>Promise<string>` 方法, 传入图片 url, 返回文字内容

```jsx
import { WriteKeyboard, useInput, keys } from 'rc-virtual-keyboard';
import { useState } from 'react';
export default () => {
  const [value, setValue] = useState('');
  const {
    onClick,
    inputMode,
    inputValue,
    chinese,
    onChangeInputMode,
    onSelectChinese,
    onRecognition,
  } = useInput({
    defaultActiveKeyboard: keys.letterType,
    onEnter: () => {
      console.log('回车了');
    },
    // 在这里实现onImageToWord方法
  });
  return (
    <div style={{ width: 500, height: 320, margin: '0 auto' }}>
      <input />
      <WriteKeyboard
        chinese={chinese}
        onMouseDown={(e) => {
          // 防止失去焦点
          e?.preventDefault?.();
        }}
        onSelectChinese={onSelectChinese}
        onClick={onClick}
        onRecognition={onRecognition}
      />
    </div>
  );
};
```

## 属性

| 属性    | 说明           | 类型     | 默认值 |
| ------- | -------------- | -------- | ------ |
| chinese | 识别之后的文字 | string[] | []     |

## 方法

| 方法            | 说明     | 类型                                   | 默认值 |
| --------------- | -------- | -------------------------------------- | ------ |
| onClick         | 点击事件 | (e: VKB.KeyboardAttributeType) => void | -      |
| onSelectChinese | 选择中文 | (chinese: string) => void              | -      |
| onRecognition   | 识别图片 | (url: string) => void                  | -      |

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
