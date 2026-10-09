import {
  INVALID_INPUT_TYPES,
  NEED_HANDLE_INPUT_TYPES,
} from '../constants';
import { setNativeInputValue } from '../../utils/simulate';

/**
 * 判断当前输入框类型是否需要拦截虚拟键盘的默认处理。
 */
export const validateInputType = (inputEl: HTMLInputElement) => {
  return [...INVALID_INPUT_TYPES, ...NEED_HANDLE_INPUT_TYPES].includes(
    inputEl.type,
  );
};

/**
 * 判断当前输入框是否允许基于选区进行插入、替换和光标定位。
 */
export const canApplySelectionBasedValue = (inputEl: HTMLInputElement) => {
  return !NEED_HANDLE_INPUT_TYPES.includes(inputEl.type);
};

/**
 * 输出不受支持输入类型的统一提示，方便在开发环境里快速定位配置问题。
 */
export const reportInvalidInputType = () => {
  console.error('disabled type', [
    ...INVALID_INPUT_TYPES,
    ...NEED_HANDLE_INPUT_TYPES,
  ]);
  console.error(
    'if you need type="number" please use data-vkb-type="number" replace',
  );
};

/**
 * 获取输入框当前 value、选区起止位置，以及是否是折叠光标状态。
 */
export const getSelectionInfo = (inputEl: HTMLInputElement) => {
  const selectionStart = inputEl.selectionStart ?? 0;
  const selectionEnd = inputEl.selectionEnd ?? 0;

  return {
    value: inputEl.value,
    selectionStart,
    selectionEnd,
    isCollapsed: selectionStart === selectionEnd,
  };
};

/**
 * 通过原生 value setter 回填输入值，并在可用时同步更新选区。
 *
 * @description
 * 这样可以更稳定地兼容 React 受控输入、antd InputNumber 和表单组件。
 */
export const applyInputValue = (
  inputEl: HTMLInputElement,
  value: string,
  selectionStart?: number,
  selectionEnd?: number,
) => {
  setNativeInputValue(inputEl, value);

  if (
    typeof selectionStart === 'number' &&
    typeof selectionEnd === 'number' &&
    typeof inputEl.setSelectionRange === 'function'
  ) {
    inputEl.setSelectionRange(selectionStart, selectionEnd);
  }
};

/**
 * 校验当前 number 输入是否仍然满足 `数字 + 可选符号/小数点` 规则。
 */
export const isAllowInputNumber = (
  type: string,
  currentValue: string,
  nextValue: string,
) => {
  if (type === 'number') {
    return !/^[-+]?(\d+)?(\.)?(\d+)?$/.test(currentValue + nextValue);
  }

  return false;
};

/**
 * 对候选词去重并保持原有顺序，避免同一个候选多次渲染。
 */
export const dedupeCandidates = (candidates: string[]) => {
  const nextCandidates: string[] = [];
  const cache = new Set<string>();

  candidates.forEach((item) => {
    if (!item || cache.has(item)) {
      return;
    }

    cache.add(item);
    nextCandidates.push(item);
  });

  return nextCandidates;
};
