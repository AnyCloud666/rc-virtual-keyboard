---
nav:
  title: Focus 弹出测试
  order: 4
---

# 全局禁止 focus 自动弹出，仅指定输入框展示键盘

这个页面只用于测试这一组规则，避免和其他文档示例共享同一个虚拟键盘状态造成干扰。

## 预期行为

- 第一个输入框：获得焦点时不弹出键盘
- 第二个输入框：获得焦点时弹出键盘
- 两个输入框共用同一个虚拟键盘实例

## 测试用例

```jsx
import { useState } from 'react';
import {
  useVirtualKeyboard,
  InitVirtualKeyBoardCtx,
} from 'rc-virtual-keyboard';

export default () => {
  const [normalValue, setNormalValue] = useState('');
  const [forcedValue, setForcedValue] = useState('');
  const { VirtualKeyboard, VirtualKeyboardProvider } = useVirtualKeyboard({
    focusShow: false,
  });

  return (
    <>
      <div style={{ display: 'grid', gap: 12, maxWidth: 420 }}>
        <input
          placeholder="默认 focus 不弹出键盘"
          value={normalValue}
          onInput={(e) => {
            setNormalValue(e.target.value);
          }}
        />

        <input
          placeholder="focus 时展示键盘"
          data-vkb-show
          value={forcedValue}
          onInput={(e) => {
            setForcedValue(e.target.value);
          }}
        />
      </div>

      <VirtualKeyboardProvider
        value={{ ...InitVirtualKeyBoardCtx, focusShow: false }}
      >
        <VirtualKeyboard />
      </VirtualKeyboardProvider>
    </>
  );
};
```

## 说明

- 这里故意只保留一个独立场景，方便确认 `focusShow={false}` 和 `data-vkb-show` 是否生效
- 实际业务接入时，依然推荐全局只保留一个虚拟键盘实例
