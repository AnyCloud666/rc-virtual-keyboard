import path from 'node:path';
import { fileURLToPath } from 'node:url';

import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';
import svgr from 'vite-plugin-svgr';

import pkg from './package.json' with { type: 'json' };

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const external = [
  ...Object.keys(pkg.dependencies ?? {}),
  ...Object.keys(pkg.peerDependencies ?? {}),
];

export default defineConfig({
  publicDir: false,
  plugins: [
    react({ jsxRuntime: 'classic' }),
    svgr({
      include: '**/*.svg',
      svgrOptions: {
        exportType: 'named',
        ref: true,
        svgo: false,
        titleProp: true,
      },
    }),
    dts({
      include: ['src'],
      outDir: 'dist',
      insertTypesEntry: true,
      copyDtsFiles: true,
      tsconfigPath: path.resolve(__dirname, 'tsconfig.json'),
      beforeWriteFile(filePath, content) {
        const compatibleContent = content
          .replace(
            /import \{ default as React(?:, ([^}]+))? \} from 'react';/g,
            (_, namedImports) =>
              `import * as React from 'react';${
                namedImports
                  ? `\nimport { ${namedImports} } from 'react';`
                  : ''
              }`,
          )
          .replaceAll('React.JSX.Element', 'React.ReactElement');

        return {
          filePath,
          content: compatibleContent,
        };
      },
    }),
  ],
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    sourcemap: true,
    cssCodeSplit: false,
    lib: {
      entry: path.resolve(__dirname, 'src/index.ts'),
      formats: ['es', 'cjs'],
      fileName: (format) => (format === 'es' ? 'index.js' : 'index.cjs'),
      name: 'RcVirtualKeyboard',
    },
    rollupOptions: {
      external,
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
        },
      },
    },
  },
});
