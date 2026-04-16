import { useCallback, useEffect, useRef } from 'react';

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
  delay = 260,
  interval = 80,
}: {
  onTrigger: (payload: T) => void;
  delay?: number;
  interval?: number;
}) => {
  const delayTimerRef = useRef<number>();
  const intervalTimerRef = useRef<number>();

  const stopContinuousTrigger = useCallback(() => {
    window.clearTimeout(delayTimerRef.current);
    window.clearInterval(intervalTimerRef.current);
  }, []);

  const startContinuousTrigger = useCallback(
    (payload: T) => {
      stopContinuousTrigger();
      onTrigger(payload);

      delayTimerRef.current = window.setTimeout(() => {
        intervalTimerRef.current = window.setInterval(() => {
          onTrigger(payload);
        }, interval);
      }, delay);
    },
    [delay, interval, onTrigger, stopContinuousTrigger],
  );

  useEffect(() => {
    window.addEventListener('mouseup', stopContinuousTrigger);
    window.addEventListener('touchend', stopContinuousTrigger);

    return () => {
      stopContinuousTrigger();
      window.removeEventListener('mouseup', stopContinuousTrigger);
      window.removeEventListener('touchend', stopContinuousTrigger);
    };
  }, [stopContinuousTrigger]);

  return {
    startContinuousTrigger,
    stopContinuousTrigger,
  };
};

export default useContinuousTrigger;
