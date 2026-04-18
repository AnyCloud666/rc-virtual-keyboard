import React, { useCallback, useEffect, useRef } from 'react';
import useHorizontalDragScroll from '../../hooks/useHorizontalDragScroll';
import useTouchClickGuard from '../../hooks/useTouchClickGuard';
import { ReactComponent as LeftSvg } from '../../svg/left.svg';
import { ReactComponent as RightSvg } from '../../svg/right.svg';
import './style.css';

type CandidateBarProps = {
  items?: string[];
  tempValue?: string;
  onSelectItem?: (item: string) => void;
};

const CandidateBar = ({
  items = [],
  tempValue,
  onSelectItem,
}: CandidateBarProps) => {
  const tempInputAreaRef = useRef<HTMLDivElement | null>(null);
  const scrollDelayTimerRef = useRef<number>();
  const scrollFrameRef = useRef<number>();
  const isContinuousScrollingRef = useRef(false);
  const scrollDirectionRef = useRef<'add' | 'minus' | null>(null);
  const lastScrollTimeRef = useRef(0);
  const { markTouchInteraction, shouldIgnoreClick } = useTouchClickGuard();
  const dragScroll = useHorizontalDragScroll(tempInputAreaRef);

  const onMore = useCallback(
    (
      type: 'add' | 'minus',
      behavior: ScrollBehavior = 'smooth',
      distance?: number,
    ) => {
      if (!tempInputAreaRef.current) return;

      const width = tempInputAreaRef.current.offsetWidth;
      const offset = distance ?? width / 10;
      tempInputAreaRef.current.scrollTo({
        left:
          tempInputAreaRef.current.scrollLeft +
          (type === 'add' ? offset : -offset),
        behavior,
      });
    },
    [],
  );

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
  }, [onMore]);

  const startContinuousScroll = useCallback((type: 'add' | 'minus') => {
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
          const distance = Math.max(1, Math.round((delta / 16) * 1.8));
          onMore(type, 'auto', distance);
          lastScrollTimeRef.current = timestamp;
        }

        scrollFrameRef.current = window.requestAnimationFrame(step);
      };

      scrollFrameRef.current = window.requestAnimationFrame(step);
    }, 180);
  }, [onMore, stopContinuousScroll]);

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

  if (!tempValue && items.length === 0) {
    return null;
  }

  return (
    <div className="candidate-bar">
      <div
        className="candidate-bar-arrow"
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
        className="candidate-bar-list"
        ref={tempInputAreaRef}
        onMouseDown={dragScroll.onMouseDown}
        onTouchStart={dragScroll.onTouchStart}
      >
        {tempValue ? (
          <div className="candidate-bar-item candidate-bar-item-input">
            {tempValue}
          </div>
        ) : null}

        {items.map((item, index) => (
          <div
            key={`${item}-${index}`}
            className="candidate-bar-item"
            onMouseDown={(e) => {
              e.preventDefault();
              if (shouldIgnoreClick() || dragScroll.shouldIgnoreClick()) {
                return;
              }
              onSelectItem?.(item);
            }}
            onClick={(e) => {
              e.preventDefault();
            }}
            onTouchEnd={(e) => {
              e.preventDefault();
              markTouchInteraction();
              if (dragScroll.shouldIgnoreClick()) {
                return;
              }
              onSelectItem?.(item);
            }}
          >
            {item}
          </div>
        ))}
      </div>

      <div
        className="candidate-bar-arrow"
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
  );
};

export default CandidateBar;
