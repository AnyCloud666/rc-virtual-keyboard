'use strict';
(self.webpackChunkreact_virtual_keyboard =
  self.webpackChunkreact_virtual_keyboard || []).push([
  [655],
  {
    20568: function (p, t, e) {
      e.r(t),
        e.d(t, {
          demos: function () {
            return i;
          },
        });
      var c = e(90228),
        d = e.n(c),
        s = e(87999),
        v = e.n(s),
        n = e(75271),
        b = e(45613),
        i = {
          'numberkeyboard-demo-0': {
            component: n.memo(
              n.lazy(
                v()(
                  d()().mark(function l() {
                    var o, u;
                    return d()().wrap(function (a) {
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
                              (u = o.NumberKeyboard),
                              a.abrupt('return', {
                                default: function () {
                                  var r = function (x) {
                                    console.log('NumberKeyboard e: ', x);
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
                                    n.createElement(u, { onClick: r }),
                                  );
                                },
                              })
                            );
                          case 5:
                          case 'end':
                            return a.stop();
                        }
                    }, l);
                  }),
                ),
              ),
            ),
            asset: {
              type: 'BLOCK',
              id: 'numberkeyboard-demo-0',
              refAtomIds: ['NumberKeyboard'],
              dependencies: {
                'index.jsx': {
                  type: 'FILE',
                  value: `import { NumberKeyboard } from 'react-virtual-keyboard';\r
\r
export default () => {\r
  const onClick = (e) => {\r
    console.log('NumberKeyboard e: ', e);\r
  };\r
  return (\r
    <div style={{ width: 500, height: 320, margin: '0 auto' }}>\r
      <NumberKeyboard onClick={onClick} />\r
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
                var l = v()(
                  d()().mark(function u() {
                    var I,
                      a = arguments;
                    return d()().wrap(function (r) {
                      for (;;)
                        switch ((r.prev = r.next)) {
                          case 0:
                            return (r.next = 2), e.e(93).then(e.bind(e, 14093));
                          case 2:
                            return r.abrupt(
                              'return',
                              (I = r.sent).default.apply(I, a),
                            );
                          case 3:
                          case 'end':
                            return r.stop();
                        }
                    }, u);
                  }),
                );
                function o() {
                  return l.apply(this, arguments);
                }
                return o;
              })(),
            },
          },
        };
    },
    37784: function (p, t, e) {
      e.r(t),
        e.d(t, {
          texts: function () {
            return d;
          },
        });
      var c = e(45613);
      const d = [
        {
          value: '\u5E38\u7528\u7684\u6570\u5B57\u952E\u76D8',
          paraId: 0,
          tocIndex: 0,
        },
        { value: '\u5C5E\u6027', paraId: 1, tocIndex: 1 },
        { value: '\u8BF4\u660E', paraId: 1, tocIndex: 1 },
        { value: '\u7C7B\u578B', paraId: 1, tocIndex: 1 },
        { value: '\u9ED8\u8BA4\u503C', paraId: 1, tocIndex: 1 },
        { value: '-', paraId: 1, tocIndex: 1 },
        { value: '-', paraId: 1, tocIndex: 1 },
        { value: '-', paraId: 1, tocIndex: 1 },
        { value: '-', paraId: 1, tocIndex: 1 },
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
        { value: '\u5185\u90E8 svg \u5927\u5C0F', paraId: 3, tocIndex: 3 },
        { value: 'string', paraId: 3, tocIndex: 3 },
        { value: '26px', paraId: 3, tocIndex: 3 },
        { value: '--vkb-key-shadow-width', paraId: 3, tocIndex: 3 },
        { value: '\u6309\u952E shadow \u5BBD\u5EA6', paraId: 3, tocIndex: 3 },
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
      ];
    },
  },
]);
