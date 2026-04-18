import type { ReactNode } from 'react';
import { Alert, Card, Space, Typography } from 'antd';
import CodeBlock from './CodeBlock';

const { Paragraph } = Typography;

export default function DemoPage({
  title,
  description,
  points,
  code,
  children,
}: {
  title: string;
  description: string;
  points: string[];
  code: string;
  children: ReactNode;
}) {
  return (
    <Space direction="vertical" size={20} style={{ width: '100%' }}>
      <Alert
        type="info"
        showIcon
        message="当前 demo 采用独立路由隔离"
        description="离开当前页面时，这个虚拟键盘实例会随页面一起卸载，不会和其他示例共享状态。"
      />
      <Card className="docs-card demo-card" title={title}>
        <Paragraph>{description}</Paragraph>
        <ul className="docs-list">
          {points.map((point) => (
            <li key={point}>{point}</li>
          ))}
        </ul>
        <div className="demo-preview">{children}</div>
        <CodeBlock code={code} />
      </Card>
    </Space>
  );
}
