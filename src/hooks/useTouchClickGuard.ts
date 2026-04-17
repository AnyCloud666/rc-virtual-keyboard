import { useCallback, useRef } from 'react';

const TOUCH_CLICK_GUARD_MS = 800;

const useTouchClickGuard = () => {
  const lastTouchAtRef = useRef(0);

  const markTouchInteraction = useCallback(() => {
    lastTouchAtRef.current = Date.now();
  }, []);

  const shouldIgnoreClick = useCallback(() => {
    return Date.now() - lastTouchAtRef.current < TOUCH_CLICK_GUARD_MS;
  }, []);

  return {
    markTouchInteraction,
    shouldIgnoreClick,
  };
};

export default useTouchClickGuard;
