import React, { CSSProperties } from 'react';
import { numberKeys } from '../keys';
import { VKB } from '../typing';
import './style.css';

/** 数字键盘 */
const NumberKeyboard = ({
  style,
  styles,
  onClick,
  onMouseDown = (e) => e.preventDefault(),
}: {
  style?: CSSProperties;
  styles?: {
    /** 单个按键样式 */
    numberKeyItem?: CSSProperties;
  };
  onClick?: (e: VKB.KeyboardAttributeType) => void;
  onMouseDown?: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
}) => {
  return (
    <div style={style} className="number-keyboard" onMouseDown={onMouseDown}>
      {numberKeys.map((item) => {
        return (
          <div
            style={styles?.numberKeyItem}
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
