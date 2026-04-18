import { Card, Space, Table } from 'antd';
import CodeBlock from '../../components/CodeBlock';
import type { DocRoute } from '../types';
import { codeDatasetUsage, DatasetUsageDemo, Paragraph, Text } from './shared';

const datasetColumns = [
  {
    title: '属性',
    dataIndex: 'name',
    key: 'name',
    width: 260,
    render: (value: string) => <Text code>{value}</Text>,
  },
  {
    title: '类型',
    dataIndex: 'type',
    key: 'type',
    width: 180,
    render: (value: string) => <Text code>{value}</Text>,
  },
  {
    title: '默认值',
    dataIndex: 'defaultValue',
    key: 'defaultValue',
    width: 180,
    render: (value: string) => <Text code>{value}</Text>,
  },
  {
    title: '说明',
    dataIndex: 'description',
    key: 'description',
  },
];

const datasetRows = [
  {
    name: 'data-vkb-show',
    type: 'boolean attribute',
    defaultValue: 'inherit',
    description: '在全局 focusShow 关闭时，为当前输入框单独开启自动展示键盘。',
  },
  {
    name: 'data-vkb-auto-popup',
    type: 'boolean | "false"',
    defaultValue: 'inherit',
    description: '覆盖全局自动弹出策略；设为 false 后，聚焦该输入框不会自动弹出键盘。',
  },
  {
    name: 'data-vkb-blur-hidden',
    type: 'boolean | "false"',
    defaultValue: 'true',
    description: '设为 false 时，输入框失焦后键盘保持展示，不立即隐藏。',
  },
  {
    name: 'data-vkb-type',
    type: 'string',
    defaultValue: '-',
    description: '声明输入类型，例如 "number"，让虚拟键盘按对应模式处理输入。',
  },
  {
    name: 'data-vkb-follow-focus',
    type: '"true" | "false"',
    defaultValue: 'true',
    description: '浮动模式下是否跟随当前输入框重新吸附；设为 false 时保留当前键盘位置。',
  },
  {
    name: 'data-vkb-disabled',
    type: '"true" | "false"',
    defaultValue: 'false',
    description: '设为 true 时，不接管该输入框，保留原生输入行为。',
  },
];

export const dataVkbRoute: DocRoute = {
  key: 'data-vkb',
  path: '/guide/data-vkb',
  title: 'data-vkb 示例',
  menuLabel: 'data-vkb 示例',
  description: '单独路由承载 data-vkb 属性交互，避免和其他虚拟键盘实例冲突。',
  group: 'examples',
  render: () => (
    <Space direction="vertical" size={20} style={{ width: '100%' }}>
      <Card className="docs-card" title="data-vkb 交互示例">
        <Paragraph>
          这个页面只挂载一套 <Text code>VirtualKeyboard</Text> 和一组输入框，用来单独验证
          <Text code>data-vkb-*</Text> 属性的行为。
        </Paragraph>
        <div className="demo-preview">
          <DatasetUsageDemo />
        </div>
        <CodeBlock code={codeDatasetUsage} />
        <Table
          rowKey="name"
          className="docs-table"
          columns={datasetColumns}
          dataSource={datasetRows}
          pagination={false}
          size="small"
          scroll={{ x: 960 }}
        />
        <ul className="docs-list">
          <li>推荐把这种全局接管型示例放到独立路由中，避免和文档页里的其他 demo 抢焦点。</li>
          <li><Text code>data-vkb-show</Text> 适合在 <Text code>focusShow=false</Text> 时给单个输入框开白名单。</li>
          <li><Text code>data-vkb-follow-focus="false"</Text> 适合浮动模式下保留当前键盘位置，不自动吸附到该输入框附近。</li>
          <li><Text code>data-vkb-disabled="true"</Text> 适合保留原生输入行为，不交给虚拟键盘处理。</li>
        </ul>
      </Card>
    </Space>
  ),
};
