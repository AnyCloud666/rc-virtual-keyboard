import { useDebounceFn, useEventListener } from 'ahooks';
import React, { CSSProperties, useEffect, useRef, useState } from 'react';
import { ReactComponent as DeleteSvg } from '../svg/delete.svg';
import { ReactComponent as EnterSvg } from '../svg/enter.svg';
import { VKB } from '../typing';
import './style.css';
const WriteKeyboard = ({
  style,
  onClick,
}: {
  style: CSSProperties;
  onClick?: (e: VKB.KeyboardAttributeType) => void;
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const canvasCTX = useRef<CanvasRenderingContext2D | null>(null);
  const writeContentRef = useRef<HTMLDivElement | null>(null);
  const allowMove = useRef(false);
  const [canvasRect, setCanvasRect] = useState({
    width: '200px',
    height: '200px',
  });

  const onDelete = () => {
    if (canvasCTX.current) {
      canvasCTX.current.clearRect(0, 0, 10000, 10000);
    }
  };
  const generateImage = useDebounceFn(
    () => {
      if (canvasRef.current) {
        const tempUrl = canvasRef.current?.toDataURL();
        console.log('tempUrl: ', tempUrl);
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
      wait: 1000,
    },
  );
  useEventListener(
    'mousedown',
    (e: MouseEvent) => {
      allowMove.current = true;
      const ctx = canvasCTX.current;
      if (ctx) {
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.lineWidth = 6;
        ctx.beginPath(); // 开始路径
        ctx.moveTo(e.offsetX, e.offsetY);
      }
    },
    {
      target: canvasRef,
    },
  );
  useEventListener(
    'mouseup',
    () => {
      allowMove.current = false;
      const ctx = canvasCTX.current;

      ctx && ctx.closePath();
      generateImage.run();
    },
    {
      target: window,
    },
  );
  useEventListener(
    'mousemove',
    (e: MouseEvent) => {
      if (allowMove.current && canvasCTX.current) {
        const ctx = canvasCTX.current;
        ctx.lineWidth = 6;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.lineTo(e.offsetX, e.offsetY);
        ctx.stroke();
      }
    },
    {
      target: canvasRef,
    },
  );
  useEffect(() => {
    if (canvasRef.current) {
      canvasCTX.current = canvasRef.current.getContext(
        '2d',
      ) as CanvasRenderingContext2D;
    }
    if (writeContentRef.current) {
      const { width, height } = writeContentRef.current.getBoundingClientRect();
      setCanvasRect({
        width: width + 'px',
        height: height + 'px',
      });
    }
  }, []);

  return (
    <div style={style} className="write-keyboard">
      <div className="write-content" ref={writeContentRef}>
        <canvas
          className="write-content-canvas"
          ref={canvasRef}
          {...canvasRect}
        />
        <div className="write-content-tips">单字</div>
      </div>
      <div className="write-control">
        <div className="write-control-backspace" onClick={onDelete}>
          {/* Del */}
          <DeleteSvg />
        </div>
        <div className="write-control-enter" onClick={generateImage.run}>
          {/* Enter */}
          <EnterSvg />
        </div>
      </div>
    </div>
  );
};
export default WriteKeyboard;
