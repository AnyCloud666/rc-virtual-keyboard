import { useDebounceFn } from 'ahooks';
import React, { createContext, useContext, useEffect, useState } from 'react';

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

const FONT_FAMILY_OPTIONS = [
  {
    label: '默认',
    value: "'Microsoft YaHei', 'PingFang SC', sans-serif",
    preview: '文Aa',
  },
  {
    label: '苹方',
    value: "'PingFang SC', 'Microsoft YaHei', sans-serif",
    preview: '苹Aa',
  },
  {
    label: '微软雅黑',
    value: "'Microsoft YaHei', 'PingFang SC', sans-serif",
    preview: '雅黑',
  },
  {
    label: '宋体',
    value: "'SimSun', 'Songti SC', serif",
    preview: '宋Aa',
  },
  {
    label: '仿宋',
    value: "'FangSong', 'STFangsong', serif",
    preview: '仿Aa',
  },
  {
    label: '楷体',
    value: "'KaiTi', 'STKaiti', serif",
    preview: '楷Aa',
  },
  {
    label: '黑体',
    value: "'SimHei', 'Heiti SC', sans-serif",
    preview: '黑Aa',
  },
  {
    label: '圆体',
    value: "'YouYuan', 'Hiragino Sans GB', sans-serif",
    preview: '圆Aa',
  },
  {
    label: 'Arial',
    value: "'Arial', 'Helvetica Neue', sans-serif",
    preview: 'Arial',
  },
  {
    label: 'Georgia',
    value: "'Georgia', 'Times New Roman', serif",
    preview: 'Geo',
  },
  {
    label: 'Trebuchet',
    value: "'Trebuchet MS', 'Arial', sans-serif",
    preview: 'Treb',
  },
  {
    label: 'Verdana',
    value: "'Verdana', 'Geneva', sans-serif",
    preview: 'VdAa',
  },
  {
    label: '等宽',
    value: "'Consolas', 'Courier New', monospace",
    preview: 'Mono',
  },
  {
    label: 'Courier',
    value: "'Courier New', 'Consolas', monospace",
    preview: 'Code',
  },
  {
    label: 'Times',
    value: "'Times New Roman', 'Georgia', serif",
    preview: 'Time',
  },
] as const;

const NUMBER_KEYBOARD_LAYOUT_OPTIONS = [
  {
    label: (
      <div className="setting-keyboard-number-layout-mini">
        {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((item) => (
          <span key={item}>{item}</span>
        ))}
      </div>
    ),
    value: 'asc',
    preview: 'asc',
  },
  {
    label: (
      <div className="setting-keyboard-number-layout-mini">
        {['7', '8', '9', '4', '5', '6', '1', '2', '3'].map((item) => (
          <span key={item}>{item}</span>
        ))}
      </div>
    ),
    value: 'desc',
    preview: 'desc',
  },
] as const;

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

const keepFocusAndBubble = (
  e: React.MouseEvent<HTMLElement> | React.PointerEvent<HTMLElement>,
) => {
  e.preventDefault();
  e.stopPropagation();
};

const stopTouchAndRun = (
  e: React.TouchEvent<HTMLElement>,
  callback: () => void,
) => {
  e.preventDefault();
  e.stopPropagation();
  callback();
};

export const PinyinLearningSettingContext = createContext<{
  enablePinyinLearning: boolean;
  onUsePinyinLearningChange?: (mode: VKB.PinyinLearningMode) => void;
}>({
  enablePinyinLearning: true,
});

const SettingKeyboard = ({
  themeMode,
  positionMode,
  vkbKeydownAudio,
  width,
  height,
  fontSize,
  fontFamily,
  numberKeyboardLayoutMode,
  onWidthChange,
  onHeightChange,
  onFontSizeChange,
  onFontFamilyChange,
  onNumberKeyboardLayoutModeChange,
  onClick,
  onKeyDown,
  onKeyUp,
}: {
  themeMode: string;
  positionMode: string;
  vkbKeydownAudio: string;
  width: string;
  height: string;
  fontSize: string;
  fontFamily: string;
  numberKeyboardLayoutMode: VKB.NumberKeyboardLayoutMode;
  onWidthChange: (width: string) => void;
  onHeightChange: (height: string) => void;
  onFontSizeChange: (fontSize: string) => void;
  onFontFamilyChange: (fontFamily: string) => void;
  onNumberKeyboardLayoutModeChange?: (
    mode: VKB.NumberKeyboardLayoutMode,
  ) => void;
  onClick?: (e: VKB.KeyboardAttributeType) => void;
  onKeyDown?: (e: VKB.KeyboardAttributeType) => void;
  onKeyUp?: (e: VKB.KeyboardAttributeType) => void;
}) => {
  const pinyinLearningSetting = useContext(PinyinLearningSettingContext);
  const enablePinyinLearning = pinyinLearningSetting.enablePinyinLearning;

  const triggerKey = (item: VKB.KeyboardAttributeType) => {
    onKeyDown?.(item);
    onClick?.(item);
    onKeyUp?.(item);
  };

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
  const [draftFontFamily, setDraftFontFamily] = useState(fontFamily);

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

  useEffect(() => {
    setDraftFontFamily(fontFamily);
  }, [fontFamily]);

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

  const { run: commitFontFamily } = useDebounceFn(
    (nextValue: string) => {
      onFontFamilyChange(nextValue);
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

  const changeFontFamily = (nextValue: string) => {
    setDraftFontFamily(nextValue);
    commitFontFamily(nextValue);
  };

  const sizeControls = [
    canResizeWidth
      ? {
          key: 'width',
          label: positionMode === 'float' ? '宽度' : 'X 轴缩放',
          value: formatPx(draftWidth),
          min: WIDTH_MIN,
          max: WIDTH_MAX,
          step: SIZE_STEP,
          currentValue: currentWidth,
          draftValue: draftWidth,
          onChange: changeWidth,
          tips:
            positionMode === 'float'
              ? '浮动模式下可独立调整横向尺寸'
              : '固定左侧、固定右侧时通过 X 轴调整键盘宽度',
        }
      : null,
    canResizeHeight
      ? {
          key: 'height',
          label: positionMode === 'float' ? '高度' : 'Y 轴缩放',
          value: formatPx(draftHeight),
          min: HEIGHT_MIN,
          max: HEIGHT_MAX,
          step: SIZE_STEP,
          currentValue: currentHeight,
          draftValue: draftHeight,
          onChange: changeHeight,
          tips:
            positionMode === 'float'
              ? '浮动模式下可独立调整纵向尺寸'
              : '固定上方、固定下方时通过 Y 轴调整键盘高度',
        }
      : null,
  ].filter(Boolean) as Array<{
    key: 'width' | 'height';
    label: string;
    value: string;
    min: number;
    max: number;
    step: number;
    currentValue: number;
    draftValue: number;
    onChange: (value: number) => void;
    tips: string;
  }>;

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
                  onClick={() => triggerKey(item)}
                  onTouchStart={(e) => stopTouchAndRun(e, () => triggerKey(item))}
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
                  onClick={() => triggerKey(item)}
                  onTouchStart={(e) => stopTouchAndRun(e, () => triggerKey(item))}
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
                  onClick={() => triggerKey(item)}
                  onTouchStart={(e) => stopTouchAndRun(e, () => triggerKey(item))}
                  title={item.description}
                >
                  {item.renderKey || item.key}
                </div>
              </div>
            );
          })}
        </div>
        <div className="setting-keyboard-size-tips">
          虚拟键盘点击与虚拟键盘打开时的实体键盘输入，都会使用这一项音效开关。
        </div>
      </div>
      <div className="setting-keyboard-item">
        <div>数字排列：</div>
        <div className="setting-keyboard-box">
          {NUMBER_KEYBOARD_LAYOUT_OPTIONS.map((item) => {
            const isActive = numberKeyboardLayoutMode === item.value;

            return (
              <div className="setting-keyboard-wrapper" key={item.value}>
                <button
                  type="button"
                  className={`setting-keyboard-box-item ${
                    isActive ? 'setting-keyboard-box-item-active' : ''
                  }`}
                  onMouseDown={keepFocusAndBubble}
                  onTouchStart={(e) =>
                    stopTouchAndRun(e, () =>
                      onNumberKeyboardLayoutModeChange?.(item.value),
                    )
                  }
                  onPointerDown={keepFocusAndBubble}
                  onClick={() => onNumberKeyboardLayoutModeChange?.(item.value)}
                  title={item.preview}
                >
                  {item.label}
                </button>
                <div>{item.preview}</div>
              </div>
            );
          })}
        </div>
      </div>
      <div className="setting-keyboard-item">
        <div>拼音学习：</div>
        <div className="setting-keyboard-box">
          {(['Y', 'N'] as VKB.PinyinLearningMode[]).map((item) => {
            const isActive =
              (enablePinyinLearning ? 'Y' : 'N') === item;

            return (
              <div className="setting-keyboard-wrapper" key={item}>
                <button
                  type="button"
                  className={`setting-keyboard-box-item ${
                    isActive ? 'setting-keyboard-box-item-active' : ''
                  }`}
                  onMouseDown={keepFocusAndBubble}
                  onTouchStart={(e) =>
                    stopTouchAndRun(e, () =>
                      pinyinLearningSetting.onUsePinyinLearningChange?.(item),
                    )
                  }
                  onPointerDown={keepFocusAndBubble}
                  onClick={() =>
                    pinyinLearningSetting.onUsePinyinLearningChange?.(item)
                  }
                  title={item === 'Y' ? '开启拼音学习' : '关闭拼音学习'}
                >
                  {item === 'Y' ? '开' : '关'}
                </button>
                <div>{item === 'Y' ? '开启' : '关闭'}</div>
              </div>
            );
          })}
        </div>
        <div className="setting-keyboard-size-tips">
          关闭后仍可输入拼音，但不会记录新的选择历史，也不会使用本地学习数据调整候选排序。
        </div>
      </div>
      <div className="setting-keyboard-item">
        <div>键盘尺寸：</div>
        <div className="setting-keyboard-size-box">
          {sizeControls.map((control) => (
            <div className="setting-keyboard-size-item" key={control.key}>
              <div className="setting-keyboard-size-header">
                <span>{control.label}</span>
                <span>{control.value}</span>
              </div>
              <div className="setting-keyboard-size-control">
                <button
                  type="button"
                  className="setting-keyboard-size-button"
                  onMouseDown={stopDragBubble}
                  onTouchStart={(e) =>
                    stopTouchAndRun(e, () =>
                      control.onChange(control.currentValue - control.step),
                    )
                  }
                  onPointerDown={stopDragBubble}
                  onClick={() =>
                    control.onChange(control.currentValue - control.step)
                  }
                >
                  -
                </button>
                <input
                  className="setting-keyboard-size-range"
                  type="range"
                  min={control.min}
                  max={control.max}
                  step={control.step}
                  value={control.draftValue}
                  onMouseDown={stopDragBubble}
                  onTouchStart={stopDragBubble}
                  onPointerDown={stopDragBubble}
                  onClick={stopDragBubble}
                  onChange={(e) => control.onChange(Number(e.target.value))}
                />
                <button
                  type="button"
                  className="setting-keyboard-size-button"
                  onMouseDown={stopDragBubble}
                  onTouchStart={(e) =>
                    stopTouchAndRun(e, () =>
                      control.onChange(control.currentValue + control.step),
                    )
                  }
                  onPointerDown={stopDragBubble}
                  onClick={() =>
                    control.onChange(control.currentValue + control.step)
                  }
                >
                  +
                </button>
              </div>
              <div className="setting-keyboard-size-tips">{control.tips}</div>
            </div>
          ))}
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
                onTouchStart={(e) =>
                  stopTouchAndRun(e, () => changeFontSize(draftFontSize - 1))
                }
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
                onTouchStart={(e) =>
                  stopTouchAndRun(e, () => changeFontSize(draftFontSize + 1))
                }
                onPointerDown={stopDragBubble}
                onClick={() => changeFontSize(draftFontSize + 1)}
              >
                +
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="setting-keyboard-item">
        <div>按键字体：</div>
        <div className="setting-keyboard-box">
          {FONT_FAMILY_OPTIONS.map((item) => {
            const isActive = draftFontFamily === item.value;

            return (
              <div className="setting-keyboard-wrapper" key={item.label}>
                <button
                  type="button"
                  className={`setting-keyboard-box-item setting-keyboard-font-item ${
                    isActive ? 'setting-keyboard-box-item-active' : ''
                  }`}
                  style={{ fontFamily: item.value }}
                  onMouseDown={stopDragBubble}
                  onTouchStart={(e) =>
                    stopTouchAndRun(e, () => changeFontFamily(item.value))
                  }
                  onPointerDown={stopDragBubble}
                  onClick={() => changeFontFamily(item.value)}
                  title={item.label}
                >
                  {item.preview}
                </button>
                <div>{item.label}</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default SettingKeyboard;
