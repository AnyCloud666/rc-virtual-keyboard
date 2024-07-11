import React, { CSSProperties, useRef } from 'react';

import { ReactComponent as LeftSvg } from '../svg/left.svg';
import { ReactComponent as RightSvg } from '../svg/right.svg';

import './style.css';

const WordTempList = ({
  words,
  style,
  styles,
  inputValue,
  onSelectWord,
}: {
  words?: string[];
  inputValue?: string;
  style?: CSSProperties;
  styles?: {
    wordKeyboardTempValue?: CSSProperties;
    wordKeyboardTempLeft?: CSSProperties;
    wordKeyboardTempRight?: CSSProperties;
    wordKeyboardTempList?: CSSProperties;
    wordKeyboardTempChar?: CSSProperties;
  };
  onSelectWord?: (word: string) => void;
}) => {
  /** 临时输入区引用 */
  const tempInputAreaRef = useRef<HTMLDivElement | null>(null);

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

  return (
    <div style={style} className="word-keyboard-temp">
      {inputValue ? (
        <div
          style={styles?.wordKeyboardTempValue}
          className="word-keyboard-temp-value"
        >
          {inputValue}
        </div>
      ) : (
        ''
      )}

      <div
        style={styles?.wordKeyboardTempLeft}
        className="word-keyboard-temp-left"
        onClick={() => onMore('minus')}
      >
        <LeftSvg />
      </div>
      <div
        style={styles?.wordKeyboardTempList}
        className="word-keyboard-temp-list"
        ref={tempInputAreaRef}
      >
        {words?.map((item, index) => {
          return (
            <div
              key={index}
              style={styles?.wordKeyboardTempChar}
              className="word-keyboard-temp-char"
              onClick={() => onSelectWord && onSelectWord(item)}
            >
              {item}
            </div>
          );
        })}
      </div>
      <div
        style={styles?.wordKeyboardTempRight}
        className="word-keyboard-temp-right"
        onClick={() => onMore('add')}
      >
        <RightSvg />
      </div>
    </div>
  );
};
export default WordTempList;
