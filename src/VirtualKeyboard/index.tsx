import { useLocalStorageState } from 'ahooks';
import React, {
  CSSProperties,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { createPortal } from 'react-dom';
import { DEFAULT_KEYDOWN_AUDIO_URL } from '../assets/defaultKeydownAudio';

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
  VKB_NUMBER_KEYBOARD_LAYOUT_MODE,
  VKB_PINYIN_LEARNING_MODE,
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
  keydownAudioUrl: DEFAULT_KEYDOWN_AUDIO_URL,
};

const VirtualKeyboard = ({
  width = InitVirtualKeyBoardCtx.width,
  height = InitVirtualKeyBoardCtx.height,
  fontSize = InitVirtualKeyBoardCtx.fontSize,
  fontFamily = InitVirtualKeyBoardCtx.fontFamily,
  numberKeyboardLayoutMode = 'asc',
  iconWidth = InitVirtualKeyBoardCtx.iconWidth,
  iconHeight = InitVirtualKeyBoardCtx.iconHeight,
  zIndex = InitVirtualKeyBoardCtx.zIndex,
  keydownAudioUrl = InitVirtualKeyBoardCtx.keydownAudioUrl,
  focusShow,
  virtualKeyboardTab,
  theme,
  showDragHandle,
  showIcon = true,
  show = false,
  themeMode = 'light',
  positionMode,
  pushInputIntoView = false,
  useKeydownAudio = 'Y',
  usePinyinLearning = 'Y',
  onFunctionKey,
  functionKeyHandlers,
  functionKeyDefaults,
  getContainer,
}: VKB.VirtualKeyboardProps) => {
  type VirtualKeyboardStyles = CSSProperties & {
    '--vkb-key-font-size'?: string;
    '--vkb-key-font-family'?: string;
  };

  const [visible, setVisible] = useState(show);
  const [activeInputElement, setActiveInputElement] =
    useState<HTMLInputElement | null>(null);
  const [floatFollowInput, setFloatFollowInput] = useState(true);
  const [floatAnchorRect, setFloatAnchorRect] = useState<{
    left: number;
    top: number;
    right: number;
    bottom: number;
    width: number;
    height: number;
  } | null>(null);
  const pushedSpaceRef = useRef<{
    element: HTMLElement;
    paddingBottom: string;
  } | null>(null);
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
  const [currentNumberKeyboardLayoutMode, setCurrentNumberKeyboardLayoutMode] =
    useLocalStorageState<VKB.NumberKeyboardLayoutMode | undefined>(
      VKB_NUMBER_KEYBOARD_LAYOUT_MODE,
      {
        defaultValue: numberKeyboardLayoutMode,
      },
    );
  const [currentUsePinyinLearning, setCurrentUsePinyinLearning] =
    useLocalStorageState<VKB.PinyinLearningMode | undefined>(
      VKB_PINYIN_LEARNING_MODE,
      {
        defaultValue: usePinyinLearning,
      },
    );
  const shouldPushInputIntoView =
    visible &&
    currentPositionMode === FixedBottomPosition.code &&
    pushInputIntoView;

  const resolveFollowFocus = useCallback((input: HTMLInputElement | null) => {
    if (!input) return floatFollowInput;

    return input.dataset?.vkbFollowFocus !== 'false';
  }, [floatFollowInput]);

  const getScrollableAncestors = useCallback((element: HTMLElement) => {
    const ancestors: HTMLElement[] = [];
    let current = element.parentElement;

    while (current) {
      const style = window.getComputedStyle(current);
      const overflowY = style.overflowY;
      const canScrollY =
        (overflowY === 'auto' || overflowY === 'scroll' || overflowY === 'overlay') &&
        current.scrollHeight > current.clientHeight;

      if (canScrollY) {
        ancestors.push(current);
      }

      current = current.parentElement;
    }

    return ancestors;
  }, []);

  const resetPushedSpace = useCallback(() => {
    if (!pushedSpaceRef.current) {
      return;
    }

    const { element, paddingBottom } = pushedSpaceRef.current;
    element.style.paddingBottom = paddingBottom;
    pushedSpaceRef.current = null;
  }, []);

  const ensureScrollableSpace = useCallback((
    input: HTMLInputElement,
    requiredSpace: number,
  ) => {
    if (requiredSpace <= 0) {
      return null;
    }

    const ancestors = getScrollableAncestors(input);
    const target = ancestors[0] ?? (document.scrollingElement as HTMLElement | null) ?? document.documentElement;

    if (!target) {
      return null;
    }

    if (pushedSpaceRef.current?.element !== target) {
      resetPushedSpace();
    }

    const computedStyle = window.getComputedStyle(target);
    const originalPaddingBottom =
      pushedSpaceRef.current?.element === target
        ? pushedSpaceRef.current.paddingBottom
        : computedStyle.paddingBottom;
    const currentPaddingBottom =
      parseFloat(target.style.paddingBottom || computedStyle.paddingBottom || '0') || 0;
    const nextPaddingBottom = Math.ceil(
      Math.max(currentPaddingBottom, parseFloat(originalPaddingBottom || '0') || 0) +
        requiredSpace,
    );

    if (!pushedSpaceRef.current) {
      pushedSpaceRef.current = {
        element: target,
        paddingBottom: originalPaddingBottom,
      };
    }

    target.style.paddingBottom = `${nextPaddingBottom}px`;

    return target;
  }, [getScrollableAncestors, resetPushedSpace]);

  const scrollInputIntoVisibleArea = useCallback((input: HTMLInputElement | null) => {
    if (
      !input ||
      !shouldPushInputIntoView
    ) {
      return;
    }

    const viewportHeight = window.visualViewport?.height ?? window.innerHeight;
    const keyboardHeight = Math.max(
      0,
      Math.min(parseFloat(currentHeight ?? '0') || 0, viewportHeight),
    );
    const safeGap = 12;
    const rect = input.getBoundingClientRect();
    const visibleTop = safeGap;
    const visibleBottom = viewportHeight - keyboardHeight - safeGap;

    let delta = 0;

    if (rect.bottom > visibleBottom) {
      delta = rect.bottom - visibleBottom;
    } else if (rect.top < visibleTop) {
      delta = rect.top - visibleTop;
    }

    if (Math.abs(delta) < 1) {
      resetPushedSpace();
      return;
    }

    let remainingDelta = delta;
    const ancestors = getScrollableAncestors(input);

    ancestors.forEach((ancestor) => {
      if (remainingDelta === 0) {
        return;
      }

      if (remainingDelta > 0) {
        const availableDown = ancestor.scrollHeight - ancestor.clientHeight - ancestor.scrollTop;
        const consumed = Math.min(availableDown, remainingDelta);

        if (consumed > 0) {
          ancestor.scrollTop += consumed;
          remainingDelta -= consumed;
        }

        return;
      }

      const availableUp = ancestor.scrollTop;
      const consumed = Math.min(availableUp, Math.abs(remainingDelta));

      if (consumed > 0) {
        ancestor.scrollTop -= consumed;
        remainingDelta += consumed;
      }
    });

    if (remainingDelta > 0) {
      const target = ensureScrollableSpace(input, remainingDelta + safeGap);

      if (target) {
        if (target === document.scrollingElement || target === document.documentElement) {
          window.scrollBy({
            top: remainingDelta,
            behavior: 'smooth',
          });
        } else {
          target.scrollBy({
            top: remainingDelta,
            behavior: 'smooth',
          });
        }
        return;
      }
    }

    if (remainingDelta !== 0) {
      window.scrollBy({
        top: remainingDelta,
        behavior: 'smooth',
      });
    }
  }, [
    currentHeight,
    ensureScrollableSpace,
    getScrollableAncestors,
    resetPushedSpace,
    shouldPushInputIntoView,
  ]);

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

  useEffect(() => {
    if (numberKeyboardLayoutMode) {
      setCurrentNumberKeyboardLayoutMode(numberKeyboardLayoutMode);
    }
  }, [numberKeyboardLayoutMode, setCurrentNumberKeyboardLayoutMode]);

  useEffect(() => {
    if (usePinyinLearning) {
      setCurrentUsePinyinLearning(usePinyinLearning);
    }
  }, [setCurrentUsePinyinLearning, usePinyinLearning]);

  const updateFloatAnchorRect = useCallback((input: HTMLInputElement | null) => {
    if (!input) {
      setFloatAnchorRect(null);
      return;
    }

    const rect = input.getBoundingClientRect();
    setFloatAnchorRect({
      left: rect.left,
      top: rect.top,
      right: rect.right,
      bottom: rect.bottom,
      width: rect.width,
      height: rect.height,
    });
  }, []);

  useEffect(() => {
    if (currentPositionMode !== FloatPosition.code || !visible) {
      return;
    }

    const syncAnchor = () => {
      updateFloatAnchorRect(activeInputElement);
    };

    syncAnchor();
    window.addEventListener('resize', syncAnchor);
    window.addEventListener('scroll', syncAnchor, true);

    return () => {
      window.removeEventListener('resize', syncAnchor);
      window.removeEventListener('scroll', syncAnchor, true);
    };
  }, [activeInputElement, currentPositionMode, updateFloatAnchorRect, visible]);

  useEffect(() => {
    if (
      !shouldPushInputIntoView ||
      !activeInputElement
    ) {
      return;
    }

    let frameId = 0;
    let timeoutId = 0;

    const runScroll = () => {
      frameId = window.requestAnimationFrame(() => {
        scrollInputIntoVisibleArea(activeInputElement);
      });
    };

    runScroll();
    timeoutId = window.setTimeout(runScroll, 120);

    return () => {
      window.clearTimeout(timeoutId);
      window.cancelAnimationFrame(frameId);
    };
  }, [
    activeInputElement,
    currentHeight,
    scrollInputIntoVisibleArea,
    shouldPushInputIntoView,
  ]);

  useEffect(() => {
    if (shouldPushInputIntoView) {
      return;
    }

    resetPushedSpace();
  }, [
    resetPushedSpace,
    shouldPushInputIntoView,
  ]);

  useEffect(() => {
    return () => {
      resetPushedSpace();
    };
  }, [resetPushedSpace]);

  const floatMaxHeight = useMemo(() => {
    if (
      currentPositionMode !== FloatPosition.code ||
      !visible ||
      !floatAnchorRect
    ) {
      return undefined;
    }

    const safeMargin = 12;
    const availableBelow =
      window.innerHeight - floatAnchorRect.bottom - safeMargin * 2;
    const availableAbove = floatAnchorRect.top - safeMargin * 2;
    const nextHeight = Math.max(availableBelow, availableAbove);

    return nextHeight > 0 ? `${Math.floor(nextHeight)}px` : undefined;
  }, [currentPositionMode, floatAnchorRect, visible]);

  const vkbStyles = useMemo(() => {
    const styles: VirtualKeyboardStyles = {
      height: currentHeight,
      maxHeight: floatMaxHeight,
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
    floatMaxHeight,
    theme,
    visible,
  ]);

  const content = (
    <>
      {showIcon && (
        <DragBlock
          init={{
            width: iconWidth ?? InitVirtualKeyBoardCtx.iconWidth ?? '100px',
            height: iconHeight ?? InitVirtualKeyBoardCtx.iconHeight ?? '100px',
          }}
          resizeOverRight={true}
          defaultTopRatio={0.8}
          defaultHiddenWidthRatio={0.5}
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
      )}
      <DragBlock
        autoKeepRight={false}
        init={{
          width: currentWidth ?? '0px',
          height: currentHeight ?? '0px',
        }}
        defaultRightOffset={12}
        defaultBottomOffset={12}
        zIndex={visible ? zIndex : -1}
        positionMode={currentPositionMode}
        floatAnchorRect={
          visible && floatFollowInput ? floatAnchorRect : null
        }
        floatOffset={12}
        onManualMove={() => {
          setFloatFollowInput(false);
        }}
      >
        <CompositionKeyboard
          style={vkbStyles}
          keyboardVisible={visible}
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
          numberKeyboardLayoutMode={currentNumberKeyboardLayoutMode ?? 'asc'}
          enablePinyinLearning={currentUsePinyinLearning !== 'N'}
          focusShow={focusShow}
          virtualKeyboardTab={virtualKeyboardTab}
          showDragHandle={showDragHandle}
          useKeydownAudio={currentUseKeydownAudio}
          keydownAudioUrl={keydownAudioUrl}
          onFunctionKey={onFunctionKey}
          functionKeyHandlers={functionKeyHandlers}
          functionKeyDefaults={functionKeyDefaults}
          onChangeShow={setVisible}
          onActiveInputChange={(input) => {
            setActiveInputElement(input);
            if (input) {
              setFloatFollowInput(resolveFollowFocus(input));
            }
            updateFloatAnchorRect(input);
          }}
          onThemeModeChange={setCurrentThemeMode}
          onPositionModeChange={setCurrentPositionMode}
          onWidthChange={setCurrentWidth}
          onHeightChange={setCurrentHeight}
          onFontSizeChange={setCurrentFontSize}
          onFontFamilyChange={setCurrentFontFamily}
          onNumberKeyboardLayoutModeChange={setCurrentNumberKeyboardLayoutMode}
          onUsePinyinLearningChange={setCurrentUsePinyinLearning}
          onKeydownAudioUrlChange={() => undefined}
          onUseKeydownAudioChange={setCurrentUseKeydownAudio}
        />
      </DragBlock>
    </>
  );

  let container: HTMLElement | null = null;

  if (getContainer) {
    try {
      const resolvedContainer = getContainer();
      container =
        resolvedContainer instanceof HTMLElement ? resolvedContainer : null;
    } catch (error) {
      console.error('VirtualKeyboard getContainer error:', error);
    }
  }

  if (container) {
    return createPortal(content, container);
  }

  return content;
};

export default VirtualKeyboard;
