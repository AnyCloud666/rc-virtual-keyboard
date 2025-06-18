import React, { useEffect, useRef, useState } from 'react';

import { ReactComponent as LeftSvg } from '../svg/left.svg';
import { ReactComponent as RightSvg } from '../svg/right.svg';

import { CapsLock, EN, letterKeys, letterType, Shift, ZH } from '../keys';
import { VKB } from '../typing';
import './style.css';

/** 字母键盘 */
const LetterKeyboard = ({
  inputMode,
  inputValue,
  chinese,
  onClick,
  onMouseDown,
  onChangeInputMode,
  onSelectChinese,
  onKeyDown,
  onKeyUp,
}: {
  chinese?: string[];
  inputValue?: string;
  inputMode: typeof ZH | typeof EN;
  onClick?: (e: VKB.KeyboardAttributeType) => void;
  onMouseDown?: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
  onChangeInputMode?: (mode: VKB.InputMode) => void;
  onSelectChinese?: (chinese: string) => void;
  onKeyDown?: (e: VKB.KeyboardAttributeType) => void;
  onKeyUp?: (e: VKB.KeyboardAttributeType) => void;
}) => {
  /** 临时输入区引用 */
  const tempInputAreaRef = useRef<HTMLDivElement | null>(null);

  const [keys, setKeys] = useState(letterKeys);

  /** 内部过滤 */
  const onClickLetter = (e: VKB.KeyboardAttributeType) => {
    if (e.code === CapsLock.code) {
      // 大小写转换
      if (e.renderKey === '小') {
        const tempKeys = letterKeys.map((item) => {
          const tempItem = { ...item };
          if (item.keyType === letterType && typeof item.key === 'string') {
            tempItem.key = item.key.toLocaleUpperCase();
          }

          if (item.code === CapsLock.code) {
            tempItem.renderKey = '大';
          }

          if (item.code === Shift.code) {
            tempItem.renderKey = '英';
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
      if (e.renderKey === '英') {
        const tempKeys = letterKeys.map((item) => {
          const tempItem = { ...item };
          if (item.code === Shift.code) {
            tempItem.renderKey = '中';
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

  /** 翻页 */
  const onMore = (type: string) => {
    if (tempInputAreaRef.current) {
      const width = tempInputAreaRef.current.offsetWidth;
      tempInputAreaRef.current.scrollTo({
        left:
          tempInputAreaRef.current.scrollLeft +
          (type === 'add' ? width : -width) / 10,
        behavior: 'smooth',
      });
    }
  };

  useEffect(() => {
    if (inputMode === 'zh') {
      const tempKeys = letterKeys.map((item) => {
        const tempItem = { ...item };
        if (item.code === Shift.code) {
          tempItem.renderKey = '中';
        }
        return tempItem;
      });
      setKeys(tempKeys);
    }
  }, []);

  return (
    <div className="letter-keyboard" onMouseDown={onMouseDown}>
      {inputMode === ZH && inputValue && (
        <div className="letter-keyboard-temp">
          <div className="letter-keyboard-temp-pinyin">{inputValue}</div>
          <div
            className="letter-keyboard-temp-left"
            onClick={() => onMore('minus')}
          >
            <LeftSvg />
          </div>
          <div className="letter-keyboard-temp-list" ref={tempInputAreaRef}>
            {chinese?.map((item, index) => {
              return (
                <div
                  key={index}
                  className="letter-keyboard-temp-char"
                  onClick={() => onSelectChinese && onSelectChinese(item)}
                >
                  {item}
                </div>
              );
            })}
          </div>
          <div
            className="letter-keyboard-temp-right"
            onClick={() => onMore('add')}
          >
            <RightSvg />
          </div>
        </div>
      )}

      <div className="letter-keyboard-area">
        {keys.map((item) => {
          return (
            <div
              className="letter-key-item"
              title={item.description}
              key={item.keyCode}
              onClick={() => {
                onKeyDown?.(item);
                onClickLetter(item);
                onKeyUp?.(item);
              }}
            >
              {item.code === 'CapsLock' ? (
                <div className="letter-caps-lock">
                  <span className="letter-caps-lock-big">
                    {item.renderKey || item.key}
                  </span>
                  /
                  <span className="letter-caps-lock-small">
                    {item.renderKey === '大' ? '小' : '大'}
                  </span>
                </div>
              ) : // item.key
              item.code === 'Shift' ? (
                <div className="letter-shift">
                  <span className="letter-shift-big">
                    {item.renderKey || item.key}
                  </span>
                  /
                  <span className="letter-shift-small">
                    {item.renderKey === '英' ? '中' : '英'}
                  </span>
                </div>
              ) : (
                item.renderKey || item.key
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
export default LetterKeyboard;
