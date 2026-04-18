import ComponentDocPage from '../components/ComponentDocPage';
import { componentDocs } from '../component-docs';
import type { DocRoute } from './types';

export const componentRoutes: DocRoute[] = componentDocs.map((doc) => ({
  key: doc.key,
  path: doc.path,
  title: doc.title,
  menuLabel: doc.menuLabel,
  description: doc.description,
  group: 'components',
  render: () => <ComponentDocPage doc={doc} />,
}));
