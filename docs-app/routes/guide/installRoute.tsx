import { Card, Space } from 'antd';
import CodeBlock from '../../components/CodeBlock';
import type { DocRoute } from '../types';
import { BasicUsageDemo, codeBasicUsage, codeInstall, Paragraph, Text } from './shared';

export const installRoute: DocRoute = {
  key: 'install',
  path: '/guide/install',
  title: '安装与发布',
  menuLabel: '安装与发布',
  description: '安装方式、样式引入和发布产物说明。',
  group: 'guide',
  render: () => (
    <Space direction="vertical" size={20} style={{ width: '100%' }}>
      <Card className="docs-card" title="安装方式">
        <Paragraph>如果你需要完整样式，建议在业务侧显式引入 <Text code>style.css</Text>。</Paragraph>
        <CodeBlock code={codeInstall} />
      </Card>

      <Card className="docs-card" title="最小使用示例">
        <Paragraph>
          下面这个示例直接接入了一个原生输入框，并在页面中挂载了
          <Text code>VirtualKeyboard</Text>，可以立即体验最基础的接入方式。
        </Paragraph>
        <div className="demo-preview">
          <BasicUsageDemo />
        </div>
        <CodeBlock code={codeBasicUsage} />
        <ul className="docs-list">
          <li>React 和 ReactDOM 继续作为 peerDependencies 保持外部安装。</li>
          <li>库构建和文档构建都切到了 Vite，但两者使用不同配置文件。</li>
          <li>库构建不会再把 <Text code>public/</Text> 下的大体积资源复制进发布包。</li>
        </ul>
      </Card>
    </Space>
  ),
};
