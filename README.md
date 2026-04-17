# rc-virtual-keyboard

react virtual keyboard

## Development

```bash
# install dependencies
$ pnpm install

# develop library by docs demo
$ pnpm start

# build library source code
$ pnpm run build

# build library source code in watch mode
$ pnpm run build:watch

# build docs
$ pnpm run docs:build

# Locally preview the production build.
$ pnpm run docs:preview

# check your project for potential problems
$ pnpm run doctor
```

## Environment

- Recommended Node.js version: `18.x`, `20.x`, or `24.x`
- On Node.js `24.x`, this repo injects a local `http_parser` compatibility shim before running `dumi`
- If you need to initialize dumi files manually, run `pnpm run docs:setup`

## use

```bash
npm install rc-virtual-keyboard --save

pnpm install rc-virtual-keyboard --save

yarn add rc-virtual-keyboard --save

```

```ts
import { useState } from 'react';
import { useVirtualKeyboard, keys } from 'rc-virtual-keyboard';

export default () => {
  const [value, setValue] = useState('');
  const { VirtualKeyboard, VirtualKeyboardProvider } = useVirtualKeyboard();

  return (
    <>
      {/* <div>可使用右侧虚拟键盘</div> */}
      <input
        placeholder="可使用右侧虚拟键盘"
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

## 说明

- 数字键
- 字母键
  - 支持大小写切换
  - 支持单字拼音输入
- 符号键
- 光标操作
  - 复制
  - 粘贴
  - 全选
- 键盘设置
  - 主题模式
  - 位置
- 手写板（ing...）

![字母键](https://github.com/AnyCloud666/rc-virtual-keyboard/blob/master/public/example/ward.jpg?raw=true)

![数字键](https://github.com/AnyCloud666/rc-virtual-keyboard/blob/master/public/example/number.jpg?raw=truev)

![符号键](https://github.com/AnyCloud666/rc-virtual-keyboard/blob/master/public/example/symbol.jpg?raw=true)

![设置项](https://github.com/AnyCloud666/rc-virtual-keyboard/blob/master/public/example/setting.jpg?raw=true)

## document

see me [https://anycloud666.github.io/rc-virtual-keyboard]

see me [https://anycloud666.github.io/rc-virtual-keyboard]

see me [https://anycloud666.github.io/rc-virtual-keyboard]

one star!one star!!!one star!!!

## LICENSE
