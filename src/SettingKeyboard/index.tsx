import { useDebounceFn } from 'ahooks';
import React, { useEffect, useState } from 'react';

import {
  FixedBottomPosition,
  FixedLeftPosition,
  FixedRightPosition,
  FixedTopPosition,
} from '../keys';
import { VKB } from '../typing';
import './style.css';

import { backgroundAudioKeys, positionKeys, themeKeys } from '../keys';

const WIDTH_MIN = 280;
const WIDTH_MAX = 1000;
const HEIGHT_MIN = 180;
const HEIGHT_MAX = 800;
const FONT_SIZE_MIN = 12;
const FONT_SIZE_MAX = 28;
const SIZE_STEP = 10;

const clampValue = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max);

const formatPx = (value: number) => `${value}px`;

const stopDragBubble = (
  e:
    | React.MouseEvent<HTMLElement>
    | React.TouchEvent<HTMLElement>
    | React.PointerEvent<HTMLElement>,
) => {
  e.stopPropagation();
};

const SettingKeyboard = ({
  themeMode,
  positionMode,
  vkbKeydownAudio,
  width,
  height,
  fontSize,
  onWidthChange,
  onHeightChange,
  onFontSizeChange,
  onClick,
}: {
  themeMode: string;
  positionMode: string;
  vkbKeydownAudio: string;
  width: string;
  height: string;
  fontSize: string;
  onWidthChange: (width: string) => void;
  onHeightChange: (height: string) => void;
  onFontSizeChange: (fontSize: string) => void;
  onClick: (e: VKB.KeyboardAttributeType) => void;
}) => {
  const currentWidth = clampValue(
    parseFloat(width) || 500,
    WIDTH_MIN,
    WIDTH_MAX,
  );
  const currentHeight = clampValue(
    parseFloat(height) || 320,
    HEIGHT_MIN,
    HEIGHT_MAX,
  );
  const currentFontSize = clampValue(
    parseFloat(fontSize) || 14,
    FONT_SIZE_MIN,
    FONT_SIZE_MAX,
  );
  const [draftWidth, setDraftWidth] = useState(currentWidth);
  const [draftHeight, setDraftHeight] = useState(currentHeight);
  const [draftFontSize, setDraftFontSize] = useState(currentFontSize);

  const canResizeWidth =
    positionMode === 'float' ||
    positionMode === FixedLeftPosition.code ||
    positionMode === FixedRightPosition.code;

  const canResizeHeight =
    positionMode === 'float' ||
    positionMode === FixedBottomPosition.code ||
    positionMode === FixedTopPosition.code;

  useEffect(() => {
    setDraftWidth(currentWidth);
  }, [currentWidth]);

  useEffect(() => {
    setDraftHeight(currentHeight);
  }, [currentHeight]);

  useEffect(() => {
    setDraftFontSize(currentFontSize);
  }, [currentFontSize]);

  const { run: commitWidth } = useDebounceFn(
    (nextValue: number) => {
      onWidthChange(formatPx(nextValue));
    },
    { wait: 120 },
  );

  const { run: commitHeight } = useDebounceFn(
    (nextValue: number) => {
      onHeightChange(formatPx(nextValue));
    },
    { wait: 120 },
  );

  const { run: commitFontSize } = useDebounceFn(
    (nextValue: number) => {
      onFontSizeChange(formatPx(nextValue));
    },
    { wait: 120 },
  );

  const changeWidth = (nextValue: number) => {
    const normalizedValue = clampValue(nextValue, WIDTH_MIN, WIDTH_MAX);

    setDraftWidth(normalizedValue);
    commitWidth(normalizedValue);
  };

  const changeHeight = (nextValue: number) => {
    const normalizedValue = clampValue(nextValue, HEIGHT_MIN, HEIGHT_MAX);

    setDraftHeight(normalizedValue);
    commitHeight(normalizedValue);
  };

  const changeFontSize = (nextValue: number) => {
    const normalizedValue = clampValue(nextValue, FONT_SIZE_MIN, FONT_SIZE_MAX);

    setDraftFontSize(normalizedValue);
    commitFontSize(normalizedValue);
  };

  return (
    <div className="setting-keyboard">
      <div className="setting-keyboard-item">
        <div>主题配置：</div>
        <div className="setting-keyboard-box">
          {themeKeys?.map((item) => {
            return (
              <div className="setting-keyboard-wrapper" key={item.keyCode}>
                <div
                  className={`setting-keyboard-box-item ${
                    item.code === themeMode
                      ? 'setting-keyboard-box-item-active'
                      : ''
                  }`}
                  onClick={() => onClick(item)}
                  title={item.description}
                >
                  {item.renderKey || item.key}
                </div>
                <div>{item.description}</div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="setting-keyboard-item">
        <div>键盘位置：</div>
        <div className="setting-keyboard-box">
          {positionKeys?.map((item) => {
            return (
              <div className="setting-keyboard-wrapper" key={item.keyCode}>
                <div
                  className={`setting-keyboard-box-item ${
                    item.code === positionMode
                      ? 'setting-keyboard-box-item-active'
                      : ''
                  }`}
                  onClick={() => onClick(item)}
                  title={item.description}
                >
                  {item.renderKey || item.key}
                </div>
                <div>{item.description}</div>
              </div>
            );
          })}
        </div>
      </div>
      <div className="setting-keyboard-item">
        <div>按键音效：</div>
        <div className="setting-keyboard-box">
          {backgroundAudioKeys?.map((item) => {
            return (
              <div className="setting-keyboard-wrapper" key={item.keyCode}>
                <div
                  className={`setting-keyboard-box-item ${
                    vkbKeydownAudio === 'Y'
                      ? 'setting-keyboard-box-item-active'
                      : ''
                  }`}
                  onClick={() => onClick(item)}
                  title={item.description}
                >
                  {item.renderKey || item.key}
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <div className="setting-keyboard-item">
        <div>键盘尺寸：</div>
        <div className="setting-keyboard-size-box">
          <div className="setting-keyboard-size-item">
            <div className="setting-keyboard-size-header">
              <span>宽度</span>
              <span>{canResizeWidth ? formatPx(draftWidth) : '100%'}</span>
            </div>
            <div className="setting-keyboard-size-control">
              <button
                type="button"
                className="setting-keyboard-size-button"
                disabled={!canResizeWidth}
                onMouseDown={stopDragBubble}
                onTouchStart={stopDragBubble}
                onPointerDown={stopDragBubble}
                onClick={() => changeWidth(currentWidth - SIZE_STEP)}
              >
                -
              </button>
              <input
                className="setting-keyboard-size-range"
                type="range"
                min={WIDTH_MIN}
                max={WIDTH_MAX}
                step={SIZE_STEP}
                value={draftWidth}
                disabled={!canResizeWidth}
                onMouseDown={stopDragBubble}
                onTouchStart={stopDragBubble}
                onPointerDown={stopDragBubble}
                onClick={stopDragBubble}
                onChange={(e) => changeWidth(Number(e.target.value))}
              />
              <button
                type="button"
                className="setting-keyboard-size-button"
                disabled={!canResizeWidth}
                onMouseDown={stopDragBubble}
                onTouchStart={stopDragBubble}
                onPointerDown={stopDragBubble}
                onClick={() => changeWidth(currentWidth + SIZE_STEP)}
              >
                +
              </button>
            </div>
            <div className="setting-keyboard-size-tips">
              {canResizeWidth
                ? '浮动、靠左、靠右时宽度生效'
                : '靠上、靠下时宽度固定为 100%'}
            </div>
          </div>

          <div className="setting-keyboard-size-item">
            <div className="setting-keyboard-size-header">
              <span>高度</span>
              <span>{canResizeHeight ? formatPx(draftHeight) : '100%'}</span>
            </div>
            <div className="setting-keyboard-size-control">
              <button
                type="button"
                className="setting-keyboard-size-button"
                disabled={!canResizeHeight}
                onMouseDown={stopDragBubble}
                onTouchStart={stopDragBubble}
                onPointerDown={stopDragBubble}
                onClick={() => changeHeight(currentHeight - SIZE_STEP)}
              >
                -
              </button>
              <input
                className="setting-keyboard-size-range"
                type="range"
                min={HEIGHT_MIN}
                max={HEIGHT_MAX}
                step={SIZE_STEP}
                value={draftHeight}
                disabled={!canResizeHeight}
                onMouseDown={stopDragBubble}
                onTouchStart={stopDragBubble}
                onPointerDown={stopDragBubble}
                onClick={stopDragBubble}
                onChange={(e) => changeHeight(Number(e.target.value))}
              />
              <button
                type="button"
                className="setting-keyboard-size-button"
                disabled={!canResizeHeight}
                onMouseDown={stopDragBubble}
                onTouchStart={stopDragBubble}
                onPointerDown={stopDragBubble}
                onClick={() => changeHeight(currentHeight + SIZE_STEP)}
              >
                +
              </button>
            </div>
            <div className="setting-keyboard-size-tips">
              {canResizeHeight
                ? '浮动、靠上、靠下时高度生效'
                : '靠左、靠右时高度固定为 100%'}
            </div>
          </div>
        </div>
      </div>
      <div className="setting-keyboard-item">
        <div>按键文字大小：</div>
        <div className="setting-keyboard-size-box">
          <div className="setting-keyboard-size-item">
            <div className="setting-keyboard-size-header">
              <span>字体</span>
              <span>{formatPx(draftFontSize)}</span>
            </div>
            <div className="setting-keyboard-size-control">
              <button
                type="button"
                className="setting-keyboard-size-button"
                onMouseDown={stopDragBubble}
                onTouchStart={stopDragBubble}
                onPointerDown={stopDragBubble}
                onClick={() => changeFontSize(draftFontSize - 1)}
              >
                -
              </button>
              <input
                className="setting-keyboard-size-range"
                type="range"
                min={FONT_SIZE_MIN}
                max={FONT_SIZE_MAX}
                step={1}
                value={draftFontSize}
                onMouseDown={stopDragBubble}
                onTouchStart={stopDragBubble}
                onPointerDown={stopDragBubble}
                onClick={stopDragBubble}
                onChange={(e) => changeFontSize(Number(e.target.value))}
              />
              <button
                type="button"
                className="setting-keyboard-size-button"
                onMouseDown={stopDragBubble}
                onTouchStart={stopDragBubble}
                onPointerDown={stopDragBubble}
                onClick={() => changeFontSize(draftFontSize + 1)}
              >
                +
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingKeyboard;
