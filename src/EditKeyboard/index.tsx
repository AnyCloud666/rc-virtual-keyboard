import React, { useState } from 'react';
import { cursorKeys, editKeys } from '../keys';

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

  return (
    <div className="edit-keyboard">
      <div className="edit-key-cursor">
        {keys.map((item, index) => {
          return (
            <div
              className={`cursor-item ${
                index < 7 && isSelect ? 'cursor-item-active' : ''
              }`}
              key={item.keyCode}
              title={item.description}
              onClick={() => onClickEdit(item)}
            >
              {item.code && cursorSvg[item.code]
                ? cursorSvg[item.code]
                : item.key}
            </div>
          );
        })}
      </div>
      {editKeys.map((item) => {
        return (
          <div
            className="edit-key-control"
            key={item.keyCode}
            title={item.description}
            onClick={() => onClickEdit(item)}
          >
            {item.key}
          </div>
        );
      })}
    </div>
  );
};
export default EditKeyboard;
