import React, {
  CSSProperties,
  ReactNode,
  useCallback,
  useEffect,
  useRef,
} from 'react';

import { useDebounceFn, useEventListener, useUpdateEffect } from 'ahooks';

import {
  FixedBottomPosition,
  FixedLeftPosition,
  FixedRightPosition,
  FixedTopPosition,
  FloatPosition,
} from '../keys';
import './style.css';

const getVisualViewportMetrics = () => {
  const viewport = window.visualViewport;

  return {
    width: viewport?.width ?? window.innerWidth,
    height: viewport?.height ?? window.innerHeight,
    offsetTop: viewport?.offsetTop ?? 0,
    offsetLeft: viewport?.offsetLeft ?? 0,
  };
};
/**
 *
 *
 *
 * @param param0
 * @returns
 *
 * @description
 */

const DragBlock = ({
  init,
  resizeOverRight,
  autoKeepRightDelay = 3000,
  autoKeepRight = true,
  delay = 280,
  zIndex = 9999,
  children,
  style,
  positionMode = FloatPosition.code,
  onClick,
  floatAnchorRect,
  floatOffset = 12,
  onManualMove,
  defaultTopRatio,
  defaultHiddenWidthRatio,
  defaultRightOffset,
  defaultBottomOffset,
  preventFocusLoss = false,
}: {
  init?: { width: string; height: string };
  resizeOverRight?: boolean;
  /** 多长时间没有操作之后靠右 */
  autoKeepRightDelay?: number;
  /** 是否自动靠右 */
  autoKeepRight?: boolean;
  /** click延迟 */
  delay?: number;
  onClick?: () => void;
  /** 层级 */
  zIndex?: number | string;
  children?: ReactNode;
  style?: CSSProperties;
  positionMode?: string;
  floatAnchorRect?: {
    left: number;
    top: number;
    right: number;
    bottom: number;
    width: number;
    height: number;
  } | null;
  floatOffset?: number;
  onManualMove?: () => void;
  defaultTopRatio?: number;
  defaultHiddenWidthRatio?: number;
  defaultRightOffset?: number;
  defaultBottomOffset?: number;
  /** 鼠标按下时阻止浏览器切换焦点 */
  preventFocusLoss?: boolean;
}) => {
  const hasInit = !!init;
  const initWidth = init?.width;
  const initHeight = init?.height;
  /** 是否允许移动 */
  const allowMove = useRef(false);
  /** 开始位置 */
  const start = useRef({ clientX: 0, clientY: 0 });

  /** touch 事件开始位置 */
  const startTouch = useRef({ clientX: 0, clientY: 0 });
  /** touch 是否发生了拖动 */
  const touchMoved = useRef(false);
  /** 当前这一轮拖动是否已经通知上层 */
  const manualMoveNotified = useRef(false);

  /** block */
  const blockRef = useRef<HTMLDivElement | null>(null);

  /** 点击时间记录 */
  const clickTimer = useRef(0);
  /** block 是否隐藏 */
  const isHidden = useRef(true);

  const applyEdgeDockPosition = useCallback(() => {
    if (!blockRef.current) return;

    const hiddenWidthRatio = defaultHiddenWidthRatio ?? 0.5;
    const topRatio = defaultTopRatio ?? 0.8;
    const nextTop = Math.max(
      0,
      window.innerHeight * topRatio - blockRef.current.offsetHeight / 2,
    );
    const nextLeft =
      window.innerWidth -
      blockRef.current.offsetWidth * hiddenWidthRatio;

    blockRef.current.style.left = `${nextLeft}px`;
    blockRef.current.style.top = `${nextTop}px`;
  }, [defaultHiddenWidthRatio, defaultTopRatio]);

  const applyEdgeExpandedPosition = useCallback(() => {
    if (!blockRef.current) return;

    const topRatio = defaultTopRatio ?? 0.8;
    const nextTop = Math.max(
      0,
      window.innerHeight * topRatio - blockRef.current.offsetHeight / 2,
    );
    const nextLeft = window.innerWidth - blockRef.current.offsetWidth;

    blockRef.current.style.left = `${nextLeft}px`;
    blockRef.current.style.top = `${nextTop}px`;
  }, [defaultTopRatio]);

  const applyCornerExpandedPosition = useCallback(() => {
    if (!blockRef.current) return;

    const rightOffset = defaultRightOffset ?? 0;
    const bottomOffset = defaultBottomOffset ?? 0;
    const nextLeft = Math.max(
      0,
      window.innerWidth - blockRef.current.offsetWidth - rightOffset,
    );
    const nextTop = Math.max(
      0,
      window.innerHeight - blockRef.current.offsetHeight - bottomOffset,
    );

    blockRef.current.style.left = `${nextLeft}px`;
    blockRef.current.style.top = `${nextTop}px`;
  }, [defaultBottomOffset, defaultRightOffset]);

  const syncBlockPosition = useCallback(() => {
    if (!blockRef.current) return;

    const viewport = getVisualViewportMetrics();
    const blockWidth = blockRef.current.offsetWidth;
    const blockHeight = blockRef.current.offsetHeight;

    switch (positionMode) {
      case FixedBottomPosition.code:
        blockRef.current.style.left = `${viewport.offsetLeft}px`;
        blockRef.current.style.top = `${Math.max(
          viewport.offsetTop,
          viewport.offsetTop + viewport.height - blockHeight,
        )}px`;
        break;
      case FixedTopPosition.code:
      case FixedLeftPosition.code:
        blockRef.current.style.left = `${viewport.offsetLeft}px`;
        blockRef.current.style.top = `${viewport.offsetTop}px`;
        break;
      case FixedRightPosition.code:
        blockRef.current.style.left =
          blockWidth > viewport.width
            ? `${viewport.offsetLeft}px`
            : `${viewport.offsetLeft + viewport.width - blockWidth}px`;
        blockRef.current.style.top = `${viewport.offsetTop}px`;
        break;
      default: {
        if (resizeOverRight && hasInit && autoKeepRight) {
          applyEdgeDockPosition();
          return;
        }

        if (
          hasInit &&
          !autoKeepRight &&
          positionMode === FloatPosition.code &&
          (typeof defaultRightOffset === 'number' ||
            typeof defaultBottomOffset === 'number')
        ) {
          applyCornerExpandedPosition();
          return;
        }

        const maxLeft = Math.max(
          0,
          viewport.width - blockRef.current.offsetWidth,
        );
        const maxTop = Math.max(
          0,
          viewport.height - blockRef.current.offsetHeight,
        );
        const nextLeft = Math.min(blockRef.current.offsetLeft, maxLeft);
        const nextTop = Math.min(blockRef.current.offsetTop, maxTop);

        blockRef.current.style.left = `${Math.max(0, nextLeft)}px`;
        blockRef.current.style.top = `${Math.max(0, nextTop)}px`;
      }
    }
  }, [
    applyEdgeDockPosition,
    applyCornerExpandedPosition,
    autoKeepRight,
    defaultBottomOffset,
    defaultRightOffset,
    hasInit,
    init?.height,
    init?.width,
    positionMode,
    resizeOverRight,
  ]);

  const syncFloatAnchorPosition = useCallback(() => {
    if (
      !blockRef.current ||
      positionMode !== FloatPosition.code ||
      !floatAnchorRect
    ) {
      return;
    }

    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const blockWidth = blockRef.current.offsetWidth;
    const blockHeight = blockRef.current.offsetHeight;
    const safeMargin = 12;
    const maxLeft = Math.max(
      safeMargin,
      viewportWidth - blockWidth - safeMargin,
    );
    const maxTop = Math.max(
      safeMargin,
      viewportHeight - blockHeight - safeMargin,
    );

    const preferredLeft = floatAnchorRect.left;
    const fallbackLeft = floatAnchorRect.right - blockWidth;
    let nextLeft = preferredLeft;
    let nextTop = floatAnchorRect.bottom + floatOffset;

    if (preferredLeft + blockWidth > viewportWidth - safeMargin) {
      nextLeft =
        fallbackLeft >= safeMargin
          ? fallbackLeft
          : Math.min(preferredLeft, maxLeft);
    }

    if (nextLeft > maxLeft) {
      nextLeft = maxLeft;
    }
    if (nextLeft < safeMargin) {
      nextLeft = safeMargin;
    }

    if (nextTop + blockHeight > viewportHeight - safeMargin) {
      const fallbackTop = floatAnchorRect.top - blockHeight - floatOffset;
      nextTop = fallbackTop >= safeMargin ? fallbackTop : maxTop;
    }

    if (nextTop < safeMargin) {
      nextTop = safeMargin;
    }

    blockRef.current.style.left = `${nextLeft}px`;
    blockRef.current.style.top = `${nextTop}px`;
  }, [floatAnchorRect, floatOffset, positionMode]);
  /** @type {*}
   * 自动靠右
   */
  const keepRight = useDebounceFn(
    () => {
      if (blockRef.current && autoKeepRight) {
        isHidden.current = true;
        if (resizeOverRight && hasInit) {
          applyEdgeDockPosition();
        } else {
          blockRef.current.style.left =
            window.innerWidth - blockRef.current.offsetWidth / 2 + 'px';
        }

        setTimeout(() => {
          if (blockRef.current) {
            blockRef.current.style.transition = 'none';
          }
        }, 400);
      }
    },
    {
      wait: autoKeepRightDelay,
    },
  );
  /** @type {*}
   * 点击展示块
   */
  const showBlock = useDebounceFn(
    () => {
      if (blockRef.current) {
        isHidden.current = false;
        if (resizeOverRight && hasInit) {
          applyEdgeExpandedPosition();
        } else {
          blockRef.current.style.left = `calc(100% - ${blockRef.current.offsetWidth}px)`;
        }
        // blockRef.current.style.transition = "all 0.3s";
        keepRight.run();
      }
    },
    {
      wait: autoKeepRightDelay,
      leading: true,
    },
  );

  /**
   * 点击事件
   *
   */
  const onClickFn = () => {
    if (Date.now() - clickTimer.current < delay) {
      if (isHidden.current && autoKeepRight && blockRef.current) {
        blockRef.current.style.transition = 'all 0.3s';
        showBlock.run();
      } else {
        !allowMove.current && onClick && onClick();
      }
    }
  };

  /** 初始位置 */
  useEffect(() => {
    if (blockRef.current) {
      if (hasInit) {
        if (resizeOverRight && autoKeepRight) {
          applyEdgeDockPosition();
        } else if (
          !autoKeepRight &&
          positionMode === FloatPosition.code &&
          (typeof defaultRightOffset === 'number' ||
            typeof defaultBottomOffset === 'number')
        ) {
          applyCornerExpandedPosition();
        } else {
          blockRef.current.style.top = `calc(100% - ${initHeight})`;
          blockRef.current.style.left =
            parseFloat(initWidth ?? '0') > window.innerWidth
              ? '0px'
              : `calc(100vw - ${initWidth})`;
        }
      } else {
        blockRef.current.style.top = `calc(50% - ${
          blockRef.current.offsetHeight / 2
        }px)`;
        blockRef.current.style.left = `calc(100% - ${
          blockRef.current.offsetWidth / 2
        }px)`;
      }
    }
  }, [
    applyCornerExpandedPosition,
    applyEdgeDockPosition,
    autoKeepRight,
    defaultBottomOffset,
    defaultRightOffset,
    hasInit,
    initHeight,
    initWidth,
    positionMode,
    resizeOverRight,
  ]);

  /** 层级 */
  useEffect(() => {
    if (blockRef.current) {
      blockRef.current.style.zIndex = zIndex.toString();
    }
  }, [zIndex]);

  useEffect(() => {
    syncBlockPosition();
  }, [syncBlockPosition]);

  useEffect(() => {
    const viewport = window.visualViewport;

    if (!viewport) {
      return;
    }

    const syncViewportPosition = () => {
      syncBlockPosition();
      syncFloatAnchorPosition();
    };

    viewport.addEventListener('resize', syncViewportPosition);
    viewport.addEventListener('scroll', syncViewportPosition);

    return () => {
      viewport.removeEventListener('resize', syncViewportPosition);
      viewport.removeEventListener('scroll', syncViewportPosition);
    };
  }, [syncBlockPosition, syncFloatAnchorPosition]);

  useEffect(() => {
    syncFloatAnchorPosition();
  }, [syncFloatAnchorPosition]);

  /** 监听自动靠右 */
  useUpdateEffect(() => {
    if (blockRef.current) {
      blockRef.current.style.transition = 'all 0.3s';
      if (autoKeepRight) {
        keepRight.run();
      } else {
        showBlock.run();
      }
    }
  }, [autoKeepRight]);

  /** 鼠标按下 */
  const onMouseDown = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (preventFocusLoss) {
      e.preventDefault();
    }

    allowMove.current = true;
    manualMoveNotified.current = false;
    showBlock.cancel();
    keepRight.cancel();

    if (blockRef.current) {
      // 记录初始位置
      const offsetLeft = blockRef.current.offsetLeft;
      const offsetTop = blockRef.current.offsetTop;

      const clientX = e.clientX - offsetLeft;

      const clientY = e.clientY - offsetTop;

      start.current = { clientX, clientY };

      clickTimer.current = Date.now();
    }
  };

  /** 鼠标移动 */
  useEventListener(
    'mousemove',
    (e: MouseEvent) => {
      if (allowMove.current) {
        const x = e.clientX - start.current.clientX;

        const y = e.clientY - start.current.clientY;

        if (blockRef.current) {
          if (
            !manualMoveNotified.current &&
            (Math.abs(x - blockRef.current.offsetLeft) > 4 ||
              Math.abs(y - blockRef.current.offsetTop) > 4)
          ) {
            manualMoveNotified.current = true;
            onManualMove?.();
          }

          blockRef.current.style.transition = 'none';

          if (x <= window.innerWidth - blockRef?.current?.offsetWidth) {
            isHidden.current = false;
          }

          if (
            x <
              window.innerWidth -
                blockRef.current.offsetWidth / (isHidden.current ? 2 : 1) &&
            x > 0
          ) {
            blockRef.current.style.left = x + 'px';
          }

          if (
            y <
              window.innerHeight -
                blockRef.current.offsetHeight / (isHidden.current ? 2 : 1) &&
            y > 0
          ) {
            blockRef.current.style.top = y + 'px';
          }
        }
      }
    },
    {
      target: window,
    },
  );

  /** 鼠标抬起 */
  useEventListener(
    'mouseup',
    () => {
      allowMove.current = false;
      if (blockRef.current) {
        blockRef.current.style.transition = 'all 0.3s';
        start.current = { clientX: 0, clientY: 0 };
        keepRight.run();
      }
    },
    {
      target: window,
    },
  );

  /** 窗口改变 */
  useEventListener(
    'resize',
    () => {
      if (blockRef.current) {
        if (resizeOverRight) {
          if (blockRef.current.offsetLeft >= 0) {
            if (hasInit && autoKeepRight) {
              applyEdgeDockPosition();
            } else {
              blockRef.current.style.left =
                window.innerWidth -
                blockRef.current.offsetWidth / (isHidden.current ? 2 : 1) +
                'px';
            }
          }

          if (blockRef.current.offsetTop >= 0) {
            if (!hasInit || !autoKeepRight) {
              blockRef.current.style.top =
                window.innerHeight / 2 -
                blockRef.current.offsetHeight / (isHidden.current ? 2 : 1) +
                'px';
            }
          }
        } else {
          if (
            hasInit &&
            !autoKeepRight &&
            positionMode === FloatPosition.code &&
            (typeof defaultRightOffset === 'number' ||
              typeof defaultBottomOffset === 'number')
          ) {
            applyCornerExpandedPosition();
          } else {
            syncBlockPosition();
          }
        }
      }
    },
    { target: window },
  );

  /** 移动端点击 */
  const onTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    allowMove.current = true;
    touchMoved.current = false;
    manualMoveNotified.current = false;
    showBlock.cancel();
    keepRight.cancel();
    e?.preventDefault?.();
    const element = e.targetTouches[0];
    // 防止页面跟随滚动
    document.body.style.overflow = 'hidden';
    if (blockRef.current) {
      const offsetLeft = blockRef.current.offsetLeft;
      const offsetTop = blockRef.current.offsetTop;

      const clientX = element.clientX - offsetLeft;

      const clientY = element.clientY - offsetTop;

      startTouch.current = {
        clientX,
        clientY,
      };
      clickTimer.current = Date.now();
    }
  };

  /** 移动端点击结束 */
  const onTouchEnd = () => {
    if (blockRef.current) {
      const shouldTriggerClick =
        !touchMoved.current && Date.now() - clickTimer.current < delay;

      allowMove.current = false;
      blockRef.current.style.transition = 'all 0.3s';
      // 防止页面跟随滚动
      document.body.style.overflow = 'unset';
      startTouch.current = { clientX: 0, clientY: 0 };

      if (shouldTriggerClick) {
        if (isHidden.current && autoKeepRight) {
          showBlock.run();
        } else {
          onClick && onClick();
        }
      }

      keepRight.run();
    }
  };

  /** 移动端移动 */
  useEventListener(
    'touchmove',
    (e: TouchEvent) => {
      if (blockRef.current && allowMove.current) {
        blockRef.current.style.transition = 'none';
        // 根据初始点击位置 client 计算移动距离
        const element = e.targetTouches[0];
        const x = element.clientX - startTouch.current.clientX;
        const y = element.clientY - startTouch.current.clientY;

        if (
          Math.abs(x - blockRef.current.offsetLeft) > 4 ||
          Math.abs(y - blockRef.current.offsetTop) > 4
        ) {
          touchMoved.current = true;
          if (!manualMoveNotified.current) {
            manualMoveNotified.current = true;
            onManualMove?.();
          }
        }

        if (x <= window.innerWidth - blockRef?.current?.offsetWidth) {
          isHidden.current = false;
        }

        if (
          x <
            window.innerWidth -
              blockRef.current.offsetWidth / (isHidden.current ? 2 : 1) &&
          x > 0
        ) {
          blockRef.current.style.left = x + 'px';
        }

        if (
          y <
            window.innerHeight -
              blockRef.current.offsetHeight / (isHidden.current ? 2 : 1) &&
          y > 0
        ) {
          blockRef.current.style.top = y + 'px';
        }
      }
    },
    {
      target: blockRef,
    },
  );

  return (
    <div
      style={style}
      className="virtual-drag-block"
      ref={blockRef}
      onClick={onClickFn}
      onMouseDown={onMouseDown}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      {children}
    </div>
  );
};
export default DragBlock;
