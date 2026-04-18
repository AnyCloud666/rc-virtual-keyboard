import React, { useMemo, useState } from 'react';
import {
  CompositionKeyboard,
  DragBlock,
  EditKeyboard,
  EmojiKeyboard,
  FunctionKeyboard,
  LetterKeyboard,
  NumberKeyboard,
  SettingKeyboard,
  SymbolKeyboard,
  VirtualKeyboard,
  WriteKeyboard,
} from 'rc-virtual-keyboard';

const letterDemoPinyinMap: Record<string, string[]> = {
  ni: ['你', '呢', '泥', '拟'],
  nihao: ['你好', '拟好', '霓号'],
  jian: ['键', '件', '建', '见'],
  jianpan: ['键盘', '键盘组件', '简拼', '键盘文档'],
  zuhe: ['组合', '组合键盘', '组合输入'],
  zujian: ['组件', '组件库', '组件示例'],
  wenshi: ['文档', '文示', '文史'],
  shuru: ['输入', '输入法', '输入框'],
};

function queryLetterCandidates(input: string) {
  if (!input) return [];

  const normalized = input.toLowerCase().replace(/[^a-z]/g, '');
  if (!normalized) return [];

  if (letterDemoPinyinMap[normalized]) {
    return letterDemoPinyinMap[normalized];
  }

  return Object.entries(letterDemoPinyinMap)
    .filter(([key]) => key.startsWith(normalized) || normalized.startsWith(key))
    .flatMap(([, value]) => value)
    .slice(0, 6);
}

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
  const [value, setValue] = useState('');

  return (
    <div className="component-demo-stack">
      <input
        value={value}
        placeholder="数字键盘示例"
        onChange={(e) => setValue(e.target.value)}
      />
      <div className="component-demo-keyboard-frame">
        <NumberKeyboard
          numberKeyboardLayoutMode="desc"
          onClick={(key) => {
            if (key.code === 'Backspace') {
              setValue((prev) => prev.slice(0, -1));
              return;
            }
            if (key.code === 'Enter') {
              setValue((prev) => `${prev}|enter`);
              return;
            }
            setValue((prev) => `${prev}${key.key}`);
          }}
        />
      </div>
      <div className="component-demo-result">当前值：{value || '未输入'}</div>
    </div>
  );
}

export function LetterKeyboardDemo() {
  const [value, setValue] = useState('');
  const [composingValue, setComposingValue] = useState('');
  const [inputMode, setInputMode] = useState<'zh' | 'en'>('zh');
  const chinese = useMemo(
    () => queryLetterCandidates(composingValue),
    [composingValue],
  );

  const commitCurrentWord = (appendText = '') => {
    const nextWord = inputMode === 'zh' ? chinese[0] || composingValue : composingValue;

    if (!nextWord) {
      return;
    }

    setValue((prev) => `${prev}${nextWord}${appendText}`);
    setComposingValue('');
  };

  return (
    <div className="component-demo-stack">
      <div className="component-demo-result">输入模式：{inputMode}</div>
      <input
        value={value}
        placeholder="字母键盘示例"
        onChange={(e) => setValue(e.target.value)}
      />
      <div className="component-demo-keyboard-frame">
        <LetterKeyboard
          inputMode={inputMode}
          inputValue={composingValue}
          chinese={chinese}
          onChangeInputMode={(mode) => {
            setInputMode(mode);
            setComposingValue('');
          }}
          onSelectChinese={(word) => {
            setValue((prev) => `${prev}${word}`);
            setComposingValue('');
          }}
          onClick={(key) => {
            if (key.code === 'Backspace') {
              if (composingValue) {
                setComposingValue((prev) => prev.slice(0, -1));
                return;
              }

              setValue((prev) => prev.slice(0, -1));
              return;
            }
            if (key.code === 'Enter') {
              commitCurrentWord();
              return;
            }
            if (key.key === ' ') {
              if (composingValue) {
                commitCurrentWord(' ');
                return;
              }

              setValue((prev) => `${prev} `);
              return;
            }
            if (/^[a-zA-Z]$/.test(key.key)) {
              setComposingValue((prev) => `${prev}${key.key.toLowerCase()}`);
              return;
            }
            if (key.key.length === 1) {
              setValue((prev) => `${prev}${key.key}`);
            }
          }}
        />
      </div>
      <div className="component-demo-result">
        联想方式：根据当前拼写内容实时查询候选词，例如输入 `nihao`、`jianpan`、`zujian`
      </div>
      <div className="component-demo-result">当前拼写：{composingValue || '无'}</div>
      <div className="component-demo-result">当前值：{value || '未输入'}</div>
    </div>
  );
}

export function SymbolKeyboardDemo() {
  const [value, setValue] = useState('');

  return (
    <div className="component-demo-stack">
      <input
        value={value}
        placeholder="符号键盘示例"
        onChange={(e) => setValue(e.target.value)}
      />
      <div className="component-demo-keyboard-frame">
        <SymbolKeyboard onClick={(key) => setValue((prev) => `${prev}${key.key}`)} />
      </div>
      <div className="component-demo-result">当前值：{value || '未输入'}</div>
    </div>
  );
}

export function EmojiKeyboardDemo() {
  const [value, setValue] = useState('');

  return (
    <div className="component-demo-stack">
      <input
        value={value}
        placeholder="Emoji 键盘示例"
        onChange={(e) => setValue(e.target.value)}
      />
      <div className="component-demo-keyboard-frame">
        <EmojiKeyboard onClick={(key) => setValue((prev) => `${prev}${key.key}`)} />
      </div>
      <div className="component-demo-result">当前值：{value || '未输入'}</div>
    </div>
  );
}

export function FunctionKeyboardDemo() {
  const [pressed, setPressed] = useState('尚未触发');

  return (
    <div className="component-demo-stack">
      <div className="component-demo-keyboard-frame">
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
      <div className="component-demo-keyboard-frame">
        <EditKeyboard onClick={(key) => setPressed(`${key.code} / ${key.key}`)} />
      </div>
      <div className="component-demo-result">最近动作：{pressed}</div>
    </div>
  );
}

export function WriteKeyboardDemo() {
  const [value, setValue] = useState('');
  const [picked, setPicked] = useState('未选择');

  return (
    <div className="component-demo-stack">
      <div className="component-demo-keyboard-frame">
        <WriteKeyboard
          chinese={['键', '盘', '文', '档', '示', '例']}
          onSelectChinese={(word) => {
            setPicked(word);
            setValue((prev) => `${prev}${word}`);
          }}
          onClick={(key) => {
            if (key.code === 'Backspace') {
              setValue((prev) => prev.slice(0, -1));
              return;
            }
            if (key.code === 'Clear') {
              setValue('');
              return;
            }
            if (key.code === 'Enter') {
              setValue((prev) => `${prev}|enter`);
            }
          }}
        />
      </div>
      <div className="component-demo-result">候选选择：{picked}</div>
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
      <div className="component-demo-keyboard-frame">
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
            if (['float', 'fixedBottom', 'fixedTop', 'fixedLeft', 'fixedRight'].includes(key.code)) {
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

export function DragBlockDemo() {
  return (
    <div className="component-demo-drag-stage">
      <DragBlock init={{ width: '180px', height: '80px' }} autoKeepRight={false}>
        <div className="component-demo-drag-card">拖动这个浮层</div>
      </DragBlock>
      <div className="component-demo-result">DragBlock 负责拖拽、贴边与定位，不负责内部内容渲染。</div>
    </div>
  );
}
