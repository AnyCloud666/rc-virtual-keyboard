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
  const [show, setShow] = useState(false);
  const [themeMode, setThemeMode] = useState(
    localStorage?.getItem(keys.VKB_THEME_MODE) ?? 'light',
  );
  const [positionMode, setPositionMode] = useState(
    localStorage?.getItem(keys.VKB_POSITION_MODE) ?? 'float',
  );
  const [value, setValue] = useState('');
  const { VirtualKeyboard, InitVirtualKeyBoardCtx, VirtualKeyboardProvide } =
    useVirtualKeyboard();

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
      <VirtualKeyboardProvide
        value={{
          ...InitVirtualKeyBoardCtx,
          width: '500px',
          height: '320px',
          show,
          setShow,
          themeMode,
          setThemeMode,
          positionMode,
          setPositionMode,
          theme: {},
        }}
      >
        <VirtualKeyboard />
      </VirtualKeyboardProvide>
    </>
  );
};
```

## document

see you[https://anycloud666.github.io/rc-virtual-keyboard]

see you[https://anycloud666.github.io/rc-virtual-keyboard]

see you[https://anycloud666.github.io/rc-virtual-keyboard]

one star!one star!!!one star!!!

## LICENSE

MIT
