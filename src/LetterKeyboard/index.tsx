import React, { useEffect, useRef, useState } from 'react';
import useContinuousTrigger from '../hooks/useContinuousTrigger';
import useTouchClickGuard from '../hooks/useTouchClickGuard';
import CandidateBar from '../lib/CandidateBar';

import {
  CapsLock,
  EN,
  Enter,
  letterKeys,
  letterType,
  Shift,
  ZH,
} from '../keys';
import { VKB } from '../typing';
import './style.css';

/** 字母键盘 */
const LetterKeyboard = ({
  inputMode,
  inputValue,
  chinese,
  onClick,
  onMouseDown,
  onChangeInputMode,
  onSelectChinese,
  onKeyDown,
  onKeyUp,
  isKeyActive,
  capsLockActive = false,
}: {
  chinese?: string[];
  inputValue?: string;
  inputMode: typeof ZH | typeof EN;
  onMouseDown?: (
    e:
      | React.MouseEvent<HTMLDivElement, MouseEvent>
      | React.TouchEvent<HTMLDivElement>,
  ) => void;
  onClick?: (e: VKB.KeyboardAttributeType) => void;
  onChangeInputMode?: (mode: VKB.InputMode) => void;
  onSelectChinese?: (chinese: string) => void;
  onKeyDown?: (e: VKB.KeyboardAttributeType) => void;
  onKeyUp?: (e: VKB.KeyboardAttributeType) => void;
  isKeyActive?: (key: VKB.KeyboardAttributeType) => boolean;
  capsLockActive?: boolean;
}) => {
  const createLetterKeys = (nextInputMode: VKB.InputMode, capsLock = false) => {
    return letterKeys.map((item) => {
      const tempItem = { ...item };

      if (item.keyType === letterType && typeof item.key === 'string') {
        tempItem.key = capsLock
          ? item.key.toLocaleUpperCase()
          : item.key.toLocaleLowerCase();
      }

      if (item.code === CapsLock.code) {
        tempItem.renderKey = capsLock ? '大' : '小';
      }

      if (item.code === Shift.code) {
        tempItem.renderKey = nextInputMode === ZH ? '中' : '英';
      }

      return tempItem;
    });
  };

  const [keys, setKeys] = useState(() =>
    createLetterKeys(inputMode, capsLockActive),
  );
  const pointerTriggeredRef = useRef<{
    code: string;
    at: number;
  } | null>(null);
  const { markTouchInteraction, shouldIgnoreClick } = useTouchClickGuard();

  /** 统一触发按键事件 */
  const triggerKey = (item: VKB.KeyboardAttributeType) => {
    onKeyDown?.(item);
    onClickLetter(item);
    onKeyUp?.(item);
  };

  const { startContinuousTrigger, stopContinuousTrigger } =
    useContinuousTrigger<VKB.KeyboardAttributeType>({
      onTrigger: triggerKey,
    });

  /** 内部过滤 */
  const onClickLetter = (e: VKB.KeyboardAttributeType) => {
    if (e.code === CapsLock.code) {
      setKeys(createLetterKeys(EN, e.renderKey === '小'));
      onChangeInputMode && onChangeInputMode(EN);
    } else if (e.code === Shift.code) {
      const nextMode = e.renderKey === '英' ? ZH : EN;

      setKeys(createLetterKeys(nextMode, capsLockActive));
      onChangeInputMode && onChangeInputMode(nextMode);
    }

    onClick && onClick(e);
  };

  useEffect(() => {
    setKeys(createLetterKeys(inputMode, capsLockActive));
  }, [capsLockActive, inputMode]);

  return (
    <div
      className="letter-keyboard"
      onMouseDown={onMouseDown}
      onTouchStart={onMouseDown}
    >
      <CandidateBar
        tempValue={inputValue}
        items={chinese}
        onSelectItem={(item) => {
          onSelectChinese?.(item);
        }}
      />

      <div className="letter-keyboard-area">
        {keys.map((item) => {
          const isRepeatableKey = ![
            CapsLock.code,
            Shift.code,
            Enter.code,
          ].includes(item.code);

          return (
            <div
              className={`letter-key-item ${
                isKeyActive?.(item) ? 'letter-key-item-active' : ''
              }`}
              title={item.description}
              key={item.keyCode}
              onClick={() => {
                if (shouldIgnoreClick()) return;
                const recentPointerTrigger = pointerTriggeredRef.current;
                const shouldSkipClick =
                  !!recentPointerTrigger &&
                  recentPointerTrigger.code === item.code &&
                  Date.now() - recentPointerTrigger.at < 250;

                if (shouldSkipClick) {
                  pointerTriggeredRef.current = null;
                  return;
                }

                if (!isRepeatableKey) {
                  triggerKey(item);
                  return;
                }

                triggerKey(item);
              }}
              onMouseDown={(e) => {
                if (!isRepeatableKey) return;

                e.preventDefault();
                pointerTriggeredRef.current = {
                  code: item.code,
                  at: Date.now(),
                };
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

                pointerTriggeredRef.current = {
                  code: item.code,
                  at: Date.now(),
                };
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
              {item.code === 'CapsLock' ? (
                <div className="letter-caps-lock">
                  <span className="letter-caps-lock-big">
                    {item.renderKey || item.key}
                  </span>
                  /
                  <span className="letter-caps-lock-small">
                    {item.renderKey === '大' ? '小' : '大'}
                  </span>
                </div>
              ) : // item.key
              item.code === 'Shift' ? (
                <div className="letter-shift">
                  <span className="letter-shift-big">
                    {item.renderKey || item.key}
                  </span>
                  /
                  <span className="letter-shift-small">
                    {item.renderKey === '英' ? '中' : '英'}
                  </span>
                </div>
              ) : (
                item.renderKey || item.key
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
export default LetterKeyboard;
