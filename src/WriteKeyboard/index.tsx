import { useDebounceFn, useEventListener } from 'ahooks';
import React, { CSSProperties, useEffect, useRef, useState } from 'react';
import { Backspace, Enter } from '../keys';
import { ReactComponent as DeleteSvg } from '../svg/delete.svg';
import { ReactComponent as EnterSvg } from '../svg/enter.svg';

import WordTempList from '../WordTempList';
import { VKB } from '../typing';
import './style.css';
const WriteKeyboard = ({
  words,
  style,
  styles,
  onClick,
  onDraw,
  onSelectWord,
  onMouseDown = (e) => e.preventDefault(),
}: {
  words?: string[];
  style?: CSSProperties;
  styles?: {
    /** 书写区域 */
    writeContent?: CSSProperties;
    /** 书写区域内部canvas */
    writeContentCanvas?: CSSProperties;
    /** 内容提示 */
    writeContentTips?: CSSProperties;
    /** 书写控制区 */
    writeControl?: CSSProperties;
    /** 删除键 */
    writeControlBackspace?: CSSProperties;
    /** 回车键 */
    writeControlEnter?: CSSProperties;
    /** 手写识别到的临时区域 */
    writeKeyboardTemp?: CSSProperties;
    /** 左侧翻页 */
    writeKeyboardTempLeft?: CSSProperties;
    /** 识别到的字符列表 */
    writeKeyboardTempList?: CSSProperties;
    /** 识别到的字符 */
    writeKeyboardTempChar?: CSSProperties;
    /** 右侧翻页 */
    writeKeyboardTempRight?: CSSProperties;
  };
  onClick?: (e: VKB.KeyboardAttributeType) => void;
  onDraw?: (img: string) => void;
  onSelectWord?: (word: string) => void;
  onMouseDown?: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const canvasCTX = useRef<CanvasRenderingContext2D | null>(null);
  const writeContentRef = useRef<HTMLDivElement | null>(null);
  const allowMove = useRef(false);
  const imgUrl = useRef('');

  const [canvasRect, setCanvasRect] = useState({
    width: '200px',
    height: '200px',
  });

  const onDelete = () => {
    if (canvasCTX.current) {
      canvasCTX.current.clearRect(0, 0, 10000, 10000);
      if (imgUrl.current) {
        imgUrl.current = '';
        onDraw && onDraw('');
      } else {
        onClick && onClick(Backspace);
      }
    }
  };
  const generateImage = useDebounceFn(
    () => {
      if (canvasRef.current) {
        const tempUrl = canvasRef.current?.toDataURL();

        imgUrl.current = tempUrl;
        onDraw && onDraw(tempUrl);
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
    <div style={style} className="write-keyboard" onMouseDown={onMouseDown}>
      {words && words.length > 0 && (
        <WordTempList words={words} onSelectWord={onSelectWord} />
      )}
      <div
        style={styles?.writeContent}
        className="write-content"
        ref={writeContentRef}
      >
        <canvas
          style={styles?.writeContentCanvas}
          className="write-content-canvas"
          ref={canvasRef}
          {...canvasRect}
        />
        <div style={styles?.writeContentTips} className="write-content-tips">
          单字
        </div>
      </div>
      <div style={styles?.writeControl} className="write-control">
        <div
          style={styles?.writeControlBackspace}
          className="write-control-backspace"
          onClick={onDelete}
        >
          {/* Del */}
          <DeleteSvg />
        </div>
        <div
          style={styles?.writeControlEnter}
          className="write-control-enter"
          onClick={() => onClick && onClick(Enter)}
        >
          {/* Enter */}
          <EnterSvg />
        </div>
      </div>
    </div>
  );
};
export default WriteKeyboard;
