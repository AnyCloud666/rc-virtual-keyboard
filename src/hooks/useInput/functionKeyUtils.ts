import {
  ArrowDown,
  ArrowLeft,
  ArrowLeftFirst,
  ArrowRight,
  ArrowRightEnd,
  ArrowUp,
  Backspace,
  CapsLock,
  Enter,
  Shift,
  Space,
  Tab,
} from '../../keys';
import { VKB } from '../../typing';
import { getSelectionInfo } from './inputValueUtils';

const FUNCTION_KEY_EVENT = 'vkb:function-key';
const FALLBACK_FOCUS_SELECTOR = [
  'input[type="search"]:not([disabled]):not([readonly])',
  '[data-vkb-function-focus="true"]',
  'input:not([type="hidden"]):not([disabled]):not([readonly])',
  'textarea:not([disabled]):not([readonly])',
  '[contenteditable="true"]',
].join(', ');

type BuildFunctionKeyContextArgs = {
  key: VKB.KeyboardAttributeType;
  activeInput: HTMLInputElement | null;
  lastActiveInput: HTMLInputElement | null;
  inputValue: string;
  chinese: string[];
  caretBrowsingEnabled: boolean;
};

/**
 * 组装功能键回调、事件派发、默认行为所共用的上下文对象。
 */
export const buildFunctionKeyContext = ({
  key,
  activeInput,
  lastActiveInput,
  inputValue,
  chinese,
  caretBrowsingEnabled,
}: BuildFunctionKeyContextArgs): VKB.FunctionKeyContext => {
  return {
    key,
    activeInput,
    lastActiveInput,
    inputValue,
    chinese: [...chinese],
    caretBrowsingEnabled,
  };
};

/**
 * 向 `window` 补发一个接近真实物理键盘的功能键事件。
 */
export const dispatchWindowFunctionKeyEvent = (
  type: 'keydown' | 'keyup',
  key: VKB.KeyboardAttributeType,
) => {
  window.dispatchEvent(
    new KeyboardEvent(type, {
      bubbles: true,
      cancelable: true,
      key: key.key,
      code: key.code,
    }),
  );
};

/**
 * 派发虚拟键盘内部的功能键自定义事件，允许外部通过 `preventDefault` 拦截。
 */
export const dispatchFunctionKeyEvent = (
  context: VKB.FunctionKeyContext,
) => {
  const event = new CustomEvent(FUNCTION_KEY_EVENT, {
    bubbles: false,
    cancelable: true,
    detail: context,
  });

  return !window.dispatchEvent(event) || event.defaultPrevented;
};

type GetFunctionSearchTextArgs = {
  activeInput: HTMLInputElement | null;
  chinese: string[];
  inputValue: string;
};

/**
 * 为 F3 提供默认搜索文本。
 *
 * @description
 * 优先级依次为：输入框选区、页面文本选区、候选词、当前临时输入值。
 */
export const getFunctionSearchText = ({
  activeInput,
  chinese,
  inputValue,
}: GetFunctionSearchTextArgs) => {
  if (activeInput) {
    const { selectionStart, selectionEnd, value } =
      getSelectionInfo(activeInput);

    const selectedText = value.slice(selectionStart, selectionEnd).trim();
    if (selectedText) {
      return selectedText;
    }
  }

  const selectionText = window.getSelection?.()?.toString().trim();
  if (selectionText) {
    return selectionText;
  }

  const candidateText = chinese.find((item) => item?.trim());
  if (candidateText) {
    return candidateText.trim();
  }

  return inputValue.trim();
};

type FocusFunctionTargetArgs = {
  focusSelector?: string;
  activeInput: HTMLInputElement | null;
  lastActiveInput: HTMLInputElement | null;
};

/**
 * 为 F6 查找并聚焦页面内的目标输入元素。
 */
export const focusFunctionTarget = ({
  focusSelector,
  activeInput,
  lastActiveInput,
}: FocusFunctionTargetArgs) => {
  const selectors = [focusSelector, FALLBACK_FOCUS_SELECTOR].filter(
    Boolean,
  ) as string[];

  for (const selector of selectors) {
    try {
      const target = document.querySelector<HTMLElement>(selector);
      if (!target) continue;

      target.focus();
      return true;
    } catch (error) {
      console.warn('invalid function key focus selector:', selector, error);
    }
  }

  const fallbackTarget = activeInput ?? lastActiveInput;
  if (fallbackTarget) {
    fallbackTarget.focus();
    return true;
  }

  return false;
};

type RunDefaultFunctionKeyActionArgs = {
  key: VKB.KeyboardAttributeType;
  functionKeyDefaults?: VKB.FunctionKeyDefaults;
  getSearchText: () => string;
  focusTarget: () => boolean;
  caretBrowsingEnabled: boolean;
  setCaretBrowsingEnabled: (value: boolean) => void;
};

/**
 * 执行浏览器内可模拟的默认功能键行为。
 *
 * @description
 * 不可在页面中真实模拟的系统级行为仍然交由业务覆写或事件监听接管。
 */
export const runDefaultFunctionKeyAction = ({
  key,
  functionKeyDefaults,
  getSearchText,
  focusTarget,
  caretBrowsingEnabled,
  setCaretBrowsingEnabled,
}: RunDefaultFunctionKeyActionArgs) => {
  switch (key.code as VKB.FunctionKeyCode) {
    case 'F1':
      if (functionKeyDefaults?.helpUrl) {
        window.open(
          functionKeyDefaults.helpUrl,
          '_blank',
          'noopener,noreferrer',
        );
        return true;
      }
      return false;
    case 'F3': {
      const text = getSearchText();
      const win = window as Window & {
        find?: (searchString: string) => boolean;
      };

      if (!text || typeof win.find !== 'function') {
        return false;
      }

      try {
        return !!win.find(text);
      } catch (error) {
        console.warn('window.find failed:', error);
        return false;
      }
    }
    case 'F5':
      window.location.reload();
      return true;
    case 'F6':
      return focusTarget();
    case 'F7':
      setCaretBrowsingEnabled(!caretBrowsingEnabled);
      return true;
    case 'F11':
      if (document.fullscreenElement) {
        void document.exitFullscreen?.().catch(() => undefined);
        return true;
      }

      void document.documentElement.requestFullscreen?.().catch(() => undefined);
      return true;
    default:
      return false;
  }
};

/**
 * 将真实键盘事件映射为虚拟键盘内部使用的 code 列表，用于高亮和音效联动。
 */
export const resolvePhysicalKeyCodes = (e: KeyboardEvent) => {
  const nextCodes = new Set<string>();
  const normalizedKey = typeof e.key === 'string' ? e.key : '';
  const digitMatch = e.code.match(/^Digit(\d)$/);
  const functionMatch = e.code.match(/^F([1-9]|1[0-2])$/);
  const isPhysicalShift =
    e.code === 'ShiftLeft' || e.code === 'ShiftRight' || e.key === 'Shift';
  const isPhysicalCapsLock =
    e.code === 'CapsLock' || e.key === 'CapsLock';

  if (digitMatch) {
    nextCodes.add(`Numpad${digitMatch[1]}`);
  }

  if (functionMatch) {
    nextCodes.add(`F${functionMatch[1]}`);
  }

  if (/^Numpad\d$/.test(e.code) || /^Key[A-Z]$/.test(e.code)) {
    nextCodes.add(e.code);
  }

  switch (e.code) {
    case Backspace.code:
    case Enter.code:
    case Tab.code:
    case Space.code:
    case CapsLock.code:
    case ArrowUp.code:
    case ArrowDown.code:
    case ArrowLeft.code:
    case ArrowRight.code:
      nextCodes.add(e.code);
      break;
    case 'Home':
      nextCodes.add(ArrowLeftFirst.code);
      break;
    case 'End':
      nextCodes.add(ArrowRightEnd.code);
      break;
  }

  if (isPhysicalShift) {
    nextCodes.add(Shift.code);
  }

  if (isPhysicalCapsLock) {
    nextCodes.add(CapsLock.code);
  }

  switch (normalizedKey) {
    case '-':
      nextCodes.add('NumpadSubtract');
      break;
    case '+':
      nextCodes.add('NumpadAdd');
      break;
    case '*':
      nextCodes.add('NumpadMultiply');
      break;
    case '/':
      nextCodes.add('NumpadDivide');
      break;
    case '.':
      nextCodes.add('NumpadDecimal');
      break;
    case '%':
      nextCodes.add('NumpadPercentage');
      break;
  }

  return [...nextCodes];
};
