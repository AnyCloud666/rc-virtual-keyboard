'use strict';
(self.webpackChunkreact_virtual_keyboard =
  self.webpackChunkreact_virtual_keyboard || []).push([
  [904],
  {
    34642: function (v, l, t) {
      t.r(l),
        t.d(l, {
          demos: function () {
            return C;
          },
        });
      var y = t(90228),
        r = t.n(y),
        c = t(26068),
        x = t.n(c),
        B = t(48305),
        I = t.n(B),
        j = t(87999),
        s = t.n(j),
        e = t(75271),
        Y = t(30603),
        C = {
          'docs-error-demo-0': {
            component: e.memo(
              e.lazy(
                s()(
                  r()().mark(function i() {
                    var o, n, d, u, m, a, g, K, M, T, P;
                    return r()().wrap(function (p) {
                      for (;;)
                        switch ((p.prev = p.next)) {
                          case 0:
                            return (
                              (p.next = 2),
                              Promise.resolve().then(t.t.bind(t, 75271, 19))
                            );
                          case 2:
                            return (
                              (o = p.sent),
                              (n = o.useState),
                              (p.next = 6),
                              Promise.resolve().then(t.bind(t, 39906))
                            );
                          case 6:
                            return (
                              (d = p.sent),
                              (u = d.useVirtualKeyboard),
                              (m = d.keys),
                              (a = d.LetterKeyboardTab),
                              (g = d.NumberKeyboardTab),
                              (K = d.SymbolKeyboardTab),
                              (M = d.EditKeyboardTab),
                              (T = d.SettingKeyboardTab),
                              (P = d.WriteKeyboardTab),
                              p.abrupt('return', {
                                default: function () {
                                  var b,
                                    _,
                                    h,
                                    E,
                                    L = n(!1),
                                    O = I()(L, 2),
                                    k = O[0],
                                    A = O[1],
                                    W = n(
                                      (b =
                                        (_ = localStorage) === null ||
                                        _ === void 0
                                          ? void 0
                                          : _.getItem(m.VKB_THEME_MODE)) !==
                                        null && b !== void 0
                                        ? b
                                        : 'light',
                                    ),
                                    D = I()(W, 2),
                                    R = D[0],
                                    U = D[1],
                                    $ = n(
                                      (h =
                                        (E = localStorage) === null ||
                                        E === void 0
                                          ? void 0
                                          : E.getItem(m.VKB_POSITION_MODE)) !==
                                        null && h !== void 0
                                        ? h
                                        : 'float',
                                    ),
                                    S = I()($, 2),
                                    N = S[0],
                                    F = S[1],
                                    z = n(''),
                                    w = I()(z, 2),
                                    H = w[0],
                                    G = w[1],
                                    f = u(),
                                    J = f.VirtualKeyboard,
                                    Q = f.InitVirtualKeyBoardCtx,
                                    X = f.VirtualKeyboardProvide;
                                  return e.createElement(
                                    e.Fragment,
                                    null,
                                    e.createElement('input', {
                                      placeholder:
                                        '\u53EF\u4F7F\u7528\u5DE6\u4FA7\u865A\u62DF\u952E\u76D8',
                                      onInput: function (V) {
                                        G(V.target.value),
                                          console.log('value', V.target.value);
                                      },
                                    }),
                                    e.createElement(
                                      'div',
                                      null,
                                      'value\uFF1A',
                                      H,
                                    ),
                                    e.createElement(
                                      'div',
                                      {
                                        style: {
                                          display: 'flex',
                                          alignItem: 'center',
                                        },
                                      },
                                      e.createElement(
                                        'div',
                                        { style: { width: 200 } },
                                        ' type="number"',
                                      ),
                                      e.createElement('input', {
                                        type: 'number',
                                      }),
                                    ),
                                    e.createElement(
                                      'div',
                                      {
                                        style: {
                                          display: 'flex',
                                          alignItem: 'center',
                                        },
                                      },
                                      e.createElement(
                                        'div',
                                        { style: { width: 200 } },
                                        ' data-vkb-type="number"',
                                      ),
                                      e.createElement('input', {
                                        'data-vkb-type': 'number',
                                      }),
                                    ),
                                    e.createElement(
                                      'div',
                                      {
                                        style: {
                                          display: 'flex',
                                          alignItem: 'center',
                                        },
                                      },
                                      e.createElement(
                                        'div',
                                        { style: { width: 200 } },
                                        ' type="email"',
                                      ),
                                      e.createElement('input', {
                                        type: 'email',
                                      }),
                                    ),
                                    e.createElement(
                                      'div',
                                      {
                                        style: {
                                          display: 'flex',
                                          alignItem: 'datetime',
                                        },
                                      },
                                      e.createElement(
                                        'div',
                                        { style: { width: 200 } },
                                        ' type="datetime"',
                                      ),
                                      e.createElement('input', {
                                        type: 'datetime',
                                      }),
                                    ),
                                    e.createElement(
                                      X,
                                      {
                                        value: x()(
                                          x()({}, Q),
                                          {},
                                          {
                                            width: '500px',
                                            height: '320px',
                                            show: k,
                                            setShow: A,
                                            themeMode: R,
                                            setThemeMode: U,
                                            positionMode: N,
                                            setPositionMode: F,
                                            theme: {},
                                            virtualKeyboardTab: [
                                              a,
                                              g,
                                              K,
                                              P,
                                              M,
                                              T,
                                            ],
                                          },
                                        ),
                                      },
                                      e.createElement(J, null),
                                    ),
                                  );
                                },
                              })
                            );
                          case 16:
                          case 'end':
                            return p.stop();
                        }
                    }, i);
                  }),
                ),
              ),
            ),
            asset: {
              type: 'BLOCK',
              id: 'docs-error-demo-0',
              refAtomIds: [],
              dependencies: {
                'index.jsx': {
                  type: 'FILE',
                  value: `import { useState } from 'react';
import {
  useVirtualKeyboard,
  keys,
  LetterKeyboardTab,
  NumberKeyboardTab,
  SymbolKeyboardTab,
  EditKeyboardTab,
  SettingKeyboardTab,
  WriteKeyboardTab,
} from 'react-virtual-keyboard';

export default () => {
  const [show, setShow] = useState(false);
  const [themeMode, setThemeMode] = useState(
    localStorage?.getItem(keys.VKB_THEME_MODE) ?? 'light',
  );
  const [positionMode, setPositionMode] = useState(
    localStorage?.getItem(keys.VKB_POSITION_MODE) ?? 'float',
  );
  const [value, setValue] = useState('');
  const { VirtualKeyboard, InitVirtualKeyBoardCtx, VirtualKeyboardProvide } =
    useVirtualKeyboard();

  return (
    <>
      {/* <div>\u53EF\u4F7F\u7528\u5DE6\u4FA7\u865A\u62DF\u952E\u76D8</div> */}
      <input
        placeholder="\u53EF\u4F7F\u7528\u5DE6\u4FA7\u865A\u62DF\u952E\u76D8"
        onInput={(e) => {
          setValue(e.target.value);
          console.log('value', e.target.value);
        }}
      />
      <div>value\uFF1A{value}</div>

      <div style={{ display: 'flex', alignItem: 'center' }}>
        <div style={{ width: 200 }}> type="number"</div>
        <input type="number" />
      </div>

      {/* \u53EF\u4EE5\u4F7F\u7528data-vkb-type='number' \u4EE3\u66FF */}
      <div style={{ display: 'flex', alignItem: 'center' }}>
        <div style={{ width: 200 }}> data-vkb-type="number"</div>
        <input data-vkb-type="number" />
      </div>

      <div style={{ display: 'flex', alignItem: 'center' }}>
        <div style={{ width: 200 }}> type="email"</div>
        <input type="email" />
      </div>

      <div style={{ display: 'flex', alignItem: 'datetime' }}>
        <div style={{ width: 200 }}> type="datetime"</div>
        <input type="datetime" />
      </div>

      <VirtualKeyboardProvide
        value={{
          ...InitVirtualKeyBoardCtx,
          width: '500px',
          height: '320px',
          show,
          setShow,
          themeMode,
          setThemeMode,
          positionMode,
          setPositionMode,
          theme: {},
          virtualKeyboardTab: [
            LetterKeyboardTab,
            NumberKeyboardTab,
            SymbolKeyboardTab,
            WriteKeyboardTab,
            EditKeyboardTab,
            SettingKeyboardTab,
          ],
        }}
      >
        <VirtualKeyboard />
      </VirtualKeyboardProvide>
    </>
  );
};`,
                },
                react: { type: 'NPM', value: '18.3.1' },
                'react-virtual-keyboard': { type: 'NPM', value: '0.0.1' },
              },
              entry: 'index.jsx',
            },
            context: { react: t(75271), 'react-virtual-keyboard': t(39906) },
            renderOpts: {
              compile: (function () {
                var i = s()(
                  r()().mark(function n() {
                    var d,
                      u = arguments;
                    return r()().wrap(function (a) {
                      for (;;)
                        switch ((a.prev = a.next)) {
                          case 0:
                            return (a.next = 2), t.e(93).then(t.bind(t, 14093));
                          case 2:
                            return a.abrupt(
                              'return',
                              (d = a.sent).default.apply(d, u),
                            );
                          case 3:
                          case 'end':
                            return a.stop();
                        }
                    }, n);
                  }),
                );
                function o() {
                  return i.apply(this, arguments);
                }
                return o;
              })(),
            },
          },
          'docs-error-demo-1': {
            component: e.memo(
              e.lazy(
                s()(
                  r()().mark(function i() {
                    return r()().wrap(function (n) {
                      for (;;)
                        switch ((n.prev = n.next)) {
                          case 0:
                            return n.abrupt('return', {
                              default: function () {
                                return e.createElement(
                                  e.Fragment,
                                  null,
                                  e.createElement(
                                    'div',
                                    {
                                      style: {
                                        display: 'flex',
                                        alignItem: 'center',
                                      },
                                    },
                                    e.createElement(
                                      'div',
                                      { style: { width: 200 } },
                                      ' type="week"',
                                    ),
                                    e.createElement('input', { type: 'week' }),
                                  ),
                                  e.createElement(
                                    'div',
                                    {
                                      style: {
                                        display: 'flex',
                                        alignItem: 'center',
                                      },
                                    },
                                    e.createElement(
                                      'div',
                                      { style: { width: 200 } },
                                      ' type="month"',
                                    ),
                                    e.createElement('input', { type: 'month' }),
                                  ),
                                  e.createElement(
                                    'div',
                                    {
                                      style: {
                                        display: 'flex',
                                        alignItem: 'datetime-local',
                                      },
                                    },
                                    e.createElement(
                                      'div',
                                      { style: { width: 200 } },
                                      ' type="datetime-local"',
                                    ),
                                    e.createElement('input', {
                                      type: 'datetime-local',
                                    }),
                                  ),
                                  e.createElement(
                                    'div',
                                    {
                                      style: {
                                        display: 'flex',
                                        alignItem: 'date',
                                      },
                                    },
                                    e.createElement(
                                      'div',
                                      { style: { width: 200 } },
                                      ' type="date"',
                                    ),
                                    e.createElement('input', { type: 'date' }),
                                  ),
                                  e.createElement(
                                    'div',
                                    {
                                      style: {
                                        display: 'flex',
                                        alignItem: 'submit',
                                      },
                                    },
                                    e.createElement(
                                      'div',
                                      { style: { width: 200 } },
                                      ' type="submit"',
                                    ),
                                    e.createElement('input', {
                                      type: 'submit',
                                    }),
                                  ),
                                  e.createElement(
                                    'div',
                                    {
                                      style: {
                                        display: 'flex',
                                        alignItem: 'reset',
                                      },
                                    },
                                    e.createElement(
                                      'div',
                                      { style: { width: 200 } },
                                      ' type="reset"',
                                    ),
                                    e.createElement('input', { type: 'reset' }),
                                  ),
                                  e.createElement(
                                    'div',
                                    {
                                      style: {
                                        display: 'flex',
                                        alignItem: 'range',
                                      },
                                    },
                                    e.createElement(
                                      'div',
                                      { style: { width: 200 } },
                                      ' type="range"',
                                    ),
                                    e.createElement('input', { type: 'range' }),
                                  ),
                                  e.createElement(
                                    'div',
                                    {
                                      style: {
                                        display: 'flex',
                                        alignItem: 'radio',
                                      },
                                    },
                                    e.createElement(
                                      'div',
                                      { style: { width: 200 } },
                                      ' type="radio"',
                                    ),
                                    e.createElement('input', { type: 'radio' }),
                                  ),
                                  e.createElement(
                                    'div',
                                    {
                                      style: {
                                        display: 'flex',
                                        alignItem: 'image',
                                      },
                                    },
                                    e.createElement(
                                      'div',
                                      { style: { width: 200 } },
                                      ' type="image"',
                                    ),
                                    e.createElement('input', { type: 'image' }),
                                  ),
                                  e.createElement(
                                    'div',
                                    {
                                      style: {
                                        display: 'flex',
                                        alignItem: 'hidden',
                                      },
                                    },
                                    e.createElement(
                                      'div',
                                      { style: { width: 200 } },
                                      ' type="hidden"',
                                    ),
                                    e.createElement('input', {
                                      type: 'hidden',
                                    }),
                                  ),
                                  e.createElement(
                                    'div',
                                    {
                                      style: {
                                        display: 'flex',
                                        alignItem: 'file',
                                      },
                                    },
                                    e.createElement(
                                      'div',
                                      { style: { width: 200 } },
                                      ' type="file"',
                                    ),
                                    e.createElement('input', { type: 'file' }),
                                  ),
                                  e.createElement(
                                    'div',
                                    {
                                      style: {
                                        display: 'flex',
                                        alignItem: 'color',
                                      },
                                    },
                                    e.createElement(
                                      'div',
                                      { style: { width: 200 } },
                                      ' type="color"',
                                    ),
                                    e.createElement('input', { type: 'color' }),
                                  ),
                                  e.createElement(
                                    'div',
                                    {
                                      style: {
                                        display: 'flex',
                                        alignItem: 'checkbox',
                                      },
                                    },
                                    e.createElement(
                                      'div',
                                      { style: { width: 200 } },
                                      ' type="checkbox"',
                                    ),
                                    e.createElement('input', {
                                      type: 'checkbox',
                                    }),
                                  ),
                                  e.createElement(
                                    'div',
                                    {
                                      style: {
                                        display: 'flex',
                                        alignItem: 'button',
                                      },
                                    },
                                    e.createElement(
                                      'div',
                                      { style: { width: 200 } },
                                      ' type="button"',
                                    ),
                                    e.createElement('input', {
                                      type: 'button',
                                    }),
                                  ),
                                );
                              },
                            });
                          case 1:
                          case 'end':
                            return n.stop();
                        }
                    }, i);
                  }),
                ),
              ),
            ),
            asset: {
              type: 'BLOCK',
              id: 'docs-error-demo-1',
              refAtomIds: [],
              dependencies: {
                'index.jsx': {
                  type: 'FILE',
                  value: `export default () => {
  return (
    <>
      <div style={{ display: 'flex', alignItem: 'center' }}>
        <div style={{ width: 200 }}> type="week"</div>
        <input type="week" />
      </div>
      <div style={{ display: 'flex', alignItem: 'center' }}>
        <div style={{ width: 200 }}> type="month"</div>
        <input type="month" />
      </div>
      <div style={{ display: 'flex', alignItem: 'datetime-local' }}>
        <div style={{ width: 200 }}> type="datetime-local"</div>
        <input type="datetime-local" />
      </div>
      <div style={{ display: 'flex', alignItem: 'date' }}>
        <div style={{ width: 200 }}> type="date"</div>
        <input type="date" />
      </div>
      <div style={{ display: 'flex', alignItem: 'submit' }}>
        <div style={{ width: 200 }}> type="submit"</div>
        <input type="submit" />
      </div>
      <div style={{ display: 'flex', alignItem: 'reset' }}>
        <div style={{ width: 200 }}> type="reset"</div>
        <input type="reset" />
      </div>
      <div style={{ display: 'flex', alignItem: 'range' }}>
        <div style={{ width: 200 }}> type="range"</div>
        <input type="range" />
      </div>
      <div style={{ display: 'flex', alignItem: 'radio' }}>
        <div style={{ width: 200 }}> type="radio"</div>
        <input type="radio" />
      </div>
      <div style={{ display: 'flex', alignItem: 'image' }}>
        <div style={{ width: 200 }}> type="image"</div>
        <input type="image" />
      </div>
      <div style={{ display: 'flex', alignItem: 'hidden' }}>
        <div style={{ width: 200 }}> type="hidden"</div>
        <input type="hidden" />
      </div>
      <div style={{ display: 'flex', alignItem: 'file' }}>
        <div style={{ width: 200 }}> type="file"</div>
        <input type="file" />
      </div>
      <div style={{ display: 'flex', alignItem: 'color' }}>
        <div style={{ width: 200 }}> type="color"</div>
        <input type="color" />
      </div>
      <div style={{ display: 'flex', alignItem: 'checkbox' }}>
        <div style={{ width: 200 }}> type="checkbox"</div>
        <input type="checkbox" />
      </div>
      <div style={{ display: 'flex', alignItem: 'button' }}>
        <div style={{ width: 200 }}> type="button"</div>
        <input type="button" />
      </div>
    </>
  );
};`,
                },
              },
              entry: 'index.jsx',
            },
            context: {},
            renderOpts: {
              compile: (function () {
                var i = s()(
                  r()().mark(function n() {
                    var d,
                      u = arguments;
                    return r()().wrap(function (a) {
                      for (;;)
                        switch ((a.prev = a.next)) {
                          case 0:
                            return (a.next = 2), t.e(93).then(t.bind(t, 14093));
                          case 2:
                            return a.abrupt(
                              'return',
                              (d = a.sent).default.apply(d, u),
                            );
                          case 3:
                          case 'end':
                            return a.stop();
                        }
                    }, n);
                  }),
                );
                function o() {
                  return i.apply(this, arguments);
                }
                return o;
              })(),
            },
          },
          'docs-error-demo-2': {
            component: e.memo(
              e.lazy(
                s()(
                  r()().mark(function i() {
                    return r()().wrap(function (n) {
                      for (;;)
                        switch ((n.prev = n.next)) {
                          case 0:
                            return n.abrupt('return', {
                              default: function () {
                                return e.createElement(
                                  e.Fragment,
                                  null,
                                  e.createElement('input', {
                                    placeholder:
                                      '\u7981\u6B62\u865A\u62DF\u952E\u76D8\u8F93\u5165',
                                    'data-vkb-disabled': !0,
                                  }),
                                );
                              },
                            });
                          case 1:
                          case 'end':
                            return n.stop();
                        }
                    }, i);
                  }),
                ),
              ),
            ),
            asset: {
              type: 'BLOCK',
              id: 'docs-error-demo-2',
              refAtomIds: [],
              dependencies: {
                'index.jsx': {
                  type: 'FILE',
                  value: `export default () => {
  return (
    <>
      <input placeholder="\u7981\u6B62\u865A\u62DF\u952E\u76D8\u8F93\u5165" data-vkb-disabled />
    </>
  );
};`,
                },
              },
              entry: 'index.jsx',
            },
            context: {},
            renderOpts: {
              compile: (function () {
                var i = s()(
                  r()().mark(function n() {
                    var d,
                      u = arguments;
                    return r()().wrap(function (a) {
                      for (;;)
                        switch ((a.prev = a.next)) {
                          case 0:
                            return (a.next = 2), t.e(93).then(t.bind(t, 14093));
                          case 2:
                            return a.abrupt(
                              'return',
                              (d = a.sent).default.apply(d, u),
                            );
                          case 3:
                          case 'end':
                            return a.stop();
                        }
                    }, n);
                  }),
                );
                function o() {
                  return i.apply(this, arguments);
                }
                return o;
              })(),
            },
          },
          'docs-error-demo-3': {
            component: e.memo(
              e.lazy(
                s()(
                  r()().mark(function i() {
                    return r()().wrap(function (n) {
                      for (;;)
                        switch ((n.prev = n.next)) {
                          case 0:
                            return n.abrupt('return', {
                              default: function () {
                                return e.createElement(
                                  e.Fragment,
                                  null,
                                  e.createElement('input', {
                                    placeholder:
                                      '\u7981\u6B62\u8F93\u5165\u90E8\u5206\u5185\u5BB9a, b, c',
                                    'data-vkb-not-input': ['a', 'b', 'c'],
                                  }),
                                );
                              },
                            });
                          case 1:
                          case 'end':
                            return n.stop();
                        }
                    }, i);
                  }),
                ),
              ),
            ),
            asset: {
              type: 'BLOCK',
              id: 'docs-error-demo-3',
              refAtomIds: [],
              dependencies: {
                'index.jsx': {
                  type: 'FILE',
                  value: `export default () => {
  return (
    <>
      <input
        placeholder="\u7981\u6B62\u8F93\u5165\u90E8\u5206\u5185\u5BB9a, b, c"
        data-vkb-not-input={['a', 'b', 'c']}
      />
    </>
  );
};`,
                },
              },
              entry: 'index.jsx',
            },
            context: {},
            renderOpts: {
              compile: (function () {
                var i = s()(
                  r()().mark(function n() {
                    var d,
                      u = arguments;
                    return r()().wrap(function (a) {
                      for (;;)
                        switch ((a.prev = a.next)) {
                          case 0:
                            return (a.next = 2), t.e(93).then(t.bind(t, 14093));
                          case 2:
                            return a.abrupt(
                              'return',
                              (d = a.sent).default.apply(d, u),
                            );
                          case 3:
                          case 'end':
                            return a.stop();
                        }
                    }, n);
                  }),
                );
                function o() {
                  return i.apply(this, arguments);
                }
                return o;
              })(),
            },
          },
        };
    },
    10137: function (v, l, t) {
      t.r(l),
        t.d(l, {
          demos: function () {
            return c;
          },
        });
      var y = t(75271),
        r = t(91836),
        c = {};
    },
    20295: function (v, l, t) {
      t.r(l),
        t.d(l, {
          demos: function () {
            return c;
          },
        });
      var y = t(75271),
        r = t(21486),
        c = {};
    },
    80894: function (v, l, t) {
      t.r(l),
        t.d(l, {
          texts: function () {
            return r;
          },
        });
      var y = t(30603);
      const r = [
        { value: 'type', paraId: 0 },
        { value: 'text', paraId: 0 },
        { value: 'search', paraId: 0 },
        { value: 'tel', paraId: 0 },
        { value: 'password', paraId: 0 },
        { value: 'datetime', paraId: 0 },
        { value: 'type', paraId: 0 },
        { value: 'selection', paraId: 0 },
        { value: 'type = ', paraId: 1, tocIndex: 2 },
        { value: 'number', paraId: 1, tocIndex: 2 },
        { value: ' | ', paraId: 1, tocIndex: 2 },
        { value: 'email', paraId: 1, tocIndex: 2 },
        { value: ' \u9020\u6210\u7684 ', paraId: 1, tocIndex: 2 },
        { value: 'selection', paraId: 1, tocIndex: 2 },
        { value: ' \u5F02\u5E38', paraId: 1, tocIndex: 2 },
        { value: 'type = ', paraId: 2, tocIndex: 2 },
        { value: 'number', paraId: 2, tocIndex: 2 },
        { value: ' \u53EF\u7528 data-vkb-type = ', paraId: 2, tocIndex: 2 },
        { value: 'number', paraId: 2, tocIndex: 2 },
        {
          value:
            ' \u4EE3\u66FF\uFF0C\u5C06\u7528\u6B63\u5219\u8FDB\u884C\u62E6\u622A\uFF0C',
          paraId: 2,
          tocIndex: 2,
        },
        { value: '/^[-+]?(\\d+)?(\\.)?(\\d+)?$/', paraId: 2, tocIndex: 2 },
        { value: 'type = ', paraId: 2, tocIndex: 2 },
        { value: 'email', paraId: 2, tocIndex: 2 },
        { value: ' \u53EF\u4EE5\u9ED8\u8BA4\u4E3A ', paraId: 2, tocIndex: 2 },
        { value: 'text', paraId: 2, tocIndex: 2 },
        {
          value: '\uFF0C\u6682\u672A\u5B9E\u73B0\u62E6\u622A',
          paraId: 2,
          tocIndex: 2,
        },
        { value: 'type', paraId: 0 },
        { value: 'week', paraId: 3, tocIndex: 3 },
        { value: 'month', paraId: 3, tocIndex: 3 },
        { value: 'time', paraId: 3, tocIndex: 3 },
        { value: 'datetime-local', paraId: 3, tocIndex: 3 },
        { value: 'date', paraId: 3, tocIndex: 3 },
        { value: 'submit', paraId: 3, tocIndex: 3 },
        { value: 'reset', paraId: 3, tocIndex: 3 },
        { value: 'range', paraId: 3, tocIndex: 3 },
        { value: 'radio', paraId: 3, tocIndex: 3 },
        { value: 'image', paraId: 3, tocIndex: 3 },
        { value: 'hidden', paraId: 3, tocIndex: 3 },
        { value: 'file', paraId: 3, tocIndex: 3 },
        { value: 'color', paraId: 3, tocIndex: 3 },
        { value: 'checkbox', paraId: 3, tocIndex: 3 },
        { value: 'button', paraId: 3, tocIndex: 3 },
        {
          value:
            '\u5B58\u5728\u9700\u6C42\uFF0C\u4E0D\u60F3\u89E6\u53D1\u865A\u62DF\u952E\u76D8\uFF0C\u7981\u6B62\u865A\u62DF\u952E\u76D8\u8F93\u5165\u65F6\uFF0C\u5728 ',
          paraId: 4,
          tocIndex: 4,
        },
        { value: 'input', paraId: 4, tocIndex: 4 },
        { value: ' \u4E0A\u52A0\u5165 ', paraId: 4, tocIndex: 4 },
        { value: 'data-vkb-disabled', paraId: 4, tocIndex: 4 },
        { value: ' \u5C5E\u6027\u53BB\u7981\u7528', paraId: 4, tocIndex: 4 },
        {
          value: '\u4F20\u5165\u7684\u503C\u5C06\u8F6C\u4E3A ',
          paraId: 4,
          tocIndex: 4,
        },
        { value: 'string', paraId: 4, tocIndex: 4 },
        { value: ' \u7C7B\u578B \uFF0C', paraId: 4, tocIndex: 4 },
        { value: 'true', paraId: 4, tocIndex: 4 },
        { value: ' => ', paraId: 4, tocIndex: 4 },
        { value: "'true'", paraId: 4, tocIndex: 4 },
        {
          value:
            '\u5B58\u5728\u9700\u6C42\uFF0C\u4E0D\u60F3\u8F93\u5165\u67D0\u4E9B\u5185\u5BB9\u65F6\uFF0C\u5728 ',
          paraId: 5,
          tocIndex: 5,
        },
        { value: 'input', paraId: 5, tocIndex: 5 },
        { value: ' \u4E0A\u52A0\u5165 ', paraId: 5, tocIndex: 5 },
        { value: 'data-vkb-not-input', paraId: 5, tocIndex: 5 },
        { value: ' \u5C5E\u6027\u53BB\u7981\u7528', paraId: 5, tocIndex: 5 },
        {
          value: '\u4F20\u5165\u7684\u503C\u5C06\u8F6C\u4E3A ',
          paraId: 5,
          tocIndex: 5,
        },
        { value: 'string', paraId: 5, tocIndex: 5 },
        { value: ' \u7C7B\u578B, ', paraId: 5, tocIndex: 5 },
        { value: "['a', 'b', 'c']", paraId: 5, tocIndex: 5 },
        { value: ' => ', paraId: 5, tocIndex: 5 },
        { value: 'a,b,c', paraId: 5, tocIndex: 5 },
        {
          value: '\u5728 vite \u9879\u76EE\u4E2D\u914D\u7F6E vite-plugin-svgr',
          paraId: 6,
          tocIndex: 6,
        },
        {
          value: `defineConfig({
  plugins: [
    // \u652F\u6301 import BottomSvg from './Bottom.svg?react' \u5199\u6CD5
    svgr(),
    // \u652F\u6301 import { ReactComponent as BottomSvg } from './Bottom.svg' \u5199\u6CD5
    svgr({
      svgrOptions: {
        exportType: 'named',
        ref: true,
        svgo: false,
        titleProp: true,
      },
      include: '**/*.svg',
    }),
  ],
});
`,
          paraId: 7,
          tocIndex: 6,
        },
      ];
    },
    59225: function (v, l, t) {
      t.r(l),
        t.d(l, {
          texts: function () {
            return r;
          },
        });
      var y = t(91836);
      const r = [];
    },
    85947: function (v, l, t) {
      t.r(l),
        t.d(l, {
          texts: function () {
            return r;
          },
        });
      var y = t(21486);
      const r = [
        {
          value: `# npm \u5305\u7BA1\u7406\u5668\r
npm install react-vitrual-keyboard\r
\r
# yarn \u5305\u7BA1\u7406\u5668\r
yarn install react-vitrual-keyboard\r
\r
# pnpm \u5305\u7BA1\u7406\u5668\r
pnpm install react-vitrual-keyboard
`,
          paraId: 0,
          tocIndex: 1,
        },
        {
          value: `import { useState } from 'react';\r
import { useVirtualKeyboard, keys } from 'react-virtual-keyboard';\r
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
        }}\r
      >\r
        <VirtualKeyboard />\r
      </VirtualKeyboardProvide>\r
    </>\r
  );\r
};
`,
          paraId: 1,
          tocIndex: 2,
        },
      ];
    },
  },
]);
