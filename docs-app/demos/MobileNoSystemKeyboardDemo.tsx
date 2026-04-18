import { useState } from 'react';
import { Space, Typography } from 'antd';
import { VirtualInput, VirtualKeyboard } from 'rc-virtual-keyboard';

const { Paragraph, Text } = Typography;

export default function MobileNoSystemKeyboardDemo() {
  const [mobileValue, setMobileValue] = useState('');
  const [codeValue, setCodeValue] = useState('');
  const [virtualInputValue, setVirtualInputValue] = useState('');

  return (
    <>
      <div style={{ display: 'grid', gap: 20, maxWidth: 520 }}>
        <div style={{ display: 'grid', gap: 12 }}>
          <Text strong>旧方案：原生 input + readOnly + inputMode=&quot;none&quot;</Text>
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

        <div style={{ display: 'grid', gap: 12 }}>
          <Text strong>新方案：VirtualInput 自定义输入框</Text>
          <VirtualInput
            value={virtualInputValue}
            placeholder="点击这里，只使用虚拟键盘输入"
            onChange={(e) => {
              setVirtualInputValue(e.target.value);
            }}
            prefix={<span style={{ fontSize: 12 }}>ID</span>}
            suffix={<span style={{ fontSize: 12, color: '#8c8c8c' }}>移动端</span>}
            style={{
              minHeight: 46,
              borderRadius: 12,
              borderColor: '#91caff',
              background: '#f6fbff',
            }}
          />
          <Space size={16} wrap>
            <Paragraph type="secondary" style={{ marginBottom: 0 }}>
              当前值：{virtualInputValue || '未输入'}
            </Paragraph>
          </Space>
        </div>
      </div>

      <VirtualKeyboard />
    </>
  );
}
