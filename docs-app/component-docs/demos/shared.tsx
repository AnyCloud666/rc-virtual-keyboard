import { useState } from 'react';
import { useInput } from 'rc-virtual-keyboard';

const letterDemoPinyinMap: Record<string, string[]> = {
  ni: ['你', '呢', '泥', '拟'],
  nihao: ['你好', '拟好', '霓号'],
  jian: ['键', '件', '建', '见'],
  jianpan: ['键盘', '键盘组件', '简拼', '键盘文档'],
  zuhe: ['组合', '组合键盘', '组合输入'],
  zujian: ['组件', '组件库', '组件示例'],
  wenshi: ['文档', '文示', '文史'],
  shuru: ['输入', '输入法', '输入框'],
};

export function queryLetterCandidates(input: string) {
  if (!input) return [];

  const normalized = input.toLowerCase().replace(/[^a-z]/g, '');
  if (!normalized) return [];

  if (letterDemoPinyinMap[normalized]) {
    return letterDemoPinyinMap[normalized];
  }

  return Object.entries(letterDemoPinyinMap)
    .filter(([key]) => key.startsWith(normalized) || normalized.startsWith(key))
    .flatMap(([, value]) => value)
    .slice(0, 6);
}

export function useDemoInputController(options?: Parameters<typeof useInput>[0]) {
  const [value, setValue] = useState('');
  const keyboard = useInput(options ?? {});

  return {
    ...keyboard,
    value,
    setValue,
  };
}
