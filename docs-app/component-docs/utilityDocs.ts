import type { ComponentDoc } from './types';
import { DragBlockDemo } from './demos';
import { noTokens } from './shared';

export const utilityComponentDocs: ComponentDoc[] = [
  {
    key: 'drag-block',
    path: '/components/drag-block',
    title: 'DragBlock',
    menuLabel: 'DragBlock',
    description: '可拖拽容器，VirtualKeyboard 的浮标和键盘定位能力都基于它实现。',
    importCode: `import { DragBlock } from 'rc-virtual-keyboard';`,
    usageCode: `import { DragBlock } from 'rc-virtual-keyboard';\n\n<DragBlock init={{ width: '180px', height: '80px' }} autoKeepRight={false}>\n  <div>拖动我</div>\n</DragBlock>;`,
    props: [
      { name: 'init', type: '{ width: string; height: string }', defaultValue: '-', description: '初始尺寸，用于定位计算' },
      { name: 'resizeOverRight', type: 'boolean', defaultValue: 'false', description: '允许向右超出后再回正' },
      { name: 'autoKeepRightDelay', type: 'number', defaultValue: '3000', description: '自动吸附右侧前的等待时间' },
      { name: 'autoKeepRight', type: 'boolean', defaultValue: 'true', description: '是否启用自动靠右' },
      { name: 'delay', type: 'number', defaultValue: '280', description: 'click 判定延迟' },
      { name: 'zIndex', type: 'number | string', defaultValue: '9999', description: '层级控制' },
      { name: 'style', type: 'CSSProperties', defaultValue: '-', description: '根节点样式' },
      { name: 'positionMode', type: 'string', defaultValue: 'float', description: '定位模式' },
      { name: 'onClick', type: '() => void', defaultValue: '-', description: '点击容器时触发' },
      { name: 'children', type: 'ReactNode', defaultValue: '-', description: '拖拽内容' },
    ],
    methods: [
      { name: 'onClick', signature: '() => void', description: '容器被点击且未被识别为拖动时触发' },
    ],
    tokens: noTokens,
    renderDemo: DragBlockDemo,
  },
];
