import React, { useEffect, useState } from 'react';
import { CapsLock, EN, letterKeys, letterType, Shift, ZH } from '../keys';
import { VKB } from '../typing';
import './style.css';

/** 字母键盘 */
const LetterKeyboard = ({
  inputMode,
  onClick,
  onChangeInputMode,
}: {
  inputMode: typeof ZH | typeof EN;
  onClick?: (e: VKB.KeyboardAttributeType) => void;
  onChangeInputMode?: (mode: string) => void;
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
    <div className="letter-keyboard">
      {keys.map((item) => {
        return (
          <div
            className="letter-key-item"
            title={item.description}
            key={item.keyCode}
            onClick={() => onClickLetter(item)}
          >
            {item.code === 'CapsLock' ? (
              <div className="letter-caps-lock">
                <span className="letter-caps-lock-big"> {item.key}</span>/
                <span className="letter-caps-lock-small">
                  {item.key === '大' ? '小' : '大'}
                </span>
              </div>
            ) : // item.key
            item.code === 'Shift' ? (
              <div className="letter-shift">
                <span className="letter-shift-big">{item.key}</span>/
                <span className="letter-shift-small">
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
  );
};
export default LetterKeyboard;
