import FocusShowDemo from '../demos/FocusShowDemo';
import HideIconDemo from '../demos/HideIconDemo';
import MobileNoSystemKeyboardDemo from '../demos/MobileNoSystemKeyboardDemo';
import NumberKeyboardLayoutDemo from '../demos/NumberKeyboardLayoutDemo';
import DemoPage from '../components/DemoPage';
import type { DocRoute } from './types';

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
    key: 'mobile-no-system-keyboard',
    path: '/examples/mobile-no-system-keyboard',
    title: '移动端接管输入',
    menuLabel: '移动端接管输入',
    description: '移动端 readOnly + inputMode=none 场景。',
    group: 'examples',
    render: () => (
      <DemoPage
        title="移动端聚焦输入框，但不唤起系统键盘"
        description="通过读写限制和独立路由页，让这个场景的行为更容易单独验证。"
        points={[
          '移动端推荐在输入框上加 readOnly',
          'inputMode="none" 用于增强兼容性',
          '组件在移动端默认切到 fixedBottom 布局',
        ]}
        code={`<input readOnly inputMode="none" />`}
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
