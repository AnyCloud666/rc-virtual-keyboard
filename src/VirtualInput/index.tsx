import React, {
  CSSProperties,
  FocusEvent,
  forwardRef,
  InputHTMLAttributes,
  MouseEvent,
  ReactNode,
  TouchEvent,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from 'react';
import './style.css';

type VirtualInputProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'readOnly' | 'size'
> & {
  /** 根节点 className */
  wrapperClassName?: string;
  /** 根节点 style */
  wrapperStyle?: CSSProperties;
  /** 前缀内容 */
  prefix?: ReactNode;
  /** 后缀内容 */
  suffix?: ReactNode;
};

type SelectionState = {
  start: number;
  end: number;
};

const clamp = (value: number, min: number, max: number) => {
  return Math.min(Math.max(value, min), max);
};

const getSafeValue = (value: unknown) => {
  if (typeof value === 'string') return value;
  if (typeof value === 'number') return `${value}`;
  return '';
};

const getTextOffsetFromNode = (
  root: HTMLElement,
  targetNode: Node,
  targetOffset: number,
) => {
  const range = document.createRange();
  range.selectNodeContents(root);

  try {
    range.setEnd(targetNode, targetOffset);
    return clamp(range.toString().length, 0, root.textContent?.length ?? 0);
  } catch {
    return root.textContent?.length ?? 0;
  }
};

const notifyInputActivated = (input: HTMLInputElement) => {
  input.dispatchEvent(new Event('click', { bubbles: true }));

  if (typeof FocusEvent === 'function') {
    input.dispatchEvent(new FocusEvent('focusin', { bubbles: true }));
    return;
  }

  input.dispatchEvent(new Event('focusin', { bubbles: true }));
};

const VirtualInput = forwardRef<HTMLInputElement, VirtualInputProps>(
  (
    {
      value,
      defaultValue,
      onChange,
      onInput,
      onFocus,
      onBlur,
      className,
      wrapperClassName,
      wrapperStyle,
      placeholder,
      disabled,
      prefix,
      suffix,
      type = 'text',
      style,
      ...restProps
    },
    ref,
  ) => {
    const restInputProps = restProps as typeof restProps & {
      'data-vkb-show'?: string;
    };
    const inputRef = useRef<HTMLInputElement | null>(null);
    const displayRef = useRef<HTMLDivElement | null>(null);
    const lastTouchAtRef = useRef(0);
    const pendingTouchFocusRef = useRef(false);
    const pendingCaretIndexRef = useRef<number | null>(null);
    const isControlled = typeof value !== 'undefined';
    const [innerValue, setInnerValue] = useState(() =>
      getSafeValue(isControlled ? value : defaultValue),
    );
    const [focused, setFocused] = useState(false);
    const [selection, setSelection] = useState<SelectionState>({
      start: innerValue.length,
      end: innerValue.length,
    });

    useImperativeHandle(ref, () => inputRef.current as HTMLInputElement);

    useEffect(() => {
      if (!isControlled) return;
      const nextValue = getSafeValue(value);
      setInnerValue(nextValue);
      setSelection((prev) => ({
        start: Math.min(prev.start, nextValue.length),
        end: Math.min(prev.end, nextValue.length),
      }));
    }, [isControlled, value]);

    const syncSelectionFromInput = () => {
      const input = inputRef.current;
      if (!input) return;

      setSelection({
        start: input.selectionStart ?? input.value.length,
        end: input.selectionEnd ?? input.value.length,
      });
    };

    const syncValueFromInput = () => {
      const input = inputRef.current;
      if (!input) return;

      setInnerValue(input.value);
      syncSelectionFromInput();
    };

    const resolveCaretIndexFromPoint = (clientX: number, clientY: number) => {
      const displayEl = displayRef.current;
      if (!displayEl) return null;

      const textLength = displayEl.textContent?.length ?? 0;

      const caretPositionFromPoint = (
        document as Document & {
          caretPositionFromPoint?: (
            x: number,
            y: number,
          ) => { offsetNode: Node; offset: number } | null;
          caretRangeFromPoint?: (
            x: number,
            y: number,
          ) => Range | null;
        }
      ).caretPositionFromPoint;

      const caretRangeFromPoint = (
        document as Document & {
          caretPositionFromPoint?: (
            x: number,
            y: number,
          ) => { offsetNode: Node; offset: number } | null;
          caretRangeFromPoint?: (
            x: number,
            y: number,
          ) => Range | null;
        }
      ).caretRangeFromPoint;

      const caretPosition = caretPositionFromPoint
        ? caretPositionFromPoint.call(document, clientX, clientY)
        : null;
      if (
        caretPosition?.offsetNode &&
        displayEl.contains(caretPosition.offsetNode)
      ) {
        return clamp(
          getTextOffsetFromNode(
            displayEl,
            caretPosition.offsetNode,
            caretPosition.offset,
          ),
          0,
          textLength,
        );
      }

      const caretRange = caretRangeFromPoint
        ? caretRangeFromPoint.call(document, clientX, clientY)
        : null;
      if (caretRange?.startContainer && displayEl.contains(caretRange.startContainer)) {
        return clamp(
          getTextOffsetFromNode(
            displayEl,
            caretRange.startContainer,
            caretRange.startOffset,
          ),
          0,
          textLength,
        );
      }

      const rect = displayEl.getBoundingClientRect();
      const midpoint = rect.left + rect.width / 2;
      return clientX <= midpoint ? 0 : textLength;
    };

    const focusProxyInput = (caretIndex?: number | null) => {
      const input = inputRef.current;
      if (!input || disabled) return;

      const previousActiveElement = document.activeElement;
      const isFocused = previousActiveElement === input;
      const nextCaretIndex =
        typeof caretIndex === 'number'
          ? clamp(caretIndex, 0, input.value.length)
          : input.value.length;

      if (!isFocused) {
        input.focus({ preventScroll: true });
      }

      if (typeof input.setSelectionRange === 'function') {
        input.setSelectionRange(nextCaretIndex, nextCaretIndex);
      }

      if (document.activeElement === input) {
        notifyInputActivated(input);
      }

      syncSelectionFromInput();
    };

    const handleWrapperMouseDown = (e: MouseEvent<HTMLDivElement>) => {
      if (disabled) return;
      if (Date.now() - lastTouchAtRef.current < 500) return;
      e.preventDefault();
      focusProxyInput(resolveCaretIndexFromPoint(e.clientX, e.clientY));
    };

    const handleWrapperTouchStart = (e: TouchEvent<HTMLDivElement>) => {
      if (disabled) return;
      lastTouchAtRef.current = Date.now();
      pendingTouchFocusRef.current = true;
      const touch = e.touches[0];
      pendingCaretIndexRef.current = touch
        ? resolveCaretIndexFromPoint(touch.clientX, touch.clientY)
        : null;
    };

    const handleWrapperTouchEnd = (e: TouchEvent<HTMLDivElement>) => {
      if (disabled || !pendingTouchFocusRef.current) return;
      pendingTouchFocusRef.current = false;
      e.preventDefault();
      const touch = e.changedTouches[0];
      const caretIndex =
        touch && pendingCaretIndexRef.current === null
          ? resolveCaretIndexFromPoint(touch.clientX, touch.clientY)
          : pendingCaretIndexRef.current;
      focusProxyInput(caretIndex);
      pendingCaretIndexRef.current = null;
    };

    const handleWrapperTouchCancel = () => {
      pendingTouchFocusRef.current = false;
      pendingCaretIndexRef.current = null;
    };

    const handleInput = (e: React.FormEvent<HTMLInputElement>) => {
      syncValueFromInput();
      onInput?.(e);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      syncValueFromInput();
      onChange?.(e);
    };

    const handleFocus = (e: FocusEvent<HTMLInputElement>) => {
      setFocused(true);
      syncSelectionFromInput();
      onFocus?.(e);
    };

    const handleBlur = (e: FocusEvent<HTMLInputElement>) => {
      setFocused(false);
      syncSelectionFromInput();
      onBlur?.(e);
    };

    const displayValue = innerValue;
    const selectionStart = Math.min(selection.start, displayValue.length);
    const selectionEnd = Math.min(selection.end, displayValue.length);

    const displayContent = useMemo(() => {
      if (!displayValue) {
        return focused ? (
          <span className="virtual-input-caret" />
        ) : (
          <span className="virtual-input-placeholder">{placeholder}</span>
        );
      }

      const before = displayValue.slice(0, selectionStart);
      const current = displayValue.slice(selectionStart, selectionEnd);
      const after = displayValue.slice(selectionEnd);
      const isCollapsed = selectionStart === selectionEnd;

      return (
        <>
          {before ? <span>{before}</span> : null}
          {isCollapsed ? (
            focused ? <span className="virtual-input-caret" /> : null
          ) : (
            <span className="virtual-input-selection">{current}</span>
          )}
          {after ? <span>{after}</span> : null}
        </>
      );
    }, [displayValue, focused, placeholder, selectionEnd, selectionStart]);

    const rootClassName = `virtual-input ${
      disabled ? 'virtual-input-disabled' : ''
    } ${focused ? 'virtual-input-focused' : ''} ${className ?? ''} ${
      wrapperClassName ?? ''
    }`.trim();

    const rootStyle = {
      ...style,
      ...wrapperStyle,
    };

    return (
      <div
        className={rootClassName}
        style={rootStyle}
        onMouseDown={handleWrapperMouseDown}
        onTouchStart={handleWrapperTouchStart}
        onTouchEnd={handleWrapperTouchEnd}
        onTouchCancel={handleWrapperTouchCancel}
      >
        {prefix ? <span className="virtual-input-affix">{prefix}</span> : null}
        <div ref={displayRef} className="virtual-input-display">
          {displayContent}
        </div>
        {suffix ? <span className="virtual-input-affix">{suffix}</span> : null}
        <input
          {...restProps}
          ref={inputRef}
          className="virtual-input-proxy"
          type={type}
          value={displayValue}
          disabled={disabled}
          data-vkb-show={restInputProps['data-vkb-show'] ?? 'true'}
          inputMode="none"
          autoComplete="off"
          autoCorrect="off"
          spellCheck={false}
          placeholder={placeholder}
          onInput={handleInput}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onKeyDown={syncSelectionFromInput}
          onKeyUp={syncSelectionFromInput}
          onSelect={syncSelectionFromInput}
          onClick={syncSelectionFromInput}
        />
      </div>
    );
  },
);

VirtualInput.displayName = 'VirtualInput';

export default VirtualInput;
