import React, { useState } from 'react';
import useContinuousTrigger from '../hooks/useContinuousTrigger';
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
}: {
  onClick?: (e: VKB.KeyboardAttributeType) => void;
}) => {
  const [keys, setKeys] = useState(cursorKeys);

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

  const { startContinuousTrigger, stopContinuousTrigger } =
    useContinuousTrigger<VKB.KeyboardAttributeType>({
      onTrigger: onClickEdit,
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
              }`}
              key={item.keyCode}
              title={item.description}
              onClick={() => {
                if (!isRepeatable) {
                  onClickEdit(item);
                }
              }}
              onMouseDown={(e) => {
                if (!isRepeatable) return;

                e.preventDefault();
                startContinuousTrigger(item);
              }}
              onMouseUp={() => {
                if (!isRepeatable) return;

                stopContinuousTrigger();
              }}
              onMouseLeave={() => {
                if (!isRepeatable) return;

                stopContinuousTrigger();
              }}
              onTouchStart={(e) => {
                if (!isRepeatable) return;

                e.preventDefault();
                startContinuousTrigger(item);
              }}
              onTouchEnd={() => {
                if (!isRepeatable) return;

                stopContinuousTrigger();
              }}
              onTouchCancel={() => {
                if (!isRepeatable) return;

                stopContinuousTrigger();
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
            className="edit-key-control"
            key={item.keyCode}
            title={item.description}
            onClick={() => {
              if (!isBackspace) {
                onClickEdit(item);
              }
            }}
            onMouseDown={(e) => {
              if (!isBackspace) return;

              e.preventDefault();
              startContinuousTrigger(item);
            }}
            onMouseUp={() => {
              if (!isBackspace) return;

              stopContinuousTrigger();
            }}
            onMouseLeave={() => {
              if (!isBackspace) return;

              stopContinuousTrigger();
            }}
            onTouchStart={(e) => {
              if (!isBackspace) return;

              e.preventDefault();
              startContinuousTrigger(item);
            }}
            onTouchEnd={() => {
              if (!isBackspace) return;

              stopContinuousTrigger();
            }}
            onTouchCancel={() => {
              if (!isBackspace) return;

              stopContinuousTrigger();
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
