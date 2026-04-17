import { useState } from 'react';
import { VirtualKeyboard } from '../src';

export default () => {
  const [value, setValue] = useState('');

  return (
    <>
      <div style={{ display: 'grid', gap: 12, maxWidth: 420 }}>
        <input
          placeholder="这里不显示外部唤起 icon"
          value={value}
          onChange={(e) => {
            setValue((e.target as HTMLInputElement).value);
          }}
        />
        <div>当前值：{value || '未输入'}</div>
      </div>

      <VirtualKeyboard show showIcon={false} />
    </>
  );
};
