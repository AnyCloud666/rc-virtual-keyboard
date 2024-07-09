import React, { CSSProperties } from 'react';
import { numberKeys } from '../keys';
import { VKB } from '../typing';
import './style.css';

/** 数字键盘 */
const NumberKeyboard = ({
  style,
  onClick,
}: {
  style?: CSSProperties;
  onClick?: (e: VKB.KeyboardAttributeType) => void;
}) => {
  return (
    <div style={style} className="number-keyboard">
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
