'use strict';
(self.webpackChunkreact_virtual_keyboard =
  self.webpackChunkreact_virtual_keyboard || []).push([
  [211],
  {
    7594: function (p, t, e) {
      e.r(t),
        e.d(t, {
          demos: function () {
            return s;
          },
        });
      var c = e(90228),
        r = e.n(c),
        i = e(87999),
        v = e.n(i),
        n = e(75271),
        y = e(36328),
        s = {
          'writekeyboard-demo-0': {
            component: n.memo(
              n.lazy(
                v()(
                  r()().mark(function I() {
                    var o, l;
                    return r()().wrap(function (a) {
                      for (;;)
                        switch ((a.prev = a.next)) {
                          case 0:
                            return (
                              (a.next = 2),
                              Promise.resolve().then(e.bind(e, 39906))
                            );
                          case 2:
                            return (
                              (o = a.sent),
                              (l = o.WriteKeyboard),
                              a.abrupt('return', {
                                default: function () {
                                  var d = function (x) {
                                    console.log('WriteKeyboard e: ', x);
                                  };
                                  return n.createElement(
                                    'div',
                                    {
                                      style: {
                                        width: 500,
                                        height: 320,
                                        margin: '0 auto',
                                      },
                                    },
                                    n.createElement(l, { onClick: d }),
                                  );
                                },
                              })
                            );
                          case 5:
                          case 'end':
                            return a.stop();
                        }
                    }, I);
                  }),
                ),
              ),
            ),
            asset: {
              type: 'BLOCK',
              id: 'writekeyboard-demo-0',
              refAtomIds: ['WriteKeyboard'],
              dependencies: {
                'index.jsx': {
                  type: 'FILE',
                  value: `import { WriteKeyboard } from 'react-virtual-keyboard';\r
\r
export default () => {\r
  const onClick = (e) => {\r
    console.log('WriteKeyboard e: ', e);\r
  };\r
  return (\r
    <div style={{ width: 500, height: 320, margin: '0 auto' }}>\r
      <WriteKeyboard onClick={onClick} />\r
    </div>\r
  );\r
};`,
                },
                'react-virtual-keyboard': { type: 'NPM', value: '0.0.1' },
              },
              entry: 'index.jsx',
            },
            context: { 'react-virtual-keyboard': e(39906) },
            renderOpts: {
              compile: (function () {
                var I = v()(
                  r()().mark(function l() {
                    var u,
                      a = arguments;
                    return r()().wrap(function (d) {
                      for (;;)
                        switch ((d.prev = d.next)) {
                          case 0:
                            return (d.next = 2), e.e(93).then(e.bind(e, 14093));
                          case 2:
                            return d.abrupt(
                              'return',
                              (u = d.sent).default.apply(u, a),
                            );
                          case 3:
                          case 'end':
                            return d.stop();
                        }
                    }, l);
                  }),
                );
                function o() {
                  return I.apply(this, arguments);
                }
                return o;
              })(),
            },
          },
        };
    },
    96301: function (p, t, e) {
      e.r(t),
        e.d(t, {
          texts: function () {
            return r;
          },
        });
      var c = e(36328);
      const r = [
        {
          value:
            '\u624B\u5199\u8BC6\u522B\uFF0C\u6682\u672A\u5B8C\u6210\uFF0C\u8BF7\u7B49\u5F85',
          paraId: 0,
          tocIndex: 0,
        },
        { value: '\u6216', paraId: 1, tocIndex: 0 },
        {
          value:
            '\u5C06\u4E66\u5199\u7684\u56FE\u7247\u8FDB\u884C\u5BFC\u51FA\uFF0C\u91C7\u7528\u7B2C\u4E09\u65B9\u8FDB\u884C\u8BC6\u522B...',
          paraId: 2,
          tocIndex: 0,
        },
        { value: '\u5C5E\u6027', paraId: 3, tocIndex: 1 },
        { value: '\u8BF4\u660E', paraId: 3, tocIndex: 1 },
        { value: '\u7C7B\u578B', paraId: 3, tocIndex: 1 },
        { value: '\u9ED8\u8BA4\u503C', paraId: 3, tocIndex: 1 },
        { value: '-', paraId: 3, tocIndex: 1 },
        { value: '-', paraId: 3, tocIndex: 1 },
        { value: '-', paraId: 3, tocIndex: 1 },
        { value: '-', paraId: 3, tocIndex: 1 },
        { value: '\u65B9\u6CD5', paraId: 4, tocIndex: 2 },
        { value: '\u8BF4\u660E', paraId: 4, tocIndex: 2 },
        { value: '\u7C7B\u578B', paraId: 4, tocIndex: 2 },
        { value: '\u9ED8\u8BA4\u503C', paraId: 4, tocIndex: 2 },
        { value: 'onClick', paraId: 4, tocIndex: 2 },
        { value: '\u70B9\u51FB\u4E8B\u4EF6', paraId: 4, tocIndex: 2 },
        {
          value: '(e: VKB.KeyboardAttributeType) => void',
          paraId: 4,
          tocIndex: 2,
        },
        { value: '-', paraId: 4, tocIndex: 2 },
        { value: 'token', paraId: 5, tocIndex: 3 },
        { value: '\u8BF4\u660E', paraId: 5, tocIndex: 3 },
        { value: '\u7C7B\u578B', paraId: 5, tocIndex: 3 },
        { value: '\u9ED8\u8BA4\u503C', paraId: 5, tocIndex: 3 },
        { value: '--vkb-key-gap', paraId: 5, tocIndex: 3 },
        { value: '\u95F4\u9694', paraId: 5, tocIndex: 3 },
        { value: 'string', paraId: 5, tocIndex: 3 },
        { value: '6px', paraId: 5, tocIndex: 3 },
        { value: '--vkb-key-border-width', paraId: 5, tocIndex: 3 },
        {
          value: '\u6309\u952E\u8FB9\u6846\u7EBF\u5BBD\u5EA6',
          paraId: 5,
          tocIndex: 3,
        },
        { value: 'string', paraId: 5, tocIndex: 3 },
        { value: '1px', paraId: 5, tocIndex: 3 },
        { value: '--vkb-keyboard-svg-size', paraId: 5, tocIndex: 3 },
        { value: '\u5185\u90E8 svg \u5927\u5C0F', paraId: 5, tocIndex: 3 },
        { value: 'string', paraId: 5, tocIndex: 3 },
        { value: '26px', paraId: 5, tocIndex: 3 },
        { value: '--vkb-key-shadow-width', paraId: 5, tocIndex: 3 },
        { value: '\u6309\u952E shadow \u5BBD\u5EA6', paraId: 5, tocIndex: 3 },
        { value: 'string', paraId: 5, tocIndex: 3 },
        { value: '4px', paraId: 5, tocIndex: 3 },
        { value: '--vkb-key-borer-radius', paraId: 5, tocIndex: 3 },
        { value: '\u6309\u952E\u5706\u89D2', paraId: 5, tocIndex: 3 },
        { value: 'string', paraId: 5, tocIndex: 3 },
        { value: '4px', paraId: 5, tocIndex: 3 },
        { value: '--vkb-key-background', paraId: 5, tocIndex: 3 },
        { value: '\u6309\u952E\u80CC\u666F\u8272', paraId: 5, tocIndex: 3 },
        { value: 'string', paraId: 5, tocIndex: 3 },
        { value: '#ffffff', paraId: 5, tocIndex: 3 },
        { value: '--vkb-key-border-color', paraId: 5, tocIndex: 3 },
        {
          value: '\u6309\u952E\u8FB9\u6846\u989C\u8272',
          paraId: 5,
          tocIndex: 3,
        },
        { value: 'string', paraId: 5, tocIndex: 3 },
        { value: '#f0f0f0', paraId: 5, tocIndex: 3 },
        { value: '--vkb-key-shadow-color', paraId: 5, tocIndex: 3 },
        { value: '\u6309\u952E shadow \u989C\u8272', paraId: 5, tocIndex: 3 },
        { value: 'string', paraId: 5, tocIndex: 3 },
        { value: '#f0f0f0', paraId: 5, tocIndex: 3 },
        { value: '--vkb-key-active-font-color', paraId: 5, tocIndex: 3 },
        {
          value: '\u6309\u952E\u6D3B\u52A8\u5B57\u4F53\u989C\u8272',
          paraId: 5,
          tocIndex: 3,
        },
        { value: 'string', paraId: 5, tocIndex: 3 },
        { value: '#1677ff', paraId: 5, tocIndex: 3 },
        { value: '--vkb-key-active-background', paraId: 5, tocIndex: 3 },
        {
          value: '\u6309\u952E\u80CC\u6D3B\u52A8\u666F\u8272',
          paraId: 5,
          tocIndex: 3,
        },
        { value: 'string', paraId: 5, tocIndex: 3 },
        { value: '#dce1e7', paraId: 5, tocIndex: 3 },
        { value: '--vkb-key-active-shadow-color', paraId: 5, tocIndex: 3 },
        { value: '\u6309\u952E\u6D3B\u52A8 shadow', paraId: 5, tocIndex: 3 },
        { value: 'string', paraId: 5, tocIndex: 3 },
        { value: '#dce1e7', paraId: 5, tocIndex: 3 },
        { value: '--vkb-key-active-border-color', paraId: 5, tocIndex: 3 },
        {
          value: '\u6309\u952E\u6D3B\u52A8\u8FB9\u6846\u989C\u8272',
          paraId: 5,
          tocIndex: 3,
        },
        { value: 'string', paraId: 5, tocIndex: 3 },
        { value: '#dce1e7', paraId: 5, tocIndex: 3 },
      ];
    },
  },
]);
