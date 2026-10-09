import { useCallback, useEffect, useRef } from 'react';

const IGNORE_MOUSE_AFTER_TOUCH_MS = 800;

/**
 * 通用长按连续触发器。
 *
 * 交互规则：
 * 1. 按下立即触发一次
 * 2. 按住一段时间后开始连续触发
 * 3. 鼠标/触摸结束后自动停止
 */
const useContinuousTrigger = <T>({
  onTrigger,
  delay = 1000,
  interval = 80,
}: {
  onTrigger: (payload: T) => void;
  delay?: number;
  interval?: number;
}) => {
  const delayTimerRef = useRef<number>();
  const intervalTimerRef = useRef<number>();
  const releaseTouchGuardTimerRef = useRef<number>();
  const onTriggerRef = useRef(onTrigger);
  const lastTouchTriggerAtRef = useRef(0);
  const activePointerTypeRef = useRef<'mouse' | 'touch' | null>(null);
  const touchSessionActiveRef = useRef(false);

  useEffect(() => {
    onTriggerRef.current = onTrigger;
  }, [onTrigger]);

  const releaseTouchGuard = useCallback(() => {
    window.clearTimeout(releaseTouchGuardTimerRef.current);
    releaseTouchGuardTimerRef.current = window.setTimeout(() => {
      touchSessionActiveRef.current = false;
      activePointerTypeRef.current = null;
    }, IGNORE_MOUSE_AFTER_TOUCH_MS);
  }, []);

  const stopContinuousTrigger = useCallback(
    (source?: 'mouse' | 'touch') => {
      if (
        source &&
        activePointerTypeRef.current &&
        activePointerTypeRef.current !== source
      ) {
        return;
      }

      if (source === 'touch') {
        lastTouchTriggerAtRef.current = Date.now();
        releaseTouchGuard();
      } else if (
        source === 'mouse' &&
        activePointerTypeRef.current === 'mouse'
      ) {
        activePointerTypeRef.current = null;
      }

      window.clearTimeout(delayTimerRef.current);
      window.clearInterval(intervalTimerRef.current);
    },
    [releaseTouchGuard],
  );

  const startContinuousTrigger = useCallback(
    (payload: T, source: 'mouse' | 'touch' = 'mouse') => {
      const now = Date.now();

      if (source === 'touch') {
        window.clearTimeout(releaseTouchGuardTimerRef.current);
        touchSessionActiveRef.current = true;
        lastTouchTriggerAtRef.current = now;
        activePointerTypeRef.current = 'touch';
      } else if (
        touchSessionActiveRef.current ||
        now - lastTouchTriggerAtRef.current < IGNORE_MOUSE_AFTER_TOUCH_MS
      ) {
        return;
      } else {
        activePointerTypeRef.current = 'mouse';
      }

      stopContinuousTrigger();
      onTriggerRef.current(payload);

      delayTimerRef.current = window.setTimeout(() => {
        intervalTimerRef.current = window.setInterval(() => {
          onTriggerRef.current(payload);
        }, interval);
      }, delay);
    },
    [delay, interval, stopContinuousTrigger],
  );

  useEffect(() => {
    const handleWindowMouseUp = () => stopContinuousTrigger('mouse');
    const handleWindowTouchEnd = () => stopContinuousTrigger('touch');

    window.addEventListener('mouseup', handleWindowMouseUp);
    window.addEventListener('touchend', handleWindowTouchEnd);
    window.addEventListener('touchcancel', handleWindowTouchEnd);

    return () => {
      window.clearTimeout(releaseTouchGuardTimerRef.current);
      stopContinuousTrigger();
      window.removeEventListener('mouseup', handleWindowMouseUp);
      window.removeEventListener('touchend', handleWindowTouchEnd);
      window.removeEventListener('touchcancel', handleWindowTouchEnd);
    };
  }, [stopContinuousTrigger]);

  return {
    startContinuousTrigger,
    stopContinuousTrigger,
  };
};

export default useContinuousTrigger;
