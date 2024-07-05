import React, { createContext, useContext, useMemo } from 'react';
import Keyboard from './Keyboard';

import DragBlock from '../DragBlock';

import {
  FixedBottomPosition,
  FixedLeftPosition,
  FixedRightPosition,
  FixedTopPosition,
  FloatPosition,
} from '../keys';
import { ReactComponent as KeyBoardSvg } from '../svg/out-keyboard.svg';
import { VKB } from '../typing';

/** 初始的 ctx 值 */
export const InitVirtualKeyBoardCtx: VKB.KeyBoardCtxType = {
  show: false,
  width: '500px',
  height: '320px',
  zIndex: 9999,
  showDragHandle: true,
  theme: {},
  themeMode: 'light',
  positionMode: 'float',
  setShow: () => {},
  setThemeMode: () => {},
  setPositionMode: () => {},
  onChange: () => {},
};

export const VirtualKeyboardContext = createContext<VKB.KeyBoardCtxType>(
  InitVirtualKeyBoardCtx,
);

export const VirtualKeyboard = () => {
  const virtualKeyboardCtx = useContext(VirtualKeyboardContext);

  const vkbStyles = useMemo(() => {
    const styles = {
      height: virtualKeyboardCtx.height,
      width: virtualKeyboardCtx.width,
      transform: virtualKeyboardCtx.show ? 'scale(1)' : 'scale(0)',
      ...virtualKeyboardCtx.theme,
    };
    switch (virtualKeyboardCtx.positionMode) {
      case FloatPosition.code:
        styles.width =
          parseFloat(virtualKeyboardCtx.width ?? '0') > window.innerWidth
            ? '100vw'
            : virtualKeyboardCtx.width;
        break;
      case FixedBottomPosition.code:
      case FixedTopPosition.code:
        styles.width = '100vw';
        break;
      case FixedLeftPosition.code:
      case FixedRightPosition.code:
        styles.height = '100vh';
        styles.width =
          parseFloat(virtualKeyboardCtx.width ?? '0') > window.innerWidth
            ? '100vw'
            : virtualKeyboardCtx.width;
        break;
    }
    return styles;
  }, [
    virtualKeyboardCtx.positionMode,
    virtualKeyboardCtx.show,
    virtualKeyboardCtx.theme,
  ]);

  return (
    <>
      <DragBlock
        resizeOverRight={true}
        onClick={() => {
          virtualKeyboardCtx.setShow(true);
        }}
      >
        <KeyBoardSvg style={{ width: 100, height: 100 }}></KeyBoardSvg>
      </DragBlock>
      <DragBlock
        autoKeepRight={false}
        init={{
          width: virtualKeyboardCtx.width ?? '0px',
          height: virtualKeyboardCtx.height ?? '0px',
        }}
        zIndex={virtualKeyboardCtx.show ? virtualKeyboardCtx.zIndex : -1}
        positionMode={virtualKeyboardCtx.positionMode}
      >
        <Keyboard
          style={vkbStyles}
          themeMode={virtualKeyboardCtx.themeMode}
          positionMode={virtualKeyboardCtx.positionMode}
          virtualKeyboardTab={virtualKeyboardCtx.virtualKeyboardTab}
          showDragHandle={virtualKeyboardCtx.showDragHandle}
          onShow={() => {
            virtualKeyboardCtx.setShow(true);
          }}
          onHidden={() => {
            virtualKeyboardCtx.setShow(false);
          }}
          onChange={virtualKeyboardCtx.onChange}
          onThemeModeChange={virtualKeyboardCtx.setThemeMode}
          onPositionModeChange={virtualKeyboardCtx.setPositionMode}
        />
      </DragBlock>
    </>
  );
};

const useVirtualKeyboard = () => {
  const virtualKeyboardCtx = useContext(VirtualKeyboardContext);

  return {
    InitVirtualKeyBoardCtx,
    virtualKeyboardCtx,
    VirtualKeyboardProvide: VirtualKeyboardContext.Provider,
    VirtualKeyboard,
  };
};

export default useVirtualKeyboard;
