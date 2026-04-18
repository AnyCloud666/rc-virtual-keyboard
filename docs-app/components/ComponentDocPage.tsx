import { Empty, Table, Card, Space, Typography } from 'antd';
import type { ComponentDoc } from '../component-docs';
import CodeBlock from './CodeBlock';

const { Paragraph, Text } = Typography;

export default function ComponentDocPage({ doc }: { doc: ComponentDoc }) {
  const DemoComponent = doc.renderDemo;
  const propsColumns = [
    { title: '属性', dataIndex: 'name', key: 'name', width: 220 },
    {
      title: '类型',
      dataIndex: 'type',
      key: 'type',
      width: 220,
      render: (value: string) => <Text code>{value}</Text>,
    },
    {
      title: '默认值',
      dataIndex: 'defaultValue',
      key: 'defaultValue',
      width: 220,
      render: (value: string) => <Text code>{value}</Text>,
    },
    { title: '说明', dataIndex: 'description', key: 'description' },
  ];

  const methodColumns = [
    { title: '方法', dataIndex: 'name', key: 'name', width: 220 },
    {
      title: '签名',
      dataIndex: 'signature',
      key: 'signature',
      width: 320,
      render: (value: string) => <Text code>{value}</Text>,
    },
    { title: '说明', dataIndex: 'description', key: 'description' },
  ];

  const tokenColumns = [
    {
      title: '变量',
      dataIndex: 'name',
      key: 'name',
      width: 280,
      render: (value: string) => <Text code>{value}</Text>,
    },
    {
      title: '默认值',
      dataIndex: 'defaultValue',
      key: 'defaultValue',
      width: 280,
      render: (value: string) => <Text code>{value}</Text>,
    },
    { title: '说明', dataIndex: 'description', key: 'description' },
  ];

  return (
    <Space direction="vertical" size={20} style={{ width: '100%' }}>
      <Card className="docs-card" title="最小示例">
        <Paragraph>{doc.description}</Paragraph>
        <div className="demo-preview component-demo-preview">
          <DemoComponent />
        </div>
      </Card>

      <Card className="docs-card" title="引入方式">
        <CodeBlock code={doc.importCode} />
      </Card>

      <Card className="docs-card" title="示例代码">
        <CodeBlock code={doc.usageCode} />
      </Card>

      <Card className="docs-card" title="属性">
        <Table
          rowKey="name"
          className="docs-table"
          columns={propsColumns}
          dataSource={doc.props}
          pagination={false}
          size="small"
          scroll={{ x: 920 }}
        />
      </Card>

      <Card className="docs-card" title="方法">
        {doc.methods.length ? (
          <Table
            rowKey="name"
            className="docs-table"
            columns={methodColumns}
            dataSource={doc.methods}
            pagination={false}
            size="small"
            scroll={{ x: 920 }}
          />
        ) : (
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description="当前组件没有独立实例方法，主要通过 props 回调配合使用。"
          />
        )}
      </Card>

      <Card className="docs-card" title="颜色变量">
        <Table
          rowKey="name"
          className="docs-table"
          columns={tokenColumns}
          dataSource={doc.tokens}
          pagination={false}
          size="small"
          scroll={{ x: 920 }}
        />
      </Card>
    </Space>
  );
}
