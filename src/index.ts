import {
  EditKeyboardTab,
  FunctionKeyboardTab,
  LetterKeyboardTab,
  NumberKeyboardTab,
  SettingKeyboardTab,
  SymbolKeyboardTab,
  WriteKeyboardTab,
} from './CompositionKeyboard/KeyboardTabs';
import * as keys from './keys';
export {
  EditKeyboardTab,
  FunctionKeyboardTab,
  keys,
  LetterKeyboardTab,
  NumberKeyboardTab,
  SettingKeyboardTab,
  SymbolKeyboardTab,
  WriteKeyboardTab,
};

export { default as FunctionKeyboard } from './FunctionKeyboard';
export { default as NumberKeyboard } from './NumberKeyboard';

export { default as LetterKeyboard } from './LetterKeyboard';

export { default as EditKeyboard } from './EditKeyboard';

export { default as SymbolKeyboard } from './SymbolKeyboard';

export { default as SettingKeyboard } from './SettingKeyboard';

export { default as WriteKeyboard } from './WriteKeyboard';

export { default as DragBlock } from './DragBlock';

export { default as CompositionKeyboard } from './CompositionKeyboard';

export {
  InitVirtualKeyBoardCtx,
  default as VirtualKeyboard,
} from './VirtualKeyboard';

export { default as useInput } from './hooks/useInput';
