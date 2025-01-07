import { useDebounceFn, useEventListener } from 'ahooks';
import React, { useEffect, useRef, useState } from 'react';
import { ReactComponent as DeleteSvg } from '../svg/delete.svg';
import { ReactComponent as EnterSvg } from '../svg/enter.svg';
import { ReactComponent as LeftSvg } from '../svg/left.svg';
import { ReactComponent as RightSvg } from '../svg/right.svg';

import { Backspace, Clear, Enter } from '../keys';
import { VKB } from '../typing';
import './style.css';
const WriteKeyboard = ({
  chinese,
  onClick,
  onSelectChinese,
  onRecognition,
  onMouseDown,
}: {
  chinese: string[];
  onClick?: (e: VKB.KeyboardAttributeType) => void;
  onSelectChinese?: (chinese: string) => void;
  /** 识别图片 */
  onRecognition?: (url: string) => void;
  onMouseDown?: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
}) => {
  /** 临时输入区引用 */
  const tempInputAreaRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const canvasCTX = useRef<CanvasRenderingContext2D | null>(null);
  const writeContentRef = useRef<HTMLDivElement | null>(null);
  const allowMove = useRef(false);
  const [canvasRect, setCanvasRect] = useState({
    width: '200px',
    height: '200px',
  });

  const onDelete = () => {
    if (canvasCTX.current && chinese.length > 0) {
      canvasCTX.current.clearRect(0, 0, 10000, 10000);
      onClick && onClick(Clear);
    } else {
      onClick && onClick(Backspace);
    }
  };
  const generateImage = useDebounceFn(
    () => {
      if (canvasRef.current) {
        const tempUrl = canvasRef.current?.toDataURL();

        onRecognition && onRecognition(tempUrl);

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
      target: writeContentRef.current,
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
    <div className="write-keyboard" onMouseDown={onMouseDown}>
      {chinese && chinese.length > 0 && (
        <div className="write-keyboard-temp">
          <div className="write-keyboard-temp-left">
            <LeftSvg />
          </div>
          <div className="write-keyboard-temp-list" ref={tempInputAreaRef}>
            {chinese?.map((item, index) => {
              return (
                <div
                  key={index}
                  className="letter-keyboard-temp-char"
                  onClick={() => {
                    onDelete();
                    onSelectChinese && onSelectChinese(item);
                  }}
                >
                  {item}
                </div>
              );
            })}
          </div>
          <div className="write-keyboard-temp-right">
            <RightSvg />
          </div>
        </div>
      )}

      <div className="write-keyboard-area">
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
          <div
            className="write-control-enter"
            onClick={() => {
              onClick && onClick(Enter);
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
