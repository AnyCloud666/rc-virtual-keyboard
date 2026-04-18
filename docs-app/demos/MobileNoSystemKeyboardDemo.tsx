import { useState } from 'react';
import { VirtualKeyboard } from 'rc-virtual-keyboard';

export default function MobileNoSystemKeyboardDemo() {
  const [mobileValue, setMobileValue] = useState('');
  const [codeValue, setCodeValue] = useState('');

  return (
    <>
      <div style={{ display: 'grid', gap: 12, maxWidth: 420 }}>
        <input
          readOnly
          inputMode="none"
          placeholder="移动端点击后不唤起系统键盘"
          value={mobileValue}
          onChange={(e) => {
            setMobileValue((e.target as HTMLInputElement).value);
          }}
        />

        <input
          readOnly
          inputMode="none"
          data-vkb-show
          placeholder="验证码/设备编号这类场景也可直接用"
          value={codeValue}
          onChange={(e) => {
            setCodeValue((e.target as HTMLInputElement).value);
          }}
        />
      </div>

      <VirtualKeyboard />
    </>
  );
}
