import React from 'react';

import EmojiKeyboard from '../EmojiKeyboard';
import FunctionKeyboard from '../FunctionKeyboard';
import { ReactComponent as EditSvg } from '../svg/edit.svg';
import { ReactComponent as EmjoSvg } from '../svg/emjo.svg';
import { ReactComponent as FunctionSvg } from '../svg/function.svg';
import { ReactComponent as KeyboardSvg } from '../svg/keyboard.svg';
import { ReactComponent as NumberSvg } from '../svg/number.svg';
import { ReactComponent as SymbolSvg } from '../svg/symbol.svg';
import { ReactComponent as WriteSvg } from '../svg/write.svg';
// import EmjoSvg from './svg/emjo.svg?react'

import { ReactComponent as SettingSvg } from '../svg/setting.svg';

import EditKeyboard from '../EditKeyboard';
import LetterKeyboard from '../LetterKeyboard';
import NumberKeyboard from '../NumberKeyboard';
import SettingKeyBoard from '../SettingKeyboard';
import SymbolKeyboard from '../SymbolKeyboard';
import WriteKeyboard from '../WriteKeyboard';
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
    onClick,
    onKeyUp,
    onKeyDown,
    isKeyActive,
    numberKeyboardLayoutMode,
  }) => (
    <NumberKeyboard
      numberKeyboardLayoutMode={numberKeyboardLayoutMode}
      onClick={onClick}
      onKeyDown={onKeyDown}
      onKeyUp={onKeyUp}
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
  Component: ({ onClick, isKeyActive }) => (
    <EmojiKeyboard onClick={onClick ?? noop} isKeyActive={isKeyActive} />
  ),
};
/** 符号键tab */
export const SymbolKeyboardTab: VKB.KeyboardTabItem = {
  id: 'symbol',
  label: <SymbolSvg />,
  name: '符号键',
  Component: ({ onClick, isKeyActive }) => (
    <SymbolKeyboard onClick={onClick} isKeyActive={isKeyActive} />
  ),
};
/** 编辑键tab */
export const EditKeyboardTab: VKB.KeyboardTabItem = {
  id: 'edit',
  label: <EditSvg />,
  name: '编辑键',
  Component: ({ onClick, isKeyActive }) => (
    <EditKeyboard onClick={onClick} isKeyActive={isKeyActive} />
  ),
};
/** 手写板tab */
export const WriteKeyboardTab: VKB.KeyboardTabItem = {
  id: 'write',
  label: <WriteSvg />,
  name: '手写板',
  Component: ({
    chinese,
    onMouseDown,
    onSelectChinese,
    onRecognition,
    onClick,
    isKeyActive,
  }) => (
    <WriteKeyboard
      chinese={chinese ?? []}
      onClick={onClick}
      onMouseDown={onMouseDown}
      onRecognition={onRecognition}
      onSelectChinese={onSelectChinese}
      isKeyActive={isKeyActive}
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
  WriteKeyboardTab,
  SettingKeyboardTab,
];

export default tabs;
