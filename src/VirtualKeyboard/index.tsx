import React, {
  createContext,
  ReactNode,
  useContext,
  useMemo,
  useState,
} from 'react';
import CompositionKeyboard from '../CompositionKeyboard';

import DragBlock from '../DragBlock';

import { useLocalStorageState } from 'ahooks';
import {
  FixedBottomPosition,
  FixedLeftPosition,
  FixedRightPosition,
  FixedTopPosition,
  FloatPosition,
  VKB_KEYDOWN_MODE,
  VKB_POSITION_MODE,
  VKB_THEME_MODE,
} from '../keys';
import { ReactComponent as KeyBoardSvg } from '../svg/out-keyboard.svg';
import { VKB } from '../typing';

/** 初始的 ctx 值 */
export const InitVirtualKeyBoardCtx: VKB.KeyBoardCtxTypBase = {
  width: '500px',
  height: '320px',
  iconWidth: '100px',
  iconHeight: '100px',
  zIndex: 9999,
  keydownAudioUrl: '/audio/typing-sound-02-229861.mp3',
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
          virtualKeyboardCtx?.setShow?.(true);
        }}
      >
        <KeyBoardSvg
          style={{
            width: virtualKeyboardCtx.iconWidth,
            height: virtualKeyboardCtx.iconHeight,
          }}
        />
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
        <CompositionKeyboard
          style={vkbStyles}
          themeMode={virtualKeyboardCtx.themeMode}
          positionMode={virtualKeyboardCtx.positionMode}
          virtualKeyboardTab={virtualKeyboardCtx.virtualKeyboardTab}
          showDragHandle={virtualKeyboardCtx.showDragHandle}
          useKeydownAudio={virtualKeyboardCtx.useKeydownAudio}
          keydownAudioUrl={virtualKeyboardCtx.keydownAudioUrl}
          onChangeShow={virtualKeyboardCtx.setShow}
          onThemeModeChange={virtualKeyboardCtx.setThemeMode}
          onPositionModeChange={virtualKeyboardCtx.setPositionMode}
          onKeydownAudioUrlChange={virtualKeyboardCtx.setKeydownAudioUrl}
          onUseKeydownAudioChange={virtualKeyboardCtx.setUseKeydownAudio}
        />
      </DragBlock>
    </>
  );
};

const VirtualKeyboardProvider = ({
  children,
  value = InitVirtualKeyBoardCtx,
}: {
  children?: ReactNode;
  value?: VKB.KeyBoardCtxTypBase;
}) => {
  const [show, setShow] = useState(false);

  const [themeMode, setThemeMode] = useLocalStorageState(VKB_THEME_MODE, {
    defaultValue: 'light',
  });

  const [positionMode, setPositionMode] = useLocalStorageState(
    VKB_POSITION_MODE,
    {
      defaultValue: 'float',
    },
  );

  const [useKeydownAudio, setUseKeydownAudio] = useLocalStorageState<
    'Y' | 'N' | undefined
  >(VKB_KEYDOWN_MODE, {
    defaultValue: 'Y',
  });

  return (
    <VirtualKeyboardContext.Provider
      value={{
        show,
        setShow,
        positionMode,
        setPositionMode,
        useKeydownAudio,
        setUseKeydownAudio,
        themeMode,
        setThemeMode,
        ...value,
      }}
    >
      {children}
    </VirtualKeyboardContext.Provider>
  );
};

const useVirtualKeyboard = () => {
  const virtualKeyboardCtx = useContext(VirtualKeyboardContext);

  return {
    virtualKeyboardCtx,
    VirtualKeyboardProvider,
    VirtualKeyboard,
  };
};

export default useVirtualKeyboard;
