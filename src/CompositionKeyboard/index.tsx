import React, { CSSProperties, ReactNode, useCallback, useRef } from 'react';

import { ReactComponent as MoveSvg } from '../svg/move.svg';

// import EmjoSvg from './svg/emjo.svg?react'
import { ReactComponent as BottomSvg } from '../svg/bottom.svg';

import { VKB } from '../typing';

import { FloatPosition, LightTheme, numberType } from '../keys';
import './style.css';

import useInput from '../hooks/useInput';
import { pinyin2ChineseV2 } from '../utils/pinyin';
import tabs from './KeyboardTabs';

const TOUCH_CLICK_GUARD_MS = 800;
/**
 * 组合键盘
 *
 * @return {*}
 */
const CompositionKeyboard = ({
  style,
  showDragHandle = true,
  showHiddenHandle = true,
  defaultActiveKeyboard = numberType,
  virtualKeyboardTab = tabs,
  moveLabel = <MoveSvg />,
  hiddenLabel = <BottomSvg />,
  themeMode = LightTheme.code,
  positionMode = FloatPosition.code,
  width = '500px',
  height = '320px',
  fontSize = '14px',
  fontFamily = "'Microsoft YaHei', 'PingFang SC', sans-serif",
  numberKeyboardLayoutMode = 'asc',
  focusShow,
  useKeydownAudio = 'Y',
  keydownAudioUrl = '/audio/typing-sound-02-229861.mp3',
  onChangeShow,
  onThemeModeChange,
  onPositionModeChange,
  onWidthChange,
  onHeightChange,
  onFontSizeChange,
  onFontFamilyChange,
  onNumberKeyboardLayoutModeChange,
  onUseKeydownAudioChange,
  onKeydownAudioUrlChange,
}: {
  /** 显示拖拽 */
  showDragHandle?: boolean;
  /** 显示隐藏 */
  showHiddenHandle?: boolean;
  /** 样式 */
  style?: CSSProperties;
  /** 默认活动的键盘 */
  defaultActiveKeyboard?: string;
  /** 需要渲染的虚拟键盘 */
  virtualKeyboardTab?: VKB.KeyboardTabItem[];
  /** 移动 */
  moveLabel?: ReactNode;
  /** 隐藏 */
  hiddenLabel?: ReactNode;
  /** 主题 */
  themeMode?: string;
  /** 位置 */
  positionMode?: string;
  /** 宽度 */
  width?: string;
  /** 高度 */
  height?: string;
  /** 按键文字大小 */
  fontSize?: string;
  /** 按键字体 */
  fontFamily?: string;
  /** 数字键盘排列 */
  numberKeyboardLayoutMode?: VKB.NumberKeyboardLayoutMode;
  /** 输入框 focus 时是否自动显示键盘 */
  focusShow?: boolean;
  /** 是否使用键盘按键声音 */
  useKeydownAudio?: 'Y' | 'N';
  /** 键盘按键声音地址 */
  keydownAudioUrl?: string;
  /** 显示/隐藏虚拟键盘 */
  onChangeShow?: (b: boolean) => void;
  /** 主题改变 */
  onThemeModeChange?: (mode: string) => void;
  /** 位置模式改变 */
  onPositionModeChange?: (mode: string) => void;
  /** 宽度改变 */
  onWidthChange?: (width: string) => void;
  /** 高度改变 */
  onHeightChange?: (height: string) => void;
  /** 按键文字大小改变 */
  onFontSizeChange?: (fontSize: string) => void;
  /** 按键字体改变 */
  onFontFamilyChange?: (fontFamily: string) => void;
  /** 数字键盘排列改变 */
  onNumberKeyboardLayoutModeChange?: (
    mode: VKB.NumberKeyboardLayoutMode,
  ) => void;
  /** 使用改变 */
  onUseKeydownAudioChange?: (mode: 'Y' | 'N') => void;
  /** 地址改变 */
  onKeydownAudioUrlChange?: (url: string) => void;
}) => {
  const {
    inputMode,
    inputValue,
    vkbThemeMode,
    vkbPositionMode,
    vkbKeydownAudio,
    chinese,
    activeKeyboard,
    setActiveKeyboard,
    onClick,
    onMouseDown,
    onSelectChinese,
    onChangeInputMode,
    onRecognition,
    onKeyDown,
    onKeyUp,
    isKeyActive,
    capsLockActive,
  } = useInput({
    themeMode,
    positionMode,
    defaultActiveKeyboard,
    focusShow,
    useKeydownAudio,
    keydownAudioUrl,
    onChangeShow,
    onThemeModeChange,
    onPositionModeChange,
    onUseKeydownAudioChange,
    onKeydownAudioUrlChange,
    onPinyin2Chinese: pinyin2ChineseV2,
  });
  const lastTouchAtRef = useRef(0);

  const markTouchInteraction = useCallback(() => {
    lastTouchAtRef.current = Date.now();
  }, []);

  const shouldIgnoreCompatClick = useCallback(() => {
    return Date.now() - lastTouchAtRef.current < TOUCH_CLICK_GUARD_MS;
  }, []);

  const stopTouchEvent = (e: React.TouchEvent<HTMLElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const shouldAllowTouchMove = (target: EventTarget | null) => {
    if (!(target instanceof HTMLElement)) {
      return false;
    }

    return !!target.closest('.write-content');
  };

  return (
    <div
      style={{
        touchAction: 'none',
        ...style,
      }}
      className={`virtual-keyboard virtual-keyboard-var virtual-keyboard-var-${vkbThemeMode}`}
      onMouseDown={onMouseDown}
      onTouchStart={onMouseDown}
      onTouchStartCapture={() => {
        markTouchInteraction();
      }}
      onTouchMoveCapture={(e) => {
        if (shouldAllowTouchMove(e.target)) {
          return;
        }

        e.preventDefault();
      }}
      onClickCapture={(e) => {
        if (!shouldIgnoreCompatClick()) return;

        e.preventDefault();
        e.stopPropagation();
      }}
    >
      <div className="virtual-keyboard-tab" id="keyboard-tab">
        {showDragHandle && vkbPositionMode === FloatPosition.code ? (
          <div id="keyboard-tab-move" className="keyboard-tab-move">
            {moveLabel ? moveLabel : <MoveSvg id="move" />}
          </div>
        ) : (
          ''
        )}

        {virtualKeyboardTab.map((item) => {
          return (
            <div
              className={`keyboard-tab ${
                activeKeyboard === item.id ? 'keyboard-tab-active' : ''
              }`}
              key={item.id}
              onClick={() => {
                setActiveKeyboard(item.id);
              }}
              onTouchStart={(e) => {
                stopTouchEvent(e);
                setActiveKeyboard(item.id);
              }}
            >
              {item.label}
            </div>
          );
        })}
        {showHiddenHandle && (
          <div
            className="keyboard-tab-down "
            onClick={(e) => {
              e.stopPropagation();
              onChangeShow && onChangeShow(false);
            }}
            onTouchStart={(e) => {
              stopTouchEvent(e);
              onChangeShow && onChangeShow(false);
            }}
          >
            {hiddenLabel ? hiddenLabel : <BottomSvg />}
          </div>
        )}
      </div>
      <div className="virtual-keyboard-content">
        {virtualKeyboardTab.map((item) => {
          return activeKeyboard === item.id ? (
            <item.Component
              key={item.id}
              inputMode={inputMode}
              themeMode={vkbThemeMode}
              positionMode={vkbPositionMode}
              vkbKeydownAudio={vkbKeydownAudio}
              width={width}
              height={height}
              fontSize={fontSize}
              fontFamily={fontFamily}
              numberKeyboardLayoutMode={numberKeyboardLayoutMode}
              capsLockActive={capsLockActive}
              chinese={chinese}
              onClick={onClick}
              isKeyActive={isKeyActive}
              onWidthChange={onWidthChange ?? (() => {})}
              onHeightChange={onHeightChange ?? (() => {})}
              onFontSizeChange={onFontSizeChange ?? (() => {})}
              onFontFamilyChange={onFontFamilyChange ?? (() => {})}
              onNumberKeyboardLayoutModeChange={
                onNumberKeyboardLayoutModeChange ?? (() => {})
              }
              onChangeInputMode={onChangeInputMode}
              inputValue={inputValue}
              onSelectChinese={onSelectChinese}
              onMouseDown={onMouseDown}
              onRecognition={onRecognition}
              onKeyDown={onKeyDown}
              onKeyUp={onKeyUp}
            />
          ) : (
            ''
          );
        })}
      </div>
    </div>
  );
};
export default CompositionKeyboard;
