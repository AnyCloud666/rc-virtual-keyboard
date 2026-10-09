import { PrismAsyncLight as SyntaxHighlighter } from 'react-syntax-highlighter';
import bash from 'react-syntax-highlighter/dist/esm/languages/prism/bash';
import tsx from 'react-syntax-highlighter/dist/esm/languages/prism/tsx';
import typescript from 'react-syntax-highlighter/dist/esm/languages/prism/typescript';
import { oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism';

SyntaxHighlighter.registerLanguage('bash', bash);
SyntaxHighlighter.registerLanguage('tsx', tsx);
SyntaxHighlighter.registerLanguage('ts', typescript);

function detectLanguage(code: string) {
  if (code.includes('pnpm ') || code.includes('npm ') || code.includes('yarn ')) {
    return 'bash';
  }

  if (
    code.includes('import ') ||
    code.includes('export ') ||
    code.includes('<VirtualKeyboard') ||
    code.includes('useState')
  ) {
    return 'tsx';
  }

  if (code.includes('defineConfig') || code.includes('svgr(')) {
    return 'ts';
  }

  return 'tsx';
}

export default function CodeBlock({ code }: { code: string }) {
  const language = detectLanguage(code);

  return (
    <div className="docs-code-wrap">
      <div className="docs-code-toolbar">
        <span className="docs-code-dot red" />
        <span className="docs-code-dot yellow" />
        <span className="docs-code-dot green" />
        <span className="docs-code-lang">{language}</span>
      </div>
      <SyntaxHighlighter
        language={language}
        style={oneLight}
        customStyle={{
          margin: 0,
          borderRadius: '0 0 12px 12px',
          padding: '16px',
          background: '#fafafa',
          fontSize: '13px',
          lineHeight: '1.7',
          borderTop: '1px solid #f0f0f0',
        }}
        codeTagProps={{
          style: {
            fontFamily:
              "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
          },
        }}
        wrapLongLines
      >
        {code}
      </SyntaxHighlighter>
    </div>
  );
}
