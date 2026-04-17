import { useLocalStorageState } from 'ahooks';
import React, { CSSProperties, useEffect, useMemo, useState } from 'react';

import CompositionKeyboard from '../CompositionKeyboard';
import DragBlock from '../DragBlock';
import useIsMobile from '../hooks/useIsMobile';
import {
  FixedBottomPosition,
  FixedLeftPosition,
  FixedRightPosition,
  FixedTopPosition,
  FloatPosition,
  VKB_KEY_FONT_FAMILY,
  VKB_KEY_FONT_SIZE,
  VKB_KEYBOARD_HEIGHT,
  VKB_KEYBOARD_WIDTH,
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
  fontSize: '14px',
  fontFamily: "'Microsoft YaHei', 'PingFang SC', sans-serif",
  iconWidth: '100px',
  iconHeight: '100px',
  zIndex: 9999,
  keydownAudioUrl: '/audio/typing-sound-02-229861.mp3',
};

const VirtualKeyboard = ({
  width = InitVirtualKeyBoardCtx.width,
  height = InitVirtualKeyBoardCtx.height,
  fontSize = InitVirtualKeyBoardCtx.fontSize,
  fontFamily = InitVirtualKeyBoardCtx.fontFamily,
  iconWidth = InitVirtualKeyBoardCtx.iconWidth,
  iconHeight = InitVirtualKeyBoardCtx.iconHeight,
  zIndex = InitVirtualKeyBoardCtx.zIndex,
  keydownAudioUrl = InitVirtualKeyBoardCtx.keydownAudioUrl,
  focusShow,
  virtualKeyboardTab,
  theme,
  showDragHandle,
  show = false,
  themeMode = 'light',
  positionMode,
  useKeydownAudio = 'Y',
}: VKB.VirtualKeyboardProps) => {
  type VirtualKeyboardStyles = CSSProperties & {
    '--vkb-key-font-size'?: string;
    '--vkb-key-font-family'?: string;
  };

  const [visible, setVisible] = useState(show);
  const isMobile = useIsMobile();
  const defaultPositionMode = isMobile
    ? FixedBottomPosition.code
    : FloatPosition.code;
  const resolvedPositionMode = positionMode ?? defaultPositionMode;

  const [currentThemeMode, setCurrentThemeMode] = useLocalStorageState(
    VKB_THEME_MODE,
    {
      defaultValue: themeMode,
    },
  );

  const [currentPositionMode, setCurrentPositionMode] = useLocalStorageState(
    VKB_POSITION_MODE,
    {
      defaultValue: resolvedPositionMode,
    },
  );

  const [currentWidth, setCurrentWidth] = useLocalStorageState(
    VKB_KEYBOARD_WIDTH,
    {
      defaultValue: width,
    },
  );

  const [currentHeight, setCurrentHeight] = useLocalStorageState(
    VKB_KEYBOARD_HEIGHT,
    {
      defaultValue: height,
    },
  );

  const [currentFontSize, setCurrentFontSize] = useLocalStorageState(
    VKB_KEY_FONT_SIZE,
    {
      defaultValue: fontSize,
    },
  );

  const [currentFontFamily, setCurrentFontFamily] = useLocalStorageState(
    VKB_KEY_FONT_FAMILY,
    {
      defaultValue: fontFamily,
    },
  );

  const [currentUseKeydownAudio, setCurrentUseKeydownAudio] =
    useLocalStorageState<'Y' | 'N' | undefined>(VKB_KEYDOWN_MODE, {
      defaultValue: useKeydownAudio,
    });

  useEffect(() => {
    setVisible(show);
  }, [show]);

  useEffect(() => {
    if (themeMode) {
      setCurrentThemeMode(themeMode);
    }
  }, [setCurrentThemeMode, themeMode]);

  useEffect(() => {
    if (positionMode) {
      setCurrentPositionMode(positionMode);
      return;
    }

    setCurrentPositionMode(defaultPositionMode);
  }, [defaultPositionMode, positionMode, setCurrentPositionMode]);

  useEffect(() => {
    if (width) {
      setCurrentWidth(width);
    }
  }, [setCurrentWidth, width]);

  useEffect(() => {
    if (height) {
      setCurrentHeight(height);
    }
  }, [height, setCurrentHeight]);

  useEffect(() => {
    if (fontSize) {
      setCurrentFontSize(fontSize);
    }
  }, [fontSize, setCurrentFontSize]);

  useEffect(() => {
    if (fontFamily) {
      setCurrentFontFamily(fontFamily);
    }
  }, [fontFamily, setCurrentFontFamily]);

  useEffect(() => {
    if (useKeydownAudio) {
      setCurrentUseKeydownAudio(useKeydownAudio);
    }
  }, [setCurrentUseKeydownAudio, useKeydownAudio]);

  const vkbStyles = useMemo(() => {
    const styles: VirtualKeyboardStyles = {
      height: currentHeight,
      width: currentWidth,
      fontSize: currentFontSize ?? InitVirtualKeyBoardCtx.fontSize,
      fontFamily: currentFontFamily ?? InitVirtualKeyBoardCtx.fontFamily,
      transform: visible ? 'scale(1)' : 'scale(0)',
      '--vkb-key-font-size':
        currentFontSize ?? InitVirtualKeyBoardCtx.fontSize ?? '14px',
      '--vkb-key-font-family':
        currentFontFamily ??
        InitVirtualKeyBoardCtx.fontFamily ??
        "'Microsoft YaHei', 'PingFang SC', sans-serif",
      ...theme,
    };
    switch (currentPositionMode) {
      case FloatPosition.code:
        styles.width =
          parseFloat(currentWidth ?? '0') > window.innerWidth
            ? '100vw'
            : currentWidth;
        break;
      case FixedBottomPosition.code:
      case FixedTopPosition.code:
        styles.width = '100vw';
        break;
      case FixedLeftPosition.code:
      case FixedRightPosition.code:
        styles.height = '100vh';
        styles.width =
          parseFloat(currentWidth ?? '0') > window.innerWidth
            ? '100vw'
            : currentWidth;
        break;
    }
    return styles;
  }, [
    currentFontSize,
    currentFontFamily,
    currentHeight,
    currentPositionMode,
    currentWidth,
    theme,
    visible,
  ]);

  return (
    <>
      <DragBlock
        resizeOverRight={true}
        onClick={() => {
          setVisible(true);
        }}
      >
        <KeyBoardSvg
          style={{
            width: iconWidth,
            height: iconHeight,
          }}
        />
      </DragBlock>
      <DragBlock
        autoKeepRight={false}
        init={{
          width: currentWidth ?? '0px',
          height: currentHeight ?? '0px',
        }}
        zIndex={visible ? zIndex : -1}
        positionMode={currentPositionMode}
      >
        <CompositionKeyboard
          style={vkbStyles}
          themeMode={currentThemeMode}
          positionMode={currentPositionMode}
          width={currentWidth ?? InitVirtualKeyBoardCtx.width ?? '500px'}
          height={currentHeight ?? InitVirtualKeyBoardCtx.height ?? '320px'}
          fontSize={
            currentFontSize ?? InitVirtualKeyBoardCtx.fontSize ?? '14px'
          }
          fontFamily={
            currentFontFamily ??
            InitVirtualKeyBoardCtx.fontFamily ??
            "'Microsoft YaHei', 'PingFang SC', sans-serif"
          }
          focusShow={focusShow}
          virtualKeyboardTab={virtualKeyboardTab}
          showDragHandle={showDragHandle}
          useKeydownAudio={currentUseKeydownAudio}
          keydownAudioUrl={keydownAudioUrl}
          onChangeShow={setVisible}
          onThemeModeChange={setCurrentThemeMode}
          onPositionModeChange={setCurrentPositionMode}
          onWidthChange={setCurrentWidth}
          onHeightChange={setCurrentHeight}
          onFontSizeChange={setCurrentFontSize}
          onFontFamilyChange={setCurrentFontFamily}
          onKeydownAudioUrlChange={() => undefined}
          onUseKeydownAudioChange={setCurrentUseKeydownAudio}
        />
      </DragBlock>
    </>
  );
};

export default VirtualKeyboard;
