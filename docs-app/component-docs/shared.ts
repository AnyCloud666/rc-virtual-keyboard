import type { TokenRow } from './types';

export const sharedThemeTokens: TokenRow[] = [
  { name: '--vkb-background', defaultValue: '#f2f5fa', description: '键盘背景色' },
  { name: '--vkb-key-color', defaultValue: '#000000', description: '按键文字颜色' },
  { name: '--vkb-key-background', defaultValue: '#ffffff', description: '普通按键背景色' },
  { name: '--vkb-key-active-background', defaultValue: '#dce1e7', description: '按下或激活时的背景色' },
  { name: '--vkb-key-active-font-color', defaultValue: '#1677ff', description: '激活状态文字颜色' },
  { name: '--vkb-key-border-color', defaultValue: '#f0f0f0', description: '普通按键边框颜色' },
  { name: '--vkb-key-active-border-color', defaultValue: '#dce1e7', description: '激活状态边框颜色' },
  { name: '--vkb-key-border-width', defaultValue: '1px', description: '按键边框宽度' },
  { name: '--vkb-key-shadow-color', defaultValue: '#f0f0f0', description: '普通按键阴影颜色' },
  { name: '--vkb-key-active-shadow-color', defaultValue: '#dce1e7', description: '激活状态阴影颜色' },
  { name: '--vkb-key-shadow-width', defaultValue: '4px', description: '按键阴影厚度' },
  { name: '--vkb-key-tips-color', defaultValue: '#cccccc', description: '辅助提示文字颜色' },
  { name: '--vkb-key-tips-font-size', defaultValue: '12px', description: '辅助提示文字大小' },
  { name: '--vkb-key-scroll-bar-color', defaultValue: '#cccccc', description: '滚动条颜色' },
  { name: '--vkb-key-gap', defaultValue: '6px', description: '按键之间的间距' },
  { name: '--vkb-key-borer-radius', defaultValue: '4px', description: '按键圆角' },
  { name: '--vkb-key-font-size', defaultValue: '14px', description: '按键字体大小' },
  { name: '--vkb-key-font-family', defaultValue: "'Microsoft YaHei', 'PingFang SC', sans-serif", description: '按键字体族' },
  { name: '--vkb-keyboard-tab', defaultValue: '40px', description: '顶部 tab 区域高度' },
  { name: '--vkb-keyboard-svg-size', defaultValue: '26px', description: '键盘内部图标尺寸' },
];

export const noTokens: TokenRow[] = [
  { name: '无专属颜色变量', defaultValue: '-', description: '当前组件不暴露额外 CSS 主题变量，主要跟随宿主容器样式。' },
];
