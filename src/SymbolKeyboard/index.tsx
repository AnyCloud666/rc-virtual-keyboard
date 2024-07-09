import React, { CSSProperties, useState } from 'react';
import { symbolKeys } from '../keys';
import { VKB } from '../typing';
import './style.css';

const SymbolKeyboard = ({
  style,
  onClick,
}: {
  style: CSSProperties;
  onClick: (e: VKB.KeyboardAttributeType) => void;
}) => {
  const [activeSymbol, setActiveSymbol] = useState(symbolKeys[0]);

  return (
    <div style={style} className="symbol-keyboard">
      <div className="symbol-key-tab">
        {symbolKeys.map((item) => {
          return (
            <div
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
      <div className="symbol-key-content">
        {activeSymbol.value.map((item) => {
          return (
            <div
              className="symbol-key-item"
              key={item.keyCode}
              onClick={() => onClick(item)}
            >
              {item.key}
              <span className="symbol-key-item-tips">
                {(typeof activeSymbol.label === 'string' &&
                  activeSymbol.label?.slice(0, 1)) ??
                  ''}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SymbolKeyboard;
