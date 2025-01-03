'use strict';
(self.webpackChunkreact_virtual_keyboard =
  self.webpackChunkreact_virtual_keyboard || []).push([
  [605],
  {
    36944: function (v, n, e) {
      e.r(n),
        e.d(n, {
          demos: function () {
            return _;
          },
        });
      var c = e(90228),
        r = e.n(c),
        i = e(87999),
        p = e.n(i),
        d = e(75271),
        x = e(68888),
        _ = {
          'dragblock-demo-0': {
            component: d.memo(
              d.lazy(
                p()(
                  r()().mark(function u() {
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
                              (l = o.DragBlock),
                              a.abrupt('return', {
                                default: function () {
                                  return d.createElement(
                                    d.Fragment,
                                    null,
                                    d.createElement(
                                      'div',
                                      null,
                                      ' \u53EF\u4EE5\u5C1D\u8BD5\u62D6\u52A8\u65C1\u8FB9\u7684\u7C89\u8272\u5757 ',
                                    ),
                                    d.createElement(
                                      l,
                                      null,
                                      d.createElement('div', {
                                        style: {
                                          width: 100,
                                          height: 100,
                                          background: 'pink',
                                        },
                                      }),
                                    ),
                                  );
                                },
                              })
                            );
                          case 5:
                          case 'end':
                            return a.stop();
                        }
                    }, u);
                  }),
                ),
              ),
            ),
            asset: {
              type: 'BLOCK',
              id: 'dragblock-demo-0',
              refAtomIds: ['DragBlock'],
              dependencies: {
                'index.jsx': {
                  type: 'FILE',
                  value: `import { DragBlock } from 'react-virtual-keyboard';\r
\r
export default () => {\r
  return (\r
    <>\r
      <div> \u53EF\u4EE5\u5C1D\u8BD5\u62D6\u52A8\u65C1\u8FB9\u7684\u7C89\u8272\u5757 </div>\r
      <DragBlock>\r
        {/* <WriteKeyboard onClick={onClick} /> */}\r
\r
        <div style={{ width: 100, height: 100, background: 'pink' }}></div>\r
      </DragBlock>\r
    </>\r
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
                var u = p()(
                  r()().mark(function l() {
                    var I,
                      a = arguments;
                    return r()().wrap(function (t) {
                      for (;;)
                        switch ((t.prev = t.next)) {
                          case 0:
                            return (t.next = 2), e.e(93).then(e.bind(e, 14093));
                          case 2:
                            return t.abrupt(
                              'return',
                              (I = t.sent).default.apply(I, a),
                            );
                          case 3:
                          case 'end':
                            return t.stop();
                        }
                    }, l);
                  }),
                );
                function o() {
                  return u.apply(this, arguments);
                }
                return o;
              })(),
            },
          },
        };
    },
    43366: function (v, n, e) {
      e.r(n),
        e.d(n, {
          texts: function () {
            return r;
          },
        });
      var c = e(68888);
      const r = [
        { value: '\u652F\u6301\u62D6\u52A8', paraId: 0, tocIndex: 0 },
        { value: '\u5C5E\u6027', paraId: 1, tocIndex: 1 },
        { value: '\u8BF4\u660E', paraId: 1, tocIndex: 1 },
        { value: '\u7C7B\u578B', paraId: 1, tocIndex: 1 },
        { value: '\u9ED8\u8BA4\u503C', paraId: 1, tocIndex: 1 },
        { value: 'init', paraId: 1, tocIndex: 1 },
        {
          value: '\u7528\u4E8E\u8BA1\u7B97\u521D\u59CB\u4F4D\u7F6E\uFF0C',
          paraId: 1,
          tocIndex: 1,
        },
        { value: '{ width: string; height: string }', paraId: 1, tocIndex: 1 },
        { value: 'undefined', paraId: 1, tocIndex: 1 },
        { value: 'resizeOverRight', paraId: 1, tocIndex: 1 },
        {
          value: '\u7A97\u53E3\u6539\u53D8\u65F6\u81EA\u52A8\u9760\u53F3',
          paraId: 1,
          tocIndex: 1,
        },
        { value: 'boolean', paraId: 1, tocIndex: 1 },
        { value: 'false', paraId: 1, tocIndex: 1 },
        { value: 'autoKeepRightDelay', paraId: 1, tocIndex: 1 },
        {
          value:
            '\u65E0\u64CD\u4F5C\u540E\uFF0C\u591A\u5C11\u6BEB\u79D2\u81EA\u52A8\u9760\u53F3',
          paraId: 1,
          tocIndex: 1,
        },
        { value: 'number', paraId: 1, tocIndex: 1 },
        { value: '3000', paraId: 1, tocIndex: 1 },
        { value: 'autoKeepRight', paraId: 1, tocIndex: 1 },
        { value: '\u81EA\u52A8\u9760\u53F3', paraId: 1, tocIndex: 1 },
        { value: 'boolean', paraId: 1, tocIndex: 1 },
        { value: 'true', paraId: 1, tocIndex: 1 },
        { value: 'delay', paraId: 1, tocIndex: 1 },
        {
          value:
            '\u9F20\u6807\u70B9\u51FB\u5EF6\u8FDF\uFF0C\u7528\u4E8E\u89E3\u51B3 mousedown \u548C click \u51B2\u7A81',
          paraId: 1,
          tocIndex: 1,
        },
        { value: 'number', paraId: 1, tocIndex: 1 },
        { value: '280', paraId: 1, tocIndex: 1 },
        { value: 'zIndex', paraId: 1, tocIndex: 1 },
        { value: '\u663E\u793A\u5C42\u7EA7', paraId: 1, tocIndex: 1 },
        { value: 'number', paraId: 1, tocIndex: 1 },
        { value: '9999', paraId: 1, tocIndex: 1 },
        { value: 'children', paraId: 1, tocIndex: 1 },
        { value: '\u5B50\u8282\u70B9', paraId: 1, tocIndex: 1 },
        { value: 'ReactNode', paraId: 1, tocIndex: 1 },
        { value: 'undefined', paraId: 1, tocIndex: 1 },
        { value: 'style', paraId: 1, tocIndex: 1 },
        {
          value: '\u5916\u90E8\u4F20\u5165\u7684\u6837\u5F0F',
          paraId: 1,
          tocIndex: 1,
        },
        { value: 'CSSProperties', paraId: 1, tocIndex: 1 },
        { value: 'undefined', paraId: 1, tocIndex: 1 },
        { value: 'positionMode', paraId: 1, tocIndex: 1 },
        {
          value: '\u7EC4\u5408\u952E\u76D8\u7684\u4F4D\u7F6E\u6A21\u5F0F',
          paraId: 1,
          tocIndex: 1,
        },
        {
          value: 'fixedBottom| fixedTop | fixedLeft | fixedRight | float',
          paraId: 1,
          tocIndex: 1,
        },
        { value: 'float', paraId: 1, tocIndex: 1 },
        { value: '\u65B9\u6CD5', paraId: 2, tocIndex: 2 },
        { value: '\u8BF4\u660E', paraId: 2, tocIndex: 2 },
        { value: '\u7C7B\u578B', paraId: 2, tocIndex: 2 },
        { value: '\u9ED8\u8BA4\u503C', paraId: 2, tocIndex: 2 },
        { value: 'onClick', paraId: 2, tocIndex: 2 },
        { value: '\u70B9\u51FB\u4E8B\u4EF6', paraId: 2, tocIndex: 2 },
        { value: '() => void', paraId: 2, tocIndex: 2 },
        { value: '-', paraId: 2, tocIndex: 2 },
        { value: 'token', paraId: 3, tocIndex: 3 },
        { value: '\u8BF4\u660E', paraId: 3, tocIndex: 3 },
        { value: '\u7C7B\u578B', paraId: 3, tocIndex: 3 },
        { value: '\u9ED8\u8BA4\u503C', paraId: 3, tocIndex: 3 },
        { value: '-', paraId: 3, tocIndex: 3 },
        { value: '-', paraId: 3, tocIndex: 3 },
        { value: '-', paraId: 3, tocIndex: 3 },
        { value: '-', paraId: 3, tocIndex: 3 },
      ];
    },
  },
]);
