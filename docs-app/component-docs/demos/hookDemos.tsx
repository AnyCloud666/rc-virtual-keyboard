import { useEffect, useRef, useState } from 'react';
import {
  NumberKeyboard,
  useContinuousTrigger,
  useHorizontalDragScroll,
  useInput,
  useIsMobile,
  useTouchClickGuard,
  keys,
} from 'rc-virtual-keyboard';

export function UseInputDemo() {
  const [value, setValue] = useState('');
  const {
    inputValue,
    chinese,
    onClick,
    onKeyDown,
    onKeyUp,
    isKeyActive,
  } = useInput({
    defaultActiveKeyboard: keys.numberType,
  });

  return (
    <div className="component-demo-stack">
      <input
        value={value}
        placeholder="先聚焦输入框，再使用 NumberKeyboard"
        onChange={(e) => setValue(e.target.value)}
      />
      <div className="component-demo-keyboard-frame">
        <NumberKeyboard
          numberKeyboardLayoutMode="asc"
          onClick={onClick}
          onKeyDown={onKeyDown}
          onKeyUp={onKeyUp}
          isKeyActive={isKeyActive}
        />
      </div>
      <div className="component-demo-result">当前值：{value || '未输入'}</div>
      <div className="component-demo-result">组合输入缓存：{inputValue || '无'}</div>
      <div className="component-demo-result">候选词：{chinese.join(' / ') || '无'}</div>
    </div>
  );
}

export function UseContinuousTriggerDemo() {
  const [count, setCount] = useState(0);
  const { startContinuousTrigger, stopContinuousTrigger } =
    useContinuousTrigger<void>({
      onTrigger: () => setCount((prev) => prev + 1),
      delay: 280,
      interval: 80,
    });

  return (
    <div className="component-demo-stack">
      <div className="component-demo-result">触发次数：{count}</div>
      <button
        type="button"
        className="hook-demo-button"
        onMouseDown={(e) => {
          e.preventDefault();
          startContinuousTrigger(undefined, 'mouse');
        }}
        onMouseUp={() => stopContinuousTrigger('mouse')}
        onMouseLeave={() => stopContinuousTrigger('mouse')}
        onTouchStart={(e) => {
          e.preventDefault();
          startContinuousTrigger(undefined, 'touch');
        }}
        onTouchEnd={() => stopContinuousTrigger('touch')}
        onTouchCancel={() => stopContinuousTrigger('touch')}
      >
        按住持续累加
      </button>
    </div>
  );
}

export function UseHorizontalDragScrollDemo() {
  const containerRef = useRef<HTMLDivElement>(null);
  const dragScroll = useHorizontalDragScroll(containerRef);
  const [picked, setPicked] = useState('未选择');

  return (
    <div className="component-demo-stack">
      <div className="component-demo-result">当前选中：{picked}</div>
      <div
        ref={containerRef}
        className="hook-demo-scroll"
        onMouseDown={dragScroll.onMouseDown}
        onTouchStart={dragScroll.onTouchStart}
      >
        {Array.from({ length: 12 }, (_, index) => `候选 ${index + 1}`).map(
          (item) => (
            <button
              key={item}
              type="button"
              className="hook-demo-chip"
              onClick={() => {
                if (dragScroll.shouldIgnoreClick()) return;
                setPicked(item);
              }}
            >
              {item}
            </button>
          ),
        )}
      </div>
    </div>
  );
}

export function UseTouchClickGuardDemo() {
  const { markTouchInteraction, shouldIgnoreClick } = useTouchClickGuard();
  const [status, setStatus] = useState('尚未触发保护窗口');

  return (
    <div className="component-demo-stack">
      <button
        type="button"
        className="hook-demo-button"
        onClick={() => {
          markTouchInteraction();
          setStatus('已标记一次 touch 交互，接下来 800ms 内点击会被忽略');
        }}
      >
        触发一次保护窗口
      </button>
      <button
        type="button"
        className="hook-demo-button hook-demo-button-secondary"
        onClick={() => {
          setStatus(
            shouldIgnoreClick()
              ? '当前 click 应该被忽略'
              : '当前 click 可以继续执行',
          );
        }}
      >
        检查当前 click 是否应忽略
      </button>
      <div className="component-demo-result">{status}</div>
    </div>
  );
}

export function UseIsMobileDemo() {
  const [query, setQuery] = useState('(max-width: 768px)');
  const [viewportWidth, setViewportWidth] = useState(
    () => window.innerWidth,
  );
  const isMobile = useIsMobile(query);

  useEffect(() => {
    const handleResize = () => {
      setViewportWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="component-demo-stack">
      <input
        value={query}
        placeholder="媒体查询表达式"
        onChange={(e) => setQuery(e.target.value)}
      />
      <div className="component-demo-result">当前窗口宽度：{viewportWidth}px</div>
      <div className="component-demo-result">查询结果：{isMobile ? 'true' : 'false'}</div>
    </div>
  );
}
