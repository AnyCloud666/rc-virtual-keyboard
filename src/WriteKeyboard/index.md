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

手写识别，暂未完成，请等待

或

将书写的图片进行导出，采用第三方进行识别...

```jsx
import { WriteKeyboard } from 'react-virtual-keyboard';

export default () => {
  const onClick = (e) => {
    console.log('WriteKeyboard e: ', e);
  };
  return (
    <div style={{ width: 500, height: 320, margin: '0 auto' }}>
      <WriteKeyboard onClick={onClick} />
    </div>
  );
};
```

## 属性

| 属性                         | 说明                           | 类型                                                                                                                                                                                                           | 默认值 |
| ---------------------------- | ------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------ |
| style                        | 外部传入的样式，作用于整个容器 | CSSProperties                                                                                                                                                                                                  | -      |
| styles                       | 外部传入的样式，作用于单个容器 | { writeContent?: CSSProperties; writeContentCanvas?: CSSProperties; writeContentTips?: CSSProperties; writeControl?: CSSProperties; writeControlBackspace?: CSSProperties; writeControlEnter?: CSSProperties;} | -      |
| styles.writeContent          | 书写区域                       | CSSProperties                                                                                                                                                                                                  | -      |
| styles.writeContentCanvas    | 书写区域内部 canvas            | CSSProperties                                                                                                                                                                                                  | -      |
| styles.writeContentTips      | 内容提示                       | CSSProperties                                                                                                                                                                                                  | -      |
| styles.writeControl          | 书写控制区                     | CSSProperties                                                                                                                                                                                                  | -      |
| styles.writeControlBackspace | 删除键                         | CSSProperties                                                                                                                                                                                                  | -      |
| styles.writeControlEnter     | 回车键                         | CSSProperties                                                                                                                                                                                                  | -      |

## 方法

| 方法    | 说明     | 类型                                   | 默认值 |
| ------- | -------- | -------------------------------------- | ------ |
| onClick | 点击事件 | (e: VKB.KeyboardAttributeType) => void | -      |
| onDraw  | 绘制图像 | (img: string) => void                  | -      |

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
