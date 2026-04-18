import { useState } from 'react';
import { VirtualKeyboard } from 'rc-virtual-keyboard';

export default function NumberKeyboardLayoutDemo() {
  const [value, setValue] = useState('');
  const [reverseOrder, setReverseOrder] = useState(false);
  const layoutMode = reverseOrder ? 'desc' : 'asc';

  return (
    <div>
      <div style={{ marginBottom: 12 }}>
        <label
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            cursor: 'pointer',
          }}
        >
          <input
            type="checkbox"
            checked={reverseOrder}
            onChange={(e) => setReverseOrder(e.target.checked)}
          />
          倒序排列数字键盘（789 / 456 / 123）
        </label>
      </div>

      <input
        value={value}
        placeholder="切换上方按钮测试数字键盘排列"
        onInput={(e) => {
          setValue((e.target as HTMLInputElement).value);
        }}
      />

      <div style={{ marginTop: 8 }}>
        当前排列：{layoutMode === 'asc' ? '123 / 456 / 789' : '789 / 456 / 123'}
      </div>

      <VirtualKeyboard
        show
        showIcon={false}
        numberKeyboardLayoutMode={layoutMode}
      />
    </div>
  );
}
