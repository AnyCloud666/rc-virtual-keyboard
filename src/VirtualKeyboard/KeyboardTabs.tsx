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

const tabs: VKB.KeyboardTabItem[] = [
  {
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
    }) => (
      <LetterKeyboard
        inputValue={inputValue}
        chinese={chinese}
        inputMode={inputMode}
        onClick={onClick}
        onMouseDown={onMouseDown}
        onChangeInputMode={onChangeInputMode}
        onSelectChinese={onSelectChinese}
      />
    ),
  },
  {
    id: 'number',
    label: <NumberSvg />,
    name: '数字键',
    Component: ({ onClick }) => <NumberKeyboard onClick={onClick} />,
  },
  {
    id: 'symbol',
    label: <SymbolSvg />,
    name: '符号键',
    Component: ({ onClick }) => <SymbolKeyboard onClick={onClick} />,
  },
  {
    id: 'edit',
    label: <EditSvg />,
    name: '编辑键',
    Component: ({ onClick }) => <EditKeyboard onClick={onClick} />,
  },
  {
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
  },
  {
    id: 'write',
    label: <WriteSvg />,
    name: '手写板',
    Component: ({ onClick }) => <WriteKeyboard onClick={onClick} />,
  },
];

export default tabs;
