---
order: 6
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

# 拖动块

支持拖动

```jsx
import { DragBlock } from 'react-virtual-keyboard';

export default () => {
  return (
    <>
      <div> 可以尝试拖动旁边的粉色块 </div>
      <DragBlock>
        {/* <WriteKeyboard onClick={onClick} /> */}

        <div style={{ width: 100, height: 100, background: 'pink' }}></div>
      </DragBlock>
    </>
  );
};
```

## 属性

| 属性               | 说明                                           | 类型                                                       | 默认值    |
| ------------------ | ---------------------------------------------- | ---------------------------------------------------------- | --------- |
| init               | 用于计算初始位置，                             | { width: string; height: string }                          | undefined |
| resizeOverRight    | 窗口改变时自动靠右                             | boolean                                                    | false     |
| autoKeepRightDelay | 无操作后，多少毫秒自动靠右                     | number                                                     | 3000      |
| autoKeepRight      | 自动靠右                                       | boolean                                                    | true      |
| delay              | 鼠标点击延迟，用于解决 mousedown 和 click 冲突 | number                                                     | 280       |
| zIndex             | 显示层级                                       | number                                                     | 9999      |
| children           | 子节点                                         | ReactNode                                                  | undefined |
| style              | 外部传入的样式                                 | CSSProperties                                              | undefined |
| positionMode       | 组合键盘的位置模式                             | fixedBottom\| fixedTop \| fixedLeft \| fixedRight \| float | float     |

## 方法

| 方法    | 说明     | 类型       | 默认值 |
| ------- | -------- | ---------- | ------ |
| onClick | 点击事件 | () => void | -      |

## 支持的样式 token

| token | 说明 | 类型 | 默认值 |
| ----- | ---- | ---- | ------ |
| -     | -    | -    | -      |
