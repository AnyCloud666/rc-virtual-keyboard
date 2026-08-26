import {
  EFFECTIVE_INPUT_TYPES,
  NEED_HANDLE_INPUT_TYPES,
} from '../constants';

type CreateFocusHandlersArgs = {
  enableFocusShow: boolean;
  activeInputRef: React.MutableRefObject<HTMLInputElement | null>;
  lastActiveInputRef: React.MutableRefObject<HTMLInputElement | null>;
  inputType: React.MutableRefObject<string>;
  jumpDelete: React.MutableRefObject<boolean>;
  cacheInputFocus: React.MutableRefObject<WeakSet<HTMLInputElement>>;
  blurTimer: React.MutableRefObject<number | undefined>;
  keyboardPointerUntilRef: React.MutableRefObject<number>;
  keyboardTouchSessionRef: React.MutableRefObject<boolean>;
  onBlurHandlerRef: React.MutableRefObject<((e: FocusEvent) => void) | undefined>;
  onFocusHandlerRef: React.MutableRefObject<((e: FocusEvent) => void) | undefined>;
  pinyinLearningRequestIdRef: React.MutableRefObject<number>;
  setInputValue: React.Dispatch<React.SetStateAction<string>>;
  setChinese: React.Dispatch<React.SetStateAction<string[]>>;
  onChangeShow?: (s: boolean) => void;
  onActiveInputChange?: (input: HTMLInputElement | null) => void;
};

/**
 * 创建与输入框焦点接管相关的一组处理函数。
 *
 * @description
 * 这一层专门负责：
 * - 识别可被虚拟键盘接管的 input
 * - 绑定 focus / blur 监听
 * - 处理键盘点击导致的“假失焦”
 * - 在真正失焦时清理候选与临时输入状态
 */
export const createFocusHandlers = ({
  enableFocusShow,
  activeInputRef,
  lastActiveInputRef,
  inputType,
  jumpDelete,
  cacheInputFocus,
  blurTimer,
  keyboardPointerUntilRef,
  keyboardTouchSessionRef,
  onBlurHandlerRef,
  onFocusHandlerRef,
  pinyinLearningRequestIdRef,
  setInputValue,
  setChinese,
  onChangeShow,
  onActiveInputChange,
}: CreateFocusHandlersArgs) => {
  const getInputDataAttribute = (
    inputEl: HTMLInputElement,
    attribute: string,
  ) => {
    let current: HTMLElement | null = inputEl;

    while (current) {
      const value = current.getAttribute(attribute);
      if (value !== null) return value;
      current = current.parentElement;
    }

    return undefined;
  };

  const isSupportedInput = (
    target: EventTarget | null,
  ): target is HTMLInputElement => {
    const activeElement = target as HTMLInputElement | null;

    return !!(
      activeElement?.tagName === 'INPUT' &&
      [...EFFECTIVE_INPUT_TYPES, ...NEED_HANDLE_INPUT_TYPES].includes(
        activeElement?.type ?? '',
      ) &&
      getInputDataAttribute(activeElement, 'data-vkb-disabled') !== 'true'
    );
  };

  const shouldShowOnFocus = (inputEl: HTMLInputElement) => {
    const vkbShow = getInputDataAttribute(inputEl, 'data-vkb-show');
    const vkbAutoPopup = getInputDataAttribute(
      inputEl,
      'data-vkb-auto-popup',
    );

    if (vkbShow === 'true') return true;
    if (vkbShow === 'false') return false;
    if (vkbAutoPopup === 'true') return true;
    if (vkbAutoPopup === 'false') return false;

    return enableFocusShow;
  };

  const shouldHideOnBlur = (inputEl: HTMLInputElement | null) => {
    if (!inputEl) return true;

    return getInputDataAttribute(inputEl, 'data-vkb-blur-hidden') !== 'false';
  };

  const bindInputListener = (inputEl: HTMLInputElement) => {
    if (!cacheInputFocus.current.has(inputEl)) {
      cacheInputFocus.current.add(inputEl);
      inputEl.addEventListener('blur', (event) => {
        onBlurHandlerRef.current?.(event as FocusEvent);
      });
      inputEl.addEventListener('focus', (event) => {
        onFocusHandlerRef.current?.(event as FocusEvent);
      });
    }
  };

  const activateInput = (
    inputEl: HTMLInputElement,
    options?: { syncShow?: boolean },
  ) => {
    const hasSwitchedInput =
      !!activeInputRef.current && activeInputRef.current !== inputEl;

    if (hasSwitchedInput) {
      pinyinLearningRequestIdRef.current += 1;
      setInputValue('');
      setChinese([]);
      jumpDelete.current = false;
    }

    inputType.current =
      getInputDataAttribute(inputEl, 'data-vkb-type') ?? '';
    activeInputRef.current = inputEl;
    lastActiveInputRef.current = inputEl;
    onActiveInputChange?.(inputEl);
    bindInputListener(inputEl);

    if (options?.syncShow && shouldShowOnFocus(inputEl)) {
      onChangeShow?.(true);
    }
  };

  const onBlur = (e: FocusEvent) => {
    window.clearTimeout(blurTimer.current);
    blurTimer.current = window.setTimeout(() => {
      const nextActiveElement = document.activeElement;
      const currentInput = e.target as HTMLInputElement | null;
      const relatedTarget = e.relatedTarget;
      const isBlurToKeyboard =
        relatedTarget instanceof HTMLElement &&
        !!relatedTarget.closest('.virtual-keyboard');
      const isKeyboardPointerActive =
        keyboardTouchSessionRef.current ||
        Date.now() < keyboardPointerUntilRef.current;

      if (isSupportedInput(nextActiveElement)) {
        return;
      }

      if ((isBlurToKeyboard || isKeyboardPointerActive) && currentInput) {
        currentInput.focus({ preventScroll: true });
        return;
      }

      pinyinLearningRequestIdRef.current += 1;
      setInputValue('');
      setChinese([]);

      if (activeInputRef.current === currentInput) {
        activeInputRef.current = null;
        inputType.current = '';
        onActiveInputChange?.(null);
      }

      if (shouldHideOnBlur(currentInput)) {
        onChangeShow?.(false);
      }
    }, 0);
  };

  const onFocus = (e: FocusEvent) => {
    window.clearTimeout(blurTimer.current);
    const activeElement = e.target as HTMLInputElement;

    if (!isSupportedInput(activeElement)) {
      return;
    }

    activateInput(activeElement, { syncShow: true });
  };

  const findFocusElement = (e: MouseEvent | FocusEvent) => {
    const activeElement = e.target as HTMLInputElement;

    if (isSupportedInput(activeElement)) {
      activateInput(activeElement, { syncShow: true });
    }
  };

  return {
    isSupportedInput,
    activateInput,
    onBlur,
    onFocus,
    findFocusElement,
  };
};
