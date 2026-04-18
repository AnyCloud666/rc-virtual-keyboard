import { useState } from 'react';
import {
  EditKeyboard,
  EmojiKeyboard,
  FunctionKeyboard,
  SettingKeyboard,
  SymbolKeyboard,
  WriteKeyboard,
  keys,
} from 'rc-virtual-keyboard';
import { useDemoInputController } from './shared';

export function SymbolKeyboardDemo() {
  const { value, setValue, onClick, onKeyDown, onKeyUp, isKeyActive } =
    useDemoInputController({
      defaultActiveKeyboard: keys.symbolType,
    });

  return (
    <div className="component-demo-stack">
      <input
        value={value}
        placeholder="符号键盘示例"
        onChange={(e) => setValue(e.target.value)}
      />
      <div className="component-demo-keyboard-frame component-demo-keyboard-frame-symbol">
        <SymbolKeyboard
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

export function EmojiKeyboardDemo() {
  const { value, setValue, onClick, onKeyDown, onKeyUp, isKeyActive } =
    useDemoInputController({
      defaultActiveKeyboard: keys.emjoType,
    });

  return (
    <div className="component-demo-stack">
      <input
        value={value}
        placeholder="Emoji 键盘示例"
        onChange={(e) => setValue(e.target.value)}
      />
      <div className="component-demo-keyboard-frame component-demo-keyboard-frame-symbol">
        <EmojiKeyboard
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

export function FunctionKeyboardDemo() {
  const [pressed, setPressed] = useState('尚未触发');

  return (
    <div className="component-demo-stack">
      <div className="component-demo-keyboard-frame component-demo-keyboard-frame-function">
        <FunctionKeyboard onClick={(key) => setPressed(`${key.code} / ${key.key}`)} />
      </div>
      <div className="component-demo-result">最近按键：{pressed}</div>
    </div>
  );
}

export function EditKeyboardDemo() {
  const [pressed, setPressed] = useState('尚未触发');

  return (
    <div className="component-demo-stack">
      <div className="component-demo-keyboard-frame component-demo-keyboard-frame-edit">
        <EditKeyboard onClick={(key) => setPressed(`${key.code} / ${key.key}`)} />
      </div>
      <div className="component-demo-result">最近动作：{pressed}</div>
    </div>
  );
}

export function WriteKeyboardDemo() {
  const {
    value,
    setValue,
    chinese,
    onClick,
    onSelectChinese,
    onRecognition,
    isKeyActive,
  } = useDemoInputController({
    defaultActiveKeyboard: keys.writeType,
    onImageToWord: async () => ['键', '盘', '文', '档', '示', '例'],
  });

  return (
    <div className="component-demo-stack">
      <input
        value={value}
        placeholder="手写键盘示例"
        onChange={(e) => setValue(e.target.value)}
      />
      <div className="component-demo-keyboard-frame component-demo-keyboard-frame-write">
        <WriteKeyboard
          chinese={chinese}
          onSelectChinese={onSelectChinese}
          onClick={onClick}
          onRecognition={onRecognition}
          isKeyActive={isKeyActive}
        />
      </div>
      <div className="component-demo-result">
        识别候选：{chinese.join(' / ') || '请先书写内容'}
      </div>
      <div className="component-demo-result">当前值：{value || '未输入'}</div>
    </div>
  );
}

export function SettingKeyboardDemo() {
  const [themeMode, setThemeMode] = useState('light');
  const [positionMode, setPositionMode] = useState('float');
  const [audioMode, setAudioMode] = useState('Y');
  const [width, setWidth] = useState('500px');
  const [height, setHeight] = useState('320px');
  const [fontSize, setFontSize] = useState('14px');
  const [fontFamily, setFontFamily] = useState("'Microsoft YaHei', 'PingFang SC', sans-serif");
  const [layoutMode, setLayoutMode] = useState<'asc' | 'desc'>('asc');

  return (
    <div className="component-demo-stack">
      <div className="component-demo-keyboard-frame component-demo-keyboard-frame-setting">
        <SettingKeyboard
          themeMode={themeMode}
          positionMode={positionMode}
          vkbKeydownAudio={audioMode}
          width={width}
          height={height}
          fontSize={fontSize}
          fontFamily={fontFamily}
          numberKeyboardLayoutMode={layoutMode}
          onWidthChange={setWidth}
          onHeightChange={setHeight}
          onFontSizeChange={setFontSize}
          onFontFamilyChange={setFontFamily}
          onNumberKeyboardLayoutModeChange={(mode) => setLayoutMode(mode)}
          onClick={(key) => {
            if (key.code === 'light' || key.code === 'dark') {
              setThemeMode(key.code);
              return;
            }
            if (
              ['float', 'fixedBottom', 'fixedTop', 'fixedLeft', 'fixedRight'].includes(
                key.code,
              )
            ) {
              setPositionMode(key.code);
              return;
            }
            if (key.code === 'backgroundAudio') {
              setAudioMode((prev) => (prev === 'Y' ? 'N' : 'Y'));
            }
          }}
        />
      </div>
      <div className="component-demo-result">
        themeMode={themeMode}，positionMode={positionMode}，audio={audioMode}，width={width}，height={height}
      </div>
    </div>
  );
}
