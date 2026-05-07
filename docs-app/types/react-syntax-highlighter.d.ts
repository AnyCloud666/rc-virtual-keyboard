declare module 'react-syntax-highlighter' {
  import type { CSSProperties, ReactNode } from 'react';

  export type SyntaxHighlighterProps = {
    language?: string;
    style?: Record<string, CSSProperties>;
    customStyle?: CSSProperties;
    codeTagProps?: {
      style?: CSSProperties;
    };
    wrapLongLines?: boolean;
    children?: ReactNode;
  };

  export type SyntaxHighlighterComponent = ((
    props: SyntaxHighlighterProps,
  ) => JSX.Element) & {
    registerLanguage: (name: string, syntax: unknown) => void;
  };

  export const PrismAsyncLight: SyntaxHighlighterComponent;
}

declare module 'react-syntax-highlighter/dist/esm/languages/prism/bash' {
  const bash: unknown;
  export default bash;
}

declare module 'react-syntax-highlighter/dist/esm/languages/prism/tsx' {
  const tsx: unknown;
  export default tsx;
}

declare module 'react-syntax-highlighter/dist/esm/languages/prism/typescript' {
  const typescript: unknown;
  export default typescript;
}

declare module 'react-syntax-highlighter/dist/esm/styles/prism' {
  export const oneLight: Record<string, import('react').CSSProperties>;
}
