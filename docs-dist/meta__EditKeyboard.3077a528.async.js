'use strict';
(self.webpackChunkreact_virtual_keyboard =
  self.webpackChunkreact_virtual_keyboard || []).push([
  [397],
  {
    65612: function (p, t, e) {
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
        y = e(41654),
        s = {
          'editkeyboard-demo-0': {
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
                              (l = o.EditKeyboard),
                              a.abrupt('return', {
                                default: function () {
                                  var d = function (x) {
                                    console.log('EditKeyboard e: ', x);
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
              id: 'editkeyboard-demo-0',
              refAtomIds: ['EditKeyboard'],
              dependencies: {
                'index.jsx': {
                  type: 'FILE',
                  value: `import { EditKeyboard } from 'react-virtual-keyboard';\r
\r
export default () => {\r
  const onClick = (e) => {\r
    console.log('EditKeyboard e: ', e);\r
  };\r
  return (\r
    <div style={{ width: 500, height: 320, margin: '0 auto' }}>\r
      <EditKeyboard onClick={onClick} />\r
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
    7390: function (p, t, e) {
      e.r(t),
        e.d(t, {
          texts: function () {
            return r;
          },
        });
      var c = e(41654);
      const r = [
        {
          value: '\u5E38\u7528\u7684\u7F16\u8F91\u952E\u76D8',
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
