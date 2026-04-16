import { useState } from 'react';
import { useVirtualKeyboard } from '../src';

export default () => {
  const [normalValue, setNormalValue] = useState('');
  const [forcedValue, setForcedValue] = useState('');
  const { VirtualKeyboard, VirtualKeyboardProvider } = useVirtualKeyboard();

  return (
    <>
      <div style={{ display: 'grid', gap: 12, maxWidth: 420 }}>
        <input
          placeholder="默认 focus 不弹出键盘"
          value={normalValue}
          onInput={(e) => {
            setNormalValue((e.target as HTMLInputElement).value);
          }}
        />

        <input
          placeholder="focus 时展示键盘"
          data-vkb-show
          value={forcedValue}
          onInput={(e) => {
            setForcedValue((e.target as HTMLInputElement).value);
          }}
        />
      </div>

      <VirtualKeyboardProvider value={{ focusShow: false }}>
        <VirtualKeyboard />
      </VirtualKeyboardProvider>
    </>
  );
};
