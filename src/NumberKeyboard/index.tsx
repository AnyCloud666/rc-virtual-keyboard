import React from 'react';
import { numberKeys } from '../keys';
import { VKB } from '../typing';
import './style.css';

/** 数字键盘 */
const NumberKeyboard = ({
  onClick,
}: {
  onClick?: (e: VKB.KeyboardAttributeType) => void;
}) => {
  return (
    <div className="number-keyboard">
      {numberKeys.map((item) => {
        return (
          <div
            className="number-key-item"
            key={item.keyCode}
            onClick={() => onClick && onClick(item)}
          >
            {item.key}
          </div>
        );
      })}
    </div>
  );
};
export default NumberKeyboard;
