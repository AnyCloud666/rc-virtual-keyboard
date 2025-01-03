import { defineConfig } from 'dumi';

const repo = 'react-vitrual-keyboard';

export default defineConfig({
  outputPath: 'docs-dist',
  logo: '/logo.png',
  base: process.env.NODE_ENV === 'production' ? `/${repo}/` : '/',
  publicPath: process.env.NODE_ENV === 'production' ? `/${repo}/` : '/',
  themeConfig: {
    name: 'react-virtual-keyboard',
  },
});
