(self.webpackChunkreact_virtual_keyboard =
  self.webpackChunkreact_virtual_keyboard || []).push([
  [195],
  {
    17372: function (e, u, t) {
      'use strict';
      var n = t(25862),
        r = t(66292),
        s = t.n(r),
        c = t(75271),
        l = t(45100),
        d = t(72146),
        f = t(52297),
        v = t(93998);
      function _(o, p) {
        var b;
        v.Z &&
          ((0, f.mf)(o) ||
            console.error(
              'useDebounceFn expected parameter is a function, got '.concat(
                typeof o,
              ),
            ));
        var h = (0, l.Z)(o),
          x =
            (b = p == null ? void 0 : p.wait) !== null && b !== void 0
              ? b
              : 1e3,
          i = (0, c.useMemo)(function () {
            return s()(
              function () {
                for (var E = [], a = 0; a < arguments.length; a++)
                  E[a] = arguments[a];
                return h.current.apply(h, (0, n.ev)([], (0, n.CR)(E), !1));
              },
              x,
              p,
            );
          }, []);
        return (
          (0, d.Z)(function () {
            i.cancel();
          }),
          { run: i, cancel: i.cancel, flush: i.flush }
        );
      }
      u.Z = _;
    },
    11577: function (e, u, t) {
      'use strict';
      t.d(u, {
        Z: function () {
          return x;
        },
      });
      var n = t(45100),
        r = t(52297),
        s = !!(
          typeof window != 'undefined' &&
          window.document &&
          window.document.createElement
        ),
        c = s;
      function l(i, E) {
        if (c) {
          if (!i) return E;
          var a;
          return (
            (0, r.mf)(i)
              ? (a = i())
              : 'current' in i
              ? (a = i.current)
              : (a = i),
            a
          );
        }
      }
      var d = t(75271),
        f = t(72146);
      function v(i, E) {
        if (i === E) return !0;
        for (var a = 0; a < i.length; a++)
          if (!Object.is(i[a], E[a])) return !1;
        return !0;
      }
      var _ = function (i) {
          var E = function (a, M, g) {
            var I = (0, d.useRef)(!1),
              y = (0, d.useRef)([]),
              R = (0, d.useRef)([]),
              T = (0, d.useRef)();
            i(function () {
              var O,
                P = Array.isArray(g) ? g : [g],
                L = P.map(function (j) {
                  return l(j);
                });
              if (!I.current) {
                (I.current = !0),
                  (y.current = L),
                  (R.current = M),
                  (T.current = a());
                return;
              }
              (L.length !== y.current.length ||
                !v(y.current, L) ||
                !v(R.current, M)) &&
                ((O = T.current) === null || O === void 0 || O.call(T),
                (y.current = L),
                (R.current = M),
                (T.current = a()));
            }),
              (0, f.Z)(function () {
                var O;
                (O = T.current) === null || O === void 0 || O.call(T),
                  (I.current = !1);
              });
          };
          return E;
        },
        o = _,
        p = o(d.useEffect),
        b = p;
      function h(i, E, a) {
        a === void 0 && (a = {});
        var M = a.enable,
          g = M === void 0 ? !0 : M,
          I = (0, n.Z)(E);
        b(
          function () {
            if (g) {
              var y = l(a.target, window);
              if (y != null && y.addEventListener) {
                var R = function (T) {
                  return I.current(T);
                };
                return (
                  y.addEventListener(i, R, {
                    capture: a.capture,
                    once: a.once,
                    passive: a.passive,
                  }),
                  function () {
                    y.removeEventListener(i, R, { capture: a.capture });
                  }
                );
              }
            }
          },
          [i, a.capture, a.once, a.passive, g],
          a.target,
        );
      }
      var x = h;
    },
    45100: function (e, u, t) {
      'use strict';
      var n = t(75271);
      function r(s) {
        var c = (0, n.useRef)(s);
        return (c.current = s), c;
      }
      u.Z = r;
    },
    72146: function (e, u, t) {
      'use strict';
      var n = t(75271),
        r = t(45100),
        s = t(52297),
        c = t(93998),
        l = function (d) {
          c.Z &&
            ((0, s.mf)(d) ||
              console.error(
                'useUnmount expected parameter is a function, got '.concat(
                  typeof d,
                ),
              ));
          var f = (0, r.Z)(d);
          (0, n.useEffect)(function () {
            return function () {
              f.current();
            };
          }, []);
        };
      u.Z = l;
    },
    42966: function (e, u, t) {
      'use strict';
      t.d(u, {
        Z: function () {
          return c;
        },
      });
      var n = t(75271),
        r = function (l) {
          return function (d, f) {
            var v = (0, n.useRef)(!1);
            l(function () {
              return function () {
                v.current = !1;
              };
            }, []),
              l(function () {
                if (!v.current) v.current = !0;
                else return d();
              }, f);
          };
        },
        s = null,
        c = r(n.useEffect);
    },
    52297: function (e, u, t) {
      'use strict';
      t.d(u, {
        mf: function () {
          return r;
        },
      });
      var n = function (f) {
          return f !== null && typeof f == 'object';
        },
        r = function (f) {
          return typeof f == 'function';
        },
        s = function (f) {
          return typeof f == 'string';
        },
        c = function (f) {
          return typeof f == 'boolean';
        },
        l = function (f) {
          return typeof f == 'number';
        },
        d = function (f) {
          return typeof f == 'undefined';
        };
    },
    93998: function (e, u) {
      'use strict';
      var t = !1;
      u.Z = t;
    },
    74396: function (e, u, t) {
      var n = t(29165),
        r = n.Symbol;
      e.exports = r;
    },
    80732: function (e, u, t) {
      var n = t(74396),
        r = t(31239),
        s = t(57058),
        c = '[object Null]',
        l = '[object Undefined]',
        d = n ? n.toStringTag : void 0;
      function f(v) {
        return v == null
          ? v === void 0
            ? l
            : c
          : d && d in Object(v)
          ? r(v)
          : s(v);
      }
      e.exports = f;
    },
    33124: function (e, u, t) {
      var n = t(82996),
        r = /^\s+/;
      function s(c) {
        return c && c.slice(0, n(c) + 1).replace(r, '');
      }
      e.exports = s;
    },
    96476: function (e, u, t) {
      var n = typeof t.g == 'object' && t.g && t.g.Object === Object && t.g;
      e.exports = n;
    },
    31239: function (e, u, t) {
      var n = t(74396),
        r = Object.prototype,
        s = r.hasOwnProperty,
        c = r.toString,
        l = n ? n.toStringTag : void 0;
      function d(f) {
        var v = s.call(f, l),
          _ = f[l];
        try {
          f[l] = void 0;
          var o = !0;
        } catch (b) {}
        var p = c.call(f);
        return o && (v ? (f[l] = _) : delete f[l]), p;
      }
      e.exports = d;
    },
    57058: function (e) {
      var u = Object.prototype,
        t = u.toString;
      function n(r) {
        return t.call(r);
      }
      e.exports = n;
    },
    29165: function (e, u, t) {
      var n = t(96476),
        r = typeof self == 'object' && self && self.Object === Object && self,
        s = n || r || Function('return this')();
      e.exports = s;
    },
    82996: function (e) {
      var u = /\s/;
      function t(n) {
        for (var r = n.length; r-- && u.test(n.charAt(r)); );
        return r;
      }
      e.exports = t;
    },
    66292: function (e, u, t) {
      var n = t(36838),
        r = t(76668),
        s = t(12448),
        c = 'Expected a function',
        l = Math.max,
        d = Math.min;
      function f(v, _, o) {
        var p,
          b,
          h,
          x,
          i,
          E,
          a = 0,
          M = !1,
          g = !1,
          I = !0;
        if (typeof v != 'function') throw new TypeError(c);
        (_ = s(_) || 0),
          n(o) &&
            ((M = !!o.leading),
            (g = 'maxWait' in o),
            (h = g ? l(s(o.maxWait) || 0, _) : h),
            (I = 'trailing' in o ? !!o.trailing : I));
        function y(m) {
          var D = p,
            S = b;
          return (p = b = void 0), (a = m), (x = v.apply(S, D)), x;
        }
        function R(m) {
          return (a = m), (i = setTimeout(P, _)), M ? y(m) : x;
        }
        function T(m) {
          var D = m - E,
            S = m - a,
            W = _ - D;
          return g ? d(W, h - S) : W;
        }
        function O(m) {
          var D = m - E,
            S = m - a;
          return E === void 0 || D >= _ || D < 0 || (g && S >= h);
        }
        function P() {
          var m = r();
          if (O(m)) return L(m);
          i = setTimeout(P, T(m));
        }
        function L(m) {
          return (i = void 0), I && p ? y(m) : ((p = b = void 0), x);
        }
        function j() {
          i !== void 0 && clearTimeout(i), (a = 0), (p = E = b = i = void 0);
        }
        function U() {
          return i === void 0 ? x : L(r());
        }
        function A() {
          var m = r(),
            D = O(m);
          if (((p = arguments), (b = this), (E = m), D)) {
            if (i === void 0) return R(E);
            if (g) return clearTimeout(i), (i = setTimeout(P, _)), y(E);
          }
          return i === void 0 && (i = setTimeout(P, _)), x;
        }
        return (A.cancel = j), (A.flush = U), A;
      }
      e.exports = f;
    },
    36838: function (e) {
      function u(t) {
        var n = typeof t;
        return t != null && (n == 'object' || n == 'function');
      }
      e.exports = u;
    },
    55073: function (e) {
      function u(t) {
        return t != null && typeof t == 'object';
      }
      e.exports = u;
    },
    16764: function (e, u, t) {
      var n = t(80732),
        r = t(55073),
        s = '[object Symbol]';
      function c(l) {
        return typeof l == 'symbol' || (r(l) && n(l) == s);
      }
      e.exports = c;
    },
    76668: function (e, u, t) {
      var n = t(29165),
        r = function () {
          return n.Date.now();
        };
      e.exports = r;
    },
    12448: function (e, u, t) {
      var n = t(33124),
        r = t(36838),
        s = t(16764),
        c = NaN,
        l = /^[-+]0x[0-9a-f]+$/i,
        d = /^0b[01]+$/i,
        f = /^0o[0-7]+$/i,
        v = parseInt;
      function _(o) {
        if (typeof o == 'number') return o;
        if (s(o)) return c;
        if (r(o)) {
          var p = typeof o.valueOf == 'function' ? o.valueOf() : o;
          o = r(p) ? p + '' : p;
        }
        if (typeof o != 'string') return o === 0 ? o : +o;
        o = n(o);
        var b = d.test(o);
        return b || f.test(o) ? v(o.slice(2), b ? 2 : 8) : l.test(o) ? c : +o;
      }
      e.exports = _;
    },
    38498: function (e, u, t) {
      var n = t(78770);
      function r(s) {
        if (Array.isArray(s)) return n(s);
      }
      (e.exports = r),
        (e.exports.__esModule = !0),
        (e.exports.default = e.exports);
    },
    20698: function (e) {
      function u(t) {
        if (
          (typeof Symbol != 'undefined' && t[Symbol.iterator] != null) ||
          t['@@iterator'] != null
        )
          return Array.from(t);
      }
      (e.exports = u),
        (e.exports.__esModule = !0),
        (e.exports.default = e.exports);
    },
    91162: function (e) {
      function u() {
        throw new TypeError(`Invalid attempt to spread non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`);
      }
      (e.exports = u),
        (e.exports.__esModule = !0),
        (e.exports.default = e.exports);
    },
    15558: function (e, u, t) {
      var n = t(38498),
        r = t(20698),
        s = t(31479),
        c = t(91162);
      function l(d) {
        return n(d) || r(d) || s(d) || c();
      }
      (e.exports = l),
        (e.exports.__esModule = !0),
        (e.exports.default = e.exports);
    },
  },
]);
