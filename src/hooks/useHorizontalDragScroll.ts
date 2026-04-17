import { useCallback, useEffect, useRef } from 'react';

const DRAG_THRESHOLD = 6;
const DRAG_CLICK_GUARD_MS = 220;

/**
 * 为横向候选区提供鼠标/触摸拖拽滚动能力，并在拖拽结束后短暂屏蔽点击，
 * 避免“拖动一下却误触发候选词点击”的情况。
 */
const useHorizontalDragScroll = (
  containerRef: React.RefObject<HTMLDivElement>,
) => {
  const draggingRef = useRef(false);
  const movedRef = useRef(false);
  const startXRef = useRef(0);
  const startScrollLeftRef = useRef(0);
  const pointerTypeRef = useRef<'mouse' | 'touch' | null>(null);
  const activeTouchIdRef = useRef<number | null>(null);
  const suppressClickUntilRef = useRef(0);

  const beginDrag = useCallback(
    (clientX: number, pointerType: 'mouse' | 'touch', touchId?: number) => {
      const container = containerRef.current;

      if (!container) return;

      draggingRef.current = true;
      movedRef.current = false;
      pointerTypeRef.current = pointerType;
      activeTouchIdRef.current = typeof touchId === 'number' ? touchId : null;
      startXRef.current = clientX;
      startScrollLeftRef.current = container.scrollLeft;
      container.style.cursor = 'grabbing';
    },
    [containerRef],
  );

  const updateDrag = useCallback(
    (clientX: number) => {
      const container = containerRef.current;

      if (!container || !draggingRef.current) return false;

      const deltaX = clientX - startXRef.current;
      if (Math.abs(deltaX) > DRAG_THRESHOLD) {
        movedRef.current = true;
      }

      container.scrollLeft = startScrollLeftRef.current - deltaX;
      return movedRef.current;
    },
    [containerRef],
  );

  const endDrag = useCallback(() => {
    const container = containerRef.current;

    if (container) {
      container.style.cursor = 'grab';
    }

    if (movedRef.current) {
      suppressClickUntilRef.current = Date.now() + DRAG_CLICK_GUARD_MS;
    }

    draggingRef.current = false;
    movedRef.current = false;
    pointerTypeRef.current = null;
    activeTouchIdRef.current = null;
  }, [containerRef]);

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      if (pointerTypeRef.current !== 'mouse') return;
      const moved = updateDrag(event.clientX);
      if (moved) {
        event.preventDefault();
      }
    };

    const handleMouseUp = () => {
      if (pointerTypeRef.current !== 'mouse') return;
      endDrag();
    };

    const handleTouchMove = (event: TouchEvent) => {
      if (pointerTypeRef.current !== 'touch') return;

      const activeTouch = Array.from(event.touches).find(
        (touch) => touch.identifier === activeTouchIdRef.current,
      );

      if (!activeTouch) return;

      const moved = updateDrag(activeTouch.clientX);
      if (moved) {
        event.preventDefault();
      }
    };

    const handleTouchEnd = () => {
      if (pointerTypeRef.current !== 'touch') return;
      endDrag();
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('touchmove', handleTouchMove, { passive: false });
    window.addEventListener('touchend', handleTouchEnd);
    window.addEventListener('touchcancel', handleTouchEnd);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
      window.removeEventListener('touchcancel', handleTouchEnd);
    };
  }, [endDrag, updateDrag]);

  const onMouseDown = useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      if (event.button !== 0) return;
      beginDrag(event.clientX, 'mouse');
    },
    [beginDrag],
  );

  const onTouchStart = useCallback(
    (event: React.TouchEvent<HTMLDivElement>) => {
      const touch = event.touches[0];
      if (!touch) return;
      beginDrag(touch.clientX, 'touch', touch.identifier);
    },
    [beginDrag],
  );

  const shouldIgnoreClick = useCallback(() => {
    return draggingRef.current || Date.now() < suppressClickUntilRef.current;
  }, []);

  return {
    onMouseDown,
    onTouchStart,
    shouldIgnoreClick,
  };
};

export default useHorizontalDragScroll;
