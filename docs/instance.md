---
nav:
  title: 实例说明
  order: 2
---

# 实例说明

## 文档中的示例为什么会拆开写

- 文档页里经常会把不同用例拆成单独示例，目的是避免演示之间互相影响
- 比如 `focusShow`、`data-vkb-show`、`data-vkb-blur-hidden` 这类能力，如果放在同一个示例里，容易因为共享一个显示状态而让行为看起来混在一起
- 所以文档会按场景拆分说明，但这只是为了演示清晰，不代表业务项目必须创建多个虚拟键盘实例

## 实际使用推荐

- 实际业务中，推荐全局只保留一个虚拟键盘实例
- 通常做法是在应用根节点挂一个 `VirtualKeyboardProvider` 和一个 `VirtualKeyboard`
- 页面里的输入框统一共用这一套虚拟键盘，通过不同的 `data-vkb-*` 属性控制行为
- 如果你要单独验证某个规则，建议像文档中的 [Focus 弹出测试](/focus-show) 一样拆成单独页面，避免示例之间互相影响

## 推荐接入方式

```jsx
import { useState } from 'react';
import { useVirtualKeyboard } from 'rc-virtual-keyboard';

export default () => {
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const { VirtualKeyboard, VirtualKeyboardProvider } = useVirtualKeyboard();

  return (
    <VirtualKeyboardProvider>
      <div>
        <input
          placeholder="默认跟随全局规则"
          value={name}
          onInput={(e) => {
            setName(e.target.value);
          }}
        />

        <input
          placeholder="focus 时强制展示键盘"
          data-vkb-show
          value={code}
          onInput={(e) => {
            setCode(e.target.value);
          }}
        />
      </div>

      <VirtualKeyboard />
    </VirtualKeyboardProvider>
  );
};
```

## 什么时候才需要多个实例

- 只有在你明确需要完全隔离不同区域的显示状态、位置、主题或交互逻辑时，才考虑多个虚拟键盘实例
- 大多数表单、后台系统、设备控制台场景，一个全局实例就够了
- 如果只是想区分某几个输入框的行为，优先使用 `focusShow`、`data-vkb-show`、`data-vkb-auto-popup`、`data-vkb-blur-hidden` 这些配置，而不是先拆实例
