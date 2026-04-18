import type { MenuProps } from 'antd';
import { componentRoutes } from './componentRoutes';
import { exampleRoutes } from './exampleRoutes';
import { guideRoutes } from './guideRoutes';
import type { DocRoute } from './types';

export const routes: DocRoute[] = [
  ...guideRoutes,
  ...componentRoutes,
  ...exampleRoutes,
];

export const routeMap = new Map(routes.map((route) => [route.path, route]));

export const menuItems: MenuProps['items'] = [
  {
    key: 'guide-group',
    type: 'group',
    label: '指南',
    children: routes
      .filter((route) => route.group === 'guide')
      .map((route) => ({ key: route.path, label: route.menuLabel })),
  },
  {
    key: 'components-group',
    type: 'group',
    label: '组件',
    children: routes
      .filter((route) => route.group === 'components')
      .map((route) => ({ key: route.path, label: route.menuLabel })),
  },
  {
    key: 'examples-group',
    type: 'group',
    label: '示例',
    children: routes
      .filter((route) => route.group === 'examples')
      .map((route) => ({ key: route.path, label: route.menuLabel })),
  },
];
