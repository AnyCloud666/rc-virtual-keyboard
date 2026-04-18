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

const getSafeValue = (value: unknown) => {
  if (typeof value === 'string') return value;
  if (typeof value === 'number') return `${value}`;
  return '';
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
    const inputRef = useRef<HTMLInputElement | null>(null);
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

    const focusProxyInput = () => {
      const input = inputRef.current;
      if (!input || disabled) return;

      input.focus({ preventScroll: true });

      const end = input.value.length;
      input.setSelectionRange(end, end);
      syncSelectionFromInput();
    };

    const handleWrapperMouseDown = (e: MouseEvent<HTMLDivElement>) => {
      if (disabled) return;
      e.preventDefault();
      focusProxyInput();
    };

    const handleWrapperTouchStart = (e: TouchEvent<HTMLDivElement>) => {
      if (disabled) return;
      e.preventDefault();
      focusProxyInput();
    };

    const handleWrapperFocus = (e: FocusEvent<HTMLDivElement>) => {
      if (e.target !== e.currentTarget) {
        return;
      }

      focusProxyInput();
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
        onFocus={handleWrapperFocus}
        tabIndex={disabled ? -1 : 0}
      >
        {prefix ? <span className="virtual-input-affix">{prefix}</span> : null}
        <div className="virtual-input-display">
          {displayContent}
        </div>
        {suffix ? <span className="virtual-input-affix">{suffix}</span> : null}
        <input
          {...restProps}
          ref={inputRef}
          className="virtual-input-proxy"
          type={type}
          value={displayValue}
          readOnly
          disabled={disabled}
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
