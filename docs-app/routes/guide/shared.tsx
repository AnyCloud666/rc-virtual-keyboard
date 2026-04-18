import { GithubOutlined } from '@ant-design/icons';
import { Button, Space, Tag, Typography } from 'antd';
import { useState } from 'react';
import { VirtualKeyboard } from 'rc-virtual-keyboard';

const { Title, Paragraph, Text } = Typography;

export const codeInstall = `pnpm add rc-virtual-keyboard\n\nimport 'rc-virtual-keyboard/style.css';`;

export const codeBasicUsage = `import { useState } from 'react';\nimport { VirtualKeyboard } from 'rc-virtual-keyboard';\nimport 'rc-virtual-keyboard/style.css';\n\nexport default function Demo() {\n  const [value, setValue] = useState('');\n\n  return (\n    <>\n      <input\n        value={value}\n        placeholder="可使用虚拟键盘输入"\n        onChange={(e) => setValue(e.target.value)}\n      />\n\n      <div>当前值: {value || '未输入'}</div>\n      <VirtualKeyboard />\n    </>\n  );\n}`;

export const codeViteSvgr = `import { defineConfig } from 'vite';\nimport react from '@vitejs/plugin-react';\nimport svgr from 'vite-plugin-svgr';\n\nexport default defineConfig({\n  plugins: [\n    react(),\n    svgr({\n      include: '**/*.svg',\n      svgrOptions: {\n        exportType: 'named',\n        ref: true,\n        svgo: false,\n        titleProp: true,\n      },\n    }),\n  ],\n});`;

export const codeDatasetUsage = `<VirtualKeyboard focusShow={false} />\n\n<input\n  placeholder="只有我聚焦时弹出键盘"\n  data-vkb-show\n/>\n\n<input\n  placeholder="我不自动弹出键盘"\n  data-vkb-auto-popup={false}\n/>\n\n<input\n  placeholder="失焦后保持键盘展示"\n  data-vkb-blur-hidden={false}\n/>\n\n<input\n  type="text"\n  placeholder="数字输入建议这样接管"\n  data-vkb-type="number"\n/>\n\n<input\n  placeholder="禁用虚拟键盘接管"\n  data-vkb-disabled="true"\n/>;`;

export function DatasetUsageDemo() {
  const [forcedValue, setForcedValue] = useState('');
  const [manualValue, setManualValue] = useState('');
  const [stickyValue, setStickyValue] = useState('');
  const [numberValue, setNumberValue] = useState('');
  const [disabledValue, setDisabledValue] = useState('');

  return (
    <div className="basic-usage-demo">
      <div className="basic-usage-form" style={{ maxWidth: 520 }}>
        <div className="basic-usage-label">data-vkb 交互示例</div>

        <input
          placeholder="data-vkb-show：只有我能弹出键盘"
          data-vkb-show
          value={forcedValue}
          onInput={(e) => {
            setForcedValue((e.target as HTMLInputElement).value);
          }}
        />

        <input
          placeholder="data-vkb-auto-popup=false：聚焦不自动弹出"
          data-vkb-auto-popup={false}
          value={manualValue}
          onInput={(e) => {
            setManualValue((e.target as HTMLInputElement).value);
          }}
        />

        <input
          placeholder="data-vkb-blur-hidden=false：失焦后保留键盘"
          data-vkb-blur-hidden={false}
          value={stickyValue}
          onInput={(e) => {
            setStickyValue((e.target as HTMLInputElement).value);
          }}
        />

        <input
          type="text"
          inputMode="decimal"
          placeholder='data-vkb-type="number"：数字输入模式'
          data-vkb-type="number"
          value={numberValue}
          onInput={(e) => {
            setNumberValue((e.target as HTMLInputElement).value);
          }}
        />

        <input
          placeholder='data-vkb-disabled="true"：不受虚拟键盘接管'
          data-vkb-disabled="true"
          value={disabledValue}
          onInput={(e) => {
            setDisabledValue((e.target as HTMLInputElement).value);
          }}
        />

        <div className="basic-usage-value">show: {forcedValue || '未输入'}</div>
        <div className="basic-usage-value">auto-popup=false: {manualValue || '未输入'}</div>
        <div className="basic-usage-value">blur-hidden=false: {stickyValue || '未输入'}</div>
        <div className="basic-usage-value">number: {numberValue || '未输入'}</div>
        <div className="basic-usage-value">disabled: {disabledValue || '未输入'}</div>
      </div>

      <VirtualKeyboard focusShow={false} />
    </div>
  );
}

export function BasicUsageDemo() {
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

export function HomeKeyboardShowcase() {
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

export function HomeHeroActions() {
  return (
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
  );
}

export function HomeHeroIntro() {
  return (
    <>
      <Space wrap>
        <Tag color="blue">React</Tag>
        <Tag color="processing">Vite</Tag>
        <Tag color="gold">Virtual Keyboard</Tag>
      </Space>

      <Title className="home-hero-title" level={1}>
        rc-virtual-keyboard
      </Title>

      <Paragraph className="home-hero-desc">
        首页直接展示真实组件。你可以先在这里完成一次输入，滚动下方或进入文档页查看安装方式、接入示例和独立路由 demo。
      </Paragraph>
    </>
  );
}

export { Paragraph, Text, Title };
