import { useState } from 'react';
import {
  CompositionKeyboard,
  LetterKeyboard,
  NumberKeyboard,
  VirtualKeyboard,
  keys,
} from 'rc-virtual-keyboard';
import { queryLetterCandidates, useDemoInputController } from './shared';

export function VirtualKeyboardDemo() {
  const [value, setValue] = useState('');

  return (
    <div className="component-demo-stack">
      <input
        value={value}
        placeholder="点击这里，再使用虚拟键盘输入"
        onChange={(e) => setValue(e.target.value)}
      />
      <div className="component-demo-result">当前值：{value || '未输入'}</div>
      <VirtualKeyboard numberKeyboardLayoutMode="asc" />
    </div>
  );
}

export function CompositionKeyboardDemo() {
  const [value, setValue] = useState('');

  return (
    <div className="component-demo-stack">
      <input
        value={value}
        placeholder="CompositionKeyboard 会直接接管当前焦点输入框"
        onChange={(e) => setValue(e.target.value)}
      />
      <div className="component-demo-result">当前值：{value || '未输入'}</div>
      <CompositionKeyboard
        style={{ width: '100%', height: '320px' }}
        width="100%"
        height="320px"
        onChangeShow={() => undefined}
      />
    </div>
  );
}

export function NumberKeyboardDemo() {
  const { value, setValue, onClick, onKeyDown, onKeyUp, isKeyActive } =
    useDemoInputController({
      defaultActiveKeyboard: keys.numberType,
    });

  return (
    <div className="component-demo-stack">
      <input
        value={value}
        placeholder="数字键盘示例"
        onChange={(e) => setValue(e.target.value)}
      />
      <div className="component-demo-keyboard-frame component-demo-keyboard-frame-number">
        <NumberKeyboard
          numberKeyboardLayoutMode="desc"
          onClick={onClick}
          onKeyDown={onKeyDown}
          onKeyUp={onKeyUp}
          isKeyActive={isKeyActive}
        />
      </div>
      <div className="component-demo-result">当前值：{value || '未输入'}</div>
    </div>
  );
}

export function LetterKeyboardDemo() {
  const {
    value,
    setValue,
    inputMode,
    inputValue,
    chinese,
    onClick,
    onSelectChinese,
    onChangeInputMode,
    onKeyDown,
    onKeyUp,
    isKeyActive,
    capsLockActive,
  } = useDemoInputController({
    defaultActiveKeyboard: keys.letterType,
    onPinyin2Chinese: (value) => ({
      pinyin: value,
      chinese: queryLetterCandidates(value),
    }),
  });

  return (
    <div className="component-demo-stack">
      <div className="component-demo-result">输入模式：{inputMode}</div>
      <input
        value={value}
        placeholder="字母键盘示例"
        onChange={(e) => setValue(e.target.value)}
      />
      <div className="component-demo-keyboard-frame component-demo-keyboard-frame-letter">
        <LetterKeyboard
          inputMode={inputMode}
          inputValue={inputValue}
          chinese={chinese}
          onChangeInputMode={onChangeInputMode}
          onSelectChinese={onSelectChinese}
          onClick={onClick}
          onKeyDown={onKeyDown}
          onKeyUp={onKeyUp}
          isKeyActive={isKeyActive}
          capsLockActive={capsLockActive}
        />
      </div>
      <div className="component-demo-result">
        联想方式：通过 `useInput` 的 `onPinyin2Chinese` 接入拼写候选，例如输入 `nihao`、`jianpan`、`zujian`
      </div>
      <div className="component-demo-result">当前拼写：{inputValue || '无'}</div>
      <div className="component-demo-result">当前值：{value || '未输入'}</div>
    </div>
  );
}
