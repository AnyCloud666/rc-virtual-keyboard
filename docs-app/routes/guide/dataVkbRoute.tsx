import { Card, Space } from 'antd';
import CodeBlock from '../../components/CodeBlock';
import type { DocRoute } from '../types';
import { codeDatasetUsage, DatasetUsageDemo, Paragraph, Text } from './shared';

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
        <ul className="docs-list">
          <li>推荐把这种全局接管型示例放到独立路由中，避免和文档页里的其他 demo 抢焦点。</li>
          <li><Text code>data-vkb-show</Text> 适合在 <Text code>focusShow=false</Text> 时给单个输入框开白名单。</li>
          <li><Text code>data-vkb-disabled="true"</Text> 适合保留原生输入行为，不交给虚拟键盘处理。</li>
        </ul>
      </Card>
    </Space>
  ),
};
