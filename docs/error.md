---
nav:
  title: 常见问题
  order: 3
---

# 常见问题

## 当前 `type` 支持的类型 `text`, `search`, `tel`, `password`, `datetime`

## 这些 `type` 属性引起的 `selection` 异常

type = `number` | `email` 造成的 `selection` 异常

- type = `number` 可用 data-vkb-type = `number` 代替，将用正则进行拦截，`/^[-+]?(\d+)?(\.)?(\d+)?$/`
- type = `email` 可以默认为 `text`，暂未实现拦截

```jsx
import { useState } from 'react';
import {
  useVirtualKeyboard,
  keys,
  LetterKeyboardTab,
  NumberKeyboardTab,
  SymbolKeyboardTab,
  EditKeyboardTab,
  SettingKeyboardTab,
  WriteKeyboardTab,
} from 'rc-virtual-keyboard';

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

      <div style={{ display: 'flex', alignItem: 'center' }}>
        <div style={{ width: 200 }}> type="number"</div>
        <input type="number" />
      </div>

      {/* 可以使用data-vkb-type='number' 代替 */}
      <div style={{ display: 'flex', alignItem: 'center' }}>
        <div style={{ width: 200 }}> data-vkb-type="number"</div>
        <input data-vkb-type="number" />
      </div>

      <div style={{ display: 'flex', alignItem: 'center' }}>
        <div style={{ width: 200 }}> type="email"</div>
        <input type="email" />
      </div>

      <div style={{ display: 'flex', alignItem: 'datetime' }}>
        <div style={{ width: 200 }}> type="datetime"</div>
        <input type="datetime" />
      </div>

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
          virtualKeyboardTab: [
            LetterKeyboardTab,
            NumberKeyboardTab,
            SymbolKeyboardTab,
            WriteKeyboardTab,
            EditKeyboardTab,
            SettingKeyboardTab,
          ],
        }}
      >
        <VirtualKeyboard />
      </VirtualKeyboardProvide>
    </>
  );
};
```

## 这些 `type` 不会触发虚拟键盘

- `week`
- `month`
- `time`
- `datetime-local`
- `date`
- `submit`
- `reset`
- `range`
- `radio`
- `image`
- `hidden`
- `file`
- `color`
- `checkbox`
- `button`

```jsx
export default () => {
  return (
    <>
      <div style={{ display: 'flex', alignItem: 'center' }}>
        <div style={{ width: 200 }}> type="week"</div>
        <input type="week" />
      </div>
      <div style={{ display: 'flex', alignItem: 'center' }}>
        <div style={{ width: 200 }}> type="month"</div>
        <input type="month" />
      </div>
      <div style={{ display: 'flex', alignItem: 'datetime-local' }}>
        <div style={{ width: 200 }}> type="datetime-local"</div>
        <input type="datetime-local" />
      </div>
      <div style={{ display: 'flex', alignItem: 'date' }}>
        <div style={{ width: 200 }}> type="date"</div>
        <input type="date" />
      </div>
      <div style={{ display: 'flex', alignItem: 'submit' }}>
        <div style={{ width: 200 }}> type="submit"</div>
        <input type="submit" />
      </div>
      <div style={{ display: 'flex', alignItem: 'reset' }}>
        <div style={{ width: 200 }}> type="reset"</div>
        <input type="reset" />
      </div>
      <div style={{ display: 'flex', alignItem: 'range' }}>
        <div style={{ width: 200 }}> type="range"</div>
        <input type="range" />
      </div>
      <div style={{ display: 'flex', alignItem: 'radio' }}>
        <div style={{ width: 200 }}> type="radio"</div>
        <input type="radio" />
      </div>
      <div style={{ display: 'flex', alignItem: 'image' }}>
        <div style={{ width: 200 }}> type="image"</div>
        <input type="image" />
      </div>
      <div style={{ display: 'flex', alignItem: 'hidden' }}>
        <div style={{ width: 200 }}> type="hidden"</div>
        <input type="hidden" />
      </div>
      <div style={{ display: 'flex', alignItem: 'file' }}>
        <div style={{ width: 200 }}> type="file"</div>
        <input type="file" />
      </div>
      <div style={{ display: 'flex', alignItem: 'color' }}>
        <div style={{ width: 200 }}> type="color"</div>
        <input type="color" />
      </div>
      <div style={{ display: 'flex', alignItem: 'checkbox' }}>
        <div style={{ width: 200 }}> type="checkbox"</div>
        <input type="checkbox" />
      </div>
      <div style={{ display: 'flex', alignItem: 'button' }}>
        <div style={{ width: 200 }}> type="button"</div>
        <input type="button" />
      </div>
    </>
  );
};
```

## 禁用虚拟键盘

- 存在需求，不想触发虚拟键盘，禁止虚拟键盘输入时，在 `input` 上加入 `data-vkb-disabled` 属性去禁用
- 传入的值将转为 `string` 类型 ，`true` => `'true'`

```jsx
export default () => {
  return (
    <>
      <input placeholder="禁止虚拟键盘输入" data-vkb-disabled />
    </>
  );
};
```

## 禁用内容输入

- 存在需求，不想输入某些内容时，在 `input` 上加入 `data-vkb-not-input` 属性去禁用
- 传入的值将转为 `string` 类型, `['a', 'b', 'c']` => `a,b,c`

```jsx
export default () => {
  return (
    <>
      <input
        placeholder="禁止输入部分内容a, b, c"
        data-vkb-not-input={['a', 'b', 'c']}
      />
    </>
  );
};
```

## Uncaught SyntaxError: The requested module '/node_modules/@wwi/react-virtual-keyboard/dist/svg/bottom.svg?import' does not provide an export named 'ReactComponent'

- 在 vite 项目中配置 vite-plugin-svgr

```js
defineConfig({
  plugins: [
    // 支持 import BottomSvg from './Bottom.svg?react' 写法
    svgr(),
    // 支持 import { ReactComponent as BottomSvg } from './Bottom.svg' 写法
    svgr({
      svgrOptions: {
        exportType: 'named',
        ref: true,
        svgo: false,
        titleProp: true,
      },
      include: '**/*.svg',
    }),
  ],
});
```
