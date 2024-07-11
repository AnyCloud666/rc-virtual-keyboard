import React from 'react';

import { ReactComponent as EditSvg } from '../svg/edit.svg';
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
import { VKB } from '../typing';
import './style.css';
/** 字母键tab */
export const LetterKeyboardTab: VKB.KeyboardTabItem = {
  id: 'letter',
  label: <KeyboardSvg />,
  name: '字母键',
  Component: ({
    inputMode,
    inputValue,
    words,
    onClick,
    onMouseDown,
    onChangeInputMode,
    onSelectWord,
  }) => (
    <LetterKeyboard
      inputValue={inputValue}
      words={words}
      inputMode={inputMode}
      onClick={onClick}
      onMouseDown={onMouseDown}
      onChangeInputMode={onChangeInputMode}
      onSelectWord={onSelectWord}
    />
  ),
};

/** 数字键tab */
export const NumberKeyboardTab: VKB.KeyboardTabItem = {
  id: 'number',
  label: <NumberSvg />,
  name: '数字键',
  Component: ({ onClick }) => <NumberKeyboard onClick={onClick} />,
};
/** 符号键tab */
export const SymbolKeyboardTab: VKB.KeyboardTabItem = {
  id: 'symbol',
  label: <SymbolSvg />,
  name: '符号键',
  Component: ({ onClick }) => <SymbolKeyboard onClick={onClick} />,
};
/** 编辑键tab */
export const EditKeyboardTab: VKB.KeyboardTabItem = {
  id: 'edit',
  label: <EditSvg />,
  name: '编辑键',
  Component: ({ onClick }) => <EditKeyboard onClick={onClick} />,
};
/** 手写板tab */
export const WriteKeyboardTab: VKB.KeyboardTabItem = {
  id: 'write',
  label: <WriteSvg />,
  name: '手写板',
  Component: ({ words, onClick, onDraw, onSelectWord }) => (
    <WriteKeyboard
      words={words}
      onDraw={onDraw}
      onClick={onClick}
      onSelectWord={onSelectWord}
    />
  ),
};
/** 设置tab */
export const SettingKeyboardTab: VKB.KeyboardTabItem = {
  id: 'setting',
  label: <SettingSvg />,
  name: '设置',
  Component: ({ themeMode, positionMode, onClick }) => (
    <SettingKeyBoard
      themeMode={themeMode}
      positionMode={positionMode}
      onClick={onClick}
    />
  ),
};

const tabs: VKB.KeyboardTabItem[] = [
  LetterKeyboardTab,
  NumberKeyboardTab,
  SymbolKeyboardTab,
  EditKeyboardTab,
  SettingKeyboardTab,
  WriteKeyboardTab,
];

export default tabs;