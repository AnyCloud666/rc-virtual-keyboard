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
      {/* <div>可使用右侧虚拟键盘</div> */}
      <input
        placeholder="可使用右侧虚拟键盘"
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

## 禁用空格输入

- 存在需求，不想输入空格 上加入 `data-vkb-not-empty` 属性去禁用

```jsx
export default () => {
  return (
    <>
      <input placeholder="禁止输入空格" data-vkb-not-empty />
    </>
  );
};
```

## 禁用两端空格输入，中间输入空格不禁用

- 存在需求，不想输入两端空格 上加入 `data-vkb-not-empty-trim` 属性去禁用

```jsx
export default () => {
  return (
    <>
      <input placeholder="禁止输入两端空格" data-vkb-not-empty-trim />
    </>
  );
};
```

## 单个输入框禁止弹出虚拟键盘

- 存在需求，单个输入框禁止弹出虚拟键盘，在 `input` 上加入 `data-vkb-auto-popup` 属性设置为 `false`

```jsx
export default () => {
  return (
    <>
      <input
        placeholder="单个输入框禁止弹出虚拟键盘"
        data-vkb-auto-popup={false}
        onInput={(e) => {
          console.log('e: ', e);
        }}
      />
    </>
  );
};
```

## Uncaught SyntaxError: The requested module '/node_modules/rc-virtual-keyboard/dist/svg/bottom.svg?import' does not provide an export named 'ReactComponent'

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

## 按键声音播放异常

- 检查默认的音频文件是否存在 /public/audio/typing-sound-02-229861.mp3
- 导入正确的 keydownAudioUrl

## antd Input 组件如何使用虚拟键盘

- 在虚拟键盘内部，触发了 input, change 事件，将触发 Input 组件的 onInput, onChange 事件

```js
import { Simulate } from 'react-dom/test-utils';
const emitInputEvent = () => {
  if (!activeInputRef.current) return;
  Simulate?.change?.(activeInputRef.current);
  Simulate?.input?.(activeInputRef.current);
};
```

```jsx
import { useState } from 'react';
import { Input } from 'antd';
export default () => {
  const [value, setValue] = useState();

  return (
    <Input
      placeholder="antd Input 组件使用虚拟键盘"
      value={value}
      onInput={(e) => {
        console.log('e: onInput', e);
        setValue(e.target.value);
      }}
      onChange={(e) => {
        console.log('e: onChange', e);
      }}
    />
  );
};
```

## antd InputNumber 组件如何使用虚拟键盘

- 在虚拟键盘内部，触发了 input, change 事件，将触发 InputNumber 组件的 onInput, onChange 事件

```jsx
import { useState, useRef } from 'react';
import { InputNumber } from 'antd';

export default () => {
  const [value, setValue] = useState();

  return (
    <InputNumber
      placeholder="antd InputNumber 组件使用虚拟键盘"
      value={value}
      onInput={(e) => {
        console.log('e: onInput', e);
      }}
      onChange={(e) => {
        console.log('e: onChange', e);
      }}
    />
  );
};
```

## ProComponents ProFormText 组件如何使用虚拟键盘

- 在虚拟键盘内部，触发了 input, change 事件，将触发 ProFormText 组件的 onInput, onChange 事件

```jsx
import { useState } from 'react';
import { ProFormText } from '@ant-design/pro-components';
export default () => {
  const [value, setValue] = useState();

  return (
    <ProFormText
      placeholder="ProComponents ProFormText 组件使用虚拟键盘"
      value={value}
      fieldProps={{
        onInput: (e) => {
          console.log('e: onInput', e);
          setValue(e.target.value);
        },
        onChange: (e) => {
          console.log('e: onChange', e);
        },
      }}
    />
  );
};
```

## ProComponents ProFormDigit 组件如何使用虚拟键盘

- 在虚拟键盘内部，触发了 input, change 事件，将触发 ProFormDigit 组件的 onInput, onChange 事件

```jsx
import { ProFormDigit } from '@ant-design/pro-components';
export default () => {
  return (
    <ProFormDigit
      placeholder="ProComponents ProFormDigit 组件使用虚拟键盘"
      fieldProps={{
        onInput: (e) => {
          console.log('ProFormDigit: onInput', e);
        },
        onChange: (e) => {
          console.log('ProFormDigit: onChange', e);
        },
      }}
    />
  );
};
```

## rc-virtual-keyboard 文档中可以复制，粘贴，但是本地运行就不可以了

- 1. `navigator.clipboard`, `document.execCommand('paste')` 需要 https 才支持，安全策略
- 2. 参考 [navigator.clipboard](https://developer.mozilla.org/zh-CN/docs/Web/API/Navigator/clipboard)
- 3. 参考 [execCommand](https://developer.mozilla.org/zh-CN/docs/Web/API/Document/execCommand#paste)

解决方法：

- 将链接协议改为 https
- 进行浏览器设置->站点权限->剪切板->允许
