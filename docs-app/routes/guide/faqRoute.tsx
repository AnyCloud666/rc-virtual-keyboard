import { Card } from 'antd';
import CodeBlock from '../../components/CodeBlock';
import type { DocRoute } from '../types';
import { codeViteSvgr, Paragraph, Text, Title } from './shared';

export const faqRoute: DocRoute = {
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
        <li>如果你覆盖了 <Text code>keydownAudioUrl</Text>，请确认你传入的音频资源地址可访问。</li>
        <li>如果你有自己的资源地址，直接传入 <Text code>keydownAudioUrl</Text> 覆盖默认值。</li>
      </ul>
    </Card>
  ),
};
