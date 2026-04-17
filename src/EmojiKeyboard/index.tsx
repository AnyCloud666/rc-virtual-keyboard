import React, { useState } from 'react';
import useContinuousTrigger from '../hooks/useContinuousTrigger';
import useTouchClickGuard from '../hooks/useTouchClickGuard';
import { emjoType } from '../keys';
import { VKB } from '../typing';
import './style.css';

type EmojiGroup = {
  id: number;
  label: string;
  value: VKB.KeyboardAttributeType[];
};

const createEmojiKey = (
  key: string,
  keyCode: number,
): VKB.KeyboardAttributeType => ({
  key,
  code: `Emoji_${keyCode}`,
  keyCode,
  keyType: emjoType,
});

const emojiGroups: EmojiGroup[] = [
  {
    id: 1,
    label: '常用',
    value: [
      '😀',
      '😁',
      '😂',
      '🤣',
      '😊',
      '😍',
      '😘',
      '🥰',
      '😎',
      '🤗',
      '🤔',
      '😭',
      '😡',
      '👍',
      '👏',
      '🙏',
      '🎉',
      '❤️',
      '🔥',
      '✨',
    ].map((item, index) => createEmojiKey(item, 20000 + index)),
  },
  {
    id: 2,
    label: '手势',
    value: [
      '👋',
      '🤚',
      '🖐️',
      '✌️',
      '🤞',
      '👌',
      '🤟',
      '🤘',
      '👏',
      '🙌',
      '💪',
      '🙏',
    ].map((item, index) => createEmojiKey(item, 20100 + index)),
  },
  {
    id: 3,
    label: '爱心',
    value: [
      '❤️',
      '🧡',
      '💛',
      '💚',
      '💙',
      '💜',
      '🖤',
      '🤍',
      '🤎',
      '💔',
      '❣️',
      '💕',
    ].map((item, index) => createEmojiKey(item, 20200 + index)),
  },
  {
    id: 4,
    label: '动物',
    value: [
      '🐶',
      '🐱',
      '🐭',
      '🐰',
      '🦊',
      '🐻',
      '🐼',
      '🐯',
      '🦁',
      '🐮',
      '🐷',
      '🐵',
    ].map((item, index) => createEmojiKey(item, 20300 + index)),
  },
  {
    id: 5,
    label: '食物',
    value: [
      '🍎',
      '🍊',
      '🍇',
      '🍉',
      '🍓',
      '🍔',
      '🍟',
      '🍕',
      '🍗',
      '🍜',
      '🍩',
      '☕',
    ].map((item, index) => createEmojiKey(item, 20400 + index)),
  },
];

/**
 * Emoji 键盘。
 *
 * @description
 * 复用符号键盘的分类 + 宫格交互，让表情输入保持和现有键盘体系一致。
 */
const EmojiKeyboard = ({
  onClick,
  isKeyActive,
}: {
  onClick: (e: VKB.KeyboardAttributeType) => void;
  isKeyActive?: (key: VKB.KeyboardAttributeType) => boolean;
}) => {
  const [activeGroup, setActiveGroup] = useState(emojiGroups[0]);
  const { markTouchInteraction, shouldIgnoreClick } = useTouchClickGuard();
  const { startContinuousTrigger, stopContinuousTrigger } =
    useContinuousTrigger<VKB.KeyboardAttributeType>({
      onTrigger: onClick,
    });

  return (
    <div className="emoji-keyboard">
      <div className="emoji-key-tab">
        {emojiGroups.map((item) => (
          <div
            className={`emoji-key-tab-item ${
              activeGroup.id === item.id ? 'emoji-key-tab-item-active' : ''
            }`}
            key={item.id}
            onClick={() => {
              if (shouldIgnoreClick()) return;
              setActiveGroup(item);
            }}
            onTouchStart={(e) => {
              e.preventDefault();
              markTouchInteraction();
              setActiveGroup(item);
            }}
          >
            {item.label}
          </div>
        ))}
      </div>
      <div className="emoji-key-content">
        {activeGroup.value.map((item) => (
          <div
            className={`emoji-key-item ${
              isKeyActive?.(item) ? 'emoji-key-item-active' : ''
            }`}
            key={item.keyCode}
            onClick={(e) => e.preventDefault()}
            onMouseDown={(e) => {
              e.preventDefault();
              startContinuousTrigger(item, 'mouse');
            }}
            onMouseUp={() => stopContinuousTrigger('mouse')}
            onMouseLeave={() => stopContinuousTrigger('mouse')}
            onTouchStart={(e) => {
              e.preventDefault();
              markTouchInteraction();
              startContinuousTrigger(item, 'touch');
            }}
            onTouchEnd={() => stopContinuousTrigger('touch')}
            onTouchCancel={() => stopContinuousTrigger('touch')}
          >
            {item.key}
          </div>
        ))}
      </div>
    </div>
  );
};

export default EmojiKeyboard;
