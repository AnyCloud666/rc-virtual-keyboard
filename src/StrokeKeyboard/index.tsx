import React, { useMemo, useState } from 'react';
import CandidateBar from '../lib/CandidateBar';
import { Backspace, Enter, Space } from '../keys';
import { VKB } from '../typing';
import { getStrokeCandidates } from '../utils/stroke';
import { ReactComponent as Stroke1Svg } from '../svg/stroke-1.svg';
import { ReactComponent as Stroke2Svg } from '../svg/stroke-2.svg';
import { ReactComponent as Stroke3Svg } from '../svg/stroke-3.svg';
import { ReactComponent as Stroke4Svg } from '../svg/stroke-4.svg';
import { ReactComponent as Stroke5Svg } from '../svg/stroke-5.svg';
import './style.css';

const strokeIcons = {
  '1': Stroke1Svg,
  '2': Stroke2Svg,
  '3': Stroke3Svg,
  '4': Stroke4Svg,
  '5': Stroke5Svg,
};

const strokes = [
  { digit: '1', glyph: '一', name: '横 / 提' },
  { digit: '2', glyph: '丨', name: '竖' },
  { digit: '3', glyph: '丿', name: '撇' },
  { digit: '4', glyph: '丶', name: '点 / 捺' },
  { digit: '5', glyph: '乛', name: '折' },
];

type StrokeKeyboardProps = Pick<
  VKB.KeyboardTabComponentProps,
  'onClick' | 'onSelectChinese' | 'onKeyDown' | 'onKeyUp'
>;

const StrokeKeyboard = ({
  onClick,
  onSelectChinese,
  onKeyDown,
  onKeyUp,
}: StrokeKeyboardProps) => {
  const [sequence, setSequence] = useState('');
  const candidates = useMemo(() => getStrokeCandidates(sequence), [sequence]);
  const strokeDisplay = [...sequence]
    .map((digit) => strokes[Number(digit) - 1].glyph)
    .join('');
  const strokeDisplayIcons = (
    <span className="stroke-keyboard-strokes" aria-label={strokeDisplay}>
      {[...sequence].map((digit, index) => {
        const Icon = strokeIcons[digit as keyof typeof strokeIcons];
        return <Icon className="stroke-keyboard-glyph" key={index} aria-hidden="true" />;
      })}
    </span>
  );

  const select = (character: string, suffix = '') => {
    onSelectChinese?.(character, suffix);
    setSequence('');
  };

  const control = (key: VKB.KeyboardAttributeType) => {
    onKeyDown?.(key);
    onClick?.(key);
    onKeyUp?.(key);
  };

  const backspace = () => {
    if (sequence) setSequence(sequence.slice(0, -1));
    else control(Backspace);
  };

  const enter = () => {
    if (candidates.length) select(candidates[0]);
    else if (!sequence) control(Enter);
  };

  const space = () => {
    if (candidates.length) select(candidates[0], ' ');
    else if (!sequence) control(Space);
  };

  const actions = [
    ...strokes.map(({ digit, name }) => {
      const Icon = strokeIcons[digit as keyof typeof strokeIcons];
      return {
        id: digit,
        content: <><Icon className="stroke-keyboard-glyph" aria-hidden="true" /><span>{digit} {name}</span></>,
        action: () => setSequence((current) => current + digit),
      };
    }),
    { id: 'backspace', content: Backspace.renderKey, action: backspace },
    { id: 'space', content: <>空格</>, action: space },
    { id: 'enter', content: Enter.renderKey, action: enter },
  ];
  const topActions = [...actions.slice(0, 3), actions[5]];
  const bottomActions = [actions[3], actions[4], actions[6], actions[7]];

  const renderAction = ({ id, content, action }: (typeof actions)[number]) => (
    <div
      key={id}
      aria-label={id === 'backspace' ? '退格' : id === 'enter' ? '确认' : undefined}
      className={`stroke-keyboard-key stroke-keyboard-key-${id}`}
      onMouseDown={(event) => event.preventDefault()}
      onTouchStart={(event) => {
        event.preventDefault();
        action();
      }}
      onClick={action}
    >
      {content}
    </div>
  );

  return (
    <div className="stroke-keyboard-shell">
      <CandidateBar
        tempValue={strokeDisplay || undefined}
        tempDisplay={strokeDisplayIcons}
        items={candidates}
        onSelectItem={(item) => {
          if (candidates.includes(item)) select(item);
        }}
      />
      <div className="stroke-keyboard-keys">
        <div className="stroke-keyboard-row stroke-keyboard-row-top">
          {topActions.map(renderAction)}
        </div>
        <div className="stroke-keyboard-row stroke-keyboard-row-bottom">
          {bottomActions.map(renderAction)}
        </div>
      </div>
    </div>
  );
};

export default StrokeKeyboard;
