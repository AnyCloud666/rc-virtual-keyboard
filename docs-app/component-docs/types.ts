export type FieldRow = {
  name: string;
  type: string;
  defaultValue: string;
  description: string;
};

export type MethodRow = {
  name: string;
  signature: string;
  description: string;
};

export type TokenRow = {
  name: string;
  defaultValue: string;
  description: string;
};

export type ComponentDoc = {
  key: string;
  path: string;
  title: string;
  menuLabel: string;
  description: string;
  importCode: string;
  usageCode: string;
  props: FieldRow[];
  methods: MethodRow[];
  tokens: TokenRow[];
  renderDemo: () => JSX.Element;
};
