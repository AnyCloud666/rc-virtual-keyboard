import { Tag } from 'antd';
import CodeBlock from '../../components/CodeBlock';
import type { DocRoute } from '../types';
import {
  codeBasicUsage,
  HomeHeroActions,
  HomeHeroIntro,
  HomeKeyboardShowcase,
  Paragraph,
  Text,
  Title,
} from './shared';

export const homeRoute: DocRoute = {
  key: 'home',
  path: '/',
  title: '首页',
  menuLabel: '首页',
  description: '组件总览与快速入口。',
  group: 'guide',
  render: () => (
    <div className="home-page">
      <section className="home-hero-shell">
        <div className="home-hero">
          <div className="home-hero-copy">
            <HomeHeroIntro />
            <HomeHeroActions />
          </div>

          <HomeKeyboardShowcase />
        </div>
      </section>

      <section className="home-next-section">
        <div className="home-next-copy">
          <Tag color="processing">Quick Start</Tag>
          <Title level={2} className="home-next-title">
            最简单使用案例
          </Title>
          <Paragraph className="home-next-desc">
            引入样式后挂载一个 <Text code>VirtualKeyboard</Text>，再接一个普通输入框，就可以完成最基础的接入。
          </Paragraph>
        </div>

        <div className="home-next-code">
          <CodeBlock code={codeBasicUsage} />
        </div>
      </section>
    </div>
  ),
};
