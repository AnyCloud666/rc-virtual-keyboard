import React from 'react';
import useContinuousTrigger from '../hooks/useContinuousTrigger';
import useTouchClickGuard from '../hooks/useTouchClickGuard';
import { Enter, getNumberKeys } from '../keys';
import { VKB } from '../typing';
import './style.css';

/** 数字键盘 */
const NumberKeyboard = ({
  numberKeyboardLayoutMode = 'asc',
  onClick,
  onKeyDown,
  onKeyUp,
  isKeyActive,
}: {
  numberKeyboardLayoutMode?: VKB.NumberKeyboardLayoutMode;
  onClick?: (e: VKB.KeyboardAttributeType) => void;
  onKeyDown?: (e: VKB.KeyboardAttributeType) => void;
  onKeyUp?: (e: VKB.KeyboardAttributeType) => void;
  isKeyActive?: (key: VKB.KeyboardAttributeType) => boolean;
}) => {
  const { markTouchInteraction, shouldIgnoreClick } = useTouchClickGuard();
  const numberKeys = getNumberKeys(numberKeyboardLayoutMode);
  const triggerKey = (item: VKB.KeyboardAttributeType) => {
    onKeyDown?.(item);
    onClick?.(item);
    onKeyUp?.(item);
  };

  const { startContinuousTrigger, stopContinuousTrigger } =
    useContinuousTrigger<VKB.KeyboardAttributeType>({
      onTrigger: triggerKey,
    });

  return (
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
  );
};
export default NumberKeyboard;
