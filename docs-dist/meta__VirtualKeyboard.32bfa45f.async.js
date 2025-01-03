'use strict';
(self.webpackChunkreact_virtual_keyboard =
  self.webpackChunkreact_virtual_keyboard || []).push([
  [708],
  {
    19266: function (O, l, e) {
      e.r(l),
        e.d(l, {
          demos: function () {
            return C;
          },
        });
      var y = e(90228),
        n = e.n(y),
        V = e(26068),
        m = e.n(V),
        j = e(48305),
        u = e.n(j),
        B = e(87999),
        g = e.n(B),
        t = e(75271),
        Y = e(70262),
        C = {
          'virtualkeyboard-demo-0': {
            component: t.memo(
              t.lazy(
                g()(
                  n()().mark(function p() {
                    var I, o, a, v, c, r, K, h, T, E, f;
                    return n()().wrap(function (d) {
                      for (;;)
                        switch ((d.prev = d.next)) {
                          case 0:
                            return (
                              (d.next = 2),
                              Promise.resolve().then(e.t.bind(e, 75271, 19))
                            );
                          case 2:
                            return (
                              (I = d.sent),
                              (o = I.useState),
                              (d.next = 6),
                              Promise.resolve().then(e.bind(e, 39906))
                            );
                          case 6:
                            return (
                              (a = d.sent),
                              (v = a.useVirtualKeyboard),
                              (c = a.keys),
                              (r = a.LetterKeyboardTab),
                              (K = a.NumberKeyboardTab),
                              (h = a.SymbolKeyboardTab),
                              (T = a.EditKeyboardTab),
                              (E = a.SettingKeyboardTab),
                              (f = a.WriteKeyboardTab),
                              d.abrupt('return', {
                                default: function () {
                                  var s,
                                    i,
                                    _,
                                    b,
                                    L = o(!1),
                                    M = u()(L, 2),
                                    W = M[0],
                                    A = M[1],
                                    R = o(
                                      (s =
                                        (i = localStorage) === null ||
                                        i === void 0
                                          ? void 0
                                          : i.getItem(c.VKB_THEME_MODE)) !==
                                        null && s !== void 0
                                        ? s
                                        : 'light',
                                    ),
                                    k = u()(R, 2),
                                    w = k[0],
                                    U = k[1],
                                    N = o(
                                      (_ =
                                        (b = localStorage) === null ||
                                        b === void 0
                                          ? void 0
                                          : b.getItem(c.VKB_POSITION_MODE)) !==
                                        null && _ !== void 0
                                        ? _
                                        : 'float',
                                    ),
                                    S = u()(N, 2),
                                    $ = S[0],
                                    z = S[1],
                                    H = o(''),
                                    P = u()(H, 2),
                                    F = P[0],
                                    G = P[1],
                                    x = v(),
                                    J = x.VirtualKeyboard,
                                    Q = x.InitVirtualKeyBoardCtx,
                                    X = x.VirtualKeyboardProvide;
                                  return t.createElement(
                                    t.Fragment,
                                    null,
                                    t.createElement('input', {
                                      placeholder:
                                        '\u53EF\u4F7F\u7528\u5DE6\u4FA7\u865A\u62DF\u952E\u76D8',
                                      onInput: function (D) {
                                        G(D.target.value),
                                          console.log('value', D.target.value);
                                      },
                                    }),
                                    t.createElement(
                                      'div',
                                      null,
                                      'value\uFF1A',
                                      F,
                                    ),
                                    t.createElement(
                                      X,
                                      {
                                        value: m()(
                                          m()({}, Q),
                                          {},
                                          {
                                            width: '500px',
                                            height: '320px',
                                            show: W,
                                            setShow: A,
                                            themeMode: w,
                                            setThemeMode: U,
                                            positionMode: $,
                                            setPositionMode: z,
                                            theme: {},
                                            virtualKeyboardTab: [
                                              r,
                                              K,
                                              h,
                                              f,
                                              T,
                                              E,
                                            ],
                                          },
                                        ),
                                      },
                                      t.createElement(J, null),
                                    ),
                                  );
                                },
                              })
                            );
                          case 16:
                          case 'end':
                            return d.stop();
                        }
                    }, p);
                  }),
                ),
              ),
            ),
            asset: {
              type: 'BLOCK',
              id: 'virtualkeyboard-demo-0',
              refAtomIds: ['VirtualKeyboard'],
              dependencies: {
                'index.jsx': {
                  type: 'FILE',
                  value: `import { useState } from 'react';\r
import {\r
  useVirtualKeyboard,\r
  keys,\r
  LetterKeyboardTab,\r
  NumberKeyboardTab,\r
  SymbolKeyboardTab,\r
  EditKeyboardTab,\r
  SettingKeyboardTab,\r
  WriteKeyboardTab,\r
} from 'react-virtual-keyboard';\r
\r
export default () => {\r
  const [show, setShow] = useState(false);\r
  const [themeMode, setThemeMode] = useState(\r
    localStorage?.getItem(keys.VKB_THEME_MODE) ?? 'light',\r
  );\r
  const [positionMode, setPositionMode] = useState(\r
    localStorage?.getItem(keys.VKB_POSITION_MODE) ?? 'float',\r
  );\r
  const [value, setValue] = useState('');\r
  const { VirtualKeyboard, InitVirtualKeyBoardCtx, VirtualKeyboardProvide } =\r
    useVirtualKeyboard();\r
\r
  return (\r
    <>\r
      {/* <div>\u53EF\u4F7F\u7528\u5DE6\u4FA7\u865A\u62DF\u952E\u76D8</div> */}\r
      <input\r
        placeholder="\u53EF\u4F7F\u7528\u5DE6\u4FA7\u865A\u62DF\u952E\u76D8"\r
        onInput={(e) => {\r
          setValue(e.target.value);\r
          console.log('value', e.target.value);\r
        }}\r
      />\r
      <div>value\uFF1A{value}</div>\r
      <VirtualKeyboardProvide\r
        value={{\r
          ...InitVirtualKeyBoardCtx,\r
          width: '500px',\r
          height: '320px',\r
          show,\r
          setShow,\r
          themeMode,\r
          setThemeMode,\r
          positionMode,\r
          setPositionMode,\r
          theme: {},\r
          virtualKeyboardTab: [\r
            LetterKeyboardTab,\r
            NumberKeyboardTab,\r
            SymbolKeyboardTab,\r
            WriteKeyboardTab,\r
            EditKeyboardTab,\r
            SettingKeyboardTab,\r
          ],\r
        }}\r
      >\r
        <VirtualKeyboard />\r
      </VirtualKeyboardProvide>\r
    </>\r
  );\r
};`,
                },
                react: { type: 'NPM', value: '18.3.1' },
                'react-virtual-keyboard': { type: 'NPM', value: '0.0.1' },
              },
              entry: 'index.jsx',
            },
            context: { react: e(75271), 'react-virtual-keyboard': e(39906) },
            renderOpts: {
              compile: (function () {
                var p = g()(
                  n()().mark(function o() {
                    var a,
                      v = arguments;
                    return n()().wrap(function (r) {
                      for (;;)
                        switch ((r.prev = r.next)) {
                          case 0:
                            return (r.next = 2), e.e(93).then(e.bind(e, 14093));
                          case 2:
                            return r.abrupt(
                              'return',
                              (a = r.sent).default.apply(a, v),
                            );
                          case 3:
                          case 'end':
                            return r.stop();
                        }
                    }, o);
                  }),
                );
                function I() {
                  return p.apply(this, arguments);
                }
                return I;
              })(),
            },
          },
        };
    },
    22629: function (O, l, e) {
      e.r(l),
        e.d(l, {
          texts: function () {
            return n;
          },
        });
      var y = e(70262);
      const n = [
        { value: '\u5C5E\u6027', paraId: 0, tocIndex: 2 },
        { value: '\u8BF4\u660E', paraId: 0, tocIndex: 2 },
        { value: '\u7C7B\u578B', paraId: 0, tocIndex: 2 },
        { value: '\u9ED8\u8BA4\u503C', paraId: 0, tocIndex: 2 },
        { value: 'width', paraId: 0, tocIndex: 2 },
        { value: '\u5BBD\u5EA6', paraId: 0, tocIndex: 2 },
        { value: 'string', paraId: 0, tocIndex: 2 },
        { value: '500px', paraId: 0, tocIndex: 2 },
        { value: 'height', paraId: 0, tocIndex: 2 },
        { value: '\u9AD8\u5EA6', paraId: 0, tocIndex: 2 },
        { value: 'string', paraId: 0, tocIndex: 2 },
        { value: '320px', paraId: 0, tocIndex: 2 },
        { value: 'zIndex', paraId: 0, tocIndex: 2 },
        { value: '\u5C42\u7EA7', paraId: 0, tocIndex: 2 },
        { value: 'string | number', paraId: 0, tocIndex: 2 },
        { value: '9999', paraId: 0, tocIndex: 2 },
        { value: 'showDragHandle', paraId: 0, tocIndex: 2 },
        {
          value:
            '\u663E\u793A\u79FB\u52A8\u53E5\u67C4 & \u5141\u8BB8\u79FB\u52A8',
          paraId: 0,
          tocIndex: 2,
        },
        { value: 'boolean', paraId: 0, tocIndex: 2 },
        { value: 'true', paraId: 0, tocIndex: 2 },
        { value: 'show', paraId: 0, tocIndex: 2 },
        { value: '\u662F\u5426\u663E\u793A', paraId: 0, tocIndex: 2 },
        { value: 'boolean', paraId: 0, tocIndex: 2 },
        { value: 'false', paraId: 0, tocIndex: 2 },
        { value: 'virtualKeyboardTab', paraId: 0, tocIndex: 2 },
        {
          value: '\u81EA\u5B9A\u4E49\u952E\u76D8 tab \u5185\u5BB9',
          paraId: 0,
          tocIndex: 2,
        },
        { value: 'KeyboardTabItem[]', paraId: 0, tocIndex: 2 },
        { value: 'all', paraId: 0, tocIndex: 2 },
        { value: 'theme', paraId: 0, tocIndex: 2 },
        {
          value:
            '\u81EA\u5B9A\u4E49\u4E3B\u9898,\u5F53\u4F7F\u7528\u4E86\u4E3B\u9898\u53D8\u91CF\u65F6\uFF0C\u4E3B\u9898\u53D8\u91CF\u7684\u6743\u91CD\u66F4\u9AD8',
          paraId: 0,
          tocIndex: 2,
        },
        { value: 'Partial<Theme>', paraId: 0, tocIndex: 2 },
        { value: '\u53C2\u8003\u9ED8\u8BA4 token', paraId: 0, tocIndex: 2 },
        { value: 'themeMode', paraId: 0, tocIndex: 2 },
        { value: '\u4E3B\u9898\u6A21\u5F0F', paraId: 0, tocIndex: 2 },
        { value: 'string', paraId: 0, tocIndex: 2 },
        { value: 'light', paraId: 0, tocIndex: 2 },
        { value: 'positionMode', paraId: 0, tocIndex: 2 },
        { value: '\u4F4D\u7F6E\u6A21\u5F0F', paraId: 0, tocIndex: 2 },
        { value: 'string', paraId: 0, tocIndex: 2 },
        { value: 'float', paraId: 0, tocIndex: 2 },
        { value: '\u65B9\u6CD5', paraId: 1, tocIndex: 3 },
        { value: '\u8BF4\u660E', paraId: 1, tocIndex: 3 },
        { value: '\u7C7B\u578B', paraId: 1, tocIndex: 3 },
        { value: '\u9ED8\u8BA4\u503C', paraId: 1, tocIndex: 3 },
        { value: 'setShow', paraId: 1, tocIndex: 3 },
        {
          value:
            '\u663E\u793A ,\u4F20\u5165\u7684\u5FC5\u987B\u662F setStatus \u91CD\u65B0 render',
          paraId: 1,
          tocIndex: 3,
        },
        { value: '(show: boolean) => void', paraId: 1, tocIndex: 3 },
        { value: '-', paraId: 1, tocIndex: 3 },
        { value: 'setThemeMode', paraId: 1, tocIndex: 3 },
        {
          value: '\u8BBE\u7F6E\u4E3B\u9898\u6A21\u5F0F',
          paraId: 1,
          tocIndex: 3,
        },
        { value: '(mode:string)=>void', paraId: 1, tocIndex: 3 },
        { value: '-', paraId: 1, tocIndex: 3 },
        { value: 'setPositionMode', paraId: 1, tocIndex: 3 },
        {
          value: '\u8BBE\u7F6E\u4F4D\u7F6E\u6A21\u5F0F',
          paraId: 1,
          tocIndex: 3,
        },
        { value: '(mode:string)=>void', paraId: 1, tocIndex: 3 },
        { value: '-', paraId: 1, tocIndex: 3 },
        { value: 'onChange', paraId: 1, tocIndex: 3 },
        {
          value:
            '\u64CD\u4F5C\u65F6\u7684\u56DE\u8C03,\u901A\u8FC7 ctx \u91CD\u5199 onChange \u5B9E\u73B0',
          paraId: 1,
          tocIndex: 3,
        },
        { value: 'onChange?: (value: string) => void', paraId: 1, tocIndex: 3 },
        { value: '-', paraId: 1, tocIndex: 3 },
        { value: 'onEnter', paraId: 1, tocIndex: 3 },
        {
          value:
            '\u56DE\u8F66 \u901A\u8FC7 ctx \u91CD\u5199 onEnter \u5B9E\u73B0',
          paraId: 1,
          tocIndex: 3,
        },
        { value: 'onEnter?: () => void', paraId: 1, tocIndex: 3 },
        { value: '-', paraId: 1, tocIndex: 3 },
        { value: 'token', paraId: 2, tocIndex: 4 },
        { value: '\u8BF4\u660E', paraId: 2, tocIndex: 4 },
        { value: '\u7C7B\u578B', paraId: 2, tocIndex: 4 },
        { value: '\u9ED8\u8BA4\u503C', paraId: 2, tocIndex: 4 },
        { value: '--vkb-key-gap', paraId: 2, tocIndex: 4 },
        { value: '\u95F4\u9694', paraId: 2, tocIndex: 4 },
        { value: 'string', paraId: 2, tocIndex: 4 },
        { value: '6px', paraId: 2, tocIndex: 4 },
        { value: '--vkb-key-border-width', paraId: 2, tocIndex: 4 },
        {
          value: '\u6309\u952E\u8FB9\u6846\u7EBF\u5BBD\u5EA6',
          paraId: 2,
          tocIndex: 4,
        },
        { value: 'string', paraId: 2, tocIndex: 4 },
        { value: '1px', paraId: 2, tocIndex: 4 },
        { value: '--vkb-keyboard-svg-size', paraId: 2, tocIndex: 4 },
        { value: '\u5185\u90E8 svg \u5927\u5C0F', paraId: 2, tocIndex: 4 },
        { value: 'string', paraId: 2, tocIndex: 4 },
        { value: '26px', paraId: 2, tocIndex: 4 },
        { value: '--vkb-key-shadow-width', paraId: 2, tocIndex: 4 },
        { value: '\u6309\u952E shadow \u5BBD\u5EA6', paraId: 2, tocIndex: 4 },
        { value: 'string', paraId: 2, tocIndex: 4 },
        { value: '4px', paraId: 2, tocIndex: 4 },
        { value: '--vkb-key-borer-radius', paraId: 2, tocIndex: 4 },
        { value: '\u6309\u952E\u5706\u89D2', paraId: 2, tocIndex: 4 },
        { value: 'string', paraId: 2, tocIndex: 4 },
        { value: '4px', paraId: 2, tocIndex: 4 },
        { value: '--vkb-key-tips-font-size', paraId: 2, tocIndex: 4 },
        {
          value: '\u63D0\u793A\u6587\u5B57\u5927\u5C0F',
          paraId: 2,
          tocIndex: 4,
        },
        { value: 'string', paraId: 2, tocIndex: 4 },
        { value: '12px', paraId: 2, tocIndex: 4 },
        { value: '--vkb-keyboard-tab', paraId: 2, tocIndex: 4 },
        { value: 'tab \u9AD8\u5EA6', paraId: 2, tocIndex: 4 },
        { value: 'string', paraId: 2, tocIndex: 4 },
        { value: '40px', paraId: 2, tocIndex: 4 },
        { value: '--vkb-key-background', paraId: 2, tocIndex: 4 },
        { value: '\u6309\u952E\u80CC\u666F\u8272', paraId: 2, tocIndex: 4 },
        { value: 'string', paraId: 2, tocIndex: 4 },
        { value: ' #ffffff', paraId: 2, tocIndex: 4 },
        { value: '--vkb-key-border-color', paraId: 2, tocIndex: 4 },
        {
          value: '\u6309\u952E\u8FB9\u6846\u989C\u8272',
          paraId: 2,
          tocIndex: 4,
        },
        { value: 'string', paraId: 2, tocIndex: 4 },
        { value: ' #f0f0f0', paraId: 2, tocIndex: 4 },
        { value: '--vkb-key-shadow-color', paraId: 2, tocIndex: 4 },
        { value: '\u6309\u952E shadow \u989C\u8272', paraId: 2, tocIndex: 4 },
        { value: 'string', paraId: 2, tocIndex: 4 },
        { value: ' #f0f0f0', paraId: 2, tocIndex: 4 },
        { value: '--vkb-key-active-font-color', paraId: 2, tocIndex: 4 },
        {
          value: '\u6309\u952E\u6D3B\u52A8\u5B57\u4F53\u989C\u8272',
          paraId: 2,
          tocIndex: 4,
        },
        { value: 'string', paraId: 2, tocIndex: 4 },
        { value: ' #1677ff', paraId: 2, tocIndex: 4 },
        { value: '--vkb-key-active-background', paraId: 2, tocIndex: 4 },
        {
          value: '\u6309\u952E\u80CC\u6D3B\u52A8\u666F\u8272',
          paraId: 2,
          tocIndex: 4,
        },
        { value: 'string', paraId: 2, tocIndex: 4 },
        { value: ' #dce1e7', paraId: 2, tocIndex: 4 },
        { value: '--vkb-key-active-shadow-color', paraId: 2, tocIndex: 4 },
        { value: '\u6309\u952E\u6D3B\u52A8 shadow', paraId: 2, tocIndex: 4 },
        { value: 'string', paraId: 2, tocIndex: 4 },
        { value: ' #dce1e7', paraId: 2, tocIndex: 4 },
        { value: '--vkb-key-active-border-color', paraId: 2, tocIndex: 4 },
        {
          value: '\u6309\u952E\u6D3B\u52A8\u8FB9\u6846\u989C\u8272',
          paraId: 2,
          tocIndex: 4,
        },
        { value: 'string', paraId: 2, tocIndex: 4 },
        { value: ' #dce1e7', paraId: 2, tocIndex: 4 },
        { value: '--vkb-background', paraId: 2, tocIndex: 4 },
        { value: '\u952E\u76D8\u80CC\u666F\u8272', paraId: 2, tocIndex: 4 },
        { value: 'string', paraId: 2, tocIndex: 4 },
        { value: ' #f2f5fa', paraId: 2, tocIndex: 4 },
        { value: '--vkb-key-color', paraId: 2, tocIndex: 4 },
        { value: '\u5B57\u4F53\u989C\u8272', paraId: 2, tocIndex: 4 },
        { value: 'string', paraId: 2, tocIndex: 4 },
        { value: ' #000000', paraId: 2, tocIndex: 4 },
        { value: '--vkb-key-tips-color', paraId: 2, tocIndex: 4 },
        { value: '\u63D0\u793A\u989C\u8272', paraId: 2, tocIndex: 4 },
        { value: 'string', paraId: 2, tocIndex: 4 },
        { value: ' #cccccc', paraId: 2, tocIndex: 4 },
        { value: '--vkb-key-scroll-bar-color', paraId: 2, tocIndex: 4 },
        { value: '\u6EDA\u52A8\u6761\u989C\u8272', paraId: 2, tocIndex: 4 },
        { value: 'string', paraId: 2, tocIndex: 4 },
        { value: ' #cccccc', paraId: 2, tocIndex: 4 },
        {
          value: `const tabs: VKB.KeyboardTabItem[] = [\r
  LetterKeyboardTab,\r
  NumberKeyboardTab,\r
  SymbolKeyboardTab,\r
  EditKeyboardTab,\r
  SettingKeyboardTab,\r
  WriteKeyboardTab,\r
];
`,
          paraId: 3,
          tocIndex: 5,
        },
      ];
    },
  },
]);
