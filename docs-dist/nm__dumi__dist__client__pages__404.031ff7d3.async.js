'use strict';
(self.webpackChunkreact_virtual_keyboard =
  self.webpackChunkreact_virtual_keyboard || []).push([
  [65],
  {
    32009: function (o, r, e) {
      e.r(r),
        e.d(r, {
          default: function () {
            return d;
          },
        });
      var a = e(95269),
        t = e(75271),
        l = function () {
          var n = (0, a.YB)(),
            u = (0, a.bU)();
          return t.createElement(
            'div',
            { className: 'dumi-default-not-found' },
            t.createElement('h1', null, n.formatMessage({ id: '404.title' })),
            t.createElement(
              a.rU,
              { to: 'base' in u ? u.base : '/', replace: !0 },
              n.formatMessage({ id: '404.back' }),
              ' \u2192',
            ),
          );
        },
        d = l;
    },
  },
]);
