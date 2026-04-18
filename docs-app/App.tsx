import { GithubOutlined, LinkOutlined } from '@ant-design/icons';
import { Breadcrumb, Button, Card, ConfigProvider, Layout, Menu, Space, Tag, Typography } from 'antd';
import type { MenuProps } from 'antd';
import { useEffect, useMemo, useState } from 'react';
import { menuItems, routeMap } from './routes';
import { normalizeHashPath } from './routes/types';

const { Header, Content, Sider } = Layout;
const { Title, Paragraph, Text, Link } = Typography;

function App() {
  const [currentPath, setCurrentPath] = useState(() => normalizeHashPath(window.location.hash));

  useEffect(() => {
    const syncRoute = () => {
      setCurrentPath(normalizeHashPath(window.location.hash));
    };

    if (!window.location.hash) {
      window.location.hash = '/';
    }

    window.addEventListener('hashchange', syncRoute);
    return () => window.removeEventListener('hashchange', syncRoute);
  }, []);

  const currentRoute = useMemo(() => routeMap.get(currentPath) ?? routeMap.get('/'), [currentPath]);
  const isHomeRoute = currentRoute?.path === '/';

  const onMenuClick: MenuProps['onClick'] = ({ key }) => {
    window.location.hash = String(key);
  };

  const breadcrumbItems = useMemo(() => {
    if (!currentRoute) return [];

    const groupLabel =
      currentRoute.group === 'guide'
        ? '指南'
        : currentRoute.group === 'components'
          ? '组件'
          : currentRoute.group === 'hooks'
            ? 'Hooks'
          : '示例';

    return [{ title: '文档' }, { title: groupLabel }, { title: currentRoute.title }];
  }, [currentRoute]);

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#1677ff',
          colorInfo: '#1677ff',
          colorBgLayout: '#f5f5f5',
          colorBgContainer: '#ffffff',
          colorBorderSecondary: '#f0f0f0',
          borderRadius: 12,
          fontFamily: `-apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC', 'Microsoft YaHei', sans-serif`,
        },
      }}
    >
      {isHomeRoute ? (
        <div className="home-landing">
          <div className="home-landing-inner">{currentRoute?.render()}</div>
        </div>
      ) : (
        <Layout className="docs-layout ant-style-layout">
          <Header className="docs-header ant-style-header">
            <div>
              <div className="docs-brand">rc-virtual-keyboard</div>
              <div className="docs-subtitle">react 虚拟键盘</div>
            </div>
            <Space size={12} wrap>
              <Tag color="blue">React</Tag>
              <Tag color="processing">Vite</Tag>
              <Tag color="gold">Ant Design</Tag>
              <Button href="https://github.com/AnyCloud666/rc-virtual-keyboard" target="_blank" icon={<GithubOutlined />}>
                GitHub
              </Button>
            </Space>
          </Header>

          <Layout>
            <Sider width={256} breakpoint="lg" collapsedWidth="0" className="docs-sider ant-style-sider">
              <div className="sider-caption">Documentation</div>
              <Menu mode="inline" selectedKeys={[currentRoute?.path ?? '/']} items={menuItems} onClick={onMenuClick} />
            </Sider>

            <Layout>
              <Content className="docs-content ant-style-content">
                <div className="docs-page-head">
                  <Breadcrumb items={breadcrumbItems} />
                  <Title level={2} style={{ marginBottom: 8 }}>{currentRoute?.title}</Title>
                  <Paragraph type="secondary" style={{ marginBottom: 0 }}>
                    {currentRoute?.description}
                  </Paragraph>
                </div>

                <div className="docs-page-body">{currentRoute?.render()}</div>

                <Card className="docs-card docs-footer-card" size="small">
                  <Space wrap>
                    <Link href={`#${currentRoute?.path ?? '/'}`}>
                      <LinkOutlined /> 当前路由: {currentRoute?.path ?? '/'}
                    </Link>
                    <Text type="secondary">每个示例单独成页，避免多个虚拟键盘实例并存。</Text>
                  </Space>
                </Card>
              </Content>
            </Layout>
          </Layout>
        </Layout>
      )}
    </ConfigProvider>
  );
}

export default App;
