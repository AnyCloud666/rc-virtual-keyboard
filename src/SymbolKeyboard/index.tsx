import React, { CSSProperties, useState } from 'react';
import { Backspace, Enter, symbolKeys } from '../keys';
import { ReactComponent as DeleteSvg } from '../svg/delete.svg';
import { ReactComponent as EnterSvg } from '../svg/enter.svg';
import { VKB } from '../typing';
import './style.css';

const SymbolKeyboard = ({
  style,
  styles,
  onClick,
  onMouseDown = (e) => e.preventDefault(),
}: {
  style?: CSSProperties;
  styles?: {
    symbolKeyTab?: CSSProperties;
    symbolKeyTabItem?: CSSProperties;
    symbolKeyContent?: CSSProperties;
    symbolKeyItem?: CSSProperties;
    symbolKeyItemTips?: CSSProperties;
  };
  onClick?: (e: VKB.KeyboardAttributeType) => void;
  onMouseDown?: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
}) => {
  const [activeSymbol, setActiveSymbol] = useState(symbolKeys[0]);

  return (
    <div style={style} className="symbol-keyboard" onMouseDown={onMouseDown}>
      <div style={styles?.symbolKeyTab} className="symbol-key-tab">
        {symbolKeys.map((item) => {
          return (
            <div
              style={styles?.symbolKeyTabItem}
              className={`symbol-key-tab-item ${
                activeSymbol.id === item.id ? 'symbol-key-tab-item-active' : ''
              }`}
              key={item.id}
              onClick={() => setActiveSymbol(item)}
            >
              {item.label}
            </div>
          );
        })}
      </div>
      <div style={styles?.symbolKeyContent} className="symbol-key-content">
        {activeSymbol.value.map((item) => {
          return (
            <div
              key={item.keyCode}
              style={styles?.symbolKeyItem}
              className="symbol-key-item"
              onClick={() => onClick && onClick(item)}
            >
              {item.key}
              <span
                style={styles?.symbolKeyItemTips}
                className="symbol-key-item-tips"
              >
                {(typeof activeSymbol.label === 'string' &&
                  activeSymbol.label?.slice(0, 1)) ??
                  ''}
              </span>
            </div>
          );
        })}
      </div>
      <div className="symbol-key-control">
        <div
          className="symbol-key-control-delete"
          onClick={() => onClick && onClick(Backspace)}
        >
          <DeleteSvg />
        </div>
        <div
          className="symbol-key-control-enter"
          onClick={() => onClick && onClick(Enter)}
        >
          <EnterSvg />
        </div>
      </div>
    </div>
  );
};

export default SymbolKeyboard;
