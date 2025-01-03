'use strict';
(self.webpackChunkreact_virtual_keyboard =
  self.webpackChunkreact_virtual_keyboard || []).push([
  [923],
  {
    84655: function (j, o, e) {
      e.r(o),
        e.d(o, {
          default: function () {
            return x;
          },
        });
      var y = e(48305),
        g = e.n(y),
        r = e(75271),
        a = e(95269),
        C = e(2405),
        b = e(10220),
        n = null,
        l = e(31532),
        k = e(52676),
        s = {},
        i = {
          name: 'react-virtual-keyboard',
          description: 'virtual keyboard',
          version: '0.0.1',
          license: 'MIT',
          repository: {
            type: 'git',
            url: 'https://github.com/AnyCloud666/react-vitrual-keyboard.git',
          },
          authors: ['1264174856@qq.com'],
        },
        u = 'browser',
        d = void 0,
        v = {
          logo: '/logo.png',
          footer:
            'Copyright \xA9 2025 | Powered by <a href="https://d.umijs.org" target="_blank" rel="noreferrer">dumi</a>',
          prefersColor: { default: 'light', switch: !0 },
          nprogress: !0,
          lastUpdated: !0,
          name: 'react-virtual-keyboard',
          sourceLink:
            'https://github.com/AnyCloud666/react-vitrual-keyboard/tree/master/{fileName}#L{line}',
          editLink:
            'https://github.com/AnyCloud666/react-vitrual-keyboard/edit/master/{filename}',
        },
        c = !0;
      function x() {
        var T = (0, a.pC)(),
          A = (0, r.useState)(!1),
          m = g()(A, 2),
          f = m[0],
          h = m[1],
          p = (0, r.useRef)(a.m8.location.pathname);
        (0, r.useEffect)(function () {
          return a.m8.listen(function (t) {
            t.location.pathname !== p.current &&
              ((p.current = t.location.pathname),
              document.documentElement.scrollTo(0, 0));
          });
        }, []);
        var L = r.useMemo(
          function () {
            var t = {
              pkg: i,
              historyType: u,
              entryExports: s,
              demos: null,
              components: n,
              locales: l.k,
              loading: f,
              setLoading: h,
              hostname: d,
              themeConfig: v,
              _2_level_nav_available: c,
            };
            return (
              Object.defineProperty(t, 'demos', {
                get: function () {
                  return (
                    (0, C.Kp)(
                      !1,
                      '`demos` return empty in latest version, please use `useDemo` instead.',
                    ),
                    {}
                  );
                },
              }),
              t
            );
          },
          [i, u, s, n, l.k, f, h, d, v, c],
        );
        return (0, k.jsx)(b.D.Provider, { value: L, children: T });
      }
    },
  },
]);
