'use strict';
(self.webpackChunkreact_virtual_keyboard =
  self.webpackChunkreact_virtual_keyboard || []).push([
  [300],
  {
    75974: function (b, l, e) {
      e.r(l),
        e.d(l, {
          demos: function () {
            return k;
          },
        });
      var _ = e(90228),
        d = e.n(_),
        g = e(48305),
        f = e.n(g),
        M = e(87999),
        x = e.n(M),
        n = e(75271),
        T = e(58774),
        k = {
          'letterkeyboard-demo-0': {
            component: n.memo(
              n.lazy(
                x()(
                  d()().mark(function p() {
                    var I, c, r, v, s, a;
                    return d()().wrap(function (t) {
                      for (;;)
                        switch ((t.prev = t.next)) {
                          case 0:
                            return (
                              (t.next = 2),
                              Promise.resolve().then(e.t.bind(e, 75271, 19))
                            );
                          case 2:
                            return (
                              (I = t.sent),
                              (c = I.useState),
                              (t.next = 6),
                              Promise.resolve().then(e.bind(e, 39906))
                            );
                          case 6:
                            return (
                              (r = t.sent),
                              (v = r.LetterKeyboard),
                              (s = r.useInput),
                              (a = r.keys),
                              t.abrupt('return', {
                                default: function () {
                                  var E = c(''),
                                    m = f()(E, 2),
                                    y = m[0],
                                    C = m[1],
                                    o = s({
                                      defaultActiveKeyboard: a.letterType,
                                      onEnter: function () {
                                        console.log('\u56DE\u8F66\u4E86');
                                      },
                                    }),
                                    D = o.onClick,
                                    P = o.inputMode,
                                    K = o.inputValue,
                                    O = o.chinese,
                                    L = o.onChangeInputMode,
                                    A = o.onSelectChinese;
                                  return n.createElement(
                                    n.Fragment,
                                    null,
                                    n.createElement(
                                      'div',
                                      {
                                        style: {
                                          margin: '0 auto',
                                          textAlign: 'center',
                                        },
                                      },
                                      n.createElement('input', {
                                        placeholder:
                                          '\u53EF\u4F7F\u7528\u865A\u62DF\u952E\u76D8',
                                        value: y,
                                        onInput: function (u) {
                                          C(u.target.value);
                                        },
                                      }),
                                      'value: ',
                                      y,
                                    ),
                                    n.createElement(
                                      'div',
                                      {
                                        style: {
                                          width: 500,
                                          height: 320,
                                          margin: '0 auto',
                                        },
                                      },
                                      n.createElement(v, {
                                        inputValue: K,
                                        chinese: O,
                                        inputMode: P,
                                        onClick: D,
                                        onChangeInputMode: L,
                                        onSelectChinese: A,
                                        onMouseDown: function (u) {
                                          var i;
                                          u == null ||
                                            (i = u.preventDefault) === null ||
                                            i === void 0 ||
                                            i.call(u);
                                        },
                                      }),
                                    ),
                                  );
                                },
                              })
                            );
                          case 11:
                          case 'end':
                            return t.stop();
                        }
                    }, p);
                  }),
                ),
              ),
            ),
            asset: {
              type: 'BLOCK',
              id: 'letterkeyboard-demo-0',
              refAtomIds: ['LetterKeyboard'],
              dependencies: {
                'index.jsx': {
                  type: 'FILE',
                  value: `import { useState } from 'react';\r
import { LetterKeyboard, useInput, keys } from 'react-virtual-keyboard';\r
\r
export default () => {\r
  const [value, setValue] = useState('');\r
  const {\r
    onClick,\r
    inputMode,\r
    inputValue,\r
    chinese,\r
    onChangeInputMode,\r
    onSelectChinese,\r
  } = useInput({\r
    defaultActiveKeyboard: keys.letterType,\r
    onEnter: () => {\r
      console.log('\u56DE\u8F66\u4E86');\r
    },\r
  });\r
  return (\r
    <>\r
      <div style={{ margin: '0 auto', textAlign: 'center' }}>\r
        <input\r
          placeholder="\u53EF\u4F7F\u7528\u865A\u62DF\u952E\u76D8"\r
          value={value}\r
          onInput={(e) => {\r
            {\r
              /* console.log('value', e.target.value); */\r
            }\r
            setValue(e.target.value);\r
          }}\r
        />\r
        value: {value}\r
      </div>\r
      <div style={{ width: 500, height: 320, margin: '0 auto' }}>\r
        <LetterKeyboard\r
          inputValue={inputValue}\r
          chinese={chinese}\r
          inputMode={inputMode}\r
          onClick={onClick}\r
          onChangeInputMode={onChangeInputMode}\r
          onSelectChinese={onSelectChinese}\r
          onMouseDown={(e) => {\r
            // \u9632\u6B62\u5931\u53BB\u7126\u70B9\r
            e?.preventDefault?.();\r
          }}\r
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
                var p = x()(
                  d()().mark(function c() {
                    var r,
                      v = arguments;
                    return d()().wrap(function (a) {
                      for (;;)
                        switch ((a.prev = a.next)) {
                          case 0:
                            return (a.next = 2), e.e(93).then(e.bind(e, 14093));
                          case 2:
                            return a.abrupt(
                              'return',
                              (r = a.sent).default.apply(r, v),
                            );
                          case 3:
                          case 'end':
                            return a.stop();
                        }
                    }, c);
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
    82567: function (b, l, e) {
      e.r(l),
        e.d(l, {
          texts: function () {
            return d;
          },
        });
      var _ = e(58774);
      const d = [
        {
          value: '\u5E38\u7528\u7684\u5B57\u6BCD\u952E\u76D8',
          paraId: 0,
          tocIndex: 0,
        },
        { value: '\u5C5E\u6027', paraId: 1, tocIndex: 1 },
        { value: '\u8BF4\u660E', paraId: 1, tocIndex: 1 },
        { value: '\u7C7B\u578B', paraId: 1, tocIndex: 1 },
        { value: '\u9ED8\u8BA4\u503C', paraId: 1, tocIndex: 1 },
        { value: 'inputMode', paraId: 1, tocIndex: 1 },
        { value: '\u8F93\u5165\u6A21\u5F0F', paraId: 1, tocIndex: 1 },
        { value: 'zh | en', paraId: 1, tocIndex: 1 },
        { value: 'en', paraId: 1, tocIndex: 1 },
        { value: 'inputValue', paraId: 1, tocIndex: 1 },
        { value: '\u8F93\u5165\u7684\u503C', paraId: 1, tocIndex: 1 },
        { value: 'string', paraId: 1, tocIndex: 1 },
        { value: "''", paraId: 1, tocIndex: 1 },
        { value: 'chinese', paraId: 1, tocIndex: 1 },
        {
          value:
            '\u4E2D\u6587\u8F93\u5165\u72B6\u6001\u83B7\u5F97\u7684\u7ED3\u679C',
          paraId: 1,
          tocIndex: 1,
        },
        { value: 'string[]', paraId: 1, tocIndex: 1 },
        { value: '[]', paraId: 1, tocIndex: 1 },
        { value: '\u65B9\u6CD5', paraId: 2, tocIndex: 2 },
        { value: '\u8BF4\u660E', paraId: 2, tocIndex: 2 },
        { value: '\u7C7B\u578B', paraId: 2, tocIndex: 2 },
        { value: '\u9ED8\u8BA4\u503C', paraId: 2, tocIndex: 2 },
        { value: 'onClick', paraId: 2, tocIndex: 2 },
        { value: '\u70B9\u51FB\u4E8B\u4EF6', paraId: 2, tocIndex: 2 },
        {
          value: '(e: VKB.KeyboardAttributeType) => void',
          paraId: 2,
          tocIndex: 2,
        },
        { value: '-', paraId: 2, tocIndex: 2 },
        { value: 'onChangeInputMode', paraId: 2, tocIndex: 2 },
        {
          value: '\u6539\u53D8\u8F93\u5165\u6A21\u5F0F',
          paraId: 2,
          tocIndex: 2,
        },
        { value: "(mode:'zh' | 'en')=>void", paraId: 2, tocIndex: 2 },
        { value: '-', paraId: 2, tocIndex: 2 },
        { value: 'onMouseDown', paraId: 2, tocIndex: 2 },
        {
          value:
            '\u9F20\u6807\u6309\u4E0B\u4E8B\u4EF6,\u5982\u679C\u4E0D\u60F3\u5931\u53BB\u8F93\u5165\u6846\u7684\u7126\u70B9\uFF0C\u5E94\u8BE5\u5B9E\u73B0\u8BE5\u65B9\u6CD5\uFF0C\u5E76\u963B\u6B62\u9ED8\u8BA4\u4E8B\u4EF6',
          paraId: 2,
          tocIndex: 2,
        },
        {
          value: '(e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void',
          paraId: 2,
          tocIndex: 2,
        },
        { value: '-', paraId: 2, tocIndex: 2 },
        { value: 'onChangeInputMode', paraId: 2, tocIndex: 2 },
        {
          value: '\u6539\u53D8\u8F93\u5165\u6A21\u5F0F',
          paraId: 2,
          tocIndex: 2,
        },
        { value: "(mode:'zh'|'en')=>void", paraId: 2, tocIndex: 2 },
        { value: '-', paraId: 2, tocIndex: 2 },
        { value: 'onSelectChinese', paraId: 2, tocIndex: 2 },
        { value: '\u9009\u62E9\u7684\u4E2D\u6587', paraId: 2, tocIndex: 2 },
        { value: '(chinese:string)=>void', paraId: 2, tocIndex: 2 },
        { value: '-', paraId: 2, tocIndex: 2 },
        { value: 'token', paraId: 3, tocIndex: 3 },
        { value: '\u8BF4\u660E', paraId: 3, tocIndex: 3 },
        { value: '\u7C7B\u578B', paraId: 3, tocIndex: 3 },
        { value: '\u9ED8\u8BA4\u503C', paraId: 3, tocIndex: 3 },
        { value: '--vkb-key-gap', paraId: 3, tocIndex: 3 },
        { value: '\u95F4\u9694', paraId: 3, tocIndex: 3 },
        { value: 'string', paraId: 3, tocIndex: 3 },
        { value: '6px', paraId: 3, tocIndex: 3 },
        { value: '--vkb-key-border-width', paraId: 3, tocIndex: 3 },
        {
          value: '\u6309\u952E\u8FB9\u6846\u7EBF\u5BBD\u5EA6',
          paraId: 3,
          tocIndex: 3,
        },
        { value: 'string', paraId: 3, tocIndex: 3 },
        { value: '1px', paraId: 3, tocIndex: 3 },
        { value: '--vkb-keyboard-svg-size', paraId: 3, tocIndex: 3 },
        { value: '\u5185\u90E8 ', paraId: 3, tocIndex: 3 },
        { value: 'svg', paraId: 3, tocIndex: 3 },
        { value: ' \u5927\u5C0F', paraId: 3, tocIndex: 3 },
        { value: 'string', paraId: 3, tocIndex: 3 },
        { value: '26px', paraId: 3, tocIndex: 3 },
        { value: '--vkb-key-shadow-width', paraId: 3, tocIndex: 3 },
        { value: '\u6309\u952E ', paraId: 3, tocIndex: 3 },
        { value: 'shadow', paraId: 3, tocIndex: 3 },
        { value: ' \u5BBD\u5EA6', paraId: 3, tocIndex: 3 },
        { value: 'string', paraId: 3, tocIndex: 3 },
        { value: '4px', paraId: 3, tocIndex: 3 },
        { value: '--vkb-key-borer-radius', paraId: 3, tocIndex: 3 },
        { value: '\u6309\u952E\u5706\u89D2', paraId: 3, tocIndex: 3 },
        { value: 'string', paraId: 3, tocIndex: 3 },
        { value: '4px', paraId: 3, tocIndex: 3 },
        { value: '--vkb-key-background', paraId: 3, tocIndex: 3 },
        { value: '\u6309\u952E\u80CC\u666F\u8272', paraId: 3, tocIndex: 3 },
        { value: 'string', paraId: 3, tocIndex: 3 },
        { value: '#ffffff', paraId: 3, tocIndex: 3 },
        { value: '--vkb-key-border-color', paraId: 3, tocIndex: 3 },
        {
          value: '\u6309\u952E\u8FB9\u6846\u989C\u8272',
          paraId: 3,
          tocIndex: 3,
        },
        { value: 'string', paraId: 3, tocIndex: 3 },
        { value: '#f0f0f0', paraId: 3, tocIndex: 3 },
        { value: '--vkb-key-shadow-color', paraId: 3, tocIndex: 3 },
        { value: '\u6309\u952E shadow \u989C\u8272', paraId: 3, tocIndex: 3 },
        { value: 'string', paraId: 3, tocIndex: 3 },
        { value: '#f0f0f0', paraId: 3, tocIndex: 3 },
        { value: '--vkb-key-active-font-color', paraId: 3, tocIndex: 3 },
        {
          value: '\u6309\u952E\u6D3B\u52A8\u5B57\u4F53\u989C\u8272',
          paraId: 3,
          tocIndex: 3,
        },
        { value: 'string', paraId: 3, tocIndex: 3 },
        { value: '#1677ff', paraId: 3, tocIndex: 3 },
        { value: '--vkb-key-active-background', paraId: 3, tocIndex: 3 },
        {
          value: '\u6309\u952E\u80CC\u6D3B\u52A8\u666F\u8272',
          paraId: 3,
          tocIndex: 3,
        },
        { value: 'string', paraId: 3, tocIndex: 3 },
        { value: '#dce1e7', paraId: 3, tocIndex: 3 },
        { value: '--vkb-key-active-shadow-color', paraId: 3, tocIndex: 3 },
        { value: '\u6309\u952E\u6D3B\u52A8 shadow', paraId: 3, tocIndex: 3 },
        { value: 'string', paraId: 3, tocIndex: 3 },
        { value: '#dce1e7', paraId: 3, tocIndex: 3 },
        { value: '--vkb-key-active-border-color', paraId: 3, tocIndex: 3 },
        {
          value: '\u6309\u952E\u6D3B\u52A8\u8FB9\u6846\u989C\u8272',
          paraId: 3,
          tocIndex: 3,
        },
        { value: 'string', paraId: 3, tocIndex: 3 },
        { value: '#dce1e7', paraId: 3, tocIndex: 3 },
        { value: '--vkb-key-color', paraId: 3, tocIndex: 3 },
        {
          value: '\u6309\u952E\u5B57\u4F53\u989C\u8272',
          paraId: 3,
          tocIndex: 3,
        },
        { value: 'string', paraId: 3, tocIndex: 3 },
        { value: '#000', paraId: 3, tocIndex: 3 },
      ];
    },
  },
]);
