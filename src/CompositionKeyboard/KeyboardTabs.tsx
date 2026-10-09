import React from 'react';

import EmojiKeyboard from '../EmojiKeyboard';
import FunctionKeyboard from '../FunctionKeyboard';
import { ReactComponent as EditSvg } from '../svg/edit.svg';
import { ReactComponent as EmjoSvg } from '../svg/emjo.svg';
import { ReactComponent as FunctionSvg } from '../svg/function.svg';
import { ReactComponent as KeyboardSvg } from '../svg/keyboard.svg';
import { ReactComponent as NumberSvg } from '../svg/number.svg';
import { ReactComponent as SymbolSvg } from '../svg/symbol.svg';
// import EmjoSvg from './svg/emjo.svg?react'

import { ReactComponent as SettingSvg } from '../svg/setting.svg';
import { ReactComponent as StrokeSvg } from '../svg/stroke.svg';

import EditKeyboard from '../EditKeyboard';
import LetterKeyboard from '../LetterKeyboard';
import NumberKeyboard from '../NumberKeyboard';
import SettingKeyBoard from '../SettingKeyboard';
import SymbolKeyboard from '../SymbolKeyboard';
import StrokeKeyboard from '../StrokeKeyboard';
import { EN } from '../keys';
import { VKB } from '../typing';
import './style.css';

const noop = () => {};
/** 字母键tab */
export const LetterKeyboardTab: VKB.KeyboardTabItem = {
  id: 'letter',
  label: <KeyboardSvg />,
  name: '字母键',
  Component: ({
    inputMode,
    inputValue,
    chinese,
    onClick,
    onMouseDown,
    onChangeInputMode,
    onSelectChinese,
    onKeyDown,
    onKeyUp,
    isKeyActive,
    capsLockActive,
  }) => (
    <LetterKeyboard
      inputValue={inputValue}
      chinese={chinese}
      inputMode={inputMode ?? EN}
      onClick={onClick}
      onMouseDown={onMouseDown}
      onChangeInputMode={onChangeInputMode}
      onSelectChinese={onSelectChinese}
      onKeyDown={onKeyDown}
      onKeyUp={onKeyUp}
      isKeyActive={isKeyActive}
      capsLockActive={capsLockActive}
    />
  ),
};

/** 数字键tab */
export const NumberKeyboardTab: VKB.KeyboardTabItem = {
  id: 'number',
  label: <NumberSvg />,
  name: '数字键',
  Component: ({
    inputValue,
    chinese,
    onMouseDown,
    onSelectChinese,
    onClick,
    onKeyUp,
    onKeyDown,
    isKeyActive,
    numberKeyboardLayoutMode,
  }) => (
    <NumberKeyboard
      numberKeyboardLayoutMode={numberKeyboardLayoutMode}
      inputValue={inputValue}
      chinese={chinese}
      onMouseDown={onMouseDown}
      onClick={onClick}
      onKeyDown={onKeyDown}
      onKeyUp={onKeyUp}
      onSelectChinese={onSelectChinese}
      isKeyActive={isKeyActive}
    />
  ),
};
/** 功能键tab */
export const FunctionKeyboardTab: VKB.KeyboardTabItem = {
  id: 'function',
  label: <FunctionSvg />,
  name: '功能键',
  Component: ({ onClick, onKeyUp, onKeyDown, isKeyActive }) => (
    <FunctionKeyboard
      onClick={onClick}
      onKeyDown={onKeyDown}
      onKeyUp={onKeyUp}
      isKeyActive={isKeyActive}
    />
  ),
};
/** Emoji 键tab */
export const EmojiKeyboardTab: VKB.KeyboardTabItem = {
  id: 'emjo',
  label: <EmjoSvg />,
  name: 'Emoji 键',
  Component: ({ onClick, onKeyDown, onKeyUp, isKeyActive }) => (
    <EmojiKeyboard
      onClick={onClick ?? noop}
      onKeyDown={onKeyDown}
      onKeyUp={onKeyUp}
      isKeyActive={isKeyActive}
    />
  ),
};
/** 符号键tab */
export const SymbolKeyboardTab: VKB.KeyboardTabItem = {
  id: 'symbol',
  label: <SymbolSvg />,
  name: '符号键',
  Component: ({ onClick, onKeyDown, onKeyUp, isKeyActive }) => (
    <SymbolKeyboard
      onClick={onClick}
      onKeyDown={onKeyDown}
      onKeyUp={onKeyUp}
      isKeyActive={isKeyActive}
    />
  ),
};
/** 编辑键tab */
export const EditKeyboardTab: VKB.KeyboardTabItem = {
  id: 'edit',
  label: <EditSvg />,
  name: '编辑键',
  Component: ({ onClick, onKeyDown, onKeyUp, isKeyActive }) => (
    <EditKeyboard
      onClick={onClick}
      onKeyDown={onKeyDown}
      onKeyUp={onKeyUp}
      isKeyActive={isKeyActive}
    />
  ),
};
/** 五笔画输入 tab */
export const StrokeKeyboardTab: VKB.KeyboardTabItem = {
  id: 'stroke',
  label: <StrokeSvg aria-label="笔画输入" />,
  name: '笔画输入',
  Component: ({ onClick, onSelectChinese, onKeyDown, onKeyUp }) => (
    <StrokeKeyboard
      onClick={onClick}
      onSelectChinese={onSelectChinese}
      onKeyDown={onKeyDown}
      onKeyUp={onKeyUp}
    />
  ),
};
/** 设置tab */
export const SettingKeyboardTab: VKB.KeyboardTabItem = {
  id: 'setting',
  label: <SettingSvg />,
  name: '设置',
  Component: ({
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
  }) => (
    <SettingKeyBoard
      vkbKeydownAudio={vkbKeydownAudio ?? 'Y'}
      themeMode={themeMode ?? ''}
      positionMode={positionMode ?? ''}
      width={width ?? ''}
      height={height ?? ''}
      fontSize={fontSize ?? ''}
      fontFamily={fontFamily ?? ''}
      numberKeyboardLayoutMode={numberKeyboardLayoutMode ?? 'asc'}
      onWidthChange={onWidthChange ?? noop}
      onHeightChange={onHeightChange ?? noop}
      onFontSizeChange={onFontSizeChange ?? noop}
      onFontFamilyChange={onFontFamilyChange ?? noop}
      onNumberKeyboardLayoutModeChange={
        onNumberKeyboardLayoutModeChange ?? noop
      }
      onClick={onClick}
      onKeyDown={onKeyDown}
      onKeyUp={onKeyUp}
    />
  ),
};

const tabs: VKB.KeyboardTabItem[] = [
  LetterKeyboardTab,
  NumberKeyboardTab,
  EmojiKeyboardTab,
  FunctionKeyboardTab,
  SymbolKeyboardTab,
  EditKeyboardTab,
  StrokeKeyboardTab,
  SettingKeyboardTab,
];

export default tabs;
