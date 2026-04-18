export type { ComponentDoc, FieldRow, MethodRow, TokenRow } from './types';

import { coreComponentDocs } from './coreDocs';
import { panelComponentDocs } from './panelDocs';
import { utilityComponentDocs } from './utilityDocs';

export const componentDocs = [
  ...coreComponentDocs,
  ...panelComponentDocs,
  ...utilityComponentDocs,
];
