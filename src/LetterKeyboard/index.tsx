import React, { useCallback, useEffect, useRef, useState } from 'react';
import useContinuousTrigger from '../hooks/useContinuousTrigger';
import useHorizontalDragScroll from '../hooks/useHorizontalDragScroll';
import useTouchClickGuard from '../hooks/useTouchClickGuard';

import { ReactComponent as LeftSvg } from '../svg/left.svg';
import { ReactComponent as RightSvg } from '../svg/right.svg';

import {
  CapsLock,
  EN,
  Enter,
  letterKeys,
  letterType,
  Shift,
  ZH,
} from '../keys';
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
  isKeyActive,
  capsLockActive = false,
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
  isKeyActive?: (key: VKB.KeyboardAttributeType) => boolean;
  capsLockActive?: boolean;
}) => {
  /** 临时输入区引用 */
  const tempInputAreaRef = useRef<HTMLDivElement | null>(null);
  /** 连续滚动延迟定时器 */
  const scrollDelayTimerRef = useRef<number>();
  /** 连续滚动动画帧 */
  const scrollFrameRef = useRef<number>();
  /** 是否已经进入长按连续滚动 */
  const isContinuousScrollingRef = useRef(false);
  /** 当前连续滚动方向 */
  const scrollDirectionRef = useRef<'add' | 'minus' | null>(null);
  /** 上一次连续滚动时间戳 */
  const lastScrollTimeRef = useRef(0);

  const createLetterKeys = (nextInputMode: VKB.InputMode, capsLock = false) => {
    return letterKeys.map((item) => {
      const tempItem = { ...item };

      if (item.keyType === letterType && typeof item.key === 'string') {
        tempItem.key = capsLock
          ? item.key.toLocaleUpperCase()
          : item.key.toLocaleLowerCase();
      }

      if (item.code === CapsLock.code) {
        tempItem.renderKey = capsLock ? '大' : '小';
      }

      if (item.code === Shift.code) {
        tempItem.renderKey = nextInputMode === ZH ? '中' : '英';
      }

      return tempItem;
    });
  };

  const [keys, setKeys] = useState(() =>
    createLetterKeys(inputMode, capsLockActive),
  );
  const { markTouchInteraction, shouldIgnoreClick } = useTouchClickGuard();
  const dragScroll = useHorizontalDragScroll(tempInputAreaRef);

  /** 统一触发按键事件 */
  const triggerKey = (item: VKB.KeyboardAttributeType) => {
    onKeyDown?.(item);
    onClickLetter(item);
    onKeyUp?.(item);
  };

  const { startContinuousTrigger, stopContinuousTrigger } =
    useContinuousTrigger<VKB.KeyboardAttributeType>({
      onTrigger: triggerKey,
    });

  /** 内部过滤 */
  const onClickLetter = (e: VKB.KeyboardAttributeType) => {
    if (e.code === CapsLock.code) {
      setKeys(createLetterKeys(EN, e.renderKey === '小'));
      onChangeInputMode && onChangeInputMode(EN);
    } else if (e.code === Shift.code) {
      const nextMode = e.renderKey === '英' ? ZH : EN;

      setKeys(createLetterKeys(nextMode, capsLockActive));
      onChangeInputMode && onChangeInputMode(nextMode);
    }

    onClick && onClick(e);
  };

  /** 翻页 */
  const onMore = (
    type: 'add' | 'minus',
    behavior: ScrollBehavior = 'smooth',
    distance?: number,
  ) => {
    if (tempInputAreaRef.current) {
      const width = tempInputAreaRef.current.offsetWidth;
      const offset = distance ?? width / 10;
      tempInputAreaRef.current.scrollTo({
        left:
          tempInputAreaRef.current.scrollLeft +
          (type === 'add' ? offset : -offset),
        behavior,
      });
    }
  };

  /** 停止连续滚动 */
  const stopContinuousScroll = useCallback((shouldKeepSingleStep = true) => {
    window.clearTimeout(scrollDelayTimerRef.current);
    if (typeof scrollFrameRef.current === 'number') {
      window.cancelAnimationFrame(scrollFrameRef.current);
    }

    if (shouldKeepSingleStep && !isContinuousScrollingRef.current) {
      const direction = scrollDirectionRef.current;
      if (direction) {
        onMore(direction, 'smooth');
      }
    }

    isContinuousScrollingRef.current = false;
    scrollDirectionRef.current = null;
    lastScrollTimeRef.current = 0;
  }, []);

  /** 开始连续滚动，短按单次平滑滚动，长按持续匀速滚动 */
  const startContinuousScroll = (type: 'add' | 'minus') => {
    stopContinuousScroll(false);
    scrollDirectionRef.current = type;

    scrollDelayTimerRef.current = window.setTimeout(() => {
      isContinuousScrollingRef.current = true;
      lastScrollTimeRef.current = 0;

      const step = (timestamp: number) => {
        if (!lastScrollTimeRef.current) {
          lastScrollTimeRef.current = timestamp;
        }

        const delta = timestamp - lastScrollTimeRef.current;

        if (delta > 0) {
          // 长按时改为像素级匀速滚动，避免大步进造成“跳着走”的卡顿感。
          const distance = Math.max(1, Math.round((delta / 16) * 1.8));
          onMore(type, 'auto', distance);
          lastScrollTimeRef.current = timestamp;
        }

        scrollFrameRef.current = window.requestAnimationFrame(step);
      };

      scrollFrameRef.current = window.requestAnimationFrame(step);
    }, 180);
  };

  useEffect(() => {
    const handleWindowMouseUp = () => {
      stopContinuousScroll();
    };
    const handleWindowTouchEnd = () => {
      stopContinuousScroll();
    };

    window.addEventListener('mouseup', handleWindowMouseUp);
    window.addEventListener('touchend', handleWindowTouchEnd);

    return () => {
      stopContinuousScroll();
      window.removeEventListener('mouseup', handleWindowMouseUp);
      window.removeEventListener('touchend', handleWindowTouchEnd);
    };
  }, [stopContinuousScroll]);

  useEffect(() => {
    setKeys(createLetterKeys(inputMode, capsLockActive));
  }, [capsLockActive, inputMode]);

  return (
    <div className="letter-keyboard" onMouseDown={onMouseDown}>
      {inputValue && (
        <div className="letter-keyboard-temp">
          <div className="letter-keyboard-temp-pinyin">{inputValue}</div>
          <div
            className="letter-keyboard-temp-left"
            onMouseDown={(e) => {
              e.preventDefault();
              startContinuousScroll('minus');
            }}
            onMouseUp={() => stopContinuousScroll()}
            onMouseLeave={() => stopContinuousScroll(false)}
            onTouchStart={(e) => {
              e.preventDefault();
              startContinuousScroll('minus');
            }}
            onTouchEnd={() => stopContinuousScroll()}
            onTouchCancel={() => stopContinuousScroll(false)}
          >
            <LeftSvg />
          </div>
          <div
            className="letter-keyboard-temp-list"
            ref={tempInputAreaRef}
            onMouseDown={dragScroll.onMouseDown}
            onTouchStart={dragScroll.onTouchStart}
          >
            {chinese?.map((item, index) => {
              return (
                <div
                  key={index}
                  className="letter-keyboard-temp-char"
                  onClick={() => {
                    if (shouldIgnoreClick() || dragScroll.shouldIgnoreClick()) {
                      return;
                    }
                    onSelectChinese && onSelectChinese(item);
                  }}
                  onTouchEnd={(e) => {
                    e.preventDefault();
                    markTouchInteraction();
                    if (dragScroll.shouldIgnoreClick()) return;
                    onSelectChinese && onSelectChinese(item);
                  }}
                >
                  {item}
                </div>
              );
            })}
          </div>
          <div
            className="letter-keyboard-temp-right"
            onMouseDown={(e) => {
              e.preventDefault();
              startContinuousScroll('add');
            }}
            onMouseUp={() => stopContinuousScroll()}
            onMouseLeave={() => stopContinuousScroll(false)}
            onTouchStart={(e) => {
              e.preventDefault();
              startContinuousScroll('add');
            }}
            onTouchEnd={() => stopContinuousScroll()}
            onTouchCancel={() => stopContinuousScroll(false)}
          >
            <RightSvg />
          </div>
        </div>
      )}

      <div className="letter-keyboard-area">
        {keys.map((item) => {
          const isRepeatableKey = ![
            CapsLock.code,
            Shift.code,
            Enter.code,
          ].includes(item.code);

          return (
            <div
              className={`letter-key-item ${
                isKeyActive?.(item) ? 'letter-key-item-active' : ''
              }`}
              title={item.description}
              key={item.keyCode}
              onClick={() => {
                if (shouldIgnoreClick()) return;
                if (!isRepeatableKey) {
                  triggerKey(item);
                }
              }}
              onMouseDown={(e) => {
                if (!isRepeatableKey) return;

                e.preventDefault();
                startContinuousTrigger(item, 'mouse');
              }}
              onMouseUp={() => {
                if (!isRepeatableKey) return;

                stopContinuousTrigger('mouse');
              }}
              onMouseLeave={() => {
                if (!isRepeatableKey) return;

                stopContinuousTrigger('mouse');
              }}
              onTouchStart={(e) => {
                e.preventDefault();
                markTouchInteraction();
                if (!isRepeatableKey) {
                  triggerKey(item);
                  return;
                }

                startContinuousTrigger(item, 'touch');
              }}
              onTouchEnd={() => {
                if (!isRepeatableKey) return;

                stopContinuousTrigger('touch');
              }}
              onTouchCancel={() => {
                if (!isRepeatableKey) return;

                stopContinuousTrigger('touch');
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
