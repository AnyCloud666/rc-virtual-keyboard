!(function () {
  'use strict';
  var t = '/'.replace(/([^/])$/, '$1/'),
    e = location.pathname,
    n = e.startsWith(t) && decodeURI('/'.concat(e.slice(t.length)));
  if (n) {
    var a = document,
      c = a.head,
      r = a.createElement.bind(a),
      i = (function (t, e, n) {
        var a,
          c =
            e.r[t] ||
            (null ===
              (a = Object.entries(e.r).find(function (e) {
                var n = e[0];
                return new RegExp(
                  '^'.concat(
                    n.replace(/\/:[^/]+/g, '/[^/]+').replace('/*', '/.+'),
                    '$',
                  ),
                ).test(t);
              })) || void 0 === a
              ? void 0
              : a[1]);
        return null == c
          ? void 0
          : c.map(function (t) {
              var a = e.f[t][1],
                c = e.f[t][0];
              return {
                type: c.split('.').pop(),
                url: ''.concat(n.publicPath).concat(c),
                attrs: [['data-'.concat(e.b), ''.concat(e.p, ':').concat(a)]],
              };
            });
      })(
        n,
        {
          p: 'react-virtual-keyboard',
          b: 'webpack',
          f: [
            [
              'nm__dumi__dist__client__pages__Demo__index.578aa5c0.chunk.css',
              9,
            ],
            ['nm__dumi__dist__client__pages__Demo__index.7f1dab53.async.js', 9],
            ['nm__dumi__dist__client__pages__404.8b85f2d9.chunk.css', 65],
            ['nm__dumi__dist__client__pages__404.031ff7d3.async.js', 65],
            ['docs__error.md.fbd8b901.async.js', 94],
            ['hooks__index.md.722d244b.async.js', 96],
            ['DragBlock__index.md.015cf63d.async.js', 104],
            ['EditKeyboard__index.md.38414e1a.async.js', 179],
            ['CompositionKeyboard__index.md.bd822596.async.js', 281],
            ['SymbolKeyboard__index.md.a07c8476.async.js', 356],
            ['VirtualKeyboard__index.md.5e306b92.async.js', 423],
            ['WriteKeyboard__index.md.b3a95f04.async.js', 509],
            [
              'nm__dumi__theme-default__layouts__DocLayout__index.19e8ac93.async.js',
              519,
            ],
            ['NumberKeyboard__index.md.5efa7db4.async.js', 768],
            ['docs__setup.md.1c1542fa.async.js', 802],
            ['853.e8c51481.chunk.css', 853],
            ['853.306d8cd5.async.js', 853],
            ['SettingKeyboard__index.md.1e39358f.async.js', 869],
            [
              'dumi__tmp-production__dumi__theme__ContextWrapper.d0101521.async.js',
              923,
            ],
            ['docs__index.md.f1d3d2a5.async.js', 935],
            ['LetterKeyboard__index.md.6867dc84.async.js', 937],
          ],
          r: {
            '/*': [2, 3, 12, 15, 16, 18],
            '/': [19, 12, 15, 16, 18],
            '/error': [4, 12, 15, 16, 18],
            '/setup': [14, 12, 15, 16, 18],
            '/~demos/:id': [0, 1, 18],
            '/components/composition-keyboard': [8, 12, 15, 16, 18],
            '/components/drag-block': [6, 12, 15, 16, 18],
            '/components/edit-keyboard': [7, 12, 15, 16, 18],
            '/components/hooks': [5, 12, 15, 16, 18],
            '/components/letter-keyboard': [20, 12, 15, 16, 18],
            '/components/number-keyboard': [13, 12, 15, 16, 18],
            '/components/setting-keyboard': [17, 12, 15, 16, 18],
            '/components/symbol-keyboard': [9, 12, 15, 16, 18],
            '/components/virtual-keyboard': [10, 12, 15, 16, 18],
            '/components/write-keyboard': [11, 12, 15, 16, 18],
          },
        },
        { publicPath: '/' },
      );
    null == i ||
      i.forEach(function (t) {
        var e,
          n = t.type,
          a = t.url;
        if ('js' === n) ((e = r('script')).src = a), (e.async = !0);
        else {
          if ('css' !== n) return;
          ((e = r('link')).href = a), (e.rel = 'preload'), (e.as = 'style');
        }
        t.attrs.forEach(function (t) {
          e.setAttribute(t[0], t[1] || '');
        }),
          c.appendChild(e);
      });
  }
})();
