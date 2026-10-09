import ComponentDocPage from '../components/ComponentDocPage';
import { hookDocs } from '../component-docs/hookDocs';
import type { DocRoute } from './types';

export const hookRoutes: DocRoute[] = hookDocs.map((doc) => ({
  key: doc.key,
  path: doc.path,
  title: doc.title,
  menuLabel: doc.menuLabel,
  description: doc.description,
  group: 'hooks',
  render: () => <ComponentDocPage doc={doc} />,
}));
