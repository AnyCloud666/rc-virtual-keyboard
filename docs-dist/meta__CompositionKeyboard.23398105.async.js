'use strict';
(self.webpackChunkreact_virtual_keyboard =
  self.webpackChunkreact_virtual_keyboard || []).push([
  [146],
  {
    86262: function (_, I, e) {
      e.r(I),
        e.d(I, {
          demos: function () {
            return K;
          },
        });
      var s = e(90228),
        r = e.n(s),
        f = e(87999),
        i = e.n(f),
        t = e(75271),
        S = e(55815),
        K = {
          'compositionkeyboard-demo-0': {
            component: t.memo(
              t.lazy(
                i()(
                  r()().mark(function c() {
                    var l, n, a, u, v, d, x, b, M, m;
                    return r()().wrap(function (o) {
                      for (;;)
                        switch ((o.prev = o.next)) {
                          case 0:
                            return (
                              (o.next = 2),
                              Promise.resolve().then(e.t.bind(e, 75271, 19))
                            );
                          case 2:
                            return (
                              (l = o.sent),
                              (n = l.useState),
                              (o.next = 6),
                              Promise.resolve().then(e.bind(e, 39906))
                            );
                          case 6:
                            return (
                              (a = o.sent),
                              (u = a.CompositionKeyboard),
                              (v = a.LetterKeyboardTab),
                              (d = a.NumberKeyboardTab),
                              (x = a.SymbolKeyboardTab),
                              (b = a.EditKeyboardTab),
                              (M = a.SettingKeyboardTab),
                              (m = a.WriteKeyboardTab),
                              o.abrupt('return', {
                                default: function () {
                                  var y = n('light'),
                                    T = y.themeMode,
                                    k = y.setThemeMode,
                                    h = n('float'),
                                    w = h.positionMode,
                                    C = h.setPositionMode,
                                    g = n(!1),
                                    L = g.show,
                                    j = g.setShow,
                                    E = function (p) {
                                      console.log('e: ++++++', p);
                                    };
                                  return t.createElement(
                                    t.Fragment,
                                    null,
                                    t.createElement('input', {
                                      onInput: function (p) {
                                        console.log('e: ', p.target.value);
                                      },
                                    }),
                                    t.createElement(
                                      'div',
                                      {
                                        style: {
                                          width: 500,
                                          height: 320,
                                          margin: '0 auto',
                                        },
                                      },
                                      t.createElement(u, {
                                        themeMode: T,
                                        virtualKeyboardTab: [v, d, x, m, b],
                                        showDragHandle: !1,
                                        showHiddenHandle: !1,
                                        onChange: E,
                                        onThemeModeChange: k,
                                        onPositionModeChange: C,
                                      }),
                                    ),
                                  );
                                },
                              })
                            );
                          case 15:
                          case 'end':
                            return o.stop();
                        }
                    }, c);
                  }),
                ),
              ),
            ),
            asset: {
              type: 'BLOCK',
              id: 'compositionkeyboard-demo-0',
              refAtomIds: ['CompositionKeyboard'],
              dependencies: {
                'index.jsx': {
                  type: 'FILE',
                  value: `import { useState } from 'react';\r
import {\r
  CompositionKeyboard,\r
  LetterKeyboardTab,\r
  NumberKeyboardTab,\r
  SymbolKeyboardTab,\r
  EditKeyboardTab,\r
  SettingKeyboardTab,\r
  WriteKeyboardTab,\r
} from 'react-virtual-keyboard';\r
export default () => {\r
  const { themeMode, setThemeMode } = useState('light');\r
  const { positionMode, setPositionMode } = useState('float');\r
  const { show, setShow } = useState(false);\r
  const onChange = (e) => {\r
    console.log('e: ++++++', e);\r
  };\r
\r
  return (\r
    <>\r
      <input\r
        onInput={(e) => {\r
          console.log('e: ', e.target.value);\r
        }}\r
      />\r
      <div style={{ width: 500, height: 320, margin: '0 auto' }}>\r
        <CompositionKeyboard\r
          themeMode={themeMode}\r
          virtualKeyboardTab={[\r
            LetterKeyboardTab,\r
            NumberKeyboardTab,\r
            SymbolKeyboardTab,\r
            WriteKeyboardTab,\r
            EditKeyboardTab,\r
          ]}\r
          showDragHandle={false}\r
          showHiddenHandle={false}\r
          onChange={onChange}\r
          onThemeModeChange={setThemeMode}\r
          onPositionModeChange={setPositionMode}\r
        />\r
      </div>\r
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
                var c = i()(
                  r()().mark(function n() {
                    var a,
                      u = arguments;
                    return r()().wrap(function (d) {
                      for (;;)
                        switch ((d.prev = d.next)) {
                          case 0:
                            return (d.next = 2), e.e(93).then(e.bind(e, 14093));
                          case 2:
                            return d.abrupt(
                              'return',
                              (a = d.sent).default.apply(a, u),
                            );
                          case 3:
                          case 'end':
                            return d.stop();
                        }
                    }, n);
                  }),
                );
                function l() {
                  return c.apply(this, arguments);
                }
                return l;
              })(),
            },
          },
        };
    },
    76599: function (_, I, e) {
      e.r(I),
        e.d(I, {
          texts: function () {
            return r;
          },
        });
      var s = e(55815);
      const r = [
        { value: '\u5C5E\u6027', paraId: 0, tocIndex: 1 },
        { value: '\u8BF4\u660E', paraId: 0, tocIndex: 1 },
        { value: '\u7C7B\u578B', paraId: 0, tocIndex: 1 },
        { value: '\u9ED8\u8BA4\u503C', paraId: 0, tocIndex: 1 },
        { value: 'showDragHandle', paraId: 0, tocIndex: 1 },
        { value: '\u663E\u793A\u62D6\u62FD', paraId: 0, tocIndex: 1 },
        { value: 'boolean', paraId: 0, tocIndex: 1 },
        { value: 'true', paraId: 0, tocIndex: 1 },
        { value: 'showHiddenHandle', paraId: 0, tocIndex: 1 },
        { value: '\u663E\u793A\u9690\u85CF', paraId: 0, tocIndex: 1 },
        { value: 'boolean', paraId: 0, tocIndex: 1 },
        { value: 'true', paraId: 0, tocIndex: 1 },
        { value: 'style', paraId: 0, tocIndex: 1 },
        { value: '\u6837\u5F0F', paraId: 0, tocIndex: 1 },
        { value: 'CSSProperties', paraId: 0, tocIndex: 1 },
        { value: '-', paraId: 0, tocIndex: 1 },
        { value: 'defaultActiveKeyboard', paraId: 0, tocIndex: 1 },
        { value: '\u9ED8\u8BA4\u952E\u76D8', paraId: 0, tocIndex: 1 },
        { value: 'string', paraId: 0, tocIndex: 1 },
        { value: 'number', paraId: 0, tocIndex: 1 },
        { value: 'moveLabel', paraId: 0, tocIndex: 1 },
        { value: '\u79FB\u52A8 label', paraId: 0, tocIndex: 1 },
        { value: 'ReactNode', paraId: 0, tocIndex: 1 },
        { value: '<MoveSvg />', paraId: 0, tocIndex: 1 },
        { value: 'hiddenLabel', paraId: 0, tocIndex: 1 },
        { value: '\u9690\u85CF label', paraId: 0, tocIndex: 1 },
        { value: 'ReactNode', paraId: 0, tocIndex: 1 },
        { value: '<BottomSvg />', paraId: 0, tocIndex: 1 },
        { value: 'themeMode', paraId: 0, tocIndex: 1 },
        { value: '\u4E3B\u9898\u6A21\u5F0F', paraId: 0, tocIndex: 1 },
        { value: 'string', paraId: 0, tocIndex: 1 },
        { value: 'light', paraId: 0, tocIndex: 1 },
        { value: 'positionMode', paraId: 0, tocIndex: 1 },
        { value: '\u4F4D\u7F6E\u6A21\u5F0F', paraId: 0, tocIndex: 1 },
        { value: 'string', paraId: 0, tocIndex: 1 },
        { value: 'float', paraId: 0, tocIndex: 1 },
        { value: '\u65B9\u6CD5', paraId: 1, tocIndex: 2 },
        { value: '\u8BF4\u660E', paraId: 1, tocIndex: 2 },
        { value: '\u7C7B\u578B', paraId: 1, tocIndex: 2 },
        { value: '\u9ED8\u8BA4\u503C', paraId: 1, tocIndex: 2 },
        { value: 'onEnter', paraId: 1, tocIndex: 2 },
        { value: 'enter \u65B9\u6CD5\u56DE\u8C03', paraId: 1, tocIndex: 2 },
        { value: '()=>void', paraId: 1, tocIndex: 2 },
        { value: '-', paraId: 1, tocIndex: 2 },
        { value: 'onChange', paraId: 1, tocIndex: 2 },
        { value: '\u8F93\u5165\u56DE\u8C03', paraId: 1, tocIndex: 2 },
        {
          value: '(e: VKB.KeyboardAttributeType) => void',
          paraId: 1,
          tocIndex: 2,
        },
        { value: '-', paraId: 1, tocIndex: 2 },
        { value: 'onChangeShow', paraId: 1, tocIndex: 2 },
        {
          value: '\u663E\u793A/\u9690\u85CF\u865A\u62DF\u952E\u76D8',
          paraId: 1,
          tocIndex: 2,
        },
        { value: '(b: boolean) => void', paraId: 1, tocIndex: 2 },
        { value: '-', paraId: 1, tocIndex: 2 },
        { value: 'onThemeModeChange', paraId: 1, tocIndex: 2 },
        { value: '\u4E3B\u9898\u6539\u53D8', paraId: 1, tocIndex: 2 },
        { value: '(mode: string) => void', paraId: 1, tocIndex: 2 },
        { value: '-', paraId: 1, tocIndex: 2 },
        { value: 'onPositionModeChange', paraId: 1, tocIndex: 2 },
        {
          value: '\u4F4D\u7F6E\u6A21\u5F0F\u6539\u53D8',
          paraId: 1,
          tocIndex: 2,
        },
        { value: '(mode: string) => void', paraId: 1, tocIndex: 2 },
        { value: '-', paraId: 1, tocIndex: 2 },
        { value: 'token', paraId: 2, tocIndex: 3 },
        { value: '\u8BF4\u660E', paraId: 2, tocIndex: 3 },
        { value: '\u7C7B\u578B', paraId: 2, tocIndex: 3 },
        { value: '\u9ED8\u8BA4\u503C', paraId: 2, tocIndex: 3 },
        { value: '--vkb-key-gap', paraId: 2, tocIndex: 3 },
        { value: '\u95F4\u9694', paraId: 2, tocIndex: 3 },
        { value: 'string', paraId: 2, tocIndex: 3 },
        { value: '6px', paraId: 2, tocIndex: 3 },
        { value: '--vkb-key-border-width', paraId: 2, tocIndex: 3 },
        {
          value: '\u6309\u952E\u8FB9\u6846\u7EBF\u5BBD\u5EA6',
          paraId: 2,
          tocIndex: 3,
        },
        { value: 'string', paraId: 2, tocIndex: 3 },
        { value: '1px', paraId: 2, tocIndex: 3 },
        { value: '--vkb-keyboard-svg-size', paraId: 2, tocIndex: 3 },
        { value: '\u5185\u90E8 svg \u5927\u5C0F', paraId: 2, tocIndex: 3 },
        { value: 'string', paraId: 2, tocIndex: 3 },
        { value: '26px', paraId: 2, tocIndex: 3 },
        { value: '--vkb-key-shadow-width', paraId: 2, tocIndex: 3 },
        { value: '\u6309\u952E shadow \u5BBD\u5EA6', paraId: 2, tocIndex: 3 },
        { value: 'string', paraId: 2, tocIndex: 3 },
        { value: '4px', paraId: 2, tocIndex: 3 },
        { value: '--vkb-key-borer-radius', paraId: 2, tocIndex: 3 },
        { value: '\u6309\u952E\u5706\u89D2', paraId: 2, tocIndex: 3 },
        { value: 'string', paraId: 2, tocIndex: 3 },
        { value: '4px', paraId: 2, tocIndex: 3 },
        { value: '--vkb-key-tips-font-size', paraId: 2, tocIndex: 3 },
        {
          value: '\u63D0\u793A\u6587\u5B57\u5927\u5C0F',
          paraId: 2,
          tocIndex: 3,
        },
        { value: 'string', paraId: 2, tocIndex: 3 },
        { value: '12px', paraId: 2, tocIndex: 3 },
        { value: '--vkb-keyboard-tab', paraId: 2, tocIndex: 3 },
        { value: 'tab \u9AD8\u5EA6', paraId: 2, tocIndex: 3 },
        { value: 'string', paraId: 2, tocIndex: 3 },
        { value: '40px', paraId: 2, tocIndex: 3 },
        { value: '--vkb-key-background', paraId: 2, tocIndex: 3 },
        { value: '\u6309\u952E\u80CC\u666F\u8272', paraId: 2, tocIndex: 3 },
        { value: 'string', paraId: 2, tocIndex: 3 },
        { value: ' #ffffff', paraId: 2, tocIndex: 3 },
        { value: '--vkb-key-border-color', paraId: 2, tocIndex: 3 },
        {
          value: '\u6309\u952E\u8FB9\u6846\u989C\u8272',
          paraId: 2,
          tocIndex: 3,
        },
        { value: 'string', paraId: 2, tocIndex: 3 },
        { value: ' #f0f0f0', paraId: 2, tocIndex: 3 },
        { value: '--vkb-key-shadow-color', paraId: 2, tocIndex: 3 },
        { value: '\u6309\u952E shadow \u989C\u8272', paraId: 2, tocIndex: 3 },
        { value: 'string', paraId: 2, tocIndex: 3 },
        { value: ' #f0f0f0', paraId: 2, tocIndex: 3 },
        { value: '--vkb-key-active-font-color', paraId: 2, tocIndex: 3 },
        {
          value: '\u6309\u952E\u6D3B\u52A8\u5B57\u4F53\u989C\u8272',
          paraId: 2,
          tocIndex: 3,
        },
        { value: 'string', paraId: 2, tocIndex: 3 },
        { value: ' #1677ff', paraId: 2, tocIndex: 3 },
        { value: '--vkb-key-active-background', paraId: 2, tocIndex: 3 },
        {
          value: '\u6309\u952E\u80CC\u6D3B\u52A8\u666F\u8272',
          paraId: 2,
          tocIndex: 3,
        },
        { value: 'string', paraId: 2, tocIndex: 3 },
        { value: ' #dce1e7', paraId: 2, tocIndex: 3 },
        { value: '--vkb-key-active-shadow-color', paraId: 2, tocIndex: 3 },
        { value: '\u6309\u952E\u6D3B\u52A8 shadow', paraId: 2, tocIndex: 3 },
        { value: 'string', paraId: 2, tocIndex: 3 },
        { value: ' #dce1e7', paraId: 2, tocIndex: 3 },
        { value: '--vkb-key-active-border-color', paraId: 2, tocIndex: 3 },
        {
          value: '\u6309\u952E\u6D3B\u52A8\u8FB9\u6846\u989C\u8272',
          paraId: 2,
          tocIndex: 3,
        },
        { value: 'string', paraId: 2, tocIndex: 3 },
        { value: ' #dce1e7', paraId: 2, tocIndex: 3 },
        { value: '--vkb-background', paraId: 2, tocIndex: 3 },
        { value: '\u952E\u76D8\u80CC\u666F\u8272', paraId: 2, tocIndex: 3 },
        { value: 'string', paraId: 2, tocIndex: 3 },
        { value: ' #f2f5fa', paraId: 2, tocIndex: 3 },
        { value: '--vkb-key-color', paraId: 2, tocIndex: 3 },
        { value: '\u5B57\u4F53\u989C\u8272', paraId: 2, tocIndex: 3 },
        { value: 'string', paraId: 2, tocIndex: 3 },
        { value: ' #000000', paraId: 2, tocIndex: 3 },
        { value: '--vkb-key-tips-color', paraId: 2, tocIndex: 3 },
        { value: '\u63D0\u793A\u989C\u8272', paraId: 2, tocIndex: 3 },
        { value: 'string', paraId: 2, tocIndex: 3 },
        { value: ' #cccccc', paraId: 2, tocIndex: 3 },
        { value: '--vkb-key-scroll-bar-color', paraId: 2, tocIndex: 3 },
        { value: '\u6EDA\u52A8\u6761\u989C\u8272', paraId: 2, tocIndex: 3 },
        { value: 'string', paraId: 2, tocIndex: 3 },
        { value: ' #cccccc', paraId: 2, tocIndex: 3 },
      ];
    },
  },
]);
