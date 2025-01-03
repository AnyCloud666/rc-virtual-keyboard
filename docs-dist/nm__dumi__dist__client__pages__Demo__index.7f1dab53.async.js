'use strict';
(self.webpackChunkreact_virtual_keyboard =
  self.webpackChunkreact_virtual_keyboard || []).push([
  [9],
  {
    58434: function (y, s, e) {
      e.r(s),
        e.d(s, {
          default: function () {
            return E;
          },
        });
      var o = e(95269),
        r = e(75271),
        D = e(93046),
        g = function () {
          var O = (0, o.UO)(),
            t = O.id,
            a = (0, o.FO)(t),
            R = (0, D.m)({
              id: t,
              component: a.component,
              renderOpts: a.renderOpts,
            }),
            h = R.canvasRef,
            v = a || {},
            m = v.component,
            d = v.renderOpts,
            n = (0, o.kw)(t),
            u = n.node,
            c = n.setSource,
            i = n.error,
            l = n.loading,
            w =
              u ||
              (d != null && d.renderer
                ? (0, r.createElement)('div', { ref: h })
                : m && (0, r.createElement)(m));
          return (
            (0, r.useEffect)(
              function () {
                var f = function (p) {
                  p.data.type === 'dumi.liveDemo.setSource' && c(p.data.value);
                };
                return (
                  window.addEventListener('message', f),
                  function () {
                    return window.removeEventListener('message', f);
                  }
                );
              },
              [c],
            ),
            (0, r.useEffect)(
              function () {
                !l &&
                  (i || u) &&
                  window.postMessage({
                    type: 'dumi.liveDemo.compileDone',
                    value: { err: i },
                  });
              },
              [i, u, l],
            ),
            w
          );
        },
        E = g;
    },
  },
]);
