import React, { CSSProperties, ReactNode, useEffect, useRef } from 'react';

import { useDebounceFn, useEventListener, useUpdateEffect } from 'ahooks';

import {
  FixedBottomPosition,
  FixedLeftPosition,
  FixedRightPosition,
  FixedTopPosition,
  FloatPosition,
} from '../keys';
import './style.css';
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
}) => {
  /** 是否允许移动 */
  const allowMove = useRef(false);
  /** 开始位置 */
  const start = useRef({ clientX: 0, clientY: 0 });

  /** touch 事件开始位置 */
  const startTouch = useRef({ clientX: 0, clientY: 0 });

  /** block */
  const blockRef = useRef<HTMLDivElement | null>(null);

  /** 点击时间记录 */
  const clickTimer = useRef(0);
  /** block 是否隐藏 */
  const isHidden = useRef(true);

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

  /** @type {*}
   * 自动靠右
   */
  const keepRight = useDebounceFn(
    () => {
      if (blockRef.current && autoKeepRight) {
        isHidden.current = true;
        blockRef.current.style.left =
          window.innerWidth - blockRef.current.offsetWidth / 2 + 'px';

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
        blockRef.current.style.left = `calc(100% - ${blockRef.current.offsetWidth}px)`;
        // blockRef.current.style.transition = "all 0.3s";
        keepRight.run();
      }
    },
    {
      wait: autoKeepRightDelay,
      leading: true,
    },
  );

  /** 初始位置 */
  useEffect(() => {
    if (blockRef.current) {
      if (init) {
        blockRef.current.style.top = `calc(100% - ${init.height})`;
        // blockRef.current.style.left =  `calc(100% - ${init.width})`;
        blockRef.current.style.left =
          parseFloat(init?.width ?? '0') > window.innerWidth
            ? '0px'
            : `calc(100vw - ${init?.width})`;
      } else {
        blockRef.current.style.top = `calc(50% - ${
          blockRef.current.offsetHeight / 2
        }px)`;
        blockRef.current.style.left = `calc(100% - ${
          blockRef.current.offsetWidth / 2
        }px)`;
      }
    }
  }, []);

  /** 层级 */
  useEffect(() => {
    if (blockRef.current) {
      blockRef.current.style.zIndex = zIndex.toString();
    }
  }, [zIndex]);

  useEffect(() => {
    if (blockRef.current) {
      switch (positionMode) {
        case FixedBottomPosition.code:
          blockRef.current.style.left = '0px';
          blockRef.current.style.top = `calc(100vh - ${init?.height})`;
          break;
        case FixedTopPosition.code:
        case FixedLeftPosition.code:
          blockRef.current.style.left = '0px';
          blockRef.current.style.top = '0px';
          break;
        case FixedRightPosition.code:
          blockRef.current.style.left =
            parseFloat(init?.width ?? '0') > window.innerWidth
              ? '0px'
              : `calc(100vw - ${init?.width})`;
          blockRef.current.style.top = '0px';
          break;
      }
    }
  }, [positionMode]);

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
    allowMove.current = true;
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
            blockRef.current.style.left =
              window.innerWidth -
              blockRef.current.offsetWidth / (isHidden.current ? 2 : 1) +
              'px';
          }

          if (blockRef.current.offsetTop >= 0) {
            blockRef.current.style.top =
              window.innerHeight / 2 -
              blockRef.current.offsetHeight / (isHidden.current ? 2 : 1) +
              'px';
          }
        } else {
          switch (positionMode) {
            case FixedBottomPosition.code:
              blockRef.current.style.left = '0px';
              blockRef.current.style.top = `calc(100vh - ${init?.height})`;
              break;
            case FixedTopPosition.code:
            case FixedLeftPosition.code:
              blockRef.current.style.left = '0px';
              blockRef.current.style.top = '0px';
              break;
            case FixedRightPosition.code:
              blockRef.current.style.left = `calc(100vw - ${init?.width})`;
              blockRef.current.style.top = '0px';
              break;
          }
        }
      }
    },
    { target: window },
  );

  /** 移动端点击 */
  const onTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    allowMove.current = true;
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
    }
  };

  /** 移动端点击结束 */
  const onTouchEnd = () => {
    if (blockRef.current) {
      allowMove.current = false;
      blockRef.current.style.transition = 'all 0.3s';
      // 防止页面跟随滚动
      document.body.style.overflow = 'unset';
      startTouch.current = { clientX: 0, clientY: 0 };
      keepRight.run();
    }
  };

  /** 移动端移动 */
  useEventListener(
    'touchmove',
    (e: React.TouchEvent<HTMLDivElement>) => {
      if (blockRef.current && allowMove.current) {
        blockRef.current.style.transition = 'none';
        // 根据初始点击位置 client 计算移动距离
        const element = e.targetTouches[0];
        const x = element.clientX - startTouch.current.clientX;
        const y = element.clientY - startTouch.current.clientY;

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
