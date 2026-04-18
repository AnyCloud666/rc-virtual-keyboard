import type { ReactNode } from 'react';

export type DocRoute = {
  key: string;
  path: string;
  title: string;
  menuLabel: string;
  description: string;
  group: 'guide' | 'components' | 'hooks' | 'examples';
  render: () => ReactNode;
};

export function normalizeHashPath(hash: string) {
  const path = hash.replace(/^#/, '') || '/';
  return path.startsWith('/') ? path : `/${path}`;
}
