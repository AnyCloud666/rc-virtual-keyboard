---
nav:
  title: Icon
  order: 6
---

# 隐藏外部唤起 icon

这个示例用于演示 `showIcon={false}` 的效果。适合那种键盘由页面状态直接控制，或者本来就希望默认展开、不需要额外悬浮入口的场景。

## 预期行为

- 页面中不会渲染外部悬浮唤起 icon
- 虚拟键盘仍然可以正常显示和输入
- 输入框和键盘交互逻辑保持不变

## 测试用例

```jsx
import { useState } from 'react';
import { VirtualKeyboard } from 'rc-virtual-keyboard';

export default () => {
  const [value, setValue] = useState('');

  return (
    <>
      <div style={{ display: 'grid', gap: 12, maxWidth: 420 }}>
        <input
          placeholder="这里不显示外部唤起 icon"
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
          }}
        />
        <div>当前值：{value || '未输入'}</div>
      </div>

      <VirtualKeyboard show showIcon={false} />
    </>
  );
};
```

## 说明

- `showIcon={false}` 只控制外部唤起 icon 的显示，不影响键盘主体功能
- 示例里额外传了 `show`，方便直接观察键盘效果
- 如果你的业务里键盘显示/隐藏由外部状态管理，这个属性会比较实用
