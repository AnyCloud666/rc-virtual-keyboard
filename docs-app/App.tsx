import { GithubOutlined, MenuOutlined } from '@ant-design/icons';
import { Breadcrumb, Button, ConfigProvider, Drawer, Layout, Menu, Skeleton, Space, Spin, Tag, Typography } from 'antd';
import type { MenuProps } from 'antd';
import { useEffect, useMemo, useState } from 'react';
import { menuItems, routeMap } from './routes';
import { normalizeHashPath } from './routes/types';

const { Header, Content, Sider } = Layout;
const { Title, Paragraph } = Typography;

function App() {
  const [currentPath, setCurrentPath] = useState(() => normalizeHashPath(window.location.hash));
  const [isAppLoading, setIsAppLoading] = useState(true);
  const [isContentLoading, setIsContentLoading] = useState(false);
  const [isMobileNav, setIsMobileNav] = useState(() => window.innerWidth <= 991);
  const [navOpen, setNavOpen] = useState(false);

  useEffect(() => {
    let frameId = 0;
    let loadingTimer = 0;
    let hasMounted = false;

    const finishLoading = (type: 'app' | 'content') => {
      window.clearTimeout(loadingTimer);
      loadingTimer = window.setTimeout(() => {
        frameId = window.requestAnimationFrame(() => {
          if (type === 'app') {
            setIsAppLoading(false);
            return;
          }

          setIsContentLoading(false);
        });
      }, 80);
    };

    const syncRoute = (type: 'app' | 'content') => {
      if (type === 'app') {
        setIsAppLoading(true);
      } else {
        setIsContentLoading(true);
      }
      setCurrentPath(normalizeHashPath(window.location.hash));
      finishLoading(type);
    };

    if (!window.location.hash) {
      window.location.hash = '/';
    }

    syncRoute('app');

    const handleHashChange = () => {
      syncRoute(hasMounted ? 'content' : 'app');
    };

    hasMounted = true;
    window.addEventListener('hashchange', handleHashChange);

    return () => {
      window.clearTimeout(loadingTimer);
      window.cancelAnimationFrame(frameId);
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, []);

  useEffect(() => {
    const syncViewport = () => {
      const nextIsMobile = window.innerWidth <= 991;
      setIsMobileNav(nextIsMobile);
      if (!nextIsMobile) {
        setNavOpen(false);
      }
    };

    syncViewport();
    window.addEventListener('resize', syncViewport);

    return () => {
      window.removeEventListener('resize', syncViewport);
    };
  }, []);

  const currentRoute = useMemo(() => routeMap.get(currentPath) ?? routeMap.get('/'), [currentPath]);
  const isHomeRoute = currentRoute?.path === '/';

  const onMenuClick: MenuProps['onClick'] = ({ key }) => {
    window.location.hash = String(key);
    setNavOpen(false);
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
  const appLoadingNode = (
    <div className={isHomeRoute ? 'app-loading app-loading-home' : 'app-loading'}>
      <div className="app-loading-inner">
        <img className="app-loading-logo" src="/logo.png" alt="rc-virtual-keyboard logo" />
        <Spin size="large" />
        <div className="app-loading-title">页面加载中</div>
        <div className="app-loading-desc">正在准备文档与示例，请稍候。</div>
      </div>
    </div>
  );

  const contentLoadingNode = (
    <div className="content-skeleton">
      <div className="content-skeleton-head">
        <Skeleton.Button active size="small" shape="round" className="content-skeleton-breadcrumb" />
        <Skeleton.Input active size="large" className="content-skeleton-title" />
        <Skeleton active title={false} paragraph={{ rows: 2, width: ['56%', '38%'] }} />
      </div>

      <div className="content-skeleton-section">
        <Skeleton active title={{ width: '24%' }} paragraph={{ rows: 4, width: ['96%', '92%', '88%', '78%'] }} />
      </div>

      <div className="content-skeleton-grid">
        <div className="content-skeleton-card">
          <Skeleton active title={{ width: '32%' }} paragraph={{ rows: 6 }} />
        </div>
        <div className="content-skeleton-card">
          <Skeleton active title={{ width: '28%' }} paragraph={{ rows: 6 }} />
        </div>
      </div>

      <div className="content-skeleton-footer">
        <Skeleton active title={{ width: '18%' }} paragraph={{ rows: 1, width: ['62%'] }} />
      </div>
    </div>
  );

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
          {isAppLoading ? appLoadingNode : <div className="home-landing-inner">{currentRoute?.render()}</div>}
        </div>
      ) : (
        <Layout className="docs-layout ant-style-layout">
          {isAppLoading ? appLoadingNode : (
            <>
              <Header className="docs-header ant-style-header">
                <div className="docs-header-main">
                  {isMobileNav ? (
                    <Button
                      className="docs-menu-trigger"
                      icon={<MenuOutlined />}
                      onClick={() => setNavOpen(true)}
                    >
                      导航
                    </Button>
                  ) : null}
                  <div className="docs-brand">
                    <img className="docs-brand-logo" src="/logo.png" alt="rc-virtual-keyboard logo" />
                    <span>rc-virtual-keyboard</span>
                  </div>
                  <div className="docs-subtitle">react 虚拟键盘</div>
                </div>
                <Space size={12} wrap className="docs-header-actions">
                  <Tag color="blue">React</Tag>
                  <Tag color="processing">Vite</Tag>
                  <Tag color="gold">Ant Design</Tag>
                  <Button href="https://github.com/AnyCloud666/rc-virtual-keyboard" target="_blank" icon={<GithubOutlined />}>
                    GitHub
                  </Button>
                </Space>
              </Header>

              <Layout>
                {isMobileNav ? (
                  <Drawer
                    title="Documentation"
                    placement="left"
                    open={navOpen}
                    onClose={() => setNavOpen(false)}
                    width={288}
                    className="docs-mobile-drawer"
                  >
                    <Menu
                      mode="inline"
                      selectedKeys={[currentRoute?.path ?? '/']}
                      items={menuItems}
                      onClick={onMenuClick}
                    />
                  </Drawer>
                ) : (
                  <Sider width={256} breakpoint="lg" collapsedWidth="0" className="docs-sider ant-style-sider">
                    <div className="sider-caption">Documentation</div>
                    <Menu mode="inline" selectedKeys={[currentRoute?.path ?? '/']} items={menuItems} onClick={onMenuClick} />
                  </Sider>
                )}

                <Layout>
                  <Content className="docs-content ant-style-content">
                    {isContentLoading ? (
                      contentLoadingNode
                    ) : (
                      <>
                        <div className="docs-page-head">
                          <Breadcrumb items={breadcrumbItems} />
                          <Title level={2} style={{ marginBottom: 8 }}>{currentRoute?.title}</Title>
                          <Paragraph type="secondary" style={{ marginBottom: 0 }}>
                            {currentRoute?.description}
                          </Paragraph>
                        </div>

                        <div className="docs-page-body">{currentRoute?.render()}</div>
                      </>
                    )}
                  </Content>
                </Layout>
              </Layout>
            </>
          )}
        </Layout>
      )}
    </ConfigProvider>
  );
}

export default App;
