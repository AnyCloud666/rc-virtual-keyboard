import React, { useState } from 'react';
import useContinuousTrigger from '../hooks/useContinuousTrigger';
import useTouchClickGuard from '../hooks/useTouchClickGuard';
import { Backspace, cursorKeys, editKeys } from '../keys';

import { ReactComponent as BottomSvg } from '../svg/bottom.svg';
import { ReactComponent as LeftFirstSvg } from '../svg/left-first.svg';
import { ReactComponent as LeftSvg } from '../svg/left.svg';
import { ReactComponent as RightEndSvg } from '../svg/right-end.svg';
import { ReactComponent as RightSvg } from '../svg/right.svg';
import { ReactComponent as TopSvg } from '../svg/top.svg';

import { VKB } from '../typing';
import './style.css';

const cursorSvg: Record<string, JSX.Element> = {
  ArrowUp: <TopSvg />,
  ArrowLeft: <LeftSvg />,
  ArrowRight: <RightSvg />,
  ArrowDown: <BottomSvg />,
  ArrowLeftFirst: <LeftFirstSvg />,
  ArrowRightEnd: <RightEndSvg />,
};

const EditKeyboard = ({
  onClick,
  onKeyDown,
  onKeyUp,
  isKeyActive,
}: {
  onClick?: (e: VKB.KeyboardAttributeType) => void;
  onKeyDown?: (e: VKB.KeyboardAttributeType) => void;
  onKeyUp?: (e: VKB.KeyboardAttributeType) => void;
  isKeyActive?: (key: VKB.KeyboardAttributeType) => boolean;
}) => {
  const [keys, setKeys] = useState(cursorKeys);
  const { markTouchInteraction, shouldIgnoreClick } = useTouchClickGuard();

  const [isSelect, setSelect] = useState(false);

  const onClickEdit = (e: VKB.KeyboardAttributeType) => {
    if (e.code === 'StartSelect') {
      if (cursorKeys[2].key === '开始选择') {
        cursorKeys[2].key = '完成选择';
        setSelect(true);
      } else {
        cursorKeys[2].key = '开始选择';
        setSelect(false);
      }
      setKeys([...cursorKeys]);
    }

    onClick && onClick(e);
  };

  const triggerKey = (item: VKB.KeyboardAttributeType) => {
    onKeyDown?.(item);
    onClickEdit(item);
    onKeyUp?.(item);
  };

  const { startContinuousTrigger, stopContinuousTrigger } =
    useContinuousTrigger<VKB.KeyboardAttributeType>({
      onTrigger: triggerKey,
    });

  const isRepeatableCursorKey = (item: VKB.KeyboardAttributeType) =>
    ['ArrowLeft', 'ArrowRight', 'ArrowLeftFirst', 'ArrowRightEnd'].includes(
      item.code,
    );

  return (
    <div className="edit-keyboard">
      <div className="edit-key-cursor">
        {keys.map((item, index) => {
          const isRepeatable = isRepeatableCursorKey(item);

          return (
            <div
              className={`cursor-item ${
                index < 7 && isSelect ? 'cursor-item-active' : ''
              } ${isKeyActive?.(item) ? 'cursor-item-pressed' : ''}`}
              key={item.keyCode}
              title={item.description}
              onClick={() => {
                if (shouldIgnoreClick()) return;
                if (!isRepeatable) {
                  triggerKey(item);
                }
              }}
              onMouseDown={(e) => {
                if (!isRepeatable) return;

                e.preventDefault();
                startContinuousTrigger(item, 'mouse');
              }}
              onMouseUp={() => {
                if (!isRepeatable) return;

                stopContinuousTrigger('mouse');
              }}
              onMouseLeave={() => {
                if (!isRepeatable) return;

                stopContinuousTrigger('mouse');
              }}
              onTouchStart={(e) => {
                e.preventDefault();
                markTouchInteraction();
                if (!isRepeatable) {
                  triggerKey(item);
                  return;
                }

                startContinuousTrigger(item, 'touch');
              }}
              onTouchEnd={() => {
                if (!isRepeatable) return;

                stopContinuousTrigger('touch');
              }}
              onTouchCancel={() => {
                if (!isRepeatable) return;

                stopContinuousTrigger('touch');
              }}
            >
              {item.code && cursorSvg[item.code]
                ? cursorSvg[item.code]
                : item.renderKey || item.key}
            </div>
          );
        })}
      </div>
      {editKeys.map((item) => {
        const isBackspace = item.code === Backspace.code;

        return (
          <div
            className={`edit-key-control ${
              isKeyActive?.(item) ? 'edit-key-control-active' : ''
            }`}
            key={item.keyCode}
            title={item.description}
            onClick={() => {
              if (shouldIgnoreClick()) return;
              if (!isBackspace) {
                triggerKey(item);
              }
            }}
            onMouseDown={(e) => {
              if (!isBackspace) return;

              e.preventDefault();
              startContinuousTrigger(item, 'mouse');
            }}
            onMouseUp={() => {
              if (!isBackspace) return;

              stopContinuousTrigger('mouse');
            }}
            onMouseLeave={() => {
              if (!isBackspace) return;

              stopContinuousTrigger('mouse');
            }}
            onTouchStart={(e) => {
              e.preventDefault();
              markTouchInteraction();
              if (!isBackspace) {
                triggerKey(item);
                return;
              }

              startContinuousTrigger(item, 'touch');
            }}
            onTouchEnd={() => {
              if (!isBackspace) return;

              stopContinuousTrigger('touch');
            }}
            onTouchCancel={() => {
              if (!isBackspace) return;

              stopContinuousTrigger('touch');
            }}
          >
            {item.renderKey || item.key}
          </div>
        );
      })}
    </div>
  );
};
export default EditKeyboard;
