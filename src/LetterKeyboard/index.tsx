import React, { CSSProperties, useEffect, useState } from 'react';

import { CapsLock, EN, letterKeys, letterType, Shift, ZH } from '../keys';
import { VKB } from '../typing';
import WordTempList from '../WordTempList';
import './style.css';

/** 字母键盘 */
const LetterKeyboard = ({
  style,
  styles,
  inputMode,
  inputValue,
  words,
  onClick,
  onMouseDown,
  onChangeInputMode,
  onSelectWord,
}: {
  style?: CSSProperties;
  styles?: {
    /** 按键区域 */
    letterKeyboardArea?: CSSProperties;
    /** 单个按键 */
    letterKeyItem?: CSSProperties;
    /** 大小写切换 */
    letterCapsLockLock?: CSSProperties;
    /** 选中模式 */
    letterCapsLockLockBig?: CSSProperties;
    /** 非选中模式 */
    letterCapsLockLockSmall?: CSSProperties;
    /** 中英文切换 */
    letterShift?: CSSProperties;
    /** 选中模式 */
    letterShiftBig?: CSSProperties;
    /** 非选中模式 */
    letterShiftSmall?: CSSProperties;
  };
  words?: string[];
  inputValue?: string;
  inputMode: typeof ZH | typeof EN;
  onClick?: (e: VKB.KeyboardAttributeType) => void;
  onMouseDown?: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
  onChangeInputMode?: (mode: VKB.InputMode) => void;
  onSelectWord?: (words: string) => void;
}) => {
  const [keys, setKeys] = useState(letterKeys);

  /** 内部过滤 */
  const onClickLetter = (e: VKB.KeyboardAttributeType) => {
    if (e.code === CapsLock.code) {
      // 大小写转换
      if (e.key === '小') {
        const tempKeys = letterKeys.map((item) => {
          const tempItem = { ...item };
          if (item.keyType === letterType && typeof item.key === 'string') {
            tempItem.key = item.key.toLocaleUpperCase();
          }

          if (item.code === CapsLock.code) {
            tempItem.key = '大';
          }

          if (item.code === Shift.code) {
            tempItem.key = '英';
            onChangeInputMode && onChangeInputMode(EN);
          }

          return tempItem;
        });
        setKeys(tempKeys);
      } else {
        setKeys([...letterKeys]);
      }
    } else if (e.code === Shift.code) {
      // 中英文切换
      if (e.key === '英') {
        const tempKeys = letterKeys.map((item) => {
          const tempItem = { ...item };
          if (item.code === Shift.code) {
            tempItem.key = '中';
            onChangeInputMode && onChangeInputMode(ZH);
          }
          return tempItem;
        });
        setKeys(tempKeys);
      } else {
        setKeys([...letterKeys]);
        onChangeInputMode && onChangeInputMode('en');
      }
    }

    onClick && onClick(e);
  };

  useEffect(() => {
    if (inputMode === 'zh') {
      const tempKeys = letterKeys.map((item) => {
        const tempItem = { ...item };
        if (item.code === Shift.code) {
          tempItem.key = '中';
        }
        return tempItem;
      });
      setKeys(tempKeys);
    }
  }, []);

  return (
    <div style={style} className="letter-keyboard" onMouseDown={onMouseDown}>
      {inputMode === ZH && inputValue && (
        <WordTempList
          words={words}
          inputValue={inputValue}
          onSelectWord={onSelectWord}
        />
      )}

      <div style={styles?.letterKeyboardArea} className="letter-keyboard-area">
        {keys.map((item) => {
          return (
            <div
              style={styles?.letterKeyItem}
              className="letter-key-item"
              title={item.description}
              key={item.keyCode}
              onClick={() => onClickLetter(item)}
            >
              {item.code === 'CapsLock' ? (
                <div
                  style={styles?.letterCapsLockLock}
                  className="letter-caps-lock"
                >
                  <span
                    style={styles?.letterCapsLockLockBig}
                    className="letter-caps-lock-big"
                  >
                    {item.key}
                  </span>
                  /
                  <span
                    style={styles?.letterCapsLockLockSmall}
                    className="letter-caps-lock-small"
                  >
                    {item.key === '大' ? '小' : '大'}
                  </span>
                </div>
              ) : // item.key
              item.code === 'Shift' ? (
                <div style={styles?.letterShift} className="letter-shift">
                  <span
                    style={styles?.letterShiftBig}
                    className="letter-shift-big"
                  >
                    {item.key}
                  </span>
                  /
                  <span
                    style={styles?.letterShiftSmall}
                    className="letter-shift-small"
                  >
                    {item.key === '英' ? '中' : '英'}
                  </span>
                </div>
              ) : (
                item.key
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
export default LetterKeyboard;
