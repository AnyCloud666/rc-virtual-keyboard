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
 * 虚拟键盘
 *
 * @return {*}
 */
const Keyboard = ({
  style,
  options,
  showDragHandle,
  defaultActiveKeyboard = numberType,
  virtualKeyboardTab = tabs,
  moveLabel = <MoveSvg />,
  hiddenLabel = <BottomSvg />,
  themeMode = LightTheme.code,
  positionMode = FloatPosition.code,

  onEnter,
  onShow,
  onHidden,
  onChange,
  onThemeModeChange,
  onPositionModeChange,
}: {
  /** 显示拖拽 */
  showDragHandle?: boolean;
  /** 样式 */
  style?: CSSProperties;
  /** 附加参数 */
  options?: Record<string, any>;
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
  /** enter 方法回调 */
  onEnter?: () => void;
  /** 输入回调 */
  onChange?: (value: string, options?: Record<string, any>) => void;
  /** 隐藏 */
  onHidden?: () => void;
  /** 显示 */
  onShow?: () => void;
  /** 主题改变 */
  onThemeModeChange?: (mode: string) => void;
  /** 位置模式改变 */
  onPositionModeChange?: (mode: string) => void;
}) => {
  const {
    inputMode,
    inputValue,
    vkbThemeMode,
    vkbPositionMode,
    chinese,
    activeKeyboard,
    setActiveKeyboard,
    onClick,
    onMouseDown,
    onSelectChinese,
    onChangeInputMode,
  } = useInput({
    themeMode,
    positionMode,
    defaultActiveKeyboard,
    onShow,
    onChange,
    onEnter,
    onThemeModeChange,
    onPositionModeChange,
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

        <div
          className="keyboard-tab-down "
          onClick={(e) => {
            e.stopPropagation();
            onHidden && onHidden();
          }}
        >
          {hiddenLabel ? hiddenLabel : <BottomSvg />}
        </div>
      </div>
      <div className="virtual-keyboard-content">
        {virtualKeyboardTab.map((item) => {
          return activeKeyboard === item.id ? (
            <item.Component
              key={item.id}
              inputMode={inputMode}
              themeMode={vkbThemeMode}
              positionMode={vkbPositionMode}
              chinese={chinese}
              onClick={onClick}
              onChangeInputMode={onChangeInputMode}
              inputValue={inputValue}
              onSelectChinese={onSelectChinese}
              onMouseDown={(e) => {
                e.preventDefault();
              }}
            />
          ) : (
            ''
          );
        })}
      </div>
    </div>
  );
};
export default Keyboard;
