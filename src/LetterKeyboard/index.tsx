import React, { CSSProperties, useEffect, useRef, useState } from 'react';

import { ReactComponent as LeftSvg } from '../svg/left.svg';
import { ReactComponent as RightSvg } from '../svg/right.svg';

import { CapsLock, EN, letterKeys, letterType, Shift, ZH } from '../keys';
import { VKB } from '../typing';
import './style.css';

/** 字母键盘 */
const LetterKeyboard = ({
  style,
  styles,
  inputMode,
  inputValue,
  chinese,
  onClick,
  onMouseDown,
  onChangeInputMode,
  onSelectChinese,
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
    /** 输入法区域 */
    letterKeyboardTemp?: CSSProperties;
    /** 当前输入的拼音 */
    letterKeyboardTempPinyin?: CSSProperties;
    /** 向左选择 */
    letterKeyboardTempLeft?: CSSProperties;
    /** 向右选择 */
    letterKeyboardTempRight?: CSSProperties;
    /** 拼音转中文的列表 */
    letterKeyboardTempList?: CSSProperties;
    /** 拼音转中文的单个汉字 */
    letterKeyboardTempChar?: CSSProperties;
  };
  chinese?: string[];
  inputValue?: string;
  inputMode: typeof ZH | typeof EN;
  onClick?: (e: VKB.KeyboardAttributeType) => void;
  onMouseDown?: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
  onChangeInputMode?: (mode: VKB.InputMode) => void;
  onSelectChinese?: (chinese: string) => void;
}) => {
  /** 临时输入区引用 */
  const tempInputAreaRef = useRef<HTMLDivElement | null>(null);

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
        <div
          style={styles?.letterKeyboardTemp}
          className="letter-keyboard-temp"
        >
          <div
            style={styles?.letterKeyboardTempPinyin}
            className="letter-keyboard-temp-pinyin"
          >
            {inputValue}
          </div>
          <div
            style={styles?.letterKeyboardTempLeft}
            className="letter-keyboard-temp-left"
            onClick={() => onMore('minus')}
          >
            <LeftSvg />
          </div>
          <div
            style={styles?.letterKeyboardTempList}
            className="letter-keyboard-temp-list"
            ref={tempInputAreaRef}
          >
            {chinese?.map((item, index) => {
              return (
                <div
                  key={index}
                  style={styles?.letterKeyboardTempChar}
                  className="letter-keyboard-temp-char"
                  onClick={() => onSelectChinese && onSelectChinese(item)}
                >
                  {item}
                </div>
              );
            })}
          </div>
          <div
            style={styles?.letterKeyboardTempRight}
            className="letter-keyboard-temp-right"
            onClick={() => onMore('add')}
          >
            <RightSvg />
          </div>
        </div>
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
