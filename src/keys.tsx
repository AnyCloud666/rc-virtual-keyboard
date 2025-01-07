import React, { ReactNode } from 'react';
import { ReactComponent as BottomSvg } from './svg/bottom.svg';
import { ReactComponent as DeleteSvg } from './svg/delete.svg';
import { ReactComponent as EnterSvg } from './svg/enter.svg';
import { ReactComponent as FloatSvg } from './svg/float.svg';
import { ReactComponent as LeftSvg } from './svg/left.svg';
import { ReactComponent as MoonSvg } from './svg/moon.svg';
import { ReactComponent as RightSvg } from './svg/right.svg';
import { ReactComponent as SunSvg } from './svg/sun.svg';
import { ReactComponent as TopSvg } from './svg/top.svg';

import { VKB } from './typing';

/** 数字键盘 */
export const numberType = 'number';
/** 字母键盘 */
export const letterType = 'letter';
/** 符号键盘 */
export const symbolType = 'symbol';
/** 控制键盘 */
export const controlsType = 'controls';
/** 编辑键盘 */
export const editType = 'edit';
/** 表情键盘 */
export const emjoType = 'emjo';
/** 手写键盘 */
export const writeType = 'write';
/** 设置键盘 */
export const settingType = 'setting';

/** 中文模式 */
export const ZH = 'zh';
/** 英文模式 */
export const EN = 'en';

/** 主题模式key */
export const VKB_THEME_MODE = 'VKB_THEME_MODE';
/** 位置模式key */
export const VKB_POSITION_MODE = 'VKB_POSITION_MODE';

/** ---------------------------功能控制类--------------------------- */
/** 删除 */
export const Backspace: VKB.KeyboardAttributeType = {
  key: <DeleteSvg />,
  code: 'Backspace',
  keyCode: 8,
  keyType: controlsType,
  description: '删除',
};
/** 回车 */
export const Enter: VKB.KeyboardAttributeType = {
  key: <EnterSvg />,
  code: 'Enter',
  keyCode: 13,
  keyType: controlsType,
  description: '回车/确定',
};
/** Tab */
export const Tab: VKB.KeyboardAttributeType = {
  key: 'Tab',
  code: 'Tab',
  keyCode: 9,
  keyType: controlsType,
};
/** 英文切换 */
export const Shift: VKB.KeyboardAttributeType = {
  key: '英',
  code: 'Shift',
  keyCode: 16,
  keyType: controlsType,
};
/** 切换大小写 */
export const CapsLock: VKB.KeyboardAttributeType = {
  key: '小',
  code: 'CapsLock',
  keyCode: 20,
  keyType: controlsType,
};
/** 清除键 */
export const Clear: VKB.KeyboardAttributeType = {
  code: 'Clear',
  key: 'Clear',
  keyCode: -12,
  keyType: controlsType,
};

/** ---------------------------光标类--------------------------- */

/** 上 */
export const ArrowUp: VKB.KeyboardAttributeType = {
  key: 'ArrowUp',
  code: 'ArrowUp',
  keyCode: 38,
  keyType: controlsType,
};
/** 左 */
export const ArrowLeft: VKB.KeyboardAttributeType = {
  key: 'ArrowLeft',
  code: 'ArrowLeft',
  keyCode: 37,
  keyType: controlsType,
};
/** 选择全部 */
export const StartSelect: VKB.KeyboardAttributeType = {
  key: '开始选择',
  code: 'StartSelect',
  keyCode: -1000,
  keyType: controlsType,
};
/** 下 */
export const ArrowDown: VKB.KeyboardAttributeType = {
  key: 'ArrowDown',
  code: 'ArrowDown',
  keyCode: 40,
  keyType: controlsType,
};
/** 右 */
export const ArrowRight: VKB.KeyboardAttributeType = {
  key: 'ArrowRight',
  code: 'ArrowRight',
  keyCode: 39,
  keyType: controlsType,
};
/** 最前 */
export const ArrowLeftFirst: VKB.KeyboardAttributeType = {
  key: 'ArrowLeftFirst',
  code: 'ArrowLeftFirst',
  keyCode: -1001,
  keyType: controlsType,
};
/** 最后 */
export const ArrowRightEnd: VKB.KeyboardAttributeType = {
  key: 'ArrowRightEnd',
  code: 'ArrowRightEnd',
  keyCode: -1002,
  keyType: controlsType,
};

/** ---------------------------编辑类--------------------------- */

/** 全选 */
export const SelectAll: VKB.KeyboardAttributeType = {
  key: '全选',
  code: 'SelectAll',
  keyCode: -2001,
  keyType: controlsType,
};
/** 复制 */
export const Copy: VKB.KeyboardAttributeType = {
  key: '复制',
  code: 'Copy',
  keyCode: -2003,
  keyType: controlsType,
};
/** 粘贴 */
export const Paste: VKB.KeyboardAttributeType = {
  key: '粘贴',
  code: 'Paste',
  keyCode: -2005,
  keyType: controlsType,
};
/** 剪切板 */
export const Clipboard: VKB.KeyboardAttributeType = {
  key: '剪贴板',
  code: 'Clipboard',
  keyCode: -2006,
  keyType: controlsType,
};

/** ---------------------------数字类--------------------------- */

/** 0 */
export const Numpad0: VKB.KeyboardAttributeType = {
  key: '0',
  code: 'Numpad0',
  keyCode: 96,
  keyType: numberType,
};
/** 1 */
export const Numpad1: VKB.KeyboardAttributeType = {
  key: '1',
  code: 'Numpad1',
  keyCode: 97,
  keyType: numberType,
};
/** 2 */
export const Numpad2: VKB.KeyboardAttributeType = {
  key: '2',
  code: 'Numpad2',
  keyCode: 98,
  keyType: numberType,
};
/** 3 */
export const Numpad3: VKB.KeyboardAttributeType = {
  key: '3',
  code: 'Numpad3',
  keyCode: 99,
  keyType: numberType,
};
/** 4 */
export const Numpad4: VKB.KeyboardAttributeType = {
  key: '4',
  code: 'Numpad4',
  keyCode: 100,
  keyType: numberType,
};
/** 5 */
export const Numpad5: VKB.KeyboardAttributeType = {
  key: '5',
  code: 'Numpad5',
  keyCode: 101,
  keyType: numberType,
};
/** 6 */
export const Numpad6: VKB.KeyboardAttributeType = {
  key: '6',
  code: 'Numpad6',
  keyCode: 102,
  keyType: numberType,
};
/** 7 */
export const Numpad7: VKB.KeyboardAttributeType = {
  key: '7',
  code: 'Numpad7',
  keyCode: 103,
  keyType: numberType,
};
/**8 */
export const Numpad8: VKB.KeyboardAttributeType = {
  key: '8',
  code: 'Numpad8',
  keyCode: 104,
  keyType: numberType,
};
/** 9 */
export const Numpad9: VKB.KeyboardAttributeType = {
  key: '9',
  code: 'Numpad9',
  keyCode: 105,
  keyType: numberType,
};

/** ---------------------------字母类--------------------------- */

/** q */
export const KeyQ: VKB.KeyboardAttributeType = {
  key: 'q',
  code: 'KeyQ',
  keyCode: 81,
  keyType: letterType,
};
/** w */
export const KeyW: VKB.KeyboardAttributeType = {
  key: 'w',
  code: 'KeyW',
  keyCode: 87,
  keyType: letterType,
};
/** e */
export const KeyE: VKB.KeyboardAttributeType = {
  key: 'e',
  code: 'KeyE',
  keyCode: 69,
  keyType: letterType,
};
/** r */
export const KeyR: VKB.KeyboardAttributeType = {
  key: 'r',
  code: 'KeyR',
  keyCode: 82,
  keyType: letterType,
};
/** t */
export const KeyT: VKB.KeyboardAttributeType = {
  key: 't',
  code: 'KeyT',
  keyCode: 84,
  keyType: letterType,
};
/** y */
export const KeyY: VKB.KeyboardAttributeType = {
  key: 'y',
  code: 'KeyY',
  keyCode: 89,
  keyType: letterType,
};
/** u */
export const KeyU: VKB.KeyboardAttributeType = {
  key: 'u',
  code: 'KeyU',
  keyCode: 85,
  keyType: letterType,
};
/** i */
export const KeyI: VKB.KeyboardAttributeType = {
  key: 'i',
  code: 'KeyI',
  keyCode: 73,
  keyType: letterType,
};
/** o */
export const KeyO: VKB.KeyboardAttributeType = {
  key: 'o',
  code: 'KeyO',
  keyCode: 79,
  keyType: letterType,
};
/** p */
export const KeyP: VKB.KeyboardAttributeType = {
  key: 'p',
  code: 'KeyP',
  keyCode: 80,
  keyType: letterType,
};
/** a */
export const KeyA: VKB.KeyboardAttributeType = {
  key: 'a',
  code: 'KeyA',
  keyCode: 65,
  keyType: letterType,
};
/** s */
export const KeyS: VKB.KeyboardAttributeType = {
  key: 's',
  code: 'KeyS',
  keyCode: 83,
  keyType: letterType,
};
/** d */
export const KeyD: VKB.KeyboardAttributeType = {
  key: 'd',
  code: 'KeyD',
  keyCode: 68,
  keyType: letterType,
};
/** f */
export const KeyF: VKB.KeyboardAttributeType = {
  key: 'f',
  code: 'KeyF',
  keyCode: 70,
  keyType: letterType,
};
/** g */
export const KeyG: VKB.KeyboardAttributeType = {
  key: 'g',
  code: 'KeyG',
  keyCode: 71,
  keyType: letterType,
};
/** h */
export const KeyH: VKB.KeyboardAttributeType = {
  key: 'h',
  code: 'KeyH',
  keyCode: 72,
  keyType: letterType,
};
/** j */
export const KeyJ: VKB.KeyboardAttributeType = {
  key: 'j',
  code: 'KeyJ',
  keyCode: 74,
  keyType: letterType,
};
/** k */
export const KeyK: VKB.KeyboardAttributeType = {
  key: 'k',
  code: 'KeyK',
  keyCode: 75,
  keyType: letterType,
};
/** l */
export const KeyL: VKB.KeyboardAttributeType = {
  key: 'l',
  code: 'KeyL',
  keyCode: 76,
  keyType: letterType,
};
/** z */
export const KeyZ: VKB.KeyboardAttributeType = {
  key: 'z',
  code: 'KeyZ',
  keyCode: 90,
  keyType: letterType,
};
/** x */
export const KeyX: VKB.KeyboardAttributeType = {
  key: 'x',
  code: 'KeyX',
  keyCode: 88,
  keyType: letterType,
};
/** c */
export const KeyC: VKB.KeyboardAttributeType = {
  key: 'c',
  code: 'KeyC',
  keyCode: 67,
  keyType: letterType,
};
/** v */
export const KeyV: VKB.KeyboardAttributeType = {
  key: 'v',
  code: 'KeyV',
  keyCode: 86,
  keyType: letterType,
};
/** b */
export const KeyB: VKB.KeyboardAttributeType = {
  key: 'b',
  code: 'KeyB',
  keyCode: 66,
  keyType: letterType,
};
/** n */
export const KeyN: VKB.KeyboardAttributeType = {
  key: 'n',
  code: 'KeyN',
  keyCode: 78,
  keyType: letterType,
};
/** m */
export const KeyM: VKB.KeyboardAttributeType = {
  key: 'm',
  code: 'KeyM',
  keyCode: 77,
  keyType: letterType,
};

/** ---------------------------符号类--------------------------- */

// 不区分中英文
/** 点 . */
export const NumpadDecimal: VKB.KeyboardAttributeType = {
  key: '.',
  code: 'NumpadDecimal',
  keyCode: 110,
  keyType: symbolType,
};
/** 空格 */
export const Space: VKB.KeyboardAttributeType = {
  key: ' ',
  code: 'Space',
  keyCode: 32,
  keyType: symbolType,
};
/** 反斜杠 \ */
export const Backslash: VKB.KeyboardAttributeType = {
  key: '\\',
  code: 'Backslash',
  keyCode: 220,
  keyType: symbolType,
};
/** 顿号 */
export const DunSign: VKB.KeyboardAttributeType = {
  key: '、',
  code: 'DunSign',
  keyCode: 2000,
  keyType: symbolType,
};
/** 书名号左 */
export const LeftBook: VKB.KeyboardAttributeType = {
  key: '《',
  code: 'LeftBook',
  keyCode: 2001,
  keyType: symbolType,
};
/** 书名号右 */
export const RightBook: VKB.KeyboardAttributeType = {
  key: '》',
  code: 'RightBook',
  keyCode: 2002,
  keyType: symbolType,
};
/** 中括号左 */
export const LeftMiddleParenthesis: VKB.KeyboardAttributeType = {
  key: '[',
  code: 'LeftMiddleParenthesis',
  keyCode: 2003,
  keyType: symbolType,
};
/** 中括号右 */
export const RightMiddleParenthesis: VKB.KeyboardAttributeType = {
  key: ']',
  code: 'RightMiddleParenthesis',
  keyCode: 2004,
  keyType: symbolType,
};
/** 大括号左 */
export const LeftBigParenthesis: VKB.KeyboardAttributeType = {
  key: '{',
  code: 'LeftBigParenthesis',
  keyCode: 2005,
  keyType: symbolType,
};
/** 大括号右 */
export const RightBigParenthesis: VKB.KeyboardAttributeType = {
  key: '}',
  code: 'RightBigParenthesis',
  keyCode: 2006,
  keyType: symbolType,
};
/** 句号 */
export const Period: VKB.KeyboardAttributeType = {
  key: '。',
  code: 'Period',
  keyCode: 2007,
  keyType: symbolType,
};
/** @ */
export const AT: VKB.KeyboardAttributeType = {
  key: '@',
  code: 'AT',
  keyCode: 2008,
  keyType: symbolType,
};

/** ---------------------------中文类--------------------------- */
/** 中文逗号 */
export const ZHComma: VKB.KeyboardAttributeType = {
  key: '，',
  code: 'ZHComma',
  keyCode: 3001,
  keyType: symbolType,
};
/** 中文问号 */
export const ZHQuestionMark: VKB.KeyboardAttributeType = {
  key: '？',
  code: 'ZHQuestionMark',
  keyCode: 3002,
  keyType: symbolType,
};
/** 中文冒号 */
export const ZHSemicolon: VKB.KeyboardAttributeType = {
  key: '：',
  code: 'ZHSemicolon',
  keyCode: 3003,
  keyType: symbolType,
};
/** 中文左双引号 */
export const ZHLeftDoubleQuotationMarks: VKB.KeyboardAttributeType = {
  key: '“',
  code: 'ZHLeftDoubleQuotationMarks',
  keyCode: 3004,
  keyType: symbolType,
};
/** 中文右双引号 */
export const ZHRightDoubleQuotationMarks: VKB.KeyboardAttributeType = {
  key: '”',
  code: 'ZHRightDoubleQuotationMarks',
  keyCode: 3005,
  keyType: symbolType,
};
/** 中文左括号 */
export const ZHLeftParenthesis: VKB.KeyboardAttributeType = {
  key: '（',
  code: 'ZHLeftParenthesis',
  keyCode: -3011,
  keyType: symbolType,
};
/** 中文右括号 */
export const ZHRightParenthesis: VKB.KeyboardAttributeType = {
  key: '）',
  code: 'ZHRightParenthesis',
  keyCode: 3006,
  keyType: symbolType,
};
/** 中文感叹号 */
export const ZHExclamationPoint: VKB.KeyboardAttributeType = {
  key: '！',
  code: 'ZHExclamationPoint',
  keyCode: 3007,
  keyType: symbolType,
};
/** ---------------------------英文类--------------------------- */

/** 英文逗号 */
export const ENComma: VKB.KeyboardAttributeType = {
  key: ',',
  code: 'ENComma',
  keyCode: 4001,
  keyType: symbolType,
};
/** 英文问号 */
export const ENQuestionMark: VKB.KeyboardAttributeType = {
  key: '?',
  code: 'ENQuestionMark',
  keyCode: 4002,
  keyType: symbolType,
};
/** 英文冒号 */
export const ENSemicolon: VKB.KeyboardAttributeType = {
  key: ':',
  code: 'ENSemicolon',
  keyCode: 4003,
  keyType: symbolType,
};
/** 英文左双引号 */
export const ENLeftDoubleQuotationMarks: VKB.KeyboardAttributeType = {
  key: '"',
  code: 'ENLeftDoubleQuotationMarks',
  keyCode: 4004,
  keyType: symbolType,
};
/** 英文右双引号 */
export const ENRightDoubleQuotationMarks: VKB.KeyboardAttributeType = {
  key: '"',
  code: 'ENRightDoubleQuotationMarks',
  keyCode: 4005,
  keyType: symbolType,
};
/** 英文左括号 */
export const ENLeftParenthesis: VKB.KeyboardAttributeType = {
  key: '(',
  code: 'ENLeftParenthesis',
  keyCode: 4006,
  keyType: symbolType,
};
/** 英文右括号 */
export const ENRightParenthesis: VKB.KeyboardAttributeType = {
  key: ')',
  code: 'ENRightParenthesis',
  keyCode: 4007,
  keyType: symbolType,
};
/** 英文感叹号 */
export const ENExclamationPoint: VKB.KeyboardAttributeType = {
  key: '!',
  code: 'ENExclamationPoint',
  keyCode: 4008,
  keyType: symbolType,
};

/** ---------------------------数学类--------------------------- */
/** 斜杠  /*/
export const NumpadDivide: VKB.KeyboardAttributeType = {
  key: '/',
  code: 'NumpadDivide',
  keyCode: 111,
  keyType: symbolType,
};
/** 加 + */
export const NumpadAdd: VKB.KeyboardAttributeType = {
  key: '+',
  code: 'NumpadAdd',
  keyCode: 107,
  keyType: symbolType,
};
/** 减 - */
export const NumpadSubtract: VKB.KeyboardAttributeType = {
  key: '-',
  code: 'NumpadSubtract',
  keyCode: 109,
  keyType: symbolType,
};
/** 乘 * */
export const NumpadMultiply: VKB.KeyboardAttributeType = {
  key: '*',
  code: 'NumpadMultiply',
  keyCode: 106,
  keyType: symbolType,
};
/** 大于 */
export const NumpadGreaterThan: VKB.KeyboardAttributeType = {
  key: '>',
  code: 'NumpadGreaterThan',
  keyCode: 190,
  keyType: symbolType,
};
/** 小于 */
export const NumpadLessThan: VKB.KeyboardAttributeType = {
  key: '<',
  code: 'NumpadLessThan',
  keyCode: 188,
  keyType: symbolType,
};
/** 等于 */
export const NumpadEqual: VKB.KeyboardAttributeType = {
  key: '=',
  code: 'NumpadEqual',
  keyCode: 187,
  keyType: symbolType,
};
/** 百分比 */
export const NumpadPercentage: VKB.KeyboardAttributeType = {
  key: '%',
  code: 'NumpadPercentage',
  keyCode: 53,
  keyType: symbolType,
};

/** ---------------------------网络类--------------------------- */
export const WWWDot: VKB.KeyboardAttributeType = {
  key: 'www.',
  code: 'WWWDot',
  keyCode: 5000,
  keyType: symbolType,
};
export const WapDot: VKB.KeyboardAttributeType = {
  key: 'wap.',
  code: 'WapDot',
  keyCode: 5001,
  keyType: symbolType,
};
export const BlogDot: VKB.KeyboardAttributeType = {
  key: 'blog.',
  code: 'BlogDot',
  keyCode: 5002,
  keyType: symbolType,
};
export const BBSDot: VKB.KeyboardAttributeType = {
  key: 'bbs.',
  code: 'BBSDot',
  keyCode: 5003,
  keyType: symbolType,
};
export const DotCom: VKB.KeyboardAttributeType = {
  key: '.com',
  code: 'DotCom',
  keyCode: 5004,
  keyType: symbolType,
};
export const DotCn: VKB.KeyboardAttributeType = {
  key: '.cn',
  code: 'DotCn',
  keyCode: 5005,
  keyType: symbolType,
};
export const DotNet: VKB.KeyboardAttributeType = {
  key: '.net',
  code: 'DotNet',
  keyCode: 5006,
  keyType: symbolType,
};
export const DotOrg: VKB.KeyboardAttributeType = {
  key: '.org',
  code: 'DotOrg',
  keyCode: 5007,
  keyType: symbolType,
};
export const Http: VKB.KeyboardAttributeType = {
  key: 'http://',
  code: 'Http',
  keyCode: 5008,
  keyType: symbolType,
};
export const Https: VKB.KeyboardAttributeType = {
  key: 'https://',
  code: 'Https',
  keyCode: 5009,
  keyType: symbolType,
};
export const FTP: VKB.KeyboardAttributeType = {
  key: 'ftp://',
  code: 'FTP',
  keyCode: 5010,
  keyType: symbolType,
};
export const SSH: VKB.KeyboardAttributeType = {
  key: 'ssh://',
  code: 'SSH',
  keyCode: 5011,
  keyType: symbolType,
};
export const Mail126: VKB.KeyboardAttributeType = {
  key: '@126.com',
  code: 'SSH',
  keyCode: 5012,
  keyType: symbolType,
};
export const Mail163: VKB.KeyboardAttributeType = {
  key: '@163.com',
  code: 'Mail163',
  keyCode: 5013,
  keyType: symbolType,
};
export const MailSina: VKB.KeyboardAttributeType = {
  key: '@sina.cn',
  code: 'MailSina',
  keyCode: 5014,
  keyType: symbolType,
};
export const MailHotMail: VKB.KeyboardAttributeType = {
  key: '@hotmail.com',
  code: 'MailHotMail',
  keyCode: 5015,
  keyType: symbolType,
};
export const MailLive: VKB.KeyboardAttributeType = {
  key: '@live.cn',
  code: 'MailLive',
  keyCode: 5016,
  keyType: symbolType,
};
export const MailGmail: VKB.KeyboardAttributeType = {
  key: '@gmail.cn',
  code: 'MailGmail',
  keyCode: 5017,
  keyType: symbolType,
};
export const MailQQ: VKB.KeyboardAttributeType = {
  key: '@qq.com',
  code: 'MailQQ',
  keyCode: 5018,
  keyType: symbolType,
};
export const MailSoHu: VKB.KeyboardAttributeType = {
  key: '@sohu.com',
  code: 'MailSoHu',
  keyCode: 5019,
  keyType: symbolType,
};

/** ---------------------------特殊类--------------------------- */
export const Multiply: VKB.KeyboardAttributeType = {
  key: '×',
  code: 'Multiply',
  keyCode: 7000,
  keyType: symbolType,
};
export const Except: VKB.KeyboardAttributeType = {
  key: '÷',
  code: 'Except',
  keyCode: 7001,
  keyType: symbolType,
};
export const Top: VKB.KeyboardAttributeType = {
  key: '↑',
  code: 'Top',
  keyCode: 7002,
  keyType: symbolType,
};
export const Bottom: VKB.KeyboardAttributeType = {
  key: '↓',
  code: 'Bottom',
  keyCode: 7003,
  keyType: symbolType,
};
export const Left: VKB.KeyboardAttributeType = {
  key: '←',
  code: 'Left',
  keyCode: 7004,
  keyType: symbolType,
};
export const Right: VKB.KeyboardAttributeType = {
  key: '→',
  code: 'Right',
  keyCode: 7005,
  keyType: symbolType,
};
export const Male: VKB.KeyboardAttributeType = {
  key: '♂',
  code: 'Male',
  keyCode: 7006,
  keyType: symbolType,
};
export const Female: VKB.KeyboardAttributeType = {
  key: '♀',
  code: 'Female',
  keyCode: 7007,
  keyType: symbolType,
};

/** ---------------------------货币类--------------------------- */
export const CNY: VKB.KeyboardAttributeType = {
  key: '￥',
  code: 'CNY',
  keyCode: 8000,
  keyType: symbolType,
};
export const Dollars: VKB.KeyboardAttributeType = {
  key: '$',
  code: 'Dollars',
  keyCode: 8001,
  keyType: symbolType,
};

/** ---------------------------主题--------------------------- */
/** 亮色 */
export const LightTheme: VKB.KeyboardAttributeType = {
  key: <SunSvg />,
  code: 'light',
  keyCode: 9001,
  keyType: settingType,
  description: '日间模式',
};
/** 暗色 */
export const DarkTheme: VKB.KeyboardAttributeType = {
  key: <MoonSvg />,
  code: 'dark',
  keyCode: 9002,
  keyType: settingType,
  description: '夜间模式',
};

/** ---------------------------位置--------------------------- */
/** 固定下方 */
export const FixedBottomPosition: VKB.KeyboardAttributeType = {
  key: <BottomSvg />,
  code: 'fixedBottom',
  keyCode: 10001,
  keyType: settingType,
  description: '固定下方',
};
/** 固定上方 */
export const FixedTopPosition: VKB.KeyboardAttributeType = {
  key: <TopSvg />,
  code: 'fixedTop',
  keyCode: 10002,
  keyType: settingType,
  description: '固定上方',
};
/** 固定左侧 */
export const FixedLeftPosition: VKB.KeyboardAttributeType = {
  key: <LeftSvg />,
  code: 'fixedLeft',
  keyCode: 10003,
  keyType: settingType,
  description: '固定左侧',
};
/** 固定右侧 */
export const FixedRightPosition: VKB.KeyboardAttributeType = {
  key: <RightSvg />,
  code: 'fixedRight',
  keyCode: 10004,
  keyType: settingType,
  description: '固定右侧',
};
/** 浮动 */
export const FloatPosition: VKB.KeyboardAttributeType = {
  key: <FloatSvg />,
  code: 'float',
  keyCode: 10005,
  keyType: settingType,
  description: '浮动',
};

/** 数字键 */
export const numberKeys: VKB.KeyboardAttributeType[] = [
  Numpad1,
  Numpad2,
  Numpad3,
  NumpadAdd,
  Numpad4,
  Numpad5,
  Numpad6,
  NumpadSubtract,
  Numpad7,
  Numpad8,
  Numpad9,
  NumpadDecimal,
  Numpad0,
  NumpadMultiply,
  NumpadDivide,
  // Enter,
  Backspace,
];

/** 字母键 */
export const letterKeys: VKB.KeyboardAttributeType[] = [
  KeyQ,
  KeyW,
  KeyE,
  KeyR,
  KeyT,
  KeyY,
  KeyU,
  KeyI,
  KeyO,
  KeyP,
  KeyA,
  KeyS,
  KeyD,
  KeyF,
  KeyG,
  KeyH,
  KeyJ,
  KeyK,
  KeyL,
  // Tab,
  Shift,
  KeyZ,
  KeyX,
  KeyC,
  KeyV,
  KeyB,
  KeyN,
  KeyM,
  Backspace,
  CapsLock,
  Space,
  Enter,
];

/** 光标控制键 */
export const cursorKeys: VKB.KeyboardAttributeType[] = [
  ArrowUp,
  ArrowLeft,
  StartSelect,
  ArrowRight,
  ArrowDown,
  ArrowLeftFirst,
  ArrowRightEnd,
];

/** 编辑键 */
export const editKeys: VKB.KeyboardAttributeType[] = [
  SelectAll,
  Backspace,
  Copy,
  Enter,
  Paste,
  //  Clipboard
];

/** 符号键 */
export const symbolKeys: {
  id: number;
  label: ReactNode;
  value: VKB.KeyboardAttributeType[];
}[] = [
  {
    id: 3000,
    label: '中文',
    value: [
      ZHComma,
      Period,
      ZHQuestionMark,
      ZHExclamationPoint,
      ZHSemicolon,
      DunSign,
      ZHLeftDoubleQuotationMarks,
      ZHRightDoubleQuotationMarks,
      LeftBook,
      RightBook,
      ZHLeftParenthesis,
      ZHRightParenthesis,
      LeftMiddleParenthesis,
      RightMiddleParenthesis,
      LeftBigParenthesis,
      RightBigParenthesis,
      NumpadLessThan,
      NumpadGreaterThan,
    ],
  },
  {
    id: 4000,
    label: '英文',
    value: [
      ENComma,
      Period,
      ENQuestionMark,
      ENExclamationPoint,
      ENSemicolon,
      DunSign,
      ENLeftDoubleQuotationMarks,
      ENRightDoubleQuotationMarks,
      LeftBook,
      RightBook,
      ENLeftParenthesis,
      ENRightParenthesis,
      LeftMiddleParenthesis,
      RightMiddleParenthesis,
      LeftBigParenthesis,
      RightBigParenthesis,
      NumpadLessThan,
      NumpadGreaterThan,
    ],
  },
  {
    id: 5000,
    label: '网络',
    value: [
      NumpadDecimal,
      NumpadDivide,
      AT,
      WWWDot,
      WapDot,
      BlogDot,
      BBSDot,
      DotCom,
      DotCn,
      DotNet,
      DotOrg,
      Http,
      Https,
      FTP,
      SSH,
      Mail126,
      Mail163,
      MailSina,
      MailHotMail,
      MailLive,
      MailGmail,
    ],
  },
  {
    id: 6000,
    label: '数学',
    value: [
      NumpadAdd,
      NumpadSubtract,
      NumpadMultiply,
      NumpadDivide,
      NumpadGreaterThan,
      NumpadLessThan,
      NumpadEqual,
      NumpadPercentage,
    ],
  },
  {
    id: 7000,
    label: '特殊',
    value: [Multiply, Except, Top, Bottom, Left, Right, Male, Female],
  },
  {
    id: 8000,
    label: '货币',
    value: [CNY, Dollars],
  },
];

/** 主题键 */
export const themeKeys: VKB.KeyboardAttributeType[] = [LightTheme, DarkTheme];
/** 位置键 */
export const positionKeys: VKB.KeyboardAttributeType[] = [
  FloatPosition,
  FixedBottomPosition,
  FixedTopPosition,
  FixedLeftPosition,
  FixedRightPosition,
];
