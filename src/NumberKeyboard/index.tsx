import React from 'react';
import { numberKeys } from '../keys';
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
  return (
    <div className="number-keyboard">
      {numberKeys.map((item) => {
        return (
          <div
            className="number-key-item"
            key={item.keyCode}
            onClick={() => {
              onKeyDown?.(item);
              onClick?.(item);
              onKeyUp?.(item);
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
