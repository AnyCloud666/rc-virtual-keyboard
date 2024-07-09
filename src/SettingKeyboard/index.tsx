import React, { CSSProperties } from 'react';

import { VKB } from '../typing';
import './style.css';

import { positionKeys, themeKeys } from '../keys';
const SettingKeyboard = ({
  style,
  themeMode,
  positionMode,
  onClick,
}: {
  style: CSSProperties;
  themeMode: string;
  positionMode: string;
  onClick: (e: VKB.KeyboardAttributeType) => void;
}) => {
  return (
    <div style={style} className="setting-keyboard">
      <div className="setting-keyboard-item">
        <div>主题配置：</div>
        <div className="setting-keyboard-box">
          {themeKeys?.map((item) => {
            return (
              <div className="setting-keyboard-wrapper" key={item.keyCode}>
                <div
                  className={`setting-keyboard-box-item ${
                    item.code === themeMode
                      ? 'setting-keyboard-box-item-active'
                      : ''
                  }`}
                  onClick={() => onClick(item)}
                  title={item.description}
                >
                  {item.key}
                </div>
                <div>{item.description}</div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="setting-keyboard-item">
        <div>键盘位置：</div>
        <div className="setting-keyboard-box">
          {positionKeys?.map((item) => {
            return (
              <div className="setting-keyboard-wrapper" key={item.keyCode}>
                <div
                  className={`setting-keyboard-box-item ${
                    item.code === positionMode
                      ? 'setting-keyboard-box-item-active'
                      : ''
                  }`}
                  onClick={() => onClick(item)}
                  title={item.description}
                >
                  {item.key}
                </div>
                <div>{item.description}</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default SettingKeyboard;
