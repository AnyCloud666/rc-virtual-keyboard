import React, { CSSProperties, ReactNode } from 'react';

import { ReactComponent as MoveSvg } from '../svg/move.svg';

// import EmjoSvg from './svg/emjo.svg?react'
import { ReactComponent as BottomSvg } from '../svg/bottom.svg';

import { VKB } from '../typing';

import { FloatPosition, LightTheme, numberType } from '../keys';
import './style.css';

import useInput from '../hooks/useInput';
import { pinyin2ChineseV1 } from '../utils/pinyin';
import tabs from './KeyboardTabs';
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
  useKeydownAudio = 'Y',
  keydownAudioUrl = '/audio/typing-sound-02-229861.mp3',
  onChangeShow,
  onThemeModeChange,
  onPositionModeChange,
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
  } = useInput({
    themeMode,
    positionMode,
    defaultActiveKeyboard,
    useKeydownAudio,
    keydownAudioUrl,
    onChangeShow,
    onThemeModeChange,
    onPositionModeChange,
    onUseKeydownAudioChange,
    onKeydownAudioUrlChange,
    onPinyin2Chinese: pinyin2ChineseV1,
  });

  return (
    <div
      style={style}
      className={`virtual-keyboard virtual-keyboard-var virtual-keyboard-var-${vkbThemeMode}`}
      onMouseDown={onMouseDown}
      onTouchStart={onMouseDown}
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
              chinese={chinese}
              onClick={onClick}
              onChangeInputMode={onChangeInputMode}
              inputValue={inputValue}
              onSelectChinese={onSelectChinese}
              onMouseDown={(e) => {
                e.preventDefault();
              }}
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
