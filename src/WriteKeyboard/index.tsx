import { useDebounceFn, useEventListener } from 'ahooks';
import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import useContinuousTrigger from '../hooks/useContinuousTrigger';
import useTouchClickGuard from '../hooks/useTouchClickGuard';
import CandidateBar from '../lib/CandidateBar';
import { ReactComponent as DeleteSvg } from '../svg/delete.svg';
import { ReactComponent as EnterSvg } from '../svg/enter.svg';

import { Backspace, Clear, Enter } from '../keys';
import { VKB } from '../typing';
import './style.css';

type DrawPoint = {
  x: number;
  y: number;
};

type StrokeSamplePoint = DrawPoint & {
  time: number;
};

type CanvasSize = {
  cssWidth: number;
  cssHeight: number;
  displayWidth: number;
  displayHeight: number;
  drawWidth: number;
  drawHeight: number;
};

const OFFSCREEN_SUPERSAMPLE = 2;
const MAX_DISPLAY_SCALE = 3;
const MAX_DRAW_SCALE = 6;
const MIN_POINT_DISTANCE = 0.8;
const BASE_STROKE_WIDTH = 5.2;
const MIN_STROKE_WIDTH = 2.8;
const MAX_STROKE_WIDTH = 6.2;
const STROKE_SAMPLE_STEP = 0.6;
const STROKE_SMOOTHING = 0.22;
const EDGE_TAPER_RATIO = 0.92;
const STROKE_COLOR = 'rgba(38, 38, 38, 0.94)';

const WriteKeyboard = ({
  chinese,
  onClick,
  onKeyDown,
  onKeyUp,
  onSelectChinese,
  onRecognition,
  onMouseDown,
  isKeyActive,
}: {
  chinese: string[];
  onClick?: (e: VKB.KeyboardAttributeType) => void;
  onKeyDown?: (e: VKB.KeyboardAttributeType) => void;
  onKeyUp?: (e: VKB.KeyboardAttributeType) => void;
  onSelectChinese?: (chinese: string) => void;
  /** 识别图片 */
  onRecognition?: (url: string) => void;
  onMouseDown?: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
  isKeyActive?: (key: VKB.KeyboardAttributeType) => boolean;
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const canvasCTX = useRef<CanvasRenderingContext2D | null>(null);
  const drawCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const drawCanvasCTX = useRef<CanvasRenderingContext2D | null>(null);
  const writeContentRef = useRef<HTMLDivElement | null>(null);
  const previousCanvasSizeRef = useRef<CanvasSize | null>(null);
  const allowMove = useRef(false);
  const lastPointRef = useRef<StrokeSamplePoint | null>(null);
  const lastMidPointRef = useRef<StrokeSamplePoint | null>(null);
  const lastRadiusRef = useRef(BASE_STROKE_WIDTH / 2);
  const { markTouchInteraction, shouldIgnoreClick } = useTouchClickGuard();
  const [canvasSize, setCanvasSize] = useState<CanvasSize>({
    cssWidth: 200,
    cssHeight: 200,
    displayWidth: 200,
    displayHeight: 200,
    drawWidth: 200,
    drawHeight: 200,
  });

  const triggerKey = (item: VKB.KeyboardAttributeType) => {
    onKeyDown?.(item);
    onClick?.(item);
    onKeyUp?.(item);
  };

  const getTouchPoint = (touch: Touch) => {
    const rect = canvasRef.current?.getBoundingClientRect();

    if (!rect) {
      return { x: 0, y: 0 };
    }

    return {
      x: touch.clientX - rect.left,
      y: touch.clientY - rect.top,
    };
  };

  const setupStrokeContext = (ctx: CanvasRenderingContext2D) => {
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.lineWidth = BASE_STROKE_WIDTH;
    ctx.strokeStyle = STROKE_COLOR;
    ctx.fillStyle = STROKE_COLOR;
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    ctx.globalAlpha = 0.98;
    // 让细线条在高 DPI 画布上边缘更柔和一些。
    ctx.shadowBlur = 0.45;
    ctx.shadowColor = ctx.strokeStyle;
  };

  const syncDisplayCanvas = () => {
    const displayCanvas = canvasRef.current;
    const displayCtx = canvasCTX.current;
    const drawCanvas = drawCanvasRef.current;

    if (!displayCanvas || !displayCtx || !drawCanvas) return;

    displayCtx.setTransform(1, 0, 0, 1, 0, 0);
    displayCtx.clearRect(0, 0, displayCanvas.width, displayCanvas.height);
    displayCtx.imageSmoothingEnabled = true;
    displayCtx.imageSmoothingQuality = 'high';
    displayCtx.drawImage(
      drawCanvas,
      0,
      0,
      drawCanvas.width,
      drawCanvas.height,
      0,
      0,
      displayCanvas.width,
      displayCanvas.height,
    );
  };

  const createSamplePoint = (point: DrawPoint): StrokeSamplePoint => ({
    ...point,
    time: performance.now(),
  });

  const getStrokeRadius = (
    previousPoint: StrokeSamplePoint,
    point: StrokeSamplePoint,
  ) => {
    const distance = Math.hypot(
      point.x - previousPoint.x,
      point.y - previousPoint.y,
    );
    const deltaTime = Math.max(point.time - previousPoint.time, 1);
    const velocity = distance / deltaTime;
    const rawWidth = BASE_STROKE_WIDTH - velocity * 0.9;
    const nextWidth = Math.min(
      MAX_STROKE_WIDTH,
      Math.max(MIN_STROKE_WIDTH, rawWidth),
    );
    const smoothedWidth =
      lastRadiusRef.current * 2 * (1 - STROKE_SMOOTHING) +
      nextWidth * STROKE_SMOOTHING;

    return smoothedWidth / 2;
  };

  /**
   * 按二次贝塞尔曲线进行采样铺点，避免只依赖浏览器默认 stroke 抗锯齿，
   * 在高 DPI 下进一步减少边缘锯齿和断续感。
   */
  const fillCurveSegment = (
    ctx: CanvasRenderingContext2D,
    start: StrokeSamplePoint,
    control: StrokeSamplePoint,
    end: StrokeSamplePoint,
    startRadius: number,
    endRadius: number,
  ) => {
    const approximateLength =
      Math.hypot(control.x - start.x, control.y - start.y) +
      Math.hypot(end.x - control.x, end.y - control.y);
    const steps = Math.max(
      12,
      Math.ceil(approximateLength / STROKE_SAMPLE_STEP),
    );

    for (let index = 0; index <= steps; index += 1) {
      const t = index / steps;
      const invT = 1 - t;
      const easedT = t * t * (3 - 2 * t);
      const edgeTaper =
        EDGE_TAPER_RATIO + (1 - EDGE_TAPER_RATIO) * Math.sin(Math.PI * t);
      const radius =
        (startRadius + (endRadius - startRadius) * easedT) * edgeTaper;
      const x =
        invT * invT * start.x + 2 * invT * t * control.x + t * t * end.x;
      const y =
        invT * invT * start.y + 2 * invT * t * control.y + t * t * end.y;

      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.fill();
    }
  };

  const beginStroke = (point: DrawPoint) => {
    const ctx = drawCanvasCTX.current;

    if (!ctx) return;

    setupStrokeContext(ctx);
    const samplePoint = createSamplePoint(point);
    lastPointRef.current = samplePoint;
    lastMidPointRef.current = samplePoint;
    lastRadiusRef.current = BASE_STROKE_WIDTH / 2;

    ctx.beginPath();
    ctx.arc(point.x, point.y, lastRadiusRef.current, 0, Math.PI * 2);
    ctx.fill();
    syncDisplayCanvas();
  };

  const drawStroke = (point: DrawPoint) => {
    const ctx = drawCanvasCTX.current;
    const previousPoint = lastPointRef.current;
    const previousMidPoint = lastMidPointRef.current;

    if (!ctx || !previousPoint || !previousMidPoint) return;

    const samplePoint = createSamplePoint(point);

    const deltaX = samplePoint.x - previousPoint.x;
    const deltaY = samplePoint.y - previousPoint.y;
    if (Math.hypot(deltaX, deltaY) < MIN_POINT_DISTANCE) {
      return;
    }

    setupStrokeContext(ctx);

    const nextMidPoint: StrokeSamplePoint = {
      x: (previousPoint.x + samplePoint.x) / 2,
      y: (previousPoint.y + samplePoint.y) / 2,
      time: samplePoint.time,
    };
    const nextRadius = getStrokeRadius(previousPoint, samplePoint);
    const segmentStartRadius = Math.max(
      MIN_STROKE_WIDTH / 2,
      lastRadiusRef.current,
    );
    const segmentEndRadius = Math.max(MIN_STROKE_WIDTH / 2, nextRadius);

    fillCurveSegment(
      ctx,
      previousMidPoint,
      previousPoint,
      nextMidPoint,
      segmentStartRadius,
      segmentEndRadius,
    );

    lastPointRef.current = samplePoint;
    lastMidPointRef.current = nextMidPoint;
    lastRadiusRef.current = nextRadius;
    syncDisplayCanvas();
  };

  const endStroke = () => {
    const ctx = drawCanvasCTX.current;
    const previousPoint = lastPointRef.current;
    const previousMidPoint = lastMidPointRef.current;

    if (ctx && previousPoint && previousMidPoint) {
      setupStrokeContext(ctx);
      fillCurveSegment(
        ctx,
        previousMidPoint,
        previousPoint,
        previousPoint,
        lastRadiusRef.current,
        Math.max(MIN_STROKE_WIDTH / 2, lastRadiusRef.current * 0.72),
      );
      syncDisplayCanvas();
    }

    lastPointRef.current = null;
    lastMidPointRef.current = null;
    lastRadiusRef.current = BASE_STROKE_WIDTH / 2;
  };

  function downloadCanvas(str: string) {
    let link = document.createElement('a');

    link.download = 'canvas_image.png';

    link.href = str;

    link.click();

    link.remove();
  }

  const onDelete = () => {
    if (drawCanvasCTX.current && chinese.length > 0) {
      drawCanvasCTX.current.clearRect(
        0,
        0,
        canvasSize.cssWidth,
        canvasSize.cssHeight,
      );
      syncDisplayCanvas();
      triggerKey(Clear);
    } else {
      triggerKey(Backspace);
    }
  };

  const onConfirm = () => {
    const firstCandidate = chinese?.[0];

    if (firstCandidate) {
      onDelete();
      onSelectChinese && onSelectChinese(firstCandidate);
      return;
    }

    triggerKey(Enter);
  };

  const { startContinuousTrigger, stopContinuousTrigger } =
    useContinuousTrigger<void>({
      onTrigger: onDelete,
    });
  const generateImage = useDebounceFn(
    () => {
      if (drawCanvasRef.current) {
        const tempUrl = drawCanvasRef.current.toDataURL();

        onRecognition && onRecognition(tempUrl);

        // downloadCanvas(tempUrl);
        // let writeImgEl = document.body.querySelector("#write-img") as HTMLImageElement;
        // console.log("writeImgEl: ", writeImgEl);
        // if (!writeImgEl) {
        //   writeImgEl = document.createElement("img");
        //   writeImgEl.id = "write-img";
        //   writeImgEl.style.position = "fixed";
        //   writeImgEl.style.top = "0px";
        //   writeImgEl.style.left = "0px";
        //   document.body.appendChild(writeImgEl);
        // }
        // writeImgEl.src = tempUrl;
      }
    },
    {
      wait: 300,
    },
  );
  useEventListener(
    'mousedown',
    (e: MouseEvent) => {
      allowMove.current = true;
      beginStroke({ x: e.offsetX, y: e.offsetY });
    },
    {
      target: canvasRef,
    },
  );
  useEventListener(
    'mouseup',
    () => {
      allowMove.current = false;
      endStroke();
      generateImage.run();
    },
    {
      target: writeContentRef.current,
    },
  );
  useEventListener(
    'mousemove',
    (e: MouseEvent) => {
      if (!allowMove.current) return;
      drawStroke({ x: e.offsetX, y: e.offsetY });
    },
    {
      target: canvasRef,
    },
  );
  useEventListener(
    'touchstart',
    (e: TouchEvent) => {
      const touch = e.targetTouches[0];
      const ctx = canvasCTX.current;

      if (!touch || !ctx) return;

      const point = getTouchPoint(touch);
      allowMove.current = true;
      beginStroke(point);
    },
    {
      target: canvasRef,
    },
  );
  useEventListener(
    'touchmove',
    (e: TouchEvent) => {
      const touch = e.targetTouches[0];

      if (!touch || !allowMove.current || !canvasCTX.current) return;

      const point = getTouchPoint(touch);
      drawStroke(point);
    },
    {
      target: canvasRef,
    },
  );
  useEventListener(
    'touchend',
    () => {
      allowMove.current = false;
      endStroke();
      generateImage.run();
    },
    {
      target: writeContentRef.current,
    },
  );
  useLayoutEffect(() => {
    const updateCanvasSize = () => {
      if (!writeContentRef.current) return;

      const { width, height } = writeContentRef.current.getBoundingClientRect();
      const displayScale = Math.min(
        Math.max(window.devicePixelRatio || 1, 1),
        MAX_DISPLAY_SCALE,
      );
      const drawScale = Math.min(
        displayScale * OFFSCREEN_SUPERSAMPLE,
        MAX_DRAW_SCALE,
      );
      const cssWidth = Math.max(1, Math.round(width));
      const cssHeight = Math.max(1, Math.round(height));
      const displayWidth = Math.max(1, Math.round(width * displayScale));
      const displayHeight = Math.max(1, Math.round(height * displayScale));
      const drawWidth = Math.max(1, Math.round(width * drawScale));
      const drawHeight = Math.max(1, Math.round(height * drawScale));

      setCanvasSize((prev) => {
        if (
          prev.cssWidth === cssWidth &&
          prev.cssHeight === cssHeight &&
          prev.displayWidth === displayWidth &&
          prev.displayHeight === displayHeight &&
          prev.drawWidth === drawWidth &&
          prev.drawHeight === drawHeight
        ) {
          return prev;
        }

        return {
          cssWidth,
          cssHeight,
          displayWidth,
          displayHeight,
          drawWidth,
          drawHeight,
        };
      });
    };

    updateCanvasSize();
    const frameId = window.requestAnimationFrame(() => {
      updateCanvasSize();
    });

    const resizeObserver = new ResizeObserver(() => {
      updateCanvasSize();
    });

    if (writeContentRef.current) {
      resizeObserver.observe(writeContentRef.current);
    }

    window.addEventListener('resize', updateCanvasSize);

    return () => {
      window.cancelAnimationFrame(frameId);
      resizeObserver.disconnect();
      window.removeEventListener('resize', updateCanvasSize);
    };
  }, []);

  useLayoutEffect(() => {
    const displayCanvas = canvasRef.current;

    if (!displayCanvas) return;

    const displayContext = displayCanvas.getContext('2d');

    if (!displayContext) return;

    let drawCanvas = drawCanvasRef.current;
    if (!drawCanvas) {
      drawCanvas = document.createElement('canvas');
      drawCanvasRef.current = drawCanvas;
    }

    const drawContext = drawCanvas.getContext('2d');

    if (!drawContext) return;

    const previousCanvasSize = previousCanvasSizeRef.current;
    let snapshotCanvas: HTMLCanvasElement | null = null;

    if (
      drawCanvas.width > 0 &&
      drawCanvas.height > 0 &&
      previousCanvasSize
    ) {
      snapshotCanvas = document.createElement('canvas');
      snapshotCanvas.width = drawCanvas.width;
      snapshotCanvas.height = drawCanvas.height;
      const snapshotContext = snapshotCanvas.getContext('2d');

      if (snapshotContext) {
        snapshotContext.drawImage(drawCanvas, 0, 0);
      }
    }

    displayCanvas.width = canvasSize.displayWidth;
    displayCanvas.height = canvasSize.displayHeight;
    drawCanvas.width = canvasSize.drawWidth;
    drawCanvas.height = canvasSize.drawHeight;

    const drawScaleX = canvasSize.drawWidth / canvasSize.cssWidth;
    const drawScaleY = canvasSize.drawHeight / canvasSize.cssHeight;

    canvasCTX.current = displayContext;
    drawCanvasCTX.current = drawContext;
    drawContext.setTransform(drawScaleX, 0, 0, drawScaleY, 0, 0);
    drawContext.imageSmoothingEnabled = true;
    drawContext.imageSmoothingQuality = 'high';
    setupStrokeContext(drawContext);

    if (snapshotCanvas && previousCanvasSize) {
      drawContext.drawImage(
        snapshotCanvas,
        0,
        0,
        previousCanvasSize.cssWidth,
        previousCanvasSize.cssHeight,
      );
    }

    previousCanvasSizeRef.current = canvasSize;
    syncDisplayCanvas();
  }, [canvasSize]);

  return (
    <div className="write-keyboard" onMouseDown={onMouseDown}>
      <CandidateBar
        items={chinese}
        onSelectItem={(item) => {
          onDelete();
          onSelectChinese?.(item);
        }}
      />

      <div className="write-keyboard-area">
        <div className="write-content" ref={writeContentRef}>
          <canvas
            className="write-content-canvas"
            ref={canvasRef}
            width={canvasSize.displayWidth}
            height={canvasSize.displayHeight}
            style={{
              width: `${canvasSize.cssWidth}px`,
              height: `${canvasSize.cssHeight}px`,
            }}
          />
          <div className="write-content-tips">单字</div>
        </div>
        <div className="write-control">
          <div
            className={`write-control-backspace ${
              isKeyActive?.(Backspace) ? 'write-control-backspace-active' : ''
            }`}
            onClick={(e) => e.preventDefault()}
            onMouseDown={(e) => {
              e.preventDefault();
              startContinuousTrigger(undefined, 'mouse');
            }}
            onMouseUp={() => stopContinuousTrigger('mouse')}
            onMouseLeave={() => stopContinuousTrigger('mouse')}
            onTouchStart={(e) => {
              e.preventDefault();
              markTouchInteraction();
              startContinuousTrigger(undefined, 'touch');
            }}
            onTouchEnd={() => stopContinuousTrigger('touch')}
            onTouchCancel={() => stopContinuousTrigger('touch')}
          >
            {/* Del */}
            <DeleteSvg />
          </div>
          <div
            className={`write-control-enter ${
              isKeyActive?.(Enter) ? 'write-control-enter-active' : ''
            }`}
            onClick={() => {
              if (shouldIgnoreClick()) return;
              onConfirm();
            }}
            onTouchStart={(e) => {
              e.preventDefault();
              markTouchInteraction();
              onConfirm();
            }}
          >
            {/* Enter */}
            <EnterSvg />
          </div>
        </div>
      </div>
    </div>
  );
};
export default WriteKeyboard;
