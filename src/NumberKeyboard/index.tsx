import React from 'react';
import useContinuousTrigger from '../hooks/useContinuousTrigger';
import { Enter, numberKeys } from '../keys';
import { VKB } from '../typing';
import './style.css';

/** 数字键盘 */
const NumberKeyboard = ({
  onClick,
  onKeyDown,
  onKeyUp,
}: {
  onClick?: (e: VKB.KeyboardAttributeType) => void;
  onKeyDown?: (e: VKB.KeyboardAttributeType) => void;
  onKeyUp?: (e: VKB.KeyboardAttributeType) => void;
}) => {
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
            className="number-key-item"
            key={item.keyCode}
            onClick={() => {
              if (!isRepeatableKey) {
                triggerKey(item);
              }
            }}
            onMouseDown={(e) => {
              if (!isRepeatableKey) return;

              e.preventDefault();
              startContinuousTrigger(item);
            }}
            onMouseUp={() => {
              if (!isRepeatableKey) return;

              stopContinuousTrigger();
            }}
            onMouseLeave={() => {
              if (!isRepeatableKey) return;

              stopContinuousTrigger();
            }}
            onTouchStart={(e) => {
              if (!isRepeatableKey) return;

              e.preventDefault();
              startContinuousTrigger(item);
            }}
            onTouchEnd={() => {
              if (!isRepeatableKey) return;

              stopContinuousTrigger();
            }}
            onTouchCancel={() => {
              if (!isRepeatableKey) return;

              stopContinuousTrigger();
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
