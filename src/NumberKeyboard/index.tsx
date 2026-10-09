import React, { useMemo, useState } from 'react';
import CandidateBar from '../lib/CandidateBar';
import useContinuousTrigger from '../hooks/useContinuousTrigger';
import useTouchClickGuard from '../hooks/useTouchClickGuard';
import { Backspace, Enter, getNumberKeys } from '../keys';
import { VKB } from '../typing';
import './style.css';

const isCalculatorToken = (key: string) => /^[0-9.+\-*/%]$/.test(key);
const hasCalculatorOperator = (value: string) => /[+\-*/%]/.test(value);
const trimTrailingOperators = (value: string) => value.replace(/[+\-*/%.]+$/g, '');

const normalizeCalculatorExpression = (value: string) => {
  return value
    .replace(/%/g, '/100')
    .replace(/÷/g, '/')
    .replace(/×/g, '*');
};

const evaluateCalculatorExpression = (value: string) => {
  if (!value) return '';

  const effectiveValue = trimTrailingOperators(value);
  if (!effectiveValue || !hasCalculatorOperator(effectiveValue)) {
    return '';
  }

  const normalized = normalizeCalculatorExpression(effectiveValue);
  if (!/^[0-9+\-*/.()%\s]+$/.test(value)) {
    return '';
  }

  if (/[*+/%.-]{2,}$/.test(normalized)) {
    return '';
  }

  try {
    const result = Function(`"use strict"; return (${normalized});`)();

    if (typeof result !== 'number' || !Number.isFinite(result)) {
      return '';
    }

    return `${result}`;
  } catch (error) {
    return '';
  }
};

/** 数字键盘 */
const NumberKeyboard = ({
  numberKeyboardLayoutMode = 'asc',
  inputValue,
  chinese,
  onSelectChinese,
  onMouseDown,
  onClick,
  onKeyDown,
  onKeyUp,
  isKeyActive,
}: {
  numberKeyboardLayoutMode?: VKB.NumberKeyboardLayoutMode;
  inputValue?: string;
  chinese?: string[];
  onSelectChinese?: (
    chinese: string,
    appendText?: string,
    options?: { replaceText?: string },
  ) => void;
  onMouseDown?: (
    e:
      | React.MouseEvent<HTMLDivElement, MouseEvent>
      | React.TouchEvent<HTMLDivElement>,
  ) => void;
  onClick?: (e: VKB.KeyboardAttributeType) => void;
  onKeyDown?: (e: VKB.KeyboardAttributeType) => void;
  onKeyUp?: (e: VKB.KeyboardAttributeType) => void;
  isKeyActive?: (key: VKB.KeyboardAttributeType) => boolean;
}) => {
  const { markTouchInteraction, shouldIgnoreClick } = useTouchClickGuard();
  const numberKeys = getNumberKeys(numberKeyboardLayoutMode);
  const [calculatorExpression, setCalculatorExpression] = useState('');
  const calculatorResult = useMemo(
    () => evaluateCalculatorExpression(calculatorExpression),
    [calculatorExpression],
  );
  const calculatorPreviewExpression = useMemo(
    () => trimTrailingOperators(calculatorExpression),
    [calculatorExpression],
  );
  const shouldShowCalculatorCandidate =
    hasCalculatorOperator(calculatorExpression) && !!calculatorResult;

  const handleCalculatorInput = (item: VKB.KeyboardAttributeType) => {
    if (item.code === Backspace.code) {
      setCalculatorExpression((prev) => prev.slice(0, -1));
      return;
    }

    if (item.code === Enter.code) {
      if (calculatorResult) {
        setCalculatorExpression(calculatorResult);
      }
      return;
    }

    if (typeof item.key === 'string' && isCalculatorToken(item.key)) {
      setCalculatorExpression((prev) => `${prev}${item.key}`);
    }
  };

  const triggerKey = (item: VKB.KeyboardAttributeType) => {
    handleCalculatorInput(item);
    onKeyDown?.(item);
    onClick?.(item);
    onKeyUp?.(item);
  };

  const { startContinuousTrigger, stopContinuousTrigger } =
    useContinuousTrigger<VKB.KeyboardAttributeType>({
      onTrigger: triggerKey,
    });

  return (
    <div className="number-keyboard-shell" onMouseDown={onMouseDown} onTouchStart={onMouseDown}>
      <CandidateBar
        tempValue={undefined}
        items={
          shouldShowCalculatorCandidate
            ? [
                calculatorResult,
                `${calculatorPreviewExpression}=${calculatorResult}`,
              ]
            : []
        }
        onSelectItem={(item) => {
          setCalculatorExpression(item);
          onSelectChinese?.(item, '', {
            replaceText: calculatorExpression,
          });
        }}
      />
      <div className="number-keyboard">
        {numberKeys.map((item) => {
          const isRepeatableKey = item.code !== Enter.code;

          return (
            <div
              className={`number-key-item ${
                isKeyActive?.(item) ? 'number-key-item-active' : ''
              }`}
              key={item.keyCode}
              onClick={() => {
                if (shouldIgnoreClick()) return;
                if (!isRepeatableKey) {
                  triggerKey(item);
                }
              }}
              onMouseDown={(e) => {
                if (!isRepeatableKey) return;

                e.preventDefault();
                startContinuousTrigger(item, 'mouse');
              }}
              onMouseUp={() => {
                if (!isRepeatableKey) return;

                stopContinuousTrigger('mouse');
              }}
              onMouseLeave={() => {
                if (!isRepeatableKey) return;

                stopContinuousTrigger('mouse');
              }}
              onTouchStart={(e) => {
                e.preventDefault();
                markTouchInteraction();
                if (!isRepeatableKey) {
                  triggerKey(item);
                  return;
                }

                startContinuousTrigger(item, 'touch');
              }}
              onTouchEnd={() => {
                if (!isRepeatableKey) return;

                stopContinuousTrigger('touch');
              }}
              onTouchCancel={() => {
                if (!isRepeatableKey) return;

                stopContinuousTrigger('touch');
              }}
            >
              {item.renderKey || item.key}
            </div>
          );
        })}
      </div>
    </div>
  );
};
export default NumberKeyboard;
