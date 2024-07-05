import React, {
  CSSProperties,
  ReactNode,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';

import { ReactComponent as MoveSvg } from '../svg/move.svg';

// import EmjoSvg from './svg/emjo.svg?react'
import { ReactComponent as BottomSvg } from '../svg/bottom.svg';
import { ReactComponent as LeftSvg } from '../svg/left.svg';
import { ReactComponent as RightSvg } from '../svg/right.svg';

import { VKB } from '../typing';
/* empty css          */
import { useEventListener } from 'ahooks';
import {
  ArrowDown,
  ArrowLeft,
  ArrowLeftFirst,
  ArrowRight,
  ArrowRightEnd,
  ArrowUp,
  Backspace,
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
  VKB_POSITION_MODE,
  VKB_THEME_MODE,
  ZH,
  controlsType,
  letterType,
  numberType,
  settingType,
} from '../keys';
import { pinyin2ChineseV1 } from '../utils/pinyin';
import './style.css';

import tabs from './KeyboardTabs';

/**
 * 虚拟键盘
 *
 * @return {*}
 */
const Keyboard = ({
  style,
  options,
  showDragHandle,
  defaultActiveKeyboard = numberType,
  virtualKeyboardTab = tabs,
  moveLabel = <MoveSvg />,
  hiddenLabel = <BottomSvg />,
  themeMode = LightTheme.code,
  positionMode = FloatPosition.code,
  onEnter,
  onShow,
  onHidden,
  onChange,
  onThemeModeChange,
  onPositionModeChange,
}: {
  /** 显示拖拽 */
  showDragHandle?: boolean;
  /** 样式 */
  style?: CSSProperties;
  /** 附加参数 */
  options?: Record<string, any>;
  /** 默认活动的键盘 */
  defaultActiveKeyboard?: string;
  /** 需要渲染的虚拟键盘 */
  virtualKeyboardTab?: VKB.KeyboardTabItem[];
  /** 移动 */
  moveLabel?: ReactNode;
  /** 隐藏 */
  hiddenLabel?: ReactNode;
  /** 主题 */
  themeMode?: string;
  /** 位置 */
  positionMode?: string;
  /** enter 方法回调 */
  onEnter?: () => void;
  /** 输入回调 */
  onChange?: (value: string, options?: Record<string, any>) => void;
  /** 隐藏 */
  onHidden?: () => void;
  /** 显示 */
  onShow?: () => void;
  /** 主题改变 */
  onThemeModeChange?: (mode: string) => void;
  /** 位置模式改变 */
  onPositionModeChange?: (mode: string) => void;
}) => {
  /** 整体容器引用 */
  const keyboardRef = useRef<HTMLDivElement | null>(null);
  /** 光标选择模式 */
  const cursorMode = useRef('index');
  /** 无效 type */
  const invalidInputType = [
    'week',
    'month',
    'time',
    'datetime-local',
    'date',
    'datetime',
    'submit',
    'reset',
    'range',
    'radio',
    'image',
    'hidden',
    'file',
    'color',
    'checkbox',
    'button',
  ];
  /** 有效 type */
  const effectiveInputType = ['text', 'search', 'tel', 'password', 'url'];
  /** 需处理 type */
  const needHandleInputType = ['number', 'email'];
  /** input type 为 number，email 造成的一些异常 selection 相关属性无法使用 */
  const inputType = useRef('');
  /** 当前活动的input */
  const activeInputRef = useRef<HTMLInputElement | null>(null);
  /** 临时输入区引用 */
  const tempInputAreaRef = useRef<HTMLDivElement | null>(null);
  /** 当前活动的键盘 */
  const [activeKeyboard, setActiveKeyboard] = useState<string>(
    defaultActiveKeyboard,
  );
  /** 输入模式 默认英文en ,中文zh */
  const [inputMode, setInputMode] = useState<VKB.InputMode>(EN);
  /** 输入的值 */
  const [inputValue, setInputValue] = useState('');
  /** 当前拼音转成的中文 */
  const [chinese, setChinese] = useState<string[]>([]);
  /** 删除inputValue 不立马删除targetValue中的值 */
  const jumpDelete = useRef(false);
  /** 焦点状态 */
  const cacheInputFocus = useRef(new WeakSet());

  /** 颜色主题 */

  const [vkbThemeMode, setVkbThemeMode] = useState(
    themeMode ?? localStorage?.getItem(VKB_THEME_MODE) ?? 'float',
  );
  /** 键盘位置 */
  const [vkbPositionMode, setVkbPositionMode] = useState(
    positionMode ?? localStorage?.getItem(VKB_POSITION_MODE) ?? 'float',
  );

  /** 寻找聚焦有效的input */
  const findFocusElement = (e: MouseEvent) => {
    const activeElement = e.target as HTMLInputElement;
    const vkbDisabled = activeElement.dataset?.vkbDisabled;
    const vkbType = activeElement.dataset?.vkbType ?? '';
    if (
      activeElement?.tagName === 'INPUT' &&
      [...effectiveInputType, ...needHandleInputType].includes(
        activeElement?.type ?? '',
      ) &&
      vkbDisabled !== 'true'
    ) {
      inputType.current = vkbType;
      activeInputRef.current = activeElement;
      if (!cacheInputFocus.current.has(activeElement)) {
        onShow && onShow();
        cacheInputFocus.current.add(activeElement);
        activeInputRef.current.addEventListener('blur', onBlur);
        activeInputRef.current.addEventListener('focus', onFocus);
      }
    }
  };
  useEventListener('click', findFocusElement, { target: document.body });

  /** 失去焦点 */
  const onBlur = useCallback(() => {
    activeInputRef.current = null;
    inputType.current = '';
  }, []);
  /** 获得焦点 */
  const onFocus = useCallback(() => {
    onShow && onShow();
  }, []);

  /**
   * 禁用类型
   *
   * @param {HTMLInputElement} inputEl
   * @return {*}
   */
  const validateInputType = (inputEl: HTMLInputElement) => {
    return [...invalidInputType, ...needHandleInputType].includes(inputEl.type);
  };

  /**
   * 是否允许输入 数字 . + -
   * 且 + - 必须在最前面
   * true 允许 false 不允许
   */
  const isAllowInputNumber = (type: string, str: string, value: string) => {
    if (type === 'number') {
      return !/^[-+]?(\d+)?(\.)?(\d+)?$/.test(str + value);
    }
    return false;
  };

  /** 触发 input 事件 */
  const emitInputEvent = () => {
    if (activeInputRef.current) {
      const inputEvent = new Event('input', { bubbles: true });
      // 标记 触发input事件
      (inputEvent as any).simulated = true;
      activeInputRef.current.dispatchEvent(inputEvent);

      // TODO: ant 的 input 的 change 事件无法被触发
      const changeEvent = new Event('change', { bubbles: true });
      // 标记 触发change事件
      (changeEvent as any).simulated = true;
      activeInputRef.current.dispatchEvent(changeEvent);
    }
  };

  /** 输入 */
  const onInput = async (e: VKB.KeyboardAttributeType) => {
    if (activeInputRef.current && typeof e.key === 'string') {
      const vkbNotEmpty = activeInputRef.current.dataset?.vkbNotEmpty;
      // 处理类型
      // if (!(await handleInputType(activeInputRef.current))) return;

      if (validateInputType(activeInputRef.current)) {
        console.error('disabled type', [
          ...invalidInputType,
          ...needHandleInputType,
        ]);
        console.error(
          'if you need type="number" please use data-vkb-type="number" replace',
        );
        return;
      }

      if (vkbNotEmpty && e.key === Space.code) {
        return;
      }

      if (
        inputMode === ZH &&
        e.key !== Space.code &&
        activeKeyboard === letterType
      ) {
        const value = inputValue + e.key;

        const transformMsg = pinyin2ChineseV1(value);
        setInputValue(value);
        setChinese([value, ...transformMsg.chinese]);
        jumpDelete.current = false;
      } else {
        let value = activeInputRef.current.value;

        const selectionEnd = activeInputRef.current.selectionEnd || 0;

        // 处理 type = 'number' 时输入的其他字符
        if (isAllowInputNumber(inputType.current, value, e.key)) return;

        value =
          value.slice(0, selectionEnd) + e.key + value.slice(selectionEnd);

        activeInputRef.current.setSelectionRange(
          selectionEnd + 1,
          selectionEnd + 1,
        );
        // 修改 value
        activeInputRef.current.value = value;

        emitInputEvent();

        onChange &&
          onChange(value, {
            ...options,
            ...e,
          });
      }
    }
  };

  /** 删除 */
  const onBackspace = (e: VKB.KeyboardAttributeType) => {
    if (activeInputRef.current) {
      if (validateInputType(activeInputRef.current)) {
        console.error('disabled type: ', [
          ...invalidInputType,
          ...needHandleInputType,
        ]);
        console.error(
          'if you need type="number" please use data-vkb-type="number" replace',
        );
        return;
      }

      if (inputMode === ZH) {
        const value = inputValue.slice(0, inputValue.length - 1);
        const transformMsg = pinyin2ChineseV1(value);
        setInputValue(value);
        setChinese([value, ...transformMsg.chinese]);

        if (value) return;

        if (!value && !jumpDelete.current) {
          jumpDelete.current = true;
          return;
        }
      }

      // 获取光标位置
      const selectionStart = activeInputRef.current.selectionStart ?? 0;
      const selectionEnd = activeInputRef.current.selectionEnd ?? 0;
      const value = activeInputRef.current.value;

      const tempValue =
        value.slice(
          0,
          selectionStart - (selectionStart === selectionEnd ? 1 : 0),
        ) + value.slice(selectionEnd);
      activeInputRef.current.value = tempValue;
      activeInputRef.current.setSelectionRange(
        selectionStart - (selectionStart === selectionEnd ? 1 : 0),
        selectionStart === selectionEnd ? selectionEnd - 1 : selectionStart,
      );

      emitInputEvent();
      onChange &&
        onChange(value, {
          ...options,
          ...e,
        });
    }
  };

  /** 光标操作 */
  const onCursor = (e: VKB.KeyboardAttributeType) => {
    if (activeInputRef.current) {
      if (validateInputType(activeInputRef.current)) {
        console.error('disabled type: ', [
          ...invalidInputType,
          ...needHandleInputType,
        ]);
        console.error(
          'if you need type="number" please use data-vkb-type="number" replace',
        );
        return;
      }

      const selectionStart = activeInputRef.current.selectionStart ?? 0;

      const selectionEnd = activeInputRef.current.selectionEnd ?? 0;

      let index = 0;
      const value = activeInputRef.current.value;
      const maxLength = value.length;

      // TODO: 待优化
      if (cursorMode.current === 'index') {
        switch (e.code) {
          case ArrowUp.code:
          case ArrowLeftFirst.code:
            activeInputRef.current.setSelectionRange(0, 0);
            break;
          case ArrowLeft.code:
            index = selectionEnd - 1 > 0 ? selectionEnd - 1 : 0;
            activeInputRef.current.setSelectionRange(index, index);
            break;
          case ArrowRight.code:
            index = selectionEnd + 1 > maxLength ? maxLength : selectionEnd + 1;
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
            index = selectionStart - 1 > 0 ? selectionStart - 1 : 0;
            activeInputRef.current.setSelectionRange(index, selectionEnd);
            break;
          case ArrowRight.code:
            if (selectionEnd < maxLength) {
              index =
                selectionEnd + 1 > maxLength ? maxLength : selectionEnd + 1;
              activeInputRef.current.setSelectionRange(selectionStart, index);
            } else {
              index =
                selectionStart + 1 > maxLength ? maxLength : selectionStart + 1;
              activeInputRef.current.setSelectionRange(index, selectionEnd);
            }

            break;
          case ArrowDown.code:
          case ArrowRightEnd.code:
            activeInputRef.current.setSelectionRange(
              selectionEnd,
              value.length,
            );
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

  /** 模拟tab键 */
  const onTab = () => {
    try {
      const inputs = document.getElementsByTagName('input') || [];
      const inputList = Array.from(inputs).filter(
        (el) => !el.hasAttribute('disabled'),
      );
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

  /** 切换输入模式 */
  const onChangeInputMode = (mode: VKB.InputMode) => {
    setInputMode(mode);
    setInputValue('');
  };

  /** 翻页 */
  const onMore = (type: string) => {
    if (tempInputAreaRef.current) {
      const width = tempInputAreaRef.current.offsetWidth;
      tempInputAreaRef.current.scrollTo({
        left:
          tempInputAreaRef.current.scrollLeft +
          (type === 'add' ? width : -width) / 10,
        behavior: 'smooth',
      });
    }
  };
  /** 选择输入的中文 */
  const onSelectChinese = (chinese: string) => {
    if (
      activeInputRef.current &&
      !needHandleInputType.includes(inputType.current)
    ) {
      let value = activeInputRef.current.value;
      const selectionEnd = activeInputRef.current.selectionEnd || 1;

      value =
        value.slice(0, selectionEnd) + chinese + value.slice(selectionEnd);

      // 修改 value
      activeInputRef.current.value = value;
      activeInputRef.current.setSelectionRange(
        chinese.length + selectionEnd,
        chinese.length + selectionEnd,
      );

      const inputEvent = new Event('input', { bubbles: true });
      // 标记 触发input事件
      (inputEvent as any).simulated = true;
      activeInputRef.current.dispatchEvent(inputEvent);

      // TODO: ant 的 input 的 change 事件无法被触发
      const changeEvent = new Event('change', { bubbles: true });
      // 标记 触发change事件
      (changeEvent as any).simulated = true;
      activeInputRef.current.dispatchEvent(changeEvent);

      onChange &&
        onChange(value, {
          ...options,
        });

      setInputValue('');
    } else {
      setInputValue('');
      setChinese([]);
      console.error('input type = email or number not allow input chinese');
    }
  };

  /** 拷贝 */
  const onCopy = async () => {
    if (activeInputRef.current) {
      const selectionStart = activeInputRef.current.selectionStart ?? 0;
      const selectionEnd = activeInputRef.current.selectionEnd ?? 0;
      if (selectionStart === selectionEnd) {
        console.warn('no have copy content');
        return;
      }
      const value = activeInputRef.current.value.slice(
        selectionStart,
        selectionEnd,
      );
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(value);
        console.log('copy success');
      } else if (document.execCommand) {
        activeInputRef.current.select();
        document.execCommand('copy');
        activeInputRef.current.setSelectionRange(value.length, value.length);
        console.log('copy success');
      } else {
        console.error('copy error');
      }
    }
  };

  /** 粘贴 */
  const onPaste = async () => {
    if (activeInputRef.current) {
      const selectionStart = activeInputRef.current.selectionStart ?? 0;
      const selectionEnd = activeInputRef.current.selectionEnd ?? 0;
      let value = activeInputRef.current.value;

      if (navigator.clipboard) {
        const text = await navigator.clipboard.readText();
        value =
          value.slice(0, selectionStart) + text + value.slice(selectionEnd);
        activeInputRef.current.value = value;
        emitInputEvent();
        console.log('paste success');
      } else if (document.execCommand) {
        activeInputRef.current.focus();
        const r = document.execCommand('paste', true);
        emitInputEvent();
        console.log(`paste ${r ? 'success' : 'error'}`);
      } else {
        console.error(' paste error ');
      }

      // value = value.slice(0,start) +  value.slice(start)
    }
  };

  /** 控制类 */
  const onControl = (e: VKB.KeyboardAttributeType) => {
    switch (e.code) {
      // 删除
      case Backspace.code:
        onBackspace(e);
        break;
      // tab
      case Tab.code:
        onTab();
        break;
      // 回车
      case Enter.code:
        onEnter && onEnter();
        break;
      // 复制
      case Copy.code:
        onCopy();
        break;
      // 粘贴
      case Paste.code:
        onPaste();
        break;
      // 剪切板
      // case Clipboard.code:
      //   onClipboard();
      //   break;
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
    }
  };

  /** 设置类 */
  const onSetting = (e: VKB.KeyboardAttributeType) => {
    switch (e.code) {
      case LightTheme.code:
      case DarkTheme.code:
        setVkbThemeMode(e.code);
        onThemeModeChange && onThemeModeChange(e.code);
        localStorage?.setItem(VKB_THEME_MODE, e.code);
        break;
      case FixedBottomPosition.code:
      case FixedTopPosition.code:
      case FixedLeftPosition.code:
      case FixedRightPosition.code:
      case FloatPosition.code:
        setVkbPositionMode(e.code);
        onPositionModeChange && onPositionModeChange(e.code);
        localStorage?.setItem(VKB_THEME_MODE, e.code);
        break;
    }
  };

  /** 点击事件分发 */
  const onClick = (e: VKB.KeyboardAttributeType) => {
    if (e.keyType === controlsType) {
      onControl(e);
    } else if (e.keyType === settingType) {
      onSetting(e);
    } else {
      onInput(e);
    }
  };

  /** 通过事件冒泡的形式递归向上寻找，没有找到则不阻止冒泡 */
  const checkStopPropagation = (
    target: any,
    targetId: string,
    outId: string,
  ): boolean => {
    if (!target) return true;
    if (target.id === targetId) {
      return false;
    }
    if (target.id === outId) {
      return true;
    }
    return checkStopPropagation(target.parentNode, targetId, outId);
  };

  /** 整个键盘的鼠标按下事件，整个键盘的触摸事件 */
  const onMouseDown = (
    e:
      | React.MouseEvent<HTMLDivElement, MouseEvent>
      | React.TouchEvent<HTMLDivElement>,
  ) => {
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

  useEffect(() => {
    setVkbThemeMode(themeMode);
  }, [themeMode]);

  useEffect(() => {
    setVkbPositionMode(positionMode);
  }, [positionMode]);

  return (
    <div
      ref={keyboardRef}
      style={style}
      className={`virtual-keyboard virtual-keyboard-var virtual-keyboard-var-${vkbThemeMode}`}
      tab-column={virtualKeyboardTab.length + (showDragHandle ? 2 : 1)}
      onMouseDown={onMouseDown}
      onTouchStart={onMouseDown}
    >
      {inputMode === ZH && inputValue && (
        <div className="virtual-keyboard-temp">
          <div className="virtual-keyboard-pinyin">{inputValue}</div>
          <div
            className="virtual-keyboard-temp-left"
            onClick={() => onMore('minus')}
          >
            <LeftSvg />
          </div>
          <div className="virtual-keyboard-temp-list" ref={tempInputAreaRef}>
            {chinese.map((item, index) => {
              return (
                <div
                  key={index}
                  className="virtual-keyboard-temp-char"
                  onClick={() => onSelectChinese(item)}
                >
                  {item}
                </div>
              );
            })}
          </div>
          <div
            className="virtual-keyboard-temp-right"
            onClick={() => onMore('add')}
          >
            <RightSvg />
          </div>
        </div>
      )}

      <div className="virtual-keyboard-tab" id="keyboard-tab">
        {showDragHandle && vkbPositionMode === FloatPosition.code ? (
          <div id="keyboard-tab-move" className="keyboard-tab-move">
            {moveLabel ? moveLabel : <MoveSvg id="move" />}
          </div>
        ) : (
          ''
        )}

        {virtualKeyboardTab.map((item) => {
          return (
            <div
              className={`keyboard-tab ${
                activeKeyboard === item.id ? 'keyboard-tab-active' : ''
              }`}
              key={item.id}
              onClick={() => {
                setActiveKeyboard(item.id);
              }}
            >
              {item.label}
            </div>
          );
        })}

        <div
          className="keyboard-tab-down "
          onClick={(e) => {
            e.stopPropagation();
            onHidden && onHidden();
          }}
        >
          {hiddenLabel ? hiddenLabel : <BottomSvg />}
        </div>
      </div>
      <div className="virtual-keyboard-content">
        {virtualKeyboardTab.map((item) => {
          return activeKeyboard === item.id ? (
            <item.Component
              key={item.id}
              inputMode={inputMode}
              themeMode={vkbThemeMode}
              positionMode={vkbPositionMode}
              onClick={onClick}
              onChangeInputMode={onChangeInputMode}
            />
          ) : (
            ''
          );
        })}
      </div>
    </div>
  );
};
export default Keyboard;
