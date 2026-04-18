# rc-virtual-keyboard

react virtual keyboard

## Development

```bash
# install dependencies
pnpm install

# start the Ant Design docs site in dev mode
pnpm run dev

# build the library for publish
pnpm run build

# build the library in watch mode
pnpm run build:watch

# build docs site
pnpm run docs:build

# preview docs build locally
pnpm run docs:preview
```

## Environment

- Recommended Node.js version: `18.x`, `20.x`, or `22.x`
- Library build output: `dist/`
- Docs build output: `docs-dist/`

## Install

```bash
npm install rc-virtual-keyboard
# or
pnpm add rc-virtual-keyboard
# or
yarn add rc-virtual-keyboard
```

## Usage

```tsx
import { useState } from 'react';
import { VirtualKeyboard } from 'rc-virtual-keyboard';
import 'rc-virtual-keyboard/style.css';

export default function Demo() {
  const [value, setValue] = useState('');

  return (
    <>
      <input
        placeholder="可使用虚拟键盘"
        value={value}
        onChange={(e) => {
          setValue(e.target.value);
        }}
      />

      <div>value: {value}</div>
      <VirtualKeyboard />
    </>
  );
}
```

## Features

- 数字键盘
- 字母键盘
- 符号键盘
- 光标操作
- 键盘设置
- 手写板
- 移动端输入接管场景

## Publish Output

The package publishes:

- `dist/index.js`: ESM entry
- `dist/index.cjs`: CommonJS entry
- `dist/index.d.ts`: type declarations
- `dist/style.css`: bundled styles

## Docs

- Local dev: `pnpm run dev`
- Production build: `pnpm run docs:build`
- GitHub Pages target: `https://anycloud666.github.io/rc-virtual-keyboard`

## LICENSE

MIT
