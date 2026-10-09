import { Alert, Card, Space, Typography } from 'antd';
import CodeBlock from '../components/CodeBlock';
import DemoPage from '../components/DemoPage';
import FocusShowDemo from '../demos/FocusShowDemo';
import HideIconDemo from '../demos/HideIconDemo';
import MobileNoSystemKeyboardDemo from '../demos/MobileNoSystemKeyboardDemo';
import MobilePushInputIntoViewDemo from '../demos/MobilePushInputIntoViewDemo';
import NumberKeyboardLayoutDemo from '../demos/NumberKeyboardLayoutDemo';
import PcPushInputIntoViewDemo from '../demos/PcPushInputIntoViewDemo';
import RefInputDemo from '../demos/RefInputDemo';
import type { DocRoute } from './types';

const { Paragraph } = Typography;

export const exampleRoutes: DocRoute[] = [
  {
    key: 'focus-show',
    path: '/examples/focus-show',
    title: 'focusShow + data-vkb-show',
    menuLabel: 'Focus 弹出控制',
    description: '关闭全局 focusShow，只让指定输入框唤起键盘。',
    group: 'examples',
    render: () => (
      <DemoPage
        title="focusShow + data-vkb-show"
        description="当前页面只挂载这一组示例，避免和其他示例共享虚拟键盘状态。"
        points={[
          '第一个输入框获得焦点时不弹出键盘',
          '第二个输入框通过 data-vkb-show 强制展示键盘',
          '页面内只保留一个 VirtualKeyboard 实例',
        ]}
        code={`<VirtualKeyboard focusShow={false} />`}
      >
        <FocusShowDemo />
      </DemoPage>
    ),
  },
  {
    key: 'hide-icon',
    path: '/examples/hide-icon',
    title: '隐藏外部图标',
    menuLabel: '隐藏外部图标',
    description: '适合由页面直接控制键盘显示状态的场景。',
    group: 'examples',
    render: () => (
      <DemoPage
        title="隐藏外部唤起 icon"
        description="这个路由页只验证 showIcon 的行为，不再和其他用例混在一起。"
        points={[
          'showIcon={false} 只影响外部入口图标',
          '键盘主体仍可正常显示和输入',
          '示例里额外传了 show，便于直接观察',
        ]}
        code={`<VirtualKeyboard show showIcon={false} />`}
      >
        <HideIconDemo />
      </DemoPage>
    ),
  },
  {
    key: 'ref-input',
    path: '/examples/ref-input',
    title: 'Ref 输入联调',
    menuLabel: 'Ref 输入联调',
    description: '对比原生 input、antd Input、InputNumber、Select、ProFormText、ProFormDigit、ProFormSelect 接入虚拟键盘后的行为。',
    group: 'examples',
    render: () => (
      <DemoPage
        title="原生 input / antd Input / InputNumber / Select / ProFormText / ProFormDigit / ProFormSelect 联调"
        description="这个页面用于检查虚拟键盘在 ref 聚焦、选区调整、ref 回写 value 和事件派发上的兼容性。"
        points={[
          '分别验证原生 input、antd Input、InputNumber、Select、ProFormText、ProFormDigit、ProFormSelect 的接入行为',
          '验证 Select 和 ProFormSelect 设置 data-vkb-auto-popup=false 后不会自动弹出虚拟键盘',
          '通过 ref 把光标移动到末尾或直接全选，观察虚拟键盘是否还能继续输入',
          '补充了 InputNumber precision={2} 的特殊示例，验证输入过程中不会提前补成 1.00',
          'onInput 中不使用 state，而是直接通过 ref 回写 value，方便排查 ref 接管场景',
          '页面会记录 focus / input / change 事件，方便判断是否存在丢事件或值不同步',
        ]}
        code={`const nativeInputRef = useRef<HTMLInputElement | null>(null);
const antdInputRef = useRef<InputRef>(null);
const inputNumberRef = useRef<unknown>(null);
const proFormInputRef = useRef<InputRef>(null);
const proFormDigitRef = useRef<unknown>(null);

const resolveNativeInput = (target: unknown) => {
  if (target instanceof HTMLInputElement) return target;
  if (target instanceof HTMLElement) return target.querySelector('input');
  if (typeof target === 'object' && target && 'input' in target) {
    return (target as { input?: HTMLInputElement | null }).input ?? null;
  }
  if (typeof target === 'object' && target && 'nativeElement' in target) {
    const nativeElement = (target as { nativeElement?: HTMLElement | null }).nativeElement;
    return nativeElement?.querySelector('input') ?? null;
  }
  return null;
};

<input
  ref={nativeInputRef}
  onInput={(e) => {
    nativeInputRef.current!.value = e.currentTarget.value;
  }}
/>
<Input
  ref={antdInputRef}
  onInput={(e) => {
    antdInputRef.current?.input!.value = e.currentTarget.value;
  }}
/>
<InputNumber
  ref={inputNumberRef}
  onInput={(value) => {
    const input = resolveNativeInput(inputNumberRef.current);
    if (input) input.value = String(value ?? '');
  }}
/>
<ProFormText
  name="proFormTextDemo"
  fieldProps={{
    ref: proFormInputRef,
    onInput: (e) => {
      proFormInputRef.current?.input!.value = e.currentTarget.value;
    },
  }}
/>
<ProFormDigit
  name="proFormDigitDemo"
  fieldProps={{
    ref: proFormDigitRef,
    onInput: (value) => {
      const input = resolveNativeInput(proFormDigitRef.current);
      if (input) input.value = String(value ?? '');
    },
  }}
/>
<Select data-vkb-auto-popup="false" options={options} />
<ProFormSelect
  name="proFormSelectDemo"
  fieldProps={{ 'data-vkb-auto-popup': 'false' }}
  options={options}
/>
<VirtualKeyboard showIcon={false} />`}
      >
        <RefInputDemo />
      </DemoPage>
    ),
  },
  {
    key: 'mobile-push-input-into-view',
    path: '/examples/mobile-push-input-into-view',
    title: '移动端输入框顶起',
    menuLabel: '移动端输入框顶起',
    description: 'fixedBottom 模式下，将被键盘遮挡的输入框推回可视区域。',
    group: 'examples',
    render: () => (
      <Space direction="vertical" size={20} style={{ width: '100%' }}>
        <Alert
          type="info"
          showIcon
          message="当前 demo 采用独立路由隔离"
          description="这个页面特意把说明和代码移到了前面，方便把最底部输入框真正放到当前路由内容区末尾。"
        />

        <Card className="docs-card" title="移动端 fixedBottom 输入框顶起">
          <Paragraph>
            当前路由专门验证 <code>pushInputIntoView</code>，在移动端浏览器里更容易观察页面是否会自动滚动，让输入框回到可视区域。
          </Paragraph>
          <ul className="docs-list">
            <li>示例里固定使用 <code>positionMode="fixedBottom"</code></li>
            <li>同时开启 <code>pushInputIntoView</code></li>
            <li>请重点测试页面最底部输入框是否会被自动顶回可视区域</li>
          </ul>
          <CodeBlock code={`<VirtualKeyboard
  positionMode="fixedBottom"
  pushInputIntoView
/>`}
          />
        </Card>

        <Card className="docs-card" title="长页面测试区">
          <MobilePushInputIntoViewDemo />
        </Card>
      </Space>
    ),
  },
  {
    key: 'pc-push-input-into-view',
    path: '/examples/pc-push-input-into-view',
    title: 'PC 输入框顶起',
    menuLabel: 'PC 输入框顶起',
    description: 'fixedBottom 模式下，PC 页面底部输入框被键盘遮挡时自动顶回可视区域。',
    group: 'examples',
    render: () => (
      <Space direction="vertical" size={20} style={{ width: '100%' }}>
        <Alert
          type="info"
          showIcon
          message="PC 端 fixedBottom 顶起测试"
          description="这个页面用于验证 pushInputIntoView，在桌面端浏览器里聚焦底部输入框后，页面是否会自动撑开并滚动。"
        />

        <Card className="docs-card" title="PC 端页面顶起输入框">
          <Paragraph>
            当前路由专门验证 <code>positionMode="fixedBottom"</code> 和 <code>pushInputIntoView</code> 的组合行为。
          </Paragraph>
          <ul className="docs-list">
            <li>示例固定使用 <code>positionMode="fixedBottom"</code></li>
            <li>同时开启 <code>pushInputIntoView</code></li>
            <li>请滚动到底部后聚焦最后一个输入框，观察页面是否自动顶起</li>
          </ul>
          <CodeBlock code={`<VirtualKeyboard
  positionMode="fixedBottom"
  pushInputIntoView
/>`} />
        </Card>

        <Card className="docs-card" title="长页面测试区">
          <PcPushInputIntoViewDemo />
        </Card>
      </Space>
    ),
  },
  {
    key: 'mobile-no-system-keyboard',
    path: '/examples/mobile-no-system-keyboard',
    title: '移动端接管输入',
    menuLabel: '移动端接管输入',
    description: '移动端原生输入接管与 VirtualInput 自定义输入框对比场景。',
    group: 'examples',
    render: () => (
      <DemoPage
        title="移动端聚焦输入框，但不唤起系统键盘"
        description="这个页面同时保留旧方案和新的 VirtualInput 方案，方便直接对比移动端接管输入体验。"
        points={[
          '旧方案仍然展示为原生 input + readOnly + inputMode="none"',
          '新方案通过 VirtualInput 提供自定义外观，同时继续复用虚拟键盘接管能力',
          '组件在移动端默认切到 fixedBottom 布局',
        ]}
        code={`import { useState } from 'react';
import { VirtualInput, VirtualKeyboard } from 'rc-virtual-keyboard';

export default function Demo() {
  const [value, setValue] = useState('');

  return (
    <>
      <VirtualInput
        value={value}
        placeholder="点击这里，只使用虚拟键盘输入"
        onChange={(e) => setValue(e.target.value)}
        prefix={<span>ID</span>}
        suffix={<span>移动端</span>}
        style={{
          minHeight: 46,
          borderRadius: 12,
          borderColor: '#91caff',
          background: '#f6fbff',
        }}
      />
      <VirtualKeyboard />
    </>
  );
}`}
      >
        <MobileNoSystemKeyboardDemo />
      </DemoPage>
    ),
  },
  {
    key: 'number-layout',
    path: '/examples/number-layout',
    title: '数字键盘布局',
    menuLabel: '数字键盘布局',
    description: '切换 asc / desc 验证数字键布局。',
    group: 'examples',
    render: () => (
      <DemoPage
        title="数字键盘倒序布局"
        description="数字键盘布局切换也被单独拆到一个路由页，避免状态交叉。"
        points={[
          'asc: 123 / 456 / 789',
          'desc: 789 / 456 / 123',
          '适合验证码、设备编号、工业面板等场景',
        ]}
        code={`<VirtualKeyboard numberKeyboardLayoutMode="desc" />`}
      >
        <NumberKeyboardLayoutDemo />
      </DemoPage>
    ),
  },
];
