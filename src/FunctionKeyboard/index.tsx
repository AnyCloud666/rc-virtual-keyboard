import React from 'react';
import useTouchClickGuard from '../hooks/useTouchClickGuard';
import { functionKeys } from '../keys';
import { VKB } from '../typing';
import './style.css';

/** 功能键盘 */
const FunctionKeyboard = ({
  onClick,
  onKeyDown,
  onKeyUp,
  isKeyActive,
}: {
  onClick?: (e: VKB.KeyboardAttributeType) => void;
  onKeyDown?: (e: VKB.KeyboardAttributeType) => void;
  onKeyUp?: (e: VKB.KeyboardAttributeType) => void;
  isKeyActive?: (key: VKB.KeyboardAttributeType) => boolean;
}) => {
  const { markTouchInteraction, shouldIgnoreClick } = useTouchClickGuard();

  const triggerKey = (item: VKB.KeyboardAttributeType) => {
    onKeyDown?.(item);
    onClick?.(item);
    onKeyUp?.(item);
  };

  return (
    <div className="function-keyboard">
      {functionKeys.map((item) => (
        <div
          className={`function-key-item ${
            isKeyActive?.(item) ? 'function-key-item-active' : ''
          }`}
          key={item.keyCode}
          onClick={() => {
            if (shouldIgnoreClick()) return;
            triggerKey(item);
          }}
          onMouseDown={(e) => {
            e.preventDefault();
          }}
          onTouchStart={(e) => {
            e.preventDefault();
            markTouchInteraction();
            triggerKey(item);
          }}
        >
          {item.renderKey || item.key}
        </div>
      ))}
    </div>
  );
};

export default FunctionKeyboard;
