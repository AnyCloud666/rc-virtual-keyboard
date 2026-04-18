import { GithubOutlined } from '@ant-design/icons';
import { Button, Card, Space, Tag, Typography } from 'antd';
import { useState } from 'react';
import { VirtualKeyboard } from 'rc-virtual-keyboard';
import CodeBlock from '../components/CodeBlock';
import type { DocRoute } from './types';

const { Title, Paragraph, Text } = Typography;

const codeInstall = `pnpm add rc-virtual-keyboard\n\nimport 'rc-virtual-keyboard/style.css';`;

const codeBasicUsage = `import { useState } from 'react';\nimport { VirtualKeyboard } from 'rc-virtual-keyboard';\nimport 'rc-virtual-keyboard/style.css';\n\nexport default function Demo() {\n  const [value, setValue] = useState('');\n\n  return (\n    <>\n      <input\n        value={value}\n        placeholder="可使用虚拟键盘输入"\n        onChange={(e) => setValue(e.target.value)}\n      />\n\n      <div>当前值: {value || '未输入'}</div>\n      <VirtualKeyboard />\n    </>\n  );\n}`;

const codeViteSvgr = `import { defineConfig } from 'vite';\nimport react from '@vitejs/plugin-react';\nimport svgr from 'vite-plugin-svgr';\n\nexport default defineConfig({\n  plugins: [\n    react(),\n    svgr({\n      include: '**/*.svg',\n      svgrOptions: {\n        exportType: 'named',\n        ref: true,\n        svgo: false,\n        titleProp: true,\n      },\n    }),\n  ],\n});`;

function BasicUsageDemo() {
  const [value, setValue] = useState('');

  return (
    <div className="basic-usage-demo">
      <div className="basic-usage-form">
        <div className="basic-usage-label">输入框</div>
        <input
          id="basic-usage-input"
          value={value}
          placeholder="点击这里，然后使用虚拟键盘输入"
          onChange={(e) => setValue(e.target.value)}
        />
        <div className="basic-usage-value">当前值：{value || '未输入'}</div>
      </div>

      <VirtualKeyboard />
    </div>
  );
}

function HomeKeyboardShowcase() {
  const [value, setValue] = useState('');

  return (
    <div className="home-showcase">
      <div className="home-showcase-panel">
        <div className="home-showcase-label">现场体验</div>
        <input
          value={value}
          placeholder="点击输入框，然后直接使用下方组合键盘"
          onChange={(e) => setValue(e.target.value)}
        />
        <div className="home-showcase-value">当前内容：{value || '未输入'}</div>
        <div className="home-showcase-tip">
          首页只挂载这一套组件，进入示例页后会切换到各自独立的路由实例。
        </div>
      </div>

      <div className="home-showcase-keyboard">
        <VirtualKeyboard />
      </div>
    </div>
  );
}

export const guideRoutes: DocRoute[] = [
  {
    key: 'home',
    path: '/',
    title: '首页',
    menuLabel: '首页',
    description: '组件总览与快速入口。',
    group: 'guide',
    render: () => (
      <Card className="docs-card home-hero-card">
        <div className="home-hero">
          <div className="home-hero-copy">
            <Space wrap>
              <Tag color="blue">React</Tag>
              <Tag color="processing">Vite</Tag>
              <Tag color="gold">Virtual Keyboard</Tag>
            </Space>

            <Title className="home-hero-title" level={1}>
              可使用的组合键盘组件
            </Title>

            <Paragraph className="home-hero-desc">
              首页直接展示真实组件，而不是占位文案。你可以先在这里完成一次输入，再进入文档页查看安装方式、接入示例和独立路由 demo。
            </Paragraph>

            <Space size={16} wrap>
              <Button type="primary" size="large" onClick={() => { window.location.hash = '/guide/install'; }}>
                查看文档
              </Button>
              <Button
                size="large"
                href="https://github.com/AnyCloud666/rc-virtual-keyboard"
                target="_blank"
                icon={<GithubOutlined />}
              >
                前往 GitHub
              </Button>
            </Space>
          </div>

          <HomeKeyboardShowcase />
        </div>
      </Card>
    ),
  },
  {
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
  },
  {
    key: 'faq',
    path: '/guide/faq',
    title: '常见问题',
    menuLabel: '常见问题',
    description: '输入类型、SVG 兼容和音频资源排查。',
    group: 'guide',
    render: () => (
      <Card className="docs-card" title="常见问题">
        <Title level={4}>1. 哪些 input type 容易触发 selection 异常？</Title>
        <ul className="docs-list">
          <li><Text code>type="number"</Text> 建议改成 <Text code>data-vkb-type="number"</Text>。</li>
          <li><Text code>type="email"</Text> 建议先按普通文本输入处理。</li>
          <li><Text code>week/month/date/file/color</Text> 这类原生控件通常不建议交给虚拟键盘接管。</li>
        </ul>

        <Title level={4}>2. 单个输入框如何禁止自动弹出？</Title>
        <Paragraph>给目标输入框增加 <Text code>data-vkb-auto-popup={false}</Text>，就可以覆盖全局默认行为。</Paragraph>

        <Title level={4}>3. 失焦后不隐藏键盘怎么办？</Title>
        <Paragraph>使用 <Text code>data-vkb-blur-hidden={false}</Text>，可以保留键盘展示状态。</Paragraph>

        <Title level={4}>4. Vite 项目里如果遇到 SVG ReactComponent 报错怎么办？</Title>
        <Paragraph>请确保业务项目也启用了 <Text code>vite-plugin-svgr</Text>。</Paragraph>
        <CodeBlock code={codeViteSvgr} />

        <Title level={4}>5. 按键音效播放异常如何排查？</Title>
        <ul className="docs-list">
          <li>检查静态资源里是否存在 <Text code>/audio/typing-sound-02-229861.mp3</Text>。</li>
          <li>如果你有自己的资源地址，直接传入 <Text code>keydownAudioUrl</Text> 覆盖默认值。</li>
        </ul>
      </Card>
    ),
  },
];
