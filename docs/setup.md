# 快速开始

## 安装

```cmd
# npm 包管理器
npm install rc-vitrual-keyboard

# yarn 包管理器
yarn install rc-vitrual-keyboard

# pnpm 包管理器
pnpm install rc-vitrual-keyboard
```

## 使用

```jsx
import { useState } from 'react';
import { useVirtualKeyboard, keys } from 'rc-virtual-keyboard';

export default () => {
  const [value, setValue] = useState('');
  const { VirtualKeyboard, VirtualKeyboardProvider } = useVirtualKeyboard();

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
      <VirtualKeyboardProvider>
        <VirtualKeyboard />
      </VirtualKeyboardProvider>
    </>
  );
};
```
