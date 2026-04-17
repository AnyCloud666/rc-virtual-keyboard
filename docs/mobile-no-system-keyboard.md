---
nav:
  title: 移动端禁系统键盘
  order: 5
---

# 移动端聚焦输入框，但不唤起系统键盘

这个示例用于验证移动端场景下，输入框仍然可以获得焦点并交给虚拟键盘输入，同时尽量避免弹出系统软键盘。

## 推荐做法

- 在目标 `input` 上加 `readOnly`
- 同时补一个 `inputMode="none"` 作为兼容性增强
- 保持页面里仍然挂载同一个 `VirtualKeyboard`
- 组件内部会在移动端默认切到 `fixedBottom`，让键盘直接贴底展示

## 测试用例

```jsx
import { useState } from 'react';
import { VirtualKeyboard } from 'rc-virtual-keyboard';

export default () => {
  const [mobileValue, setMobileValue] = useState('');
  const [codeValue, setCodeValue] = useState('');

  return (
    <>
      <div style={{ display: 'grid', gap: 12, maxWidth: 420 }}>
        <input
          readOnly
          inputMode="none"
          placeholder="移动端点击后不唤起系统键盘"
          value={mobileValue}
          onChange={(e) => {
            setMobileValue(e.target.value);
          }}
        />

        <input
          readOnly
          inputMode="none"
          data-vkb-show
          placeholder="验证码/设备编号这类场景也可直接用"
          value={codeValue}
          onChange={(e) => {
            setCodeValue(e.target.value);
          }}
        />
      </div>

      <VirtualKeyboard />
    </>
  );
};
```

## 预期行为

- 点击输入框时，输入框可以获得焦点
- 页面内虚拟键盘仍可正常输入
- 移动端下虚拟键盘直接固定在页面底部
- 移动端系统软键盘不再弹出，或显著降低被唤起的概率

## 说明

- `readOnly` 是这个场景里最稳妥的做法，虚拟键盘内部仍然会通过原生赋值和事件派发去更新输入框值
- `inputMode="none"` 主要用于增强兼容性，不同移动端浏览器实现可能略有差异
- 当外部没有显式传 `positionMode` 时，组件内部会根据屏幕宽度在移动端默认使用 `fixedBottom`
- 如果某个场景既需要系统键盘，也需要虚拟键盘，建议按业务状态动态切换 `readOnly`
