import { Simulate, SimulateEventData } from '../../utils/simulate';
import {
  getEnglishLearningPrefixCandidates,
  recordEnglishSelection,
  reorderCandidatesByEnglishLearning,
} from '../../utils/englishLearning';
import {
  getPinyinLearningPrefixCandidates,
  recordPinyinSelection,
  reorderCandidatesByPinyinLearning,
} from '../../utils/pinyinLearning';
import {
  ArrowDown,
  ArrowLeft,
  ArrowLeftFirst,
  ArrowRight,
  ArrowRightEnd,
  ArrowUp,
  BackgroundAudio,
  Backspace,
  Clear,
  Copy,
  DarkTheme,
  EN,
  Enter,
  FixedBottomPosition,
  FixedLeftPosition,
  FixedRightPosition,
  FixedTopPosition,
  FloatPosition,
  LightTheme,
  Paste,
  SelectAll,
  Space,
  StartSelect,
  Tab,
  ZH,
  controlsType,
  functionType,
  letterType,
  settingType,
} from '../../keys';
import { VKB } from '../../typing';
import { getNextCursorIndex, getPreviousCursorIndex } from './cursorUtils';
import {
  applyInputValue,
  canApplySelectionBasedValue,
  dedupeCandidates,
  getSelectionInfo,
  isAllowInputNumber,
  reportInvalidInputType,
  validateInputType,
} from './inputValueUtils';

type CreateInteractionHandlersArgs = {
  inputMode: VKB.InputMode;
  activeKeyboard: string;
  inputValue: string;
  chinese: string[];
  caretBrowsingEnabled: boolean;
  vkbKeydownAudio: 'Y' | 'N';
  keyboardVisible: boolean;
  enablePinyinLearning: boolean;
  onPinyin2Chinese: (value: string) => { pinyin: string; chinese: string[] };
  onEnglishWords: (value: string) => string[];
  activeInputRef: React.MutableRefObject<HTMLInputElement | null>;
  lastActiveInputRef: React.MutableRefObject<HTMLInputElement | null>;
  inputType: React.MutableRefObject<string>;
  cursorMode: React.MutableRefObject<string>;
  jumpDelete: React.MutableRefObject<boolean>;
  keyboardPointerUntilRef: React.MutableRefObject<number>;
  keyboardTouchSessionRef: React.MutableRefObject<boolean>;
  pinyinLearningRequestIdRef: React.MutableRefObject<number>;
  setInputValue: React.Dispatch<React.SetStateAction<string>>;
  setChinese: React.Dispatch<React.SetStateAction<string[]>>;
  setInputMode: React.Dispatch<React.SetStateAction<VKB.InputMode>>;
  setVkbThemeMode: React.Dispatch<React.SetStateAction<string>>;
  setVkbPositionMode: React.Dispatch<React.SetStateAction<string>>;
  setVkbKeydownAudio: React.Dispatch<React.SetStateAction<'Y' | 'N'>>;
  setCaretBrowsingEnabled: React.Dispatch<React.SetStateAction<boolean>>;
  activateKeyCode: (code: string) => void;
  releaseKeyCode: (code: string, delay?: number) => void;
  playKeydownAudio: () => void;
  markKeyboardPointerInteraction: (duration?: number) => void;
  releaseKeyboardPointerInteraction: (duration?: number) => void;
  getCurrentFunctionKeyContext: (
    key: VKB.KeyboardAttributeType,
    nextCaretBrowsingEnabled?: boolean,
  ) => VKB.FunctionKeyContext;
  dispatchCurrentFunctionKeyEvent: (
    key: VKB.KeyboardAttributeType,
    nextCaretBrowsingEnabled?: boolean,
  ) => boolean;
  dispatchWindowFunctionKeyEvent: (
    type: 'keydown' | 'keyup',
    key: VKB.KeyboardAttributeType,
  ) => void;
  runCurrentDefaultFunctionKeyAction: (key: VKB.KeyboardAttributeType) => boolean;
  onFunctionKey?: VKB.FunctionKeyHandler;
  functionKeyHandlers?: VKB.FunctionKeyHandlerMap;
  onThemeModeChange?: (mode: string) => void;
  onPositionModeChange?: (mode: string) => void;
  onUseKeydownAudioChange?: (mode: 'Y' | 'N') => void;
};

/**
 * 创建 useInput 中最核心的一组交互处理函数。
 *
 * @description
 * 这一层负责把“输入、候选、控制键、功能键、键盘表面事件”组织成统一的运行时，
 * 让主入口文件只保留状态装配和事件注册。
 */
export const createInteractionHandlers = ({
  inputMode,
  activeKeyboard,
  inputValue,
  chinese,
  caretBrowsingEnabled,
  vkbKeydownAudio,
  keyboardVisible,
  enablePinyinLearning,
  onPinyin2Chinese,
  onEnglishWords,
  activeInputRef,
  lastActiveInputRef,
  inputType,
  cursorMode,
  jumpDelete,
  keyboardPointerUntilRef,
  keyboardTouchSessionRef,
  pinyinLearningRequestIdRef,
  setInputValue,
  setChinese,
  setInputMode,
  setVkbThemeMode,
  setVkbPositionMode,
  setVkbKeydownAudio,
  setCaretBrowsingEnabled,
  activateKeyCode,
  releaseKeyCode,
  playKeydownAudio,
  markKeyboardPointerInteraction,
  releaseKeyboardPointerInteraction,
  getCurrentFunctionKeyContext,
  dispatchCurrentFunctionKeyEvent,
  dispatchWindowFunctionKeyEvent,
  runCurrentDefaultFunctionKeyAction,
  onFunctionKey,
  functionKeyHandlers,
  onThemeModeChange,
  onPositionModeChange,
  onUseKeydownAudioChange,
}: CreateInteractionHandlersArgs) => {
  const shouldSkipLearningForActiveInput = () => {
    const targetInput = activeInputRef.current ?? lastActiveInputRef.current;

    if (!targetInput) {
      return false;
    }

    return (
      targetInput.type === 'password' || targetInput.dataset?.vkbType === 'password'
    );
  };

  const emitInputEvent = () => {
    if (!activeInputRef.current) return;
    Simulate?.input?.(activeInputRef.current);
    Simulate?.change?.(activeInputRef.current);
  };

  const updateChineseCandidates = (value: string) => {
    const transformMsg = onPinyin2Chinese(value) || {
      pinyin: value,
      chinese: [],
    };
    const normalizedValue = value.toLowerCase().replace(/[^a-z'\s]+/g, '').trim();
    const compactValue = normalizedValue.replace(/['\s]+/g, '');
    const shouldUseSingleCharCandidatesOnly = compactValue.length === 1;
    const baseCandidates = dedupeCandidates(transformMsg.chinese).filter((item) =>
      shouldUseSingleCharCandidatesOnly ? item.length === 1 : true,
    );
    const requestId = ++pinyinLearningRequestIdRef.current;

    setInputValue(value);
    setChinese([value, ...baseCandidates]);

    if (
      enablePinyinLearning !== true ||
      shouldSkipLearningForActiveInput() ||
      shouldUseSingleCharCandidatesOnly
    ) {
      return;
    }

    void Promise.all([
      getPinyinLearningPrefixCandidates(transformMsg.pinyin || value),
      reorderCandidatesByPinyinLearning(transformMsg.pinyin || value, baseCandidates),
    ])
      .then(([learnedPrefixCandidates, sortedCandidates]) => {
        if (pinyinLearningRequestIdRef.current !== requestId) {
          return;
        }

        const mergedCandidates = dedupeCandidates([
          ...learnedPrefixCandidates,
          ...sortedCandidates,
        ]);

        setChinese([value, ...mergedCandidates]);
      })
      .catch((error) => {
        console.warn('reorder pinyin candidates failed:', error);
      });
  };

  const updateLetterCandidates = (value: string) => {
    if (!value) {
      pinyinLearningRequestIdRef.current += 1;
      setInputValue('');
      setChinese([]);
      return;
    }

    if (inputMode === ZH) {
      updateChineseCandidates(value);
      return;
    }

    const words = dedupeCandidates(onEnglishWords(value) || []).filter(
      (word) => word !== value,
    );
    const requestId = ++pinyinLearningRequestIdRef.current;
    setInputValue(value);
    setChinese([value, ...words]);

    if (
      enablePinyinLearning !== true ||
      shouldSkipLearningForActiveInput()
    ) {
      return;
    }

    void Promise.all([
      getEnglishLearningPrefixCandidates(value),
      reorderCandidatesByEnglishLearning(value, words),
    ])
      .then(([learnedPrefixWords, sortedWords]) => {
        if (pinyinLearningRequestIdRef.current !== requestId) {
          return;
        }

        const mergedWords = dedupeCandidates([
          ...learnedPrefixWords.filter((word) => word !== value),
          ...sortedWords,
        ]);

        setChinese([value, ...mergedWords]);
      })
      .catch((error) => {
        console.warn('reorder english candidates failed:', error);
      });
  };

  const shouldUseLetterComposition = (key: string) => {
    return activeKeyboard === letterType && /^[a-zA-Z]$/.test(key);
  };

  const onSelectChinese = (
    chineseText: string,
    appendText = '',
    options?: { replaceText?: string },
  ) => {
    const currentPinyinValue = inputValue;
    const targetInput = activeInputRef.current ?? lastActiveInputRef.current;

    if (targetInput && canApplySelectionBasedValue(targetInput)) {
      let { value, selectionStart, selectionEnd } = getSelectionInfo(targetInput);
      const replaceText = options?.replaceText;
      let insertStart = selectionStart;
      let insertEnd = selectionEnd;

      if (replaceText) {
        const beforeCursor = value.slice(0, selectionEnd);
        const replaceStart =
          beforeCursor.lastIndexOf(replaceText) !== -1
            ? beforeCursor.lastIndexOf(replaceText)
            : value.lastIndexOf(replaceText);

        if (replaceStart !== -1) {
          insertStart = replaceStart;
          insertEnd = replaceStart + replaceText.length;
        }
      }

      value =
        value.slice(0, insertStart) +
        chineseText +
        appendText +
        value.slice(insertEnd);
      const insertedText = chineseText + appendText;

      applyInputValue(
        targetInput,
        value,
        insertedText.length + insertStart,
        insertedText.length + insertStart,
      );

      Simulate?.input?.(targetInput);
      Simulate?.change?.(targetInput);
    }

    if (
      enablePinyinLearning &&
      !shouldSkipLearningForActiveInput() &&
      inputMode === ZH &&
      activeKeyboard === letterType &&
      currentPinyinValue &&
      chineseText !== currentPinyinValue
    ) {
      void recordPinyinSelection(currentPinyinValue, chineseText).catch((error) => {
        console.warn('record pinyin selection failed:', error);
      });
    }

    if (
      enablePinyinLearning &&
      !shouldSkipLearningForActiveInput() &&
      inputMode === EN &&
      activeKeyboard === letterType &&
      currentPinyinValue
    ) {
      void recordEnglishSelection(currentPinyinValue, chineseText).catch(
        (error) => {
          console.warn('record english selection failed:', error);
        },
      );
    }

    pinyinLearningRequestIdRef.current += 1;
    setInputValue('');
    setChinese([]);
  };

  const commitCurrentCandidate = (appendText = '') => {
    if (!activeInputRef.current || !inputValue) return false;

    const candidate =
      inputMode === ZH
        ? chinese[1] || chinese[0] || inputValue
        : chinese[0] || inputValue;
    onSelectChinese(candidate, appendText);
    return true;
  };

  const onInput = (e: VKB.KeyboardAttributeType) => {
    if (activeInputRef.current && typeof e.key === 'string') {
      let { value, selectionStart, selectionEnd, isCollapsed } =
        getSelectionInfo(activeInputRef.current);
      const vkbNotEmpty = activeInputRef.current.dataset?.vkbNotEmpty;
      const vkbNotEmptyTrim = activeInputRef.current.dataset?.vkbNotEmptyTrim;
      const vkbNotInput =
        activeInputRef.current.dataset?.vkbNotInput?.split(',');

      if (validateInputType(activeInputRef.current)) {
        reportInvalidInputType();
        return;
      }

      if (vkbNotInput?.includes(e.key)) return;
      if (vkbNotEmpty === 'true' && e.code === Space.code) return;
      if (
        vkbNotEmptyTrim === 'true' &&
        e.code === Space.code &&
        (selectionStart === 0 || selectionEnd === value.length)
      ) {
        return;
      }

      if (
        shouldUseLetterComposition(e.key) &&
        ((inputMode === ZH && e.key !== Space.code) || inputMode === EN)
      ) {
        const nextLetterValue =
          inputMode === ZH ? e.key.toLowerCase() : e.key;

        updateLetterCandidates(inputValue + nextLetterValue);
        jumpDelete.current = false;
      } else if (
        inputMode === EN &&
        inputValue &&
        activeKeyboard === letterType &&
        e.code === Space.code
      ) {
        updateLetterCandidates(`${inputValue} `);
        jumpDelete.current = false;
      } else {
        const insertedLength = e.key.length;
        if (isAllowInputNumber(inputType.current, value, e.key)) return;

        if (isCollapsed) {
          value =
            value.slice(0, selectionStart) +
            e.key +
            value.slice(selectionStart);
        } else {
          value =
            value.slice(0, selectionStart) + e.key + value.slice(selectionEnd);
        }

        applyInputValue(
          activeInputRef.current,
          value,
          selectionStart + insertedLength,
          selectionStart + insertedLength,
        );

        emitInputEvent();
      }
    }
  };

  const onBackspace = (e: VKB.KeyboardAttributeType) => {
    if (activeInputRef.current) {
      if (validateInputType(activeInputRef.current)) {
        reportInvalidInputType();
        return;
      }

      if (inputMode === ZH || inputMode === EN) {
        const value = inputValue.slice(0, inputValue.length - 1);
        updateLetterCandidates(value);

        if (value) return;
        if (!value && !jumpDelete.current) {
          jumpDelete.current = true;
          return;
        }
      }

      const { selectionStart, selectionEnd, value, isCollapsed } =
        getSelectionInfo(activeInputRef.current);
      const deleteStart = isCollapsed
        ? getPreviousCursorIndex(value, selectionStart)
        : selectionStart;

      const tempValue = value.slice(0, deleteStart) + value.slice(selectionEnd);
      applyInputValue(
        activeInputRef.current,
        tempValue,
        deleteStart,
        deleteStart,
      );

      emitInputEvent();
    }
  };

  const onCursor = (e: VKB.KeyboardAttributeType) => {
    if (activeInputRef.current) {
      if (validateInputType(activeInputRef.current)) {
        reportInvalidInputType();
        return;
      }

      const { selectionStart, selectionEnd, value } = getSelectionInfo(
        activeInputRef.current,
      );
      let index = 0;
      const maxLength = value.length;

      if (cursorMode.current === 'index') {
        switch (e.code) {
          case ArrowUp.code:
          case ArrowLeftFirst.code:
            activeInputRef.current.setSelectionRange(0, 0);
            break;
          case ArrowLeft.code:
            index = getPreviousCursorIndex(value, selectionEnd);
            activeInputRef.current.setSelectionRange(index, index);
            break;
          case ArrowRight.code:
            index = getNextCursorIndex(value, selectionEnd);
            activeInputRef.current.setSelectionRange(index, index);
            break;
          case ArrowDown.code:
          case ArrowRightEnd.code:
            activeInputRef.current.setSelectionRange(maxLength, maxLength);
            break;
          case SelectAll.code:
            activeInputRef.current.setSelectionRange(0, maxLength);
            break;
          case StartSelect.code:
            cursorMode.current = 'select';
            break;
        }
      } else {
        switch (e.code) {
          case ArrowUp.code:
          case ArrowLeftFirst.code:
            activeInputRef.current.setSelectionRange(0, selectionEnd);
            break;
          case ArrowLeft.code:
            index = getPreviousCursorIndex(value, selectionStart);
            activeInputRef.current.setSelectionRange(index, selectionEnd);
            break;
          case ArrowRight.code:
            if (selectionEnd < maxLength) {
              index = getNextCursorIndex(value, selectionEnd);
              activeInputRef.current.setSelectionRange(selectionStart, index);
            } else {
              index = getNextCursorIndex(value, selectionStart);
              activeInputRef.current.setSelectionRange(index, selectionEnd);
            }
            break;
          case ArrowDown.code:
          case ArrowRightEnd.code:
            activeInputRef.current.setSelectionRange(selectionEnd, value.length);
            break;
          case SelectAll.code:
            activeInputRef.current.setSelectionRange(0, maxLength);
            break;
          case StartSelect.code:
            cursorMode.current = 'index';
            break;
        }
      }
    }
  };

  const onTab = () => {
    try {
      const inputs = document.getElementsByTagName('input') || [];
      const inputList = Array.from(inputs).filter((el) => {
        if (el.hasAttribute('disabled')) return false;
        if (el.readOnly) return false;
        if (el.type === 'hidden') return false;
        if (el.dataset?.vkbDisabled === 'true') return false;
        if (el.tabIndex < 0) return false;

        const style = window.getComputedStyle(el);
        if (style.display === 'none' || style.visibility === 'hidden') {
          return false;
        }

        return true;
      });
      if (document.activeElement?.tagName !== 'INPUT') {
        inputList[0]?.focus();
      } else {
        const curIndex = inputList.findIndex(
          (el) => el === document.activeElement,
        );
        if (curIndex + 1 <= inputList.length - 1) {
          inputList[curIndex + 1]?.focus();
        } else inputList[0]?.focus();
      }
    } catch (error) {
      console.log('error: ', error);
    }
  };

  const onChangeInputMode = (mode: VKB.InputMode) => {
    setInputMode(mode);
    pinyinLearningRequestIdRef.current += 1;
    setInputValue('');
    setChinese([]);
  };

  const onCopy = async () => {
    if (activeInputRef.current) {
      const { selectionStart, selectionEnd, value } = getSelectionInfo(
        activeInputRef.current,
      );
      if (selectionStart === selectionEnd) {
        console.warn('no have copy content');
        return;
      }
      const copiedValue = value.slice(selectionStart, selectionEnd);
      if (navigator.clipboard) {
        try {
          await navigator.clipboard.writeText(copiedValue);
          console.log('copy success');
          return;
        } catch (error) {
          console.warn('copy fallback to execCommand', error);
        }
      }

      if (document.queryCommandSupported('copy')) {
        activeInputRef.current.setSelectionRange(selectionStart, selectionEnd);
        const copied = document.execCommand('copy');
        activeInputRef.current.setSelectionRange(selectionStart, selectionEnd);
        console.log(`copy ${copied ? 'success' : 'error'}`);
      } else {
        console.error('copy error');
      }
    }
  };

  const onPaste = async () => {
    if (activeInputRef.current) {
      let { selectionStart, selectionEnd, value } = getSelectionInfo(
        activeInputRef.current,
      );

      if (navigator.clipboard) {
        try {
          const text = await navigator.clipboard.readText();
          value =
            value.slice(0, selectionStart) + text + value.slice(selectionEnd);
          const nextCursor = selectionStart + text.length;
          applyInputValue(
            activeInputRef.current,
            value,
            nextCursor,
            nextCursor,
          );
          emitInputEvent();
          console.log('paste success');
          return;
        } catch (error) {
          console.warn('paste fallback to execCommand', error);
        }
      }

      if (document.queryCommandSupported('paste')) {
        activeInputRef.current.focus();
        const r = document.execCommand('paste');
        if (r) {
          emitInputEvent();
        }
        console.log(`paste ${r ? 'success' : 'error'}`);
      } else {
        console.error(
          'paste error navigator.clipboard and document.execCommand not support,You may need https',
        );
      }
    }
  };

  const onClear = () => {
    pinyinLearningRequestIdRef.current += 1;
    setInputValue('');
    setChinese([]);
  };

  const onControl = (e: VKB.KeyboardAttributeType) => {
    switch (e.code) {
      case Backspace.code:
        onBackspace(e);
        break;
      case Tab.code:
        onTab();
        break;
      case Enter.code:
        if (!commitCurrentCandidate()) {
          // TODO
        }
        break;
      case Copy.code:
        onCopy();
        break;
      case Paste.code:
        onPaste();
        break;
      case ArrowUp.code:
      case ArrowLeft.code:
      case StartSelect.code:
      case ArrowRight.code:
      case ArrowDown.code:
      case ArrowLeftFirst.code:
      case ArrowRightEnd.code:
      case SelectAll.code:
        onCursor(e);
        break;
      case Clear.code:
        onClear();
        break;
    }
  };

  const onSetting = (e: VKB.KeyboardAttributeType) => {
    switch (e.code) {
      case LightTheme.code:
      case DarkTheme.code:
        setVkbThemeMode(e.code);
        onThemeModeChange?.(e.code);
        break;
      case FixedBottomPosition.code:
      case FixedTopPosition.code:
      case FixedLeftPosition.code:
      case FixedRightPosition.code:
      case FloatPosition.code:
        setVkbPositionMode(e.code);
        onPositionModeChange?.(e.code);
        break;
      case BackgroundAudio.code: {
        const nextValue = vkbKeydownAudio === 'Y' ? 'N' : 'Y';
        setVkbKeydownAudio(nextValue);
        onUseKeydownAudioChange?.(nextValue);
        break;
      }
    }
  };

  const onFunction = (e: VKB.KeyboardAttributeType) => {
    const functionKeyCode = e.code as VKB.FunctionKeyCode;
    const nextCaretBrowsingEnabled =
      functionKeyCode === 'F7' ? !caretBrowsingEnabled : caretBrowsingEnabled;
    const context = getCurrentFunctionKeyContext(e, nextCaretBrowsingEnabled);
    const keyHandler = functionKeyHandlers?.[functionKeyCode];

    if (keyHandler?.(context) === true) return;
    if (onFunctionKey?.(context) === true) return;
    if (dispatchCurrentFunctionKeyEvent(e, nextCaretBrowsingEnabled)) return;

    if (!activeInputRef.current) {
      dispatchWindowFunctionKeyEvent('keydown', e);
      dispatchWindowFunctionKeyEvent('keyup', e);
    }

    runCurrentDefaultFunctionKeyAction(e);
  };

  const onClick = (e: VKB.KeyboardAttributeType) => {
    if (e.keyType === controlsType) {
      onControl(e);
    } else if (e.keyType === functionType) {
      onFunction(e);
    } else if (e.keyType === settingType) {
      onSetting(e);
    } else {
      onInput(e);
    }
    playKeydownAudio();

    const shouldEmitKeyPress =
      !!activeInputRef.current &&
      e.keyType !== controlsType &&
      e.keyType !== functionType &&
      e.keyType !== settingType &&
      typeof e.key === 'string' &&
      e.key.length === 1;

    if (!shouldEmitKeyPress || !activeInputRef.current) return;
    Simulate?.keyPress?.(activeInputRef.current, {
      keyCode: e.keyCode,
      which: e.keyCode,
      code: e.code,
      key: e.key,
      charCode: e.key.charCodeAt(0),
    } as SimulateEventData);
  };

  const onKeyDown = (e: VKB.KeyboardAttributeType) => {
    activateKeyCode(e.code);
    if (!activeInputRef.current) return;
    Simulate?.keyDown?.(activeInputRef.current, {
      keyCode: e.keyCode,
      which: e.keyCode,
      code: e.code,
      key: e.key,
    } as SimulateEventData);
  };

  const shouldDelayKeyUpForInput = (inputEl: HTMLInputElement) => {
    return !!inputEl.closest('.ant-input-number, .rc-input-number');
  };

  const onKeyUp = (e: VKB.KeyboardAttributeType) => {
    const activeInput = activeInputRef.current;
    const dispatchKeyUp = (targetInput: HTMLInputElement) => {
      releaseKeyCode(e.code, 120);
      Simulate?.keyUp?.(targetInput, {
        keyCode: e.keyCode,
        which: e.keyCode,
        code: e.code,
        key: e.key,
      } as SimulateEventData);
    };

    if (!activeInput) {
      releaseKeyCode(e.code, 120);
      return;
    }

    if (shouldDelayKeyUpForInput(activeInput)) {
      window.setTimeout(() => {
        dispatchKeyUp(activeInput);
      }, 0);
      return;
    }

    dispatchKeyUp(activeInput);
  };

  const checkStopPropagation = (
    target: any,
    targetId: string,
    outId: string,
  ): boolean => {
    if (!target) return true;
    if (target.id === targetId) return false;
    if (target.id === outId) return true;
    return checkStopPropagation(target.parentNode, targetId, outId);
  };

  const onMouseDown = (
    e:
      | React.MouseEvent<HTMLDivElement, MouseEvent>
      | React.TouchEvent<HTMLDivElement>,
  ) => {
    const isTouchEvent = 'touches' in e;

    if (isTouchEvent) {
      keyboardTouchSessionRef.current = true;
      markKeyboardPointerInteraction(10_000);
    } else {
      markKeyboardPointerInteraction();
    }

    const isStop = checkStopPropagation(
      e.target,
      'keyboard-tab-move',
      'keyboard-tab',
    );
    e?.preventDefault?.();
    if (isStop) {
      e?.stopPropagation?.();
    }
  };

  const onMouseUp = (
    e?:
      | React.MouseEvent<HTMLDivElement, MouseEvent>
      | React.TouchEvent<HTMLDivElement>,
  ) => {
    if (e && 'changedTouches' in e) {
      keyboardTouchSessionRef.current = false;
      releaseKeyboardPointerInteraction(120);
      return;
    }

    releaseKeyboardPointerInteraction();
  };

  return {
    onClick,
    onMouseDown,
    onMouseUp,
    onSelectChinese,
    onChangeInputMode,
    onKeyDown,
    onKeyUp,
  };
};
