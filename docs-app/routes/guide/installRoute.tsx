import { Card, Space } from 'antd';
import CodeBlock from '../../components/CodeBlock';
import type { DocRoute } from '../types';
import { BasicUsageDemo, codeBasicUsage, codeInstall, Paragraph, Text } from './shared';

const codeLocalBuild = `# 安装依赖
npm install

# 本地打包组件库
npm run build

# 监听模式下持续打包
npm run build:watch

# 打包文档站点
npm run docs:build

# 本地预览文档构建结果
npm run docs:preview`;

const codePublish = `# 发布前建议先校验
npm run lint:es
npm run build

# 按发版类型更新版本号
# 小版本（补丁修复）
npm version patch

# 中版本（向下兼容的新功能）
# npm version minor

# 大版本（不兼容变更）
# npm version major

# 登录 npm（如尚未登录）
npm login

# 发布到 npm
npm publish --access public`;

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

      <Card className="docs-card" title="本地 npm 打包命令">
        <Paragraph>
          如果你在本地开发、联调或准备发版，可以直接使用仓库内置的 <Text code>npm</Text> 脚本完成组件库和文档站打包。
        </Paragraph>
        <CodeBlock code={codeLocalBuild} />
      </Card>

      <Card className="docs-card" title="发布命令">
        <Paragraph>
          当前包名为 <Text code>rc-virtual-keyboard</Text>，<Text code>package.json</Text> 中已配置 <Text code>prepublishOnly</Text>，
          执行发布前会自动触发一次 <Text code>npm run build</Text>。
        </Paragraph>
        <Paragraph>
          建议先根据本次变更类型选择版本号更新方式：
          <Text code>patch</Text> 表示小版本修复，
          <Text code>minor</Text> 表示中版本功能增加，
          <Text code>major</Text> 表示大版本不兼容调整。
        </Paragraph>
        <CodeBlock code={codePublish} />
      </Card>
    </Space>
  ),
};
