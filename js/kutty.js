!(function () {
  'use strict';
  var e, t;
  (e = window),
    (t = function () {
      function e(e, t, n) {
        return (
          t in e
            ? Object.defineProperty(e, t, {
                value: n,
                enumerable: !0,
                configurable: !0,
                writable: !0,
              })
            : (e[t] = n),
          e
        );
      }
      function t(e, t) {
        var n = Object.keys(e);
        if (Object.getOwnPropertySymbols) {
          var i = Object.getOwnPropertySymbols(e);
          t &&
            (i = i.filter(function (t) {
              return Object.getOwnPropertyDescriptor(e, t).enumerable;
            })),
            n.push.apply(n, i);
        }
        return n;
      }
      function n(n) {
        for (var i = 1; i < arguments.length; i++) {
          var r = null != arguments[i] ? arguments[i] : {};
          i % 2
            ? t(Object(r), !0).forEach(function (t) {
                e(n, t, r[t]);
              })
            : Object.getOwnPropertyDescriptors
            ? Object.defineProperties(n, Object.getOwnPropertyDescriptors(r))
            : t(Object(r)).forEach(function (e) {
                Object.defineProperty(
                  n,
                  e,
                  Object.getOwnPropertyDescriptor(r, e)
                );
              });
        }
        return n;
      }
      function i(e) {
        return Array.from(new Set(e));
      }
      function r() {
        return (
          navigator.userAgent.includes('Node.js') ||
          navigator.userAgent.includes('jsdom')
        );
      }
      function o(e, t) {
        return e == t;
      }
      function s(e, t) {
        'template' !== e.tagName.toLowerCase()
          ? console.warn(
              `Alpine: [${t}] directive should only be added to <template> tags. See https://github.com/alpinejs/alpine#${t}`
            )
          : 1 !== e.content.childElementCount &&
            console.warn(
              `Alpine: <template> tag with [${t}] encountered with multiple element roots. Make sure <template> only has a single child element.`
            );
      }
      function a(e) {
        return e.toLowerCase().replace(/-(\w)/g, (e, t) => t.toUpperCase());
      }
      function l(e, t) {
        if (!1 === t(e)) return;
        let n = e.firstElementChild;
        for (; n; ) l(n, t), (n = n.nextElementSibling);
      }
      function c(e, t) {
        var n;
        return function () {
          var i = this,
            r = arguments,
            o = function () {
              (n = null), e.apply(i, r);
            };
          clearTimeout(n), (n = setTimeout(o, t));
        };
      }
      const u = (e, t, n) => {
        if (
          (console.warn(
            `Alpine Error: "${n}"\n\nExpression: "${t}"\nElement:`,
            e
          ),
          !r())
        )
          throw n;
      };
      function d(e, { el: t, expression: n }) {
        try {
          const i = e();
          return i instanceof Promise ? i.catch((e) => u(t, n, e)) : i;
        } catch (e) {
          u(t, n, e);
        }
      }
      function p(e, t, n, i = {}) {
        return d(
          () =>
            'function' == typeof t
              ? t.call(n)
              : new Function(
                  ['$data', ...Object.keys(i)],
                  `var __alpine_result; with($data) { __alpine_result = ${t} }; return __alpine_result`
                )(n, ...Object.values(i)),
          { el: e, expression: t }
        );
      }
      const f = /^x-(on|bind|data|text|html|model|if|for|show|cloak|transition|ref|spread)\b/;
      function h(e) {
        const t = b(e.name);
        return f.test(t);
      }
      function m(e, t, n) {
        let i = Array.from(e.attributes).filter(h).map(v),
          r = i.filter((e) => 'spread' === e.type)[0];
        if (r) {
          let n = p(e, r.expression, t.$data);
          i = i.concat(
            Object.entries(n).map(([e, t]) => v({ name: e, value: t }))
          );
        }
        return n
          ? i.filter((e) => e.type === n)
          : (function (e) {
              let t = ['bind', 'model', 'show', 'catch-all'];
              return e.sort((e, n) => {
                let i = -1 === t.indexOf(e.type) ? 'catch-all' : e.type,
                  r = -1 === t.indexOf(n.type) ? 'catch-all' : n.type;
                return t.indexOf(i) - t.indexOf(r);
              });
            })(i);
      }
      function v({ name: e, value: t }) {
        const n = b(e),
          i = n.match(f),
          r = n.match(/:([a-zA-Z0-9\-:]+)/),
          o = n.match(/\.[^.\]]+(?=[^\]]*$)/g) || [];
        return {
          type: i ? i[1] : null,
          value: r ? r[1] : null,
          modifiers: o.map((e) => e.replace('.', '')),
          expression: t,
        };
      }
      function b(e) {
        return e.startsWith('@')
          ? e.replace('@', 'x-on:')
          : e.startsWith(':')
          ? e.replace(':', 'x-bind:')
          : e;
      }
      function y(e, t = Boolean) {
        return e.split(' ').filter(t);
      }
      const g = 'in',
        x = 'out',
        w = 'cancelled';
      function O(e, t, n, i, r = !1) {
        if (r) return t();
        if (e.__x_transition && e.__x_transition.type === g) return;
        const o = m(e, i, 'transition'),
          s = m(e, i, 'show')[0];
        if (s && s.modifiers.includes('transition')) {
          let i = s.modifiers;
          if (i.includes('out') && !i.includes('in')) return t();
          const r = i.includes('in') && i.includes('out');
          (i = r ? i.filter((e, t) => t < i.indexOf('out')) : i),
            (function (e, t, n, i) {
              A(
                e,
                t,
                n,
                () => {},
                i,
                {
                  duration: E(t, 'duration', 150),
                  origin: E(t, 'origin', 'center'),
                  first: { opacity: 0, scale: E(t, 'scale', 95) },
                  second: { opacity: 1, scale: 100 },
                },
                g
              );
            })(e, i, t, n);
        } else
          o.some((e) => ['enter', 'enter-start', 'enter-end'].includes(e.value))
            ? (function (e, t, n, i, r) {
                S(
                  e,
                  y(
                    k(
                      (n.find((e) => 'enter' === e.value) || { expression: '' })
                        .expression,
                      e,
                      t
                    )
                  ),
                  y(
                    k(
                      (
                        n.find((e) => 'enter-start' === e.value) || {
                          expression: '',
                        }
                      ).expression,
                      e,
                      t
                    )
                  ),
                  y(
                    k(
                      (
                        n.find((e) => 'enter-end' === e.value) || {
                          expression: '',
                        }
                      ).expression,
                      e,
                      t
                    )
                  ),
                  i,
                  () => {},
                  g,
                  r
                );
              })(e, i, o, t, n)
            : t();
      }
      function _(e, t, n, i, r = !1) {
        if (r) return t();
        if (e.__x_transition && e.__x_transition.type === x) return;
        const o = m(e, i, 'transition'),
          s = m(e, i, 'show')[0];
        if (s && s.modifiers.includes('transition')) {
          let i = s.modifiers;
          if (i.includes('in') && !i.includes('out')) return t();
          const r = i.includes('in') && i.includes('out');
          (i = r ? i.filter((e, t) => t > i.indexOf('out')) : i),
            (function (e, t, n, i, r) {
              A(
                e,
                t,
                () => {},
                i,
                r,
                {
                  duration: n
                    ? E(t, 'duration', 150)
                    : E(t, 'duration', 150) / 2,
                  origin: E(t, 'origin', 'center'),
                  first: { opacity: 1, scale: 100 },
                  second: { opacity: 0, scale: E(t, 'scale', 95) },
                },
                x
              );
            })(e, i, r, t, n);
        } else
          o.some((e) => ['leave', 'leave-start', 'leave-end'].includes(e.value))
            ? (function (e, t, n, i, r) {
                S(
                  e,
                  y(
                    k(
                      (n.find((e) => 'leave' === e.value) || { expression: '' })
                        .expression,
                      e,
                      t
                    )
                  ),
                  y(
                    k(
                      (
                        n.find((e) => 'leave-start' === e.value) || {
                          expression: '',
                        }
                      ).expression,
                      e,
                      t
                    )
                  ),
                  y(
                    k(
                      (
                        n.find((e) => 'leave-end' === e.value) || {
                          expression: '',
                        }
                      ).expression,
                      e,
                      t
                    )
                  ),
                  () => {},
                  i,
                  x,
                  r
                );
              })(e, i, o, t, n)
            : t();
      }
      function E(e, t, n) {
        if (-1 === e.indexOf(t)) return n;
        const i = e[e.indexOf(t) + 1];
        if (!i) return n;
        if ('scale' === t && !$(i)) return n;
        if ('duration' === t) {
          let e = i.match(/([0-9]+)ms/);
          if (e) return e[1];
        }
        return 'origin' === t &&
          ['top', 'right', 'left', 'center', 'bottom'].includes(
            e[e.indexOf(t) + 2]
          )
          ? [i, e[e.indexOf(t) + 2]].join(' ')
          : i;
      }
      function A(e, t, n, i, r, o, s) {
        e.__x_transition &&
          e.__x_transition.cancel &&
          e.__x_transition.cancel();
        const a = e.style.opacity,
          l = e.style.transform,
          c = e.style.transformOrigin,
          u = !t.includes('opacity') && !t.includes('scale'),
          d = u || t.includes('opacity'),
          p = u || t.includes('scale'),
          f = {
            start() {
              d && (e.style.opacity = o.first.opacity),
                p && (e.style.transform = `scale(${o.first.scale / 100})`);
            },
            during() {
              p && (e.style.transformOrigin = o.origin),
                (e.style.transitionProperty = [
                  d ? 'opacity' : '',
                  p ? 'transform' : '',
                ]
                  .join(' ')
                  .trim()),
                (e.style.transitionDuration = o.duration / 1e3 + 's'),
                (e.style.transitionTimingFunction =
                  'cubic-bezier(0.4, 0.0, 0.2, 1)');
            },
            show() {
              n();
            },
            end() {
              d && (e.style.opacity = o.second.opacity),
                p && (e.style.transform = `scale(${o.second.scale / 100})`);
            },
            hide() {
              i();
            },
            cleanup() {
              d && (e.style.opacity = a),
                p && (e.style.transform = l),
                p && (e.style.transformOrigin = c),
                (e.style.transitionProperty = null),
                (e.style.transitionDuration = null),
                (e.style.transitionTimingFunction = null);
            },
          };
        j(e, f, s, r);
      }
      const k = (e, t, n) =>
        'function' == typeof e ? n.evaluateReturnExpression(t, e) : e;
      function S(e, t, n, i, r, o, s, a) {
        e.__x_transition &&
          e.__x_transition.cancel &&
          e.__x_transition.cancel();
        const l = e.__x_original_classes || [],
          c = {
            start() {
              e.classList.add(...n);
            },
            during() {
              e.classList.add(...t);
            },
            show() {
              r();
            },
            end() {
              e.classList.remove(...n.filter((e) => !l.includes(e))),
                e.classList.add(...i);
            },
            hide() {
              o();
            },
            cleanup() {
              e.classList.remove(...t.filter((e) => !l.includes(e))),
                e.classList.remove(...i.filter((e) => !l.includes(e)));
            },
          };
        j(e, c, s, a);
      }
      function j(e, t, n, i) {
        const r = D(() => {
          t.hide(), e.isConnected && t.cleanup(), delete e.__x_transition;
        });
        (e.__x_transition = {
          type: n,
          cancel: D(() => {
            i(w), r();
          }),
          finish: r,
          nextFrame: null,
        }),
          t.start(),
          t.during(),
          (e.__x_transition.nextFrame = requestAnimationFrame(() => {
            let n =
              1e3 *
              Number(
                getComputedStyle(e)
                  .transitionDuration.replace(/,.*/, '')
                  .replace('s', '')
              );
            0 === n &&
              (n =
                1e3 *
                Number(getComputedStyle(e).animationDuration.replace('s', ''))),
              t.show(),
              (e.__x_transition.nextFrame = requestAnimationFrame(() => {
                t.end(), setTimeout(e.__x_transition.finish, n);
              }));
          }));
      }
      function $(e) {
        return !Array.isArray(e) && !isNaN(e);
      }
      function D(e) {
        let t = !1;
        return function () {
          t || ((t = !0), e.apply(this, arguments));
        };
      }
      function P(e, t, i, r, o) {
        s(t, 'x-for');
        let a = (function (e) {
            let t = /,([^,\}\]]*)(?:,([^,\}\]]*))?$/,
              n = e.match(/([\s\S]*?)\s+(?:in|of)\s+([\s\S]*)/);
            if (!n) return;
            let i = {};
            i.items = n[2].trim();
            let r = n[1].trim().replace(/^\(|\)$/g, ''),
              o = r.match(t);
            return (
              o
                ? ((i.item = r.replace(t, '').trim()),
                  (i.index = o[1].trim()),
                  o[2] && (i.collection = o[2].trim()))
                : (i.item = r),
              i
            );
          })('function' == typeof i ? e.evaluateReturnExpression(t, i) : i),
          l = (function (e, t, n, i) {
            let r = m(t, e, 'if')[0];
            if (r && !e.evaluateReturnExpression(t, r.expression)) return [];
            let o = e.evaluateReturnExpression(t, n.items, i);
            return (
              $(o) && o > 0 && (o = Array.from(Array(o).keys(), (e) => e + 1)),
              o
            );
          })(e, t, a, o),
          c = t;
        l.forEach((i, s) => {
          let u = (function (e, t, i, r, o) {
              let s = o ? n({}, o) : {};
              return (
                (s[e.item] = t),
                e.index && (s[e.index] = i),
                e.collection && (s[e.collection] = r),
                s
              );
            })(a, i, s, l, o()),
            d = (function (e, t, n, i) {
              let r = m(t, e, 'bind').filter((e) => 'key' === e.value)[0];
              return r
                ? e.evaluateReturnExpression(t, r.expression, () => i)
                : n;
            })(e, t, s, u),
            p = (function (e, t) {
              if (!e) return;
              if (void 0 === e.__x_for_key) return;
              if (e.__x_for_key === t) return e;
              let n = e;
              for (; n; ) {
                if (n.__x_for_key === t)
                  return n.parentElement.insertBefore(n, e);
                n =
                  !(
                    !n.nextElementSibling ||
                    void 0 === n.nextElementSibling.__x_for_key
                  ) && n.nextElementSibling;
              }
            })(c.nextElementSibling, d);
          p
            ? (delete p.__x_for_key,
              (p.__x_for = u),
              e.updateElements(p, () => p.__x_for))
            : ((p = (function (e, t) {
                let n = document.importNode(e.content, !0);
                return (
                  t.parentElement.insertBefore(n, t.nextElementSibling),
                  t.nextElementSibling
                );
              })(t, c)),
              O(
                p,
                () => {},
                () => {},
                e,
                r
              ),
              (p.__x_for = u),
              e.initializeElements(p, () => p.__x_for)),
            (c = p),
            (c.__x_for_key = d);
        }),
          (function (e, t) {
            for (
              var n =
                !(
                  !e.nextElementSibling ||
                  void 0 === e.nextElementSibling.__x_for_key
                ) && e.nextElementSibling;
              n;

            ) {
              let e = n,
                i = n.nextElementSibling;
              _(
                n,
                () => {
                  e.remove();
                },
                () => {},
                t
              ),
                (n = !(!i || void 0 === i.__x_for_key) && i);
            }
          })(c, e);
      }
      function C(e, t, n, r, s, l, c) {
        var u = e.evaluateReturnExpression(t, r, s);
        if ('value' === n) {
          if (
            ye.ignoreFocusedForValueBinding &&
            document.activeElement.isSameNode(t)
          )
            return;
          if ((void 0 === u && r.match(/\./) && (u = ''), 'radio' === t.type))
            void 0 === t.attributes.value && 'bind' === l
              ? (t.value = u)
              : 'bind' !== l && (t.checked = o(t.value, u));
          else if ('checkbox' === t.type)
            'boolean' == typeof u || [null, void 0].includes(u) || 'bind' !== l
              ? 'bind' !== l &&
                (Array.isArray(u)
                  ? (t.checked = u.some((e) => o(e, t.value)))
                  : (t.checked = !!u))
              : (t.value = String(u));
          else if ('SELECT' === t.tagName)
            !(function (e, t) {
              const n = [].concat(t).map((e) => e + '');
              Array.from(e.options).forEach((e) => {
                e.selected = n.includes(e.value || e.text);
              });
            })(t, u);
          else {
            if (t.value === u) return;
            t.value = u;
          }
        } else if ('class' === n)
          if (Array.isArray(u)) {
            const e = t.__x_original_classes || [];
            t.setAttribute('class', i(e.concat(u)).join(' '));
          } else if ('object' == typeof u)
            Object.keys(u)
              .sort((e, t) => u[e] - u[t])
              .forEach((e) => {
                u[e]
                  ? y(e).forEach((e) => t.classList.add(e))
                  : y(e).forEach((e) => t.classList.remove(e));
              });
          else {
            const e = t.__x_original_classes || [],
              n = u ? y(u) : [];
            t.setAttribute('class', i(e.concat(n)).join(' '));
          }
        else
          (n = c.includes('camel') ? a(n) : n),
            [null, void 0, !1].includes(u)
              ? t.removeAttribute(n)
              : (function (e) {
                  return [
                    'disabled',
                    'checked',
                    'required',
                    'readonly',
                    'hidden',
                    'open',
                    'selected',
                    'autofocus',
                    'itemscope',
                    'multiple',
                    'novalidate',
                    'allowfullscreen',
                    'allowpaymentrequest',
                    'formnovalidate',
                    'autoplay',
                    'controls',
                    'loop',
                    'muted',
                    'playsinline',
                    'default',
                    'ismap',
                    'reversed',
                    'async',
                    'defer',
                    'nomodule',
                  ].includes(e);
                })(n)
              ? L(t, n, n)
              : L(t, n, u);
      }
      function L(e, t, n) {
        e.getAttribute(t) != n && e.setAttribute(t, n);
      }
      function M(e, t, n, i, r, o = {}) {
        const s = { passive: i.includes('passive') };
        if ((i.includes('camel') && (n = a(n)), i.includes('away'))) {
          let a = (l) => {
            t.contains(l.target) ||
              (t.offsetWidth < 1 && t.offsetHeight < 1) ||
              (T(e, r, l, o),
              i.includes('once') && document.removeEventListener(n, a, s));
          };
          document.addEventListener(n, a, s);
        } else {
          let a = i.includes('window')
              ? window
              : i.includes('document')
              ? document
              : t,
            l = (c) => {
              (a !== window && a !== document) || document.body.contains(t)
                ? ((function (e) {
                    return ['keydown', 'keyup'].includes(e);
                  })(n) &&
                    (function (e, t) {
                      let n = t.filter(
                        (e) =>
                          !['window', 'document', 'prevent', 'stop'].includes(e)
                      );
                      if (n.includes('debounce')) {
                        let e = n.indexOf('debounce');
                        n.splice(
                          e,
                          $((n[e + 1] || 'invalid-wait').split('ms')[0]) ? 2 : 1
                        );
                      }
                      if (0 === n.length) return !1;
                      if (1 === n.length && n[0] === q(e.key)) return !1;
                      const i = [
                        'ctrl',
                        'shift',
                        'alt',
                        'meta',
                        'cmd',
                        'super',
                      ].filter((e) => n.includes(e));
                      return (
                        (n = n.filter((e) => !i.includes(e))),
                        !(
                          i.length > 0 &&
                          i.filter(
                            (t) => (
                              ('cmd' !== t && 'super' !== t) || (t = 'meta'),
                              e[t + 'Key']
                            )
                          ).length === i.length &&
                          n[0] === q(e.key)
                        )
                      );
                    })(c, i)) ||
                  (i.includes('prevent') && c.preventDefault(),
                  i.includes('stop') && c.stopPropagation(),
                  i.includes('self') && c.target !== t) ||
                  T(e, r, c, o).then((e) => {
                    !1 === e
                      ? c.preventDefault()
                      : i.includes('once') && a.removeEventListener(n, l, s);
                  })
                : a.removeEventListener(n, l, s);
            };
          if (i.includes('debounce')) {
            let e = i[i.indexOf('debounce') + 1] || 'invalid-wait',
              t = $(e.split('ms')[0]) ? Number(e.split('ms')[0]) : 250;
            l = c(l, t);
          }
          a.addEventListener(n, l, s);
        }
      }
      function T(e, t, i, r) {
        return e.evaluateCommandExpression(i.target, t, () =>
          n(n({}, r()), {}, { $event: i })
        );
      }
      function q(e) {
        switch (e) {
          case '/':
            return 'slash';
          case ' ':
          case 'Spacebar':
            return 'space';
          default:
            return (
              e &&
              e
                .replace(/([a-z])([A-Z])/g, '$1-$2')
                .replace(/[_\s]/, '-')
                .toLowerCase()
            );
        }
      }
      function R(e, t, n) {
        return (
          'radio' === e.type &&
            (e.hasAttribute('name') || e.setAttribute('name', n)),
          (n, i) => {
            if (n instanceof CustomEvent && n.detail) return n.detail;
            if ('checkbox' === e.type) {
              if (Array.isArray(i)) {
                const e = t.includes('number')
                  ? N(n.target.value)
                  : n.target.value;
                return n.target.checked
                  ? i.concat([e])
                  : i.filter((t) => !o(t, e));
              }
              return n.target.checked;
            }
            if ('select' === e.tagName.toLowerCase() && e.multiple)
              return t.includes('number')
                ? Array.from(n.target.selectedOptions).map((e) =>
                    N(e.value || e.text)
                  )
                : Array.from(n.target.selectedOptions).map(
                    (e) => e.value || e.text
                  );
            {
              const e = n.target.value;
              return t.includes('number')
                ? N(e)
                : t.includes('trim')
                ? e.trim()
                : e;
            }
          }
        );
      }
      function N(e) {
        const t = e ? parseFloat(e) : null;
        return $(t) ? t : e;
      }
      const { isArray: z } = Array,
        {
          getPrototypeOf: B,
          create: F,
          defineProperty: I,
          defineProperties: W,
          isExtensible: H,
          getOwnPropertyDescriptor: U,
          getOwnPropertyNames: V,
          getOwnPropertySymbols: G,
          preventExtensions: K,
          hasOwnProperty: X,
        } = Object,
        { push: Y, concat: Z, map: J } = Array.prototype;
      function Q(e) {
        return void 0 === e;
      }
      function ee(e) {
        return 'function' == typeof e;
      }
      const te = new WeakMap();
      function ne(e, t) {
        te.set(e, t);
      }
      const ie = (e) => te.get(e) || e;
      function re(e, t) {
        return e.valueIsObservable(t) ? e.getProxy(t) : t;
      }
      function oe(e, t, n) {
        Z.call(V(n), G(n)).forEach((i) => {
          let r = U(n, i);
          r.configurable || (r = me(e, r, re)), I(t, i, r);
        }),
          K(t);
      }
      class se {
        constructor(e, t) {
          (this.originalTarget = t), (this.membrane = e);
        }
        get(e, t) {
          const { originalTarget: n, membrane: i } = this,
            r = n[t],
            { valueObserved: o } = i;
          return o(n, t), i.getProxy(r);
        }
        set(e, t, n) {
          const {
            originalTarget: i,
            membrane: { valueMutated: r },
          } = this;
          return (
            i[t] !== n
              ? ((i[t] = n), r(i, t))
              : 'length' === t && z(i) && r(i, t),
            !0
          );
        }
        deleteProperty(e, t) {
          const {
            originalTarget: n,
            membrane: { valueMutated: i },
          } = this;
          return delete n[t], i(n, t), !0;
        }
        apply(e, t, n) {}
        construct(e, t, n) {}
        has(e, t) {
          const {
            originalTarget: n,
            membrane: { valueObserved: i },
          } = this;
          return i(n, t), t in n;
        }
        ownKeys(e) {
          const { originalTarget: t } = this;
          return Z.call(V(t), G(t));
        }
        isExtensible(e) {
          const t = H(e);
          if (!t) return t;
          const { originalTarget: n, membrane: i } = this,
            r = H(n);
          return r || oe(i, e, n), r;
        }
        setPrototypeOf(e, t) {}
        getPrototypeOf(e) {
          const { originalTarget: t } = this;
          return B(t);
        }
        getOwnPropertyDescriptor(e, t) {
          const { originalTarget: n, membrane: i } = this,
            { valueObserved: r } = this.membrane;
          r(n, t);
          let o = U(n, t);
          if (Q(o)) return o;
          const s = U(e, t);
          return Q(s)
            ? ((o = me(i, o, re)), o.configurable || I(e, t, o), o)
            : s;
        }
        preventExtensions(e) {
          const { originalTarget: t, membrane: n } = this;
          return oe(n, e, t), K(t), !0;
        }
        defineProperty(e, t, n) {
          const { originalTarget: i, membrane: r } = this,
            { valueMutated: o } = r,
            { configurable: s } = n;
          if (X.call(n, 'writable') && !X.call(n, 'value')) {
            const e = U(i, t);
            n.value = e.value;
          }
          return (
            I(
              i,
              t,
              (function (e) {
                return X.call(e, 'value') && (e.value = ie(e.value)), e;
              })(n)
            ),
            !1 === s && I(e, t, me(r, n, re)),
            o(i, t),
            !0
          );
        }
      }
      function ae(e, t) {
        return e.valueIsObservable(t) ? e.getReadOnlyProxy(t) : t;
      }
      class le {
        constructor(e, t) {
          (this.originalTarget = t), (this.membrane = e);
        }
        get(e, t) {
          const { membrane: n, originalTarget: i } = this,
            r = i[t],
            { valueObserved: o } = n;
          return o(i, t), n.getReadOnlyProxy(r);
        }
        set(e, t, n) {
          return !1;
        }
        deleteProperty(e, t) {
          return !1;
        }
        apply(e, t, n) {}
        construct(e, t, n) {}
        has(e, t) {
          const {
            originalTarget: n,
            membrane: { valueObserved: i },
          } = this;
          return i(n, t), t in n;
        }
        ownKeys(e) {
          const { originalTarget: t } = this;
          return Z.call(V(t), G(t));
        }
        setPrototypeOf(e, t) {}
        getOwnPropertyDescriptor(e, t) {
          const { originalTarget: n, membrane: i } = this,
            { valueObserved: r } = i;
          r(n, t);
          let o = U(n, t);
          if (Q(o)) return o;
          const s = U(e, t);
          return Q(s)
            ? ((o = me(i, o, ae)),
              X.call(o, 'set') && (o.set = void 0),
              o.configurable || I(e, t, o),
              o)
            : s;
        }
        preventExtensions(e) {
          return !1;
        }
        defineProperty(e, t, n) {
          return !1;
        }
      }
      function ce(e) {
        let t;
        return z(e) ? (t = []) : 'object' == typeof e && (t = {}), t;
      }
      const ue = Object.prototype;
      function de(e) {
        if (null === e) return !1;
        if ('object' != typeof e) return !1;
        if (z(e)) return !0;
        const t = B(e);
        return t === ue || null === t || null === B(t);
      }
      const pe = (e, t) => {},
        fe = (e, t) => {},
        he = (e) => e;
      function me(e, t, n) {
        const { set: i, get: r } = t;
        return (
          X.call(t, 'value')
            ? (t.value = n(e, t.value))
            : (Q(r) ||
                (t.get = function () {
                  return n(e, r.call(ie(this)));
                }),
              Q(i) ||
                (t.set = function (t) {
                  i.call(ie(this), e.unwrapProxy(t));
                })),
          t
        );
      }
      class ve {
        constructor(e) {
          if (
            ((this.valueDistortion = he),
            (this.valueMutated = fe),
            (this.valueObserved = pe),
            (this.valueIsObservable = de),
            (this.objectGraph = new WeakMap()),
            !Q(e))
          ) {
            const {
              valueDistortion: t,
              valueMutated: n,
              valueObserved: i,
              valueIsObservable: r,
            } = e;
            (this.valueDistortion = ee(t) ? t : he),
              (this.valueMutated = ee(n) ? n : fe),
              (this.valueObserved = ee(i) ? i : pe),
              (this.valueIsObservable = ee(r) ? r : de);
          }
        }
        getProxy(e) {
          const t = ie(e),
            n = this.valueDistortion(t);
          if (this.valueIsObservable(n)) {
            const i = this.getReactiveState(t, n);
            return i.readOnly === e ? e : i.reactive;
          }
          return n;
        }
        getReadOnlyProxy(e) {
          e = ie(e);
          const t = this.valueDistortion(e);
          return this.valueIsObservable(t)
            ? this.getReactiveState(e, t).readOnly
            : t;
        }
        unwrapProxy(e) {
          return ie(e);
        }
        getReactiveState(e, t) {
          const { objectGraph: n } = this;
          let i = n.get(t);
          if (i) return i;
          const r = this;
          return (
            (i = {
              get reactive() {
                const n = new se(r, t),
                  i = new Proxy(ce(t), n);
                return ne(i, e), I(this, 'reactive', { value: i }), i;
              },
              get readOnly() {
                const n = new le(r, t),
                  i = new Proxy(ce(t), n);
                return ne(i, e), I(this, 'readOnly', { value: i }), i;
              },
            }),
            n.set(t, i),
            i
          );
        }
      }
      class be {
        constructor(e, t = null) {
          this.$el = e;
          const n = this.$el.getAttribute('x-data'),
            i = '' === n ? '{}' : n,
            r = this.$el.getAttribute('x-init');
          let o = { $el: this.$el },
            s = t ? t.$el : this.$el;
          Object.entries(ye.magicProperties).forEach(([e, t]) => {
            Object.defineProperty(o, '$' + e, {
              get: function () {
                return t(s);
              },
            });
          }),
            (this.unobservedData = t ? t.getUnobservedData() : p(e, i, o));
          let { membrane: a, data: l } = this.wrapDataInObservable(
            this.unobservedData
          );
          var c;
          (this.$data = l),
            (this.membrane = a),
            (this.unobservedData.$el = this.$el),
            (this.unobservedData.$refs = this.getRefsProxy()),
            (this.nextTickStack = []),
            (this.unobservedData.$nextTick = (e) => {
              this.nextTickStack.push(e);
            }),
            (this.watchers = {}),
            (this.unobservedData.$watch = (e, t) => {
              this.watchers[e] || (this.watchers[e] = []),
                this.watchers[e].push(t);
            }),
            Object.entries(ye.magicProperties).forEach(([e, t]) => {
              Object.defineProperty(this.unobservedData, '$' + e, {
                get: function () {
                  return t(s, this.$el);
                },
              });
            }),
            (this.showDirectiveStack = []),
            this.showDirectiveLastElement,
            t || ye.onBeforeComponentInitializeds.forEach((e) => e(this)),
            r &&
              !t &&
              ((this.pauseReactivity = !0),
              (c = this.evaluateReturnExpression(this.$el, r)),
              (this.pauseReactivity = !1)),
            this.initializeElements(this.$el),
            this.listenForNewElementsToInitialize(),
            'function' == typeof c && c.call(this.$data),
            t ||
              setTimeout(() => {
                ye.onComponentInitializeds.forEach((e) => e(this));
              }, 0);
        }
        getUnobservedData() {
          return (function (e, t) {
            let n = e.unwrapProxy(t),
              i = {};
            return (
              Object.keys(n).forEach((e) => {
                ['$el', '$refs', '$nextTick', '$watch'].includes(e) ||
                  (i[e] = n[e]);
              }),
              i
            );
          })(this.membrane, this.$data);
        }
        wrapDataInObservable(e) {
          var t = this;
          let n = c(function () {
            t.updateElements(t.$el);
          }, 0);
          return (function (e, t) {
            let n = new ve({
              valueMutated(e, n) {
                t(e, n);
              },
            });
            return { data: n.getProxy(e), membrane: n };
          })(e, (e, i) => {
            t.watchers[i]
              ? t.watchers[i].forEach((t) => t(e[i]))
              : Array.isArray(e)
              ? Object.keys(t.watchers).forEach((n) => {
                  let r = n.split('.');
                  'length' !== i &&
                    r.reduce(
                      (i, r) => (
                        Object.is(e, i[r]) &&
                          t.watchers[n].forEach((t) => t(e)),
                        i[r]
                      ),
                      t.unobservedData
                    );
                })
              : Object.keys(t.watchers)
                  .filter((e) => e.includes('.'))
                  .forEach((n) => {
                    let r = n.split('.');
                    i === r[r.length - 1] &&
                      r.reduce(
                        (r, o) => (
                          Object.is(e, r) &&
                            t.watchers[n].forEach((t) => t(e[i])),
                          r[o]
                        ),
                        t.unobservedData
                      );
                  }),
              t.pauseReactivity || n();
          });
        }
        walkAndSkipNestedComponents(e, t, n = () => {}) {
          l(e, (e) =>
            e.hasAttribute('x-data') && !e.isSameNode(this.$el)
              ? (e.__x || n(e), !1)
              : t(e)
          );
        }
        initializeElements(e, t = () => {}) {
          this.walkAndSkipNestedComponents(
            e,
            (e) =>
              void 0 === e.__x_for_key &&
              void 0 === e.__x_inserted_me &&
              void this.initializeElement(e, t),
            (e) => {
              e.__x = new be(e);
            }
          ),
            this.executeAndClearRemainingShowDirectiveStack(),
            this.executeAndClearNextTickStack(e);
        }
        initializeElement(e, t) {
          e.hasAttribute('class') &&
            m(e, this).length > 0 &&
            (e.__x_original_classes = y(e.getAttribute('class'))),
            this.registerListeners(e, t),
            this.resolveBoundAttributes(e, !0, t);
        }
        updateElements(e, t = () => {}) {
          this.walkAndSkipNestedComponents(
            e,
            (e) => {
              if (void 0 !== e.__x_for_key && !e.isSameNode(this.$el))
                return !1;
              this.updateElement(e, t);
            },
            (e) => {
              e.__x = new be(e);
            }
          ),
            this.executeAndClearRemainingShowDirectiveStack(),
            this.executeAndClearNextTickStack(e);
        }
        executeAndClearNextTickStack(e) {
          e === this.$el &&
            this.nextTickStack.length > 0 &&
            requestAnimationFrame(() => {
              for (; this.nextTickStack.length > 0; )
                this.nextTickStack.shift()();
            });
        }
        executeAndClearRemainingShowDirectiveStack() {
          this.showDirectiveStack
            .reverse()
            .map(
              (e) =>
                new Promise((t, n) => {
                  e(t, n);
                })
            )
            .reduce(
              (e, t) =>
                e.then(() =>
                  t.then((e) => {
                    e();
                  })
                ),
              Promise.resolve(() => {})
            )
            .catch((e) => {
              if (e !== w) throw e;
            }),
            (this.showDirectiveStack = []),
            (this.showDirectiveLastElement = void 0);
        }
        updateElement(e, t) {
          this.resolveBoundAttributes(e, !1, t);
        }
        registerListeners(e, t) {
          m(e, this).forEach(
            ({ type: i, value: r, modifiers: o, expression: s }) => {
              switch (i) {
                case 'on':
                  M(this, e, r, o, s, t);
                  break;
                case 'model':
                  !(function (e, t, i, r, o) {
                    var s =
                      'select' === t.tagName.toLowerCase() ||
                      ['checkbox', 'radio'].includes(t.type) ||
                      i.includes('lazy')
                        ? 'change'
                        : 'input';
                    M(
                      e,
                      t,
                      s,
                      i,
                      `${r} = rightSideOfExpression($event, ${r})`,
                      () =>
                        n(n({}, o()), {}, { rightSideOfExpression: R(t, i, r) })
                    );
                  })(this, e, o, s, t);
              }
            }
          );
        }
        resolveBoundAttributes(e, t = !1, n) {
          let i = m(e, this);
          i.forEach(({ type: r, value: o, modifiers: a, expression: l }) => {
            switch (r) {
              case 'model':
                C(this, e, 'value', l, n, r, a);
                break;
              case 'bind':
                if ('template' === e.tagName.toLowerCase() && 'key' === o)
                  return;
                C(this, e, o, l, n, r, a);
                break;
              case 'text':
                var c = this.evaluateReturnExpression(e, l, n);
                !(function (e, t, n) {
                  void 0 === t && n.match(/\./) && (t = ''),
                    (e.textContent = t);
                })(e, c, l);
                break;
              case 'html':
                !(function (e, t, n, i) {
                  t.innerHTML = e.evaluateReturnExpression(t, n, i);
                })(this, e, l, n);
                break;
              case 'show':
                (c = this.evaluateReturnExpression(e, l, n)),
                  (function (e, t, n, i, r = !1) {
                    const o = () => {
                        (t.style.display = 'none'), (t.__x_is_shown = !1);
                      },
                      s = () => {
                        1 === t.style.length && 'none' === t.style.display
                          ? t.removeAttribute('style')
                          : t.style.removeProperty('display'),
                          (t.__x_is_shown = !0);
                      };
                    if (!0 === r) return void (n ? s() : o());
                    const a = (i, r) => {
                      n
                        ? (('none' === t.style.display || t.__x_transition) &&
                            O(
                              t,
                              () => {
                                s();
                              },
                              r,
                              e
                            ),
                          i(() => {}))
                        : 'none' !== t.style.display
                        ? _(
                            t,
                            () => {
                              i(() => {
                                o();
                              });
                            },
                            r,
                            e
                          )
                        : i(() => {});
                    };
                    i.includes('immediate')
                      ? a(
                          (e) => e(),
                          () => {}
                        )
                      : (e.showDirectiveLastElement &&
                          !e.showDirectiveLastElement.contains(t) &&
                          e.executeAndClearRemainingShowDirectiveStack(),
                        e.showDirectiveStack.push(a),
                        (e.showDirectiveLastElement = t));
                  })(this, e, c, a, t);
                break;
              case 'if':
                if (i.some((e) => 'for' === e.type)) return;
                (c = this.evaluateReturnExpression(e, l, n)),
                  (function (e, t, n, i, r) {
                    s(t, 'x-if');
                    const o =
                      t.nextElementSibling &&
                      !0 === t.nextElementSibling.__x_inserted_me;
                    if (!n || (o && !t.__x_transition))
                      !n &&
                        o &&
                        _(
                          t.nextElementSibling,
                          () => {
                            t.nextElementSibling.remove();
                          },
                          () => {},
                          e,
                          i
                        );
                    else {
                      const n = document.importNode(t.content, !0);
                      t.parentElement.insertBefore(n, t.nextElementSibling),
                        O(
                          t.nextElementSibling,
                          () => {},
                          () => {},
                          e,
                          i
                        ),
                        e.initializeElements(t.nextElementSibling, r),
                        (t.nextElementSibling.__x_inserted_me = !0);
                    }
                  })(this, e, c, t, n);
                break;
              case 'for':
                P(this, e, l, t, n);
                break;
              case 'cloak':
                e.removeAttribute('x-cloak');
            }
          });
        }
        evaluateReturnExpression(e, t, i = () => {}) {
          return p(
            e,
            t,
            this.$data,
            n(n({}, i()), {}, { $dispatch: this.getDispatchFunction(e) })
          );
        }
        evaluateCommandExpression(e, t, i = () => {}) {
          return (function (e, t, n, i = {}) {
            return d(
              () => {
                if ('function' == typeof t)
                  return Promise.resolve(t.call(n, i.$event));
                let e = Function;
                if (
                  ((e = Object.getPrototypeOf(async function () {})
                    .constructor),
                  Object.keys(n).includes(t))
                ) {
                  let e = new Function(
                    ['dataContext', ...Object.keys(i)],
                    `with(dataContext) { return ${t} }`
                  )(n, ...Object.values(i));
                  return 'function' == typeof e
                    ? Promise.resolve(e.call(n, i.$event))
                    : Promise.resolve();
                }
                return Promise.resolve(
                  new e(
                    ['dataContext', ...Object.keys(i)],
                    `with(dataContext) { ${t} }`
                  )(n, ...Object.values(i))
                );
              },
              { el: e, expression: t }
            );
          })(
            e,
            t,
            this.$data,
            n(n({}, i()), {}, { $dispatch: this.getDispatchFunction(e) })
          );
        }
        getDispatchFunction(e) {
          return (t, n = {}) => {
            e.dispatchEvent(new CustomEvent(t, { detail: n, bubbles: !0 }));
          };
        }
        listenForNewElementsToInitialize() {
          const e = this.$el;
          new MutationObserver((e) => {
            for (let t = 0; t < e.length; t++) {
              const n = e[t].target.closest('[x-data]');
              if (n && n.isSameNode(this.$el)) {
                if (
                  'attributes' === e[t].type &&
                  'x-data' === e[t].attributeName
                ) {
                  const n = e[t].target.getAttribute('x-data') || '{}',
                    i = p(this.$el, n, { $el: this.$el });
                  Object.keys(i).forEach((e) => {
                    this.$data[e] !== i[e] && (this.$data[e] = i[e]);
                  });
                }
                e[t].addedNodes.length > 0 &&
                  e[t].addedNodes.forEach((e) => {
                    1 !== e.nodeType ||
                      e.__x_inserted_me ||
                      (!e.matches('[x-data]') || e.__x
                        ? this.initializeElements(e)
                        : (e.__x = new be(e)));
                  });
              }
            }
          }).observe(e, { childList: !0, attributes: !0, subtree: !0 });
        }
        getRefsProxy() {
          var e = this;
          return new Proxy(
            {},
            {
              get(t, n) {
                return (
                  '$isAlpineProxy' === n ||
                  (e.walkAndSkipNestedComponents(e.$el, (e) => {
                    e.hasAttribute('x-ref') &&
                      e.getAttribute('x-ref') === n &&
                      (i = e);
                  }),
                  i)
                );
                var i;
              },
            }
          );
        }
      }
      const ye = {
        version: '2.8.0',
        pauseMutationObserver: !1,
        magicProperties: {},
        onComponentInitializeds: [],
        onBeforeComponentInitializeds: [],
        ignoreFocusedForValueBinding: !1,
        start: async function () {
          r() ||
            (await new Promise((e) => {
              'loading' == document.readyState
                ? document.addEventListener('DOMContentLoaded', e)
                : e();
            })),
            this.discoverComponents((e) => {
              this.initializeComponent(e);
            }),
            document.addEventListener('turbolinks:load', () => {
              this.discoverUninitializedComponents((e) => {
                this.initializeComponent(e);
              });
            }),
            this.listenForNewUninitializedComponentsAtRunTime();
        },
        discoverComponents: function (e) {
          document.querySelectorAll('[x-data]').forEach((t) => {
            e(t);
          });
        },
        discoverUninitializedComponents: function (e, t = null) {
          const n = (t || document).querySelectorAll('[x-data]');
          Array.from(n)
            .filter((e) => void 0 === e.__x)
            .forEach((t) => {
              e(t);
            });
        },
        listenForNewUninitializedComponentsAtRunTime: function () {
          const e = document.querySelector('body');
          new MutationObserver((e) => {
            if (!this.pauseMutationObserver)
              for (let t = 0; t < e.length; t++)
                e[t].addedNodes.length > 0 &&
                  e[t].addedNodes.forEach((e) => {
                    1 === e.nodeType &&
                      ((e.parentElement &&
                        e.parentElement.closest('[x-data]')) ||
                        this.discoverUninitializedComponents((e) => {
                          this.initializeComponent(e);
                        }, e.parentElement));
                  });
          }).observe(e, { childList: !0, attributes: !0, subtree: !0 });
        },
        initializeComponent: function (e) {
          if (!e.__x)
            try {
              e.__x = new be(e);
            } catch (e) {
              setTimeout(() => {
                throw e;
              }, 0);
            }
        },
        clone: function (e, t) {
          t.__x || (t.__x = new be(t, e));
        },
        addMagicProperty: function (e, t) {
          this.magicProperties[e] = t;
        },
        onComponentInitialized: function (e) {
          this.onComponentInitializeds.push(e);
        },
        onBeforeComponentInitialized: function (e) {
          this.onBeforeComponentInitializeds.push(e);
        },
      };
      return (
        r() ||
          ((window.Alpine = ye),
          window.deferLoadingAlpine
            ? window.deferLoadingAlpine(function () {
                window.Alpine.start();
              })
            : window.Alpine.start()),
        ye
      );
    }),
    'object' == typeof exports && 'undefined' != typeof module
      ? (module.exports = t())
      : 'function' == typeof define && define.amd
      ? define(t)
      : ((e = e || self).Alpine = t()),
    (function (e, t) {
      'object' == typeof exports && 'undefined' != typeof module
        ? t(exports)
        : 'function' == typeof define && define.amd
        ? define(['exports'], t)
        : t(((e = e || self).Popper = {}));
    })(window, function (e) {
      function t(e) {
        return {
          width: (e = e.getBoundingClientRect()).width,
          height: e.height,
          top: e.top,
          right: e.right,
          bottom: e.bottom,
          left: e.left,
          x: e.left,
          y: e.top,
        };
      }
      function n(e) {
        return '[object Window]' !== e.toString()
          ? ((e = e.ownerDocument) && e.defaultView) || window
          : e;
      }
      function i(e) {
        return { scrollLeft: (e = n(e)).pageXOffset, scrollTop: e.pageYOffset };
      }
      function r(e) {
        return e instanceof n(e).Element || e instanceof Element;
      }
      function o(e) {
        return e instanceof n(e).HTMLElement || e instanceof HTMLElement;
      }
      function s(e) {
        return e ? (e.nodeName || '').toLowerCase() : null;
      }
      function a(e) {
        return (
          (r(e) ? e.ownerDocument : e.document) || window.document
        ).documentElement;
      }
      function l(e) {
        return t(a(e)).left + i(e).scrollLeft;
      }
      function c(e) {
        return n(e).getComputedStyle(e);
      }
      function u(e) {
        return (
          (e = c(e)),
          /auto|scroll|overlay|hidden/.test(
            e.overflow + e.overflowY + e.overflowX
          )
        );
      }
      function d(e, r, c) {
        void 0 === c && (c = !1);
        var d = a(r);
        e = t(e);
        var p = o(r),
          f = { scrollLeft: 0, scrollTop: 0 },
          h = { x: 0, y: 0 };
        return (
          (p || (!p && !c)) &&
            (('body' !== s(r) || u(d)) &&
              (f =
                r !== n(r) && o(r)
                  ? { scrollLeft: r.scrollLeft, scrollTop: r.scrollTop }
                  : i(r)),
            o(r)
              ? (((h = t(r)).x += r.clientLeft), (h.y += r.clientTop))
              : d && (h.x = l(d))),
          {
            x: e.left + f.scrollLeft - h.x,
            y: e.top + f.scrollTop - h.y,
            width: e.width,
            height: e.height,
          }
        );
      }
      function p(e) {
        return {
          x: e.offsetLeft,
          y: e.offsetTop,
          width: e.offsetWidth,
          height: e.offsetHeight,
        };
      }
      function f(e) {
        return 'html' === s(e)
          ? e
          : e.assignedSlot || e.parentNode || e.host || a(e);
      }
      function h(e, t) {
        void 0 === t && (t = []);
        var i = (function e(t) {
          return 0 <= ['html', 'body', '#document'].indexOf(s(t))
            ? t.ownerDocument.body
            : o(t) && u(t)
            ? t
            : e(f(t));
        })(e);
        e = 'body' === s(i);
        var r = n(i);
        return (
          (i = e ? [r].concat(r.visualViewport || [], u(i) ? i : []) : i),
          (t = t.concat(i)),
          e ? t : t.concat(h(f(i)))
        );
      }
      function m(e) {
        if (!o(e) || 'fixed' === c(e).position) return null;
        if ((e = e.offsetParent)) {
          var t = a(e);
          if (
            'body' === s(e) &&
            'static' === c(e).position &&
            'static' !== c(t).position
          )
            return t;
        }
        return e;
      }
      function v(e) {
        for (
          var t = n(e), i = m(e);
          i &&
          0 <= ['table', 'td', 'th'].indexOf(s(i)) &&
          'static' === c(i).position;

        )
          i = m(i);
        if (i && 'body' === s(i) && 'static' === c(i).position) return t;
        if (!i)
          e: {
            for (e = f(e); o(e) && 0 > ['html', 'body'].indexOf(s(e)); ) {
              if (
                'none' !== (i = c(e)).transform ||
                'none' !== i.perspective ||
                (i.willChange && 'auto' !== i.willChange)
              ) {
                i = e;
                break e;
              }
              e = e.parentNode;
            }
            i = null;
          }
        return i || t;
      }
      function b(e) {
        var t;
        return function () {
          return (
            t ||
              (t = new Promise(function (n) {
                Promise.resolve().then(function () {
                  (t = void 0), n(e());
                });
              })),
            t
          );
        };
      }
      function y(e) {
        return e.split('-')[0];
      }
      function g(e, t) {
        var i,
          r = t.getRootNode && t.getRootNode();
        if (e.contains(t)) return !0;
        if (
          ((i = r) &&
            (i = r instanceof (i = n(r).ShadowRoot) || r instanceof ShadowRoot),
          i)
        )
          do {
            if (t && e.isSameNode(t)) return !0;
            t = t.parentNode || t.host;
          } while (t);
        return !1;
      }
      function x(e) {
        return Object.assign(
          Object.assign({}, e),
          {},
          { left: e.x, top: e.y, right: e.x + e.width, bottom: e.y + e.height }
        );
      }
      function w(e, r) {
        if ('viewport' === r) {
          r = n(e);
          var s = a(e);
          r = r.visualViewport;
          var u = s.clientWidth;
          s = s.clientHeight;
          var d = 0,
            p = 0;
          r &&
            ((u = r.width),
            (s = r.height),
            /^((?!chrome|android).)*safari/i.test(navigator.userAgent) ||
              ((d = r.offsetLeft), (p = r.offsetTop))),
            (e = x((e = { width: u, height: s, x: d + l(e), y: p })));
        } else o(r) ? (((e = t(r)).top += r.clientTop), (e.left += r.clientLeft), (e.bottom = e.top + r.clientHeight), (e.right = e.left + r.clientWidth), (e.width = r.clientWidth), (e.height = r.clientHeight), (e.x = e.left), (e.y = e.top)) : ((p = a(e)), (e = a(p)), (d = i(p)), (r = p.ownerDocument.body), (u = Math.max(e.scrollWidth, e.clientWidth, r ? r.scrollWidth : 0, r ? r.clientWidth : 0)), (s = Math.max(e.scrollHeight, e.clientHeight, r ? r.scrollHeight : 0, r ? r.clientHeight : 0)), (p = -d.scrollLeft + l(p)), (d = -d.scrollTop), 'rtl' === c(r || e).direction && (p += Math.max(e.clientWidth, r ? r.clientWidth : 0) - u), (e = x({ width: u, height: s, x: p, y: d })));
        return e;
      }
      function O(e, t, n) {
        return (
          (t =
            'clippingParents' === t
              ? (function (e) {
                  var t = h(f(e)),
                    n =
                      0 <= ['absolute', 'fixed'].indexOf(c(e).position) && o(e)
                        ? v(e)
                        : e;
                  return r(n)
                    ? t.filter(function (e) {
                        return r(e) && g(e, n) && 'body' !== s(e);
                      })
                    : [];
                })(e)
              : [].concat(t)),
          ((n = (n = [].concat(t, [n])).reduce(function (t, n) {
            return (
              (n = w(e, n)),
              (t.top = Math.max(n.top, t.top)),
              (t.right = Math.min(n.right, t.right)),
              (t.bottom = Math.min(n.bottom, t.bottom)),
              (t.left = Math.max(n.left, t.left)),
              t
            );
          }, w(e, n[0]))).width = n.right - n.left),
          (n.height = n.bottom - n.top),
          (n.x = n.left),
          (n.y = n.top),
          n
        );
      }
      function _(e) {
        return 0 <= ['top', 'bottom'].indexOf(e) ? 'x' : 'y';
      }
      function E(e) {
        var t = e.reference,
          n = e.element,
          i = (e = e.placement) ? y(e) : null;
        e = e ? e.split('-')[1] : null;
        var r = t.x + t.width / 2 - n.width / 2,
          o = t.y + t.height / 2 - n.height / 2;
        switch (i) {
          case 'top':
            r = { x: r, y: t.y - n.height };
            break;
          case 'bottom':
            r = { x: r, y: t.y + t.height };
            break;
          case 'right':
            r = { x: t.x + t.width, y: o };
            break;
          case 'left':
            r = { x: t.x - n.width, y: o };
            break;
          default:
            r = { x: t.x, y: t.y };
        }
        if (null != (i = i ? _(i) : null))
          switch (((o = 'y' === i ? 'height' : 'width'), e)) {
            case 'start':
              r[i] = Math.floor(r[i]) - Math.floor(t[o] / 2 - n[o] / 2);
              break;
            case 'end':
              r[i] = Math.floor(r[i]) + Math.ceil(t[o] / 2 - n[o] / 2);
          }
        return r;
      }
      function A(e) {
        return Object.assign(
          Object.assign({}, { top: 0, right: 0, bottom: 0, left: 0 }),
          e
        );
      }
      function k(e, t) {
        return t.reduce(function (t, n) {
          return (t[n] = e), t;
        }, {});
      }
      function S(e, n) {
        void 0 === n && (n = {});
        var i = n;
        n = void 0 === (n = i.placement) ? e.placement : n;
        var o = i.boundary,
          s = void 0 === o ? 'clippingParents' : o,
          l = void 0 === (o = i.rootBoundary) ? 'viewport' : o;
        o = void 0 === (o = i.elementContext) ? 'popper' : o;
        var c = i.altBoundary,
          u = void 0 !== c && c;
        i = A(
          'number' != typeof (i = void 0 === (i = i.padding) ? 0 : i)
            ? i
            : k(i, T)
        );
        var d = e.elements.reference;
        (c = e.rects.popper),
          (s = O(
            r(
              (u =
                e.elements[u ? ('popper' === o ? 'reference' : 'popper') : o])
            )
              ? u
              : u.contextElement || a(e.elements.popper),
            s,
            l
          )),
          (u = E({
            reference: (l = t(d)),
            element: c,
            strategy: 'absolute',
            placement: n,
          })),
          (c = x(Object.assign(Object.assign({}, c), u))),
          (l = 'popper' === o ? c : l);
        var p = {
          top: s.top - l.top + i.top,
          bottom: l.bottom - s.bottom + i.bottom,
          left: s.left - l.left + i.left,
          right: l.right - s.right + i.right,
        };
        if (((e = e.modifiersData.offset), 'popper' === o && e)) {
          var f = e[n];
          Object.keys(p).forEach(function (e) {
            var t = 0 <= ['right', 'bottom'].indexOf(e) ? 1 : -1,
              n = 0 <= ['top', 'bottom'].indexOf(e) ? 'y' : 'x';
            p[e] += f[n] * t;
          });
        }
        return p;
      }
      function j() {
        for (var e = arguments.length, t = Array(e), n = 0; n < e; n++)
          t[n] = arguments[n];
        return !t.some(function (e) {
          return !(e && 'function' == typeof e.getBoundingClientRect);
        });
      }
      function $(e) {
        void 0 === e && (e = {});
        var t = e.defaultModifiers,
          n = void 0 === t ? [] : t,
          i = void 0 === (e = e.defaultOptions) ? z : e;
        return function (e, t, o) {
          function s() {
            l.forEach(function (e) {
              return e();
            }),
              (l = []);
          }
          void 0 === o && (o = i);
          var a = {
              placement: 'bottom',
              orderedModifiers: [],
              options: Object.assign(Object.assign({}, z), i),
              modifiersData: {},
              elements: { reference: e, popper: t },
              attributes: {},
              styles: {},
            },
            l = [],
            c = !1,
            u = {
              state: a,
              setOptions: function (o) {
                return (
                  s(),
                  (a.options = Object.assign(
                    Object.assign(Object.assign({}, i), a.options),
                    o
                  )),
                  (a.scrollParents = {
                    reference: r(e)
                      ? h(e)
                      : e.contextElement
                      ? h(e.contextElement)
                      : [],
                    popper: h(t),
                  }),
                  (o = (function (e) {
                    var t = (function (e) {
                      var t = new Map(),
                        n = new Set(),
                        i = [];
                      return (
                        e.forEach(function (e) {
                          t.set(e.name, e);
                        }),
                        e.forEach(function (e) {
                          n.has(e.name) ||
                            (function e(r) {
                              n.add(r.name),
                                []
                                  .concat(
                                    r.requires || [],
                                    r.requiresIfExists || []
                                  )
                                  .forEach(function (i) {
                                    n.has(i) || ((i = t.get(i)) && e(i));
                                  }),
                                i.push(r);
                            })(e);
                        }),
                        i
                      );
                    })(e);
                    return N.reduce(function (e, n) {
                      return e.concat(
                        t.filter(function (e) {
                          return e.phase === n;
                        })
                      );
                    }, []);
                  })(
                    (function (e) {
                      var t = e.reduce(function (e, t) {
                        var n = e[t.name];
                        return (
                          (e[t.name] = n
                            ? Object.assign(
                                Object.assign(Object.assign({}, n), t),
                                {},
                                {
                                  options: Object.assign(
                                    Object.assign({}, n.options),
                                    t.options
                                  ),
                                  data: Object.assign(
                                    Object.assign({}, n.data),
                                    t.data
                                  ),
                                }
                              )
                            : t),
                          e
                        );
                      }, {});
                      return Object.keys(t).map(function (e) {
                        return t[e];
                      });
                    })([].concat(n, a.options.modifiers))
                  )),
                  (a.orderedModifiers = o.filter(function (e) {
                    return e.enabled;
                  })),
                  a.orderedModifiers.forEach(function (e) {
                    var t = e.name,
                      n = e.options;
                    (n = void 0 === n ? {} : n),
                      'function' == typeof (e = e.effect) &&
                        ((t = e({
                          state: a,
                          name: t,
                          instance: u,
                          options: n,
                        })),
                        l.push(t || function () {}));
                  }),
                  u.update()
                );
              },
              forceUpdate: function () {
                if (!c) {
                  var e = a.elements,
                    t = e.reference;
                  if (j(t, (e = e.popper)))
                    for (
                      a.rects = {
                        reference: d(t, v(e), 'fixed' === a.options.strategy),
                        popper: p(e),
                      },
                        a.reset = !1,
                        a.placement = a.options.placement,
                        a.orderedModifiers.forEach(function (e) {
                          return (a.modifiersData[e.name] = Object.assign(
                            {},
                            e.data
                          ));
                        }),
                        t = 0;
                      t < a.orderedModifiers.length;
                      t++
                    )
                      if (!0 === a.reset) (a.reset = !1), (t = -1);
                      else {
                        var n = a.orderedModifiers[t];
                        e = n.fn;
                        var i = n.options;
                        (i = void 0 === i ? {} : i),
                          (n = n.name),
                          'function' == typeof e &&
                            (a =
                              e({
                                state: a,
                                options: i,
                                name: n,
                                instance: u,
                              }) || a);
                      }
                }
              },
              update: b(function () {
                return new Promise(function (e) {
                  u.forceUpdate(), e(a);
                });
              }),
              destroy: function () {
                s(), (c = !0);
              },
            };
          return j(e, t)
            ? (u.setOptions(o).then(function (e) {
                !c && o.onFirstUpdate && o.onFirstUpdate(e);
              }),
              u)
            : u;
        };
      }
      function D(e) {
        var t,
          i = e.popper,
          r = e.popperRect,
          o = e.placement,
          s = e.offsets,
          l = e.position,
          c = e.gpuAcceleration,
          u = e.adaptive,
          d = window.devicePixelRatio || 1;
        (e = Math.round(s.x * d) / d || 0), (d = Math.round(s.y * d) / d || 0);
        var p = s.hasOwnProperty('x');
        s = s.hasOwnProperty('y');
        var f,
          h = 'left',
          m = 'top',
          b = window;
        if (u) {
          var y = v(i);
          y === n(i) && (y = a(i)),
            'top' === o &&
              ((m = 'bottom'),
              (d -= y.clientHeight - r.height),
              (d *= c ? 1 : -1)),
            'left' === o &&
              ((h = 'right'),
              (e -= y.clientWidth - r.width),
              (e *= c ? 1 : -1));
        }
        return (
          (i = Object.assign({ position: l }, u && W)),
          c
            ? Object.assign(
                Object.assign({}, i),
                {},
                (((f = {})[m] = s ? '0' : ''),
                (f[h] = p ? '0' : ''),
                (f.transform =
                  2 > (b.devicePixelRatio || 1)
                    ? 'translate(' + e + 'px, ' + d + 'px)'
                    : 'translate3d(' + e + 'px, ' + d + 'px, 0)'),
                f)
              )
            : Object.assign(
                Object.assign({}, i),
                {},
                (((t = {})[m] = s ? d + 'px' : ''),
                (t[h] = p ? e + 'px' : ''),
                (t.transform = ''),
                t)
              )
        );
      }
      function P(e) {
        return e.replace(/left|right|bottom|top/g, function (e) {
          return G[e];
        });
      }
      function C(e) {
        return e.replace(/start|end/g, function (e) {
          return K[e];
        });
      }
      function L(e, t, n) {
        return (
          void 0 === n && (n = { x: 0, y: 0 }),
          {
            top: e.top - t.height - n.y,
            right: e.right - t.width + n.x,
            bottom: e.bottom - t.height + n.y,
            left: e.left - t.width - n.x,
          }
        );
      }
      function M(e) {
        return ['top', 'right', 'bottom', 'left'].some(function (t) {
          return 0 <= e[t];
        });
      }
      var T = ['top', 'bottom', 'right', 'left'],
        q = T.reduce(function (e, t) {
          return e.concat([t + '-start', t + '-end']);
        }, []),
        R = [].concat(T, ['auto']).reduce(function (e, t) {
          return e.concat([t, t + '-start', t + '-end']);
        }, []),
        N = 'beforeRead read afterRead beforeMain main afterMain beforeWrite write afterWrite'.split(
          ' '
        ),
        z = { placement: 'bottom', modifiers: [], strategy: 'absolute' },
        B = { passive: !0 },
        F = {
          name: 'eventListeners',
          enabled: !0,
          phase: 'write',
          fn: function () {},
          effect: function (e) {
            var t = e.state,
              i = e.instance,
              r = (e = e.options).scroll,
              o = void 0 === r || r,
              s = void 0 === (e = e.resize) || e,
              a = n(t.elements.popper),
              l = [].concat(t.scrollParents.reference, t.scrollParents.popper);
            return (
              o &&
                l.forEach(function (e) {
                  e.addEventListener('scroll', i.update, B);
                }),
              s && a.addEventListener('resize', i.update, B),
              function () {
                o &&
                  l.forEach(function (e) {
                    e.removeEventListener('scroll', i.update, B);
                  }),
                  s && a.removeEventListener('resize', i.update, B);
              }
            );
          },
          data: {},
        },
        I = {
          name: 'popperOffsets',
          enabled: !0,
          phase: 'read',
          fn: function (e) {
            var t = e.state;
            t.modifiersData[e.name] = E({
              reference: t.rects.reference,
              element: t.rects.popper,
              strategy: 'absolute',
              placement: t.placement,
            });
          },
          data: {},
        },
        W = { top: 'auto', right: 'auto', bottom: 'auto', left: 'auto' },
        H = {
          name: 'computeStyles',
          enabled: !0,
          phase: 'beforeWrite',
          fn: function (e) {
            var t = e.state,
              n = e.options;
            (e = void 0 === (e = n.gpuAcceleration) || e),
              (n = void 0 === (n = n.adaptive) || n),
              (e = {
                placement: y(t.placement),
                popper: t.elements.popper,
                popperRect: t.rects.popper,
                gpuAcceleration: e,
              }),
              null != t.modifiersData.popperOffsets &&
                (t.styles.popper = Object.assign(
                  Object.assign({}, t.styles.popper),
                  D(
                    Object.assign(
                      Object.assign({}, e),
                      {},
                      {
                        offsets: t.modifiersData.popperOffsets,
                        position: t.options.strategy,
                        adaptive: n,
                      }
                    )
                  )
                )),
              null != t.modifiersData.arrow &&
                (t.styles.arrow = Object.assign(
                  Object.assign({}, t.styles.arrow),
                  D(
                    Object.assign(
                      Object.assign({}, e),
                      {},
                      {
                        offsets: t.modifiersData.arrow,
                        position: 'absolute',
                        adaptive: !1,
                      }
                    )
                  )
                )),
              (t.attributes.popper = Object.assign(
                Object.assign({}, t.attributes.popper),
                {},
                { 'data-popper-placement': t.placement }
              ));
          },
          data: {},
        },
        U = {
          name: 'applyStyles',
          enabled: !0,
          phase: 'write',
          fn: function (e) {
            var t = e.state;
            Object.keys(t.elements).forEach(function (e) {
              var n = t.styles[e] || {},
                i = t.attributes[e] || {},
                r = t.elements[e];
              o(r) &&
                s(r) &&
                (Object.assign(r.style, n),
                Object.keys(i).forEach(function (e) {
                  var t = i[e];
                  !1 === t
                    ? r.removeAttribute(e)
                    : r.setAttribute(e, !0 === t ? '' : t);
                }));
            });
          },
          effect: function (e) {
            var t = e.state,
              n = {
                popper: {
                  position: t.options.strategy,
                  left: '0',
                  top: '0',
                  margin: '0',
                },
                arrow: { position: 'absolute' },
                reference: {},
              };
            return (
              Object.assign(t.elements.popper.style, n.popper),
              t.elements.arrow &&
                Object.assign(t.elements.arrow.style, n.arrow),
              function () {
                Object.keys(t.elements).forEach(function (e) {
                  var i = t.elements[e],
                    r = t.attributes[e] || {};
                  (e = Object.keys(
                    t.styles.hasOwnProperty(e) ? t.styles[e] : n[e]
                  ).reduce(function (e, t) {
                    return (e[t] = ''), e;
                  }, {})),
                    o(i) &&
                      s(i) &&
                      (Object.assign(i.style, e),
                      Object.keys(r).forEach(function (e) {
                        i.removeAttribute(e);
                      }));
                });
              }
            );
          },
          requires: ['computeStyles'],
        },
        V = {
          name: 'offset',
          enabled: !0,
          phase: 'main',
          requires: ['popperOffsets'],
          fn: function (e) {
            var t = e.state,
              n = e.name,
              i = void 0 === (e = e.options.offset) ? [0, 0] : e,
              r = (e = R.reduce(function (e, n) {
                var r = t.rects,
                  o = y(n),
                  s = 0 <= ['left', 'top'].indexOf(o) ? -1 : 1,
                  a =
                    'function' == typeof i
                      ? i(
                          Object.assign(
                            Object.assign({}, r),
                            {},
                            { placement: n }
                          )
                        )
                      : i;
                return (
                  (r = (r = a[0]) || 0),
                  (a = ((a = a[1]) || 0) * s),
                  (o =
                    0 <= ['left', 'right'].indexOf(o)
                      ? { x: a, y: r }
                      : { x: r, y: a }),
                  (e[n] = o),
                  e
                );
              }, {}))[t.placement],
              o = r.x;
            (r = r.y),
              null != t.modifiersData.popperOffsets &&
                ((t.modifiersData.popperOffsets.x += o),
                (t.modifiersData.popperOffsets.y += r)),
              (t.modifiersData[n] = e);
          },
        },
        G = { left: 'right', right: 'left', bottom: 'top', top: 'bottom' },
        K = { start: 'end', end: 'start' },
        X = {
          name: 'flip',
          enabled: !0,
          phase: 'main',
          fn: function (e) {
            var t = e.state,
              n = e.options;
            if (((e = e.name), !t.modifiersData[e]._skip)) {
              var i = n.mainAxis;
              i = void 0 === i || i;
              var r = n.altAxis;
              r = void 0 === r || r;
              var o = n.fallbackPlacements,
                s = n.padding,
                a = n.boundary,
                l = n.rootBoundary,
                c = n.altBoundary,
                u = n.flipVariations,
                d = void 0 === u || u,
                p = n.allowedAutoPlacements;
              (u = y((n = t.options.placement))),
                (o =
                  o ||
                  (u !== n && d
                    ? (function (e) {
                        if ('auto' === y(e)) return [];
                        var t = P(e);
                        return [C(e), t, C(t)];
                      })(n)
                    : [P(n)]));
              var f = [n].concat(o).reduce(function (e, n) {
                return e.concat(
                  'auto' === y(n)
                    ? (function (e, t) {
                        void 0 === t && (t = {});
                        var n = t.boundary,
                          i = t.rootBoundary,
                          r = t.padding,
                          o = t.flipVariations,
                          s = t.allowedAutoPlacements,
                          a = void 0 === s ? R : s,
                          l = t.placement.split('-')[1];
                        0 ===
                          (o = (t = l
                            ? o
                              ? q
                              : q.filter(function (e) {
                                  return e.split('-')[1] === l;
                                })
                            : T).filter(function (e) {
                            return 0 <= a.indexOf(e);
                          })).length && (o = t);
                        var c = o.reduce(function (t, o) {
                          return (
                            (t[o] = S(e, {
                              placement: o,
                              boundary: n,
                              rootBoundary: i,
                              padding: r,
                            })[y(o)]),
                            t
                          );
                        }, {});
                        return Object.keys(c).sort(function (e, t) {
                          return c[e] - c[t];
                        });
                      })(t, {
                        placement: n,
                        boundary: a,
                        rootBoundary: l,
                        padding: s,
                        flipVariations: d,
                        allowedAutoPlacements: p,
                      })
                    : n
                );
              }, []);
              (n = t.rects.reference), (o = t.rects.popper);
              var h = new Map();
              u = !0;
              for (var m = f[0], v = 0; v < f.length; v++) {
                var b = f[v],
                  g = y(b),
                  x = 'start' === b.split('-')[1],
                  w = 0 <= ['top', 'bottom'].indexOf(g),
                  O = w ? 'width' : 'height',
                  _ = S(t, {
                    placement: b,
                    boundary: a,
                    rootBoundary: l,
                    altBoundary: c,
                    padding: s,
                  });
                if (
                  ((x = w ? (x ? 'right' : 'left') : x ? 'bottom' : 'top'),
                  n[O] > o[O] && (x = P(x)),
                  (O = P(x)),
                  (w = []),
                  i && w.push(0 >= _[g]),
                  r && w.push(0 >= _[x], 0 >= _[O]),
                  w.every(function (e) {
                    return e;
                  }))
                ) {
                  (m = b), (u = !1);
                  break;
                }
                h.set(b, w);
              }
              if (u)
                for (
                  i = function (e) {
                    var t = f.find(function (t) {
                      if ((t = h.get(t)))
                        return t.slice(0, e).every(function (e) {
                          return e;
                        });
                    });
                    if (t) return (m = t), 'break';
                  },
                    r = d ? 3 : 1;
                  0 < r && 'break' !== i(r);
                  r--
                );
              t.placement !== m &&
                ((t.modifiersData[e]._skip = !0),
                (t.placement = m),
                (t.reset = !0));
            }
          },
          requiresIfExists: ['offset'],
          data: { _skip: !1 },
        },
        Y = {
          name: 'preventOverflow',
          enabled: !0,
          phase: 'main',
          fn: function (e) {
            var t = e.state,
              n = e.options;
            e = e.name;
            var i = n.mainAxis,
              r = void 0 === i || i;
            i = void 0 !== (i = n.altAxis) && i;
            var o = n.tether;
            o = void 0 === o || o;
            var s = n.tetherOffset,
              a = void 0 === s ? 0 : s;
            (n = S(t, {
              boundary: n.boundary,
              rootBoundary: n.rootBoundary,
              padding: n.padding,
              altBoundary: n.altBoundary,
            })),
              (s = y(t.placement));
            var l = t.placement.split('-')[1],
              c = !l,
              u = _(s);
            s = 'x' === u ? 'y' : 'x';
            var d = t.modifiersData.popperOffsets,
              f = t.rects.reference,
              h = t.rects.popper,
              m =
                'function' == typeof a
                  ? a(
                      Object.assign(
                        Object.assign({}, t.rects),
                        {},
                        { placement: t.placement }
                      )
                    )
                  : a;
            if (((a = { x: 0, y: 0 }), d)) {
              if (r) {
                var b = 'y' === u ? 'top' : 'left',
                  g = 'y' === u ? 'bottom' : 'right',
                  x = 'y' === u ? 'height' : 'width';
                r = d[u];
                var w = d[u] + n[b],
                  O = d[u] - n[g],
                  E = o ? -h[x] / 2 : 0,
                  A = 'start' === l ? f[x] : h[x];
                (l = 'start' === l ? -h[x] : -f[x]),
                  (h = t.elements.arrow),
                  (h = o && h ? p(h) : { width: 0, height: 0 });
                var k = t.modifiersData['arrow#persistent']
                  ? t.modifiersData['arrow#persistent'].padding
                  : { top: 0, right: 0, bottom: 0, left: 0 };
                (b = k[b]),
                  (g = k[g]),
                  (h = Math.max(0, Math.min(f[x], h[x]))),
                  (A = c ? f[x] / 2 - E - h - b - m : A - h - b - m),
                  (c = c ? -f[x] / 2 + E + h + g + m : l + h + g + m),
                  (m = t.elements.arrow && v(t.elements.arrow)),
                  (f = t.modifiersData.offset
                    ? t.modifiersData.offset[t.placement][u]
                    : 0),
                  (m =
                    d[u] +
                    A -
                    f -
                    (m
                      ? 'y' === u
                        ? m.clientTop || 0
                        : m.clientLeft || 0
                      : 0)),
                  (c = d[u] + c - f),
                  (o = Math.max(
                    o ? Math.min(w, m) : w,
                    Math.min(r, o ? Math.max(O, c) : O)
                  )),
                  (d[u] = o),
                  (a[u] = o - r);
              }
              i &&
                ((i = d[s]),
                (o = Math.max(
                  i + n['x' === u ? 'top' : 'left'],
                  Math.min(i, i - n['x' === u ? 'bottom' : 'right'])
                )),
                (d[s] = o),
                (a[s] = o - i)),
                (t.modifiersData[e] = a);
            }
          },
          requiresIfExists: ['offset'],
        },
        Z = {
          name: 'arrow',
          enabled: !0,
          phase: 'main',
          fn: function (e) {
            var t,
              n = e.state;
            e = e.name;
            var i = n.elements.arrow,
              r = n.modifiersData.popperOffsets,
              o = y(n.placement),
              s = _(o);
            if (
              ((o = 0 <= ['left', 'right'].indexOf(o) ? 'height' : 'width'),
              i && r)
            ) {
              var a = n.modifiersData[e + '#persistent'].padding,
                l = p(i),
                c = 'y' === s ? 'top' : 'left',
                u = 'y' === s ? 'bottom' : 'right',
                d =
                  n.rects.reference[o] +
                  n.rects.reference[s] -
                  r[s] -
                  n.rects.popper[o];
              (r = r[s] - n.rects.reference[s]),
                (d =
                  (i = (i = v(i))
                    ? 'y' === s
                      ? i.clientHeight || 0
                      : i.clientWidth || 0
                    : 0) /
                    2 -
                  l[o] / 2 +
                  (d / 2 - r / 2)),
                (o = Math.max(a[c], Math.min(d, i - l[o] - a[u]))),
                (n.modifiersData[e] =
                  (((t = {})[s] = o), (t.centerOffset = o - d), t));
            }
          },
          effect: function (e) {
            var t = e.state,
              n = e.options;
            e = e.name;
            var i = n.element;
            if (
              ((i = void 0 === i ? '[data-popper-arrow]' : i),
              (n = void 0 === (n = n.padding) ? 0 : n),
              null != i)
            ) {
              if (
                'string' == typeof i &&
                !(i = t.elements.popper.querySelector(i))
              )
                return;
              g(t.elements.popper, i) &&
                ((t.elements.arrow = i),
                (t.modifiersData[e + '#persistent'] = {
                  padding: A('number' != typeof n ? n : k(n, T)),
                }));
            }
          },
          requires: ['popperOffsets'],
          requiresIfExists: ['preventOverflow'],
        },
        J = {
          name: 'hide',
          enabled: !0,
          phase: 'main',
          requiresIfExists: ['preventOverflow'],
          fn: function (e) {
            var t = e.state;
            e = e.name;
            var n = t.rects.reference,
              i = t.rects.popper,
              r = t.modifiersData.preventOverflow,
              o = S(t, { elementContext: 'reference' }),
              s = S(t, { altBoundary: !0 });
            (n = L(o, n)),
              (i = L(s, i, r)),
              (r = M(n)),
              (s = M(i)),
              (t.modifiersData[e] = {
                referenceClippingOffsets: n,
                popperEscapeOffsets: i,
                isReferenceHidden: r,
                hasPopperEscaped: s,
              }),
              (t.attributes.popper = Object.assign(
                Object.assign({}, t.attributes.popper),
                {},
                { 'data-popper-reference-hidden': r, 'data-popper-escaped': s }
              ));
          },
        },
        Q = $({ defaultModifiers: [F, I, H, U] }),
        ee = [F, I, H, U, V, X, Y, Z, J],
        te = $({ defaultModifiers: ee });
      (e.applyStyles = U),
        (e.arrow = Z),
        (e.computeStyles = H),
        (e.createPopper = te),
        (e.createPopperLite = Q),
        (e.defaultModifiers = ee),
        (e.detectOverflow = S),
        (e.eventListeners = F),
        (e.flip = X),
        (e.hide = J),
        (e.offset = V),
        (e.popperGenerator = $),
        (e.popperOffsets = I),
        (e.preventOverflow = Y),
        Object.defineProperty(e, '__esModule', { value: !0 });
    }),
    (window.collapse = function () {
      return {
        open: !1,
        trigger: {
          '@click'() {
            const e = this.$el.querySelector('[x-spread]', 'trigger');
            (this.open = !this.open),
              e.setAttribute('aria-expanded', this.open);
          },
        },
        collapse: {
          'x-show.transition.opacity.duration.200ms'() {
            return this.open;
          },
        },
      };
    });
  const n = (e, t) => {
      var n = Math.abs(t) % e.length;
      n >= 0 && e[n].focus();
    },
    i = (e) => {
      var t = e.querySelector('[x-spread="trigger"]');
      t && t.focus();
    },
    r = (e) => {
      const t = document.querySelector('html'),
        n = document.querySelector('body');
      e
        ? (o() && (n.style.paddingRight = s() + 'px'),
          (t.style.overflow = 'hidden'))
        : ((n.style.paddingRight = null), (t.style.overflow = null));
    },
    o = () => {
      const e = document.body.getBoundingClientRect();
      return Math.round(e.left + e.right) < window.innerWidth;
    },
    s = () => {
      const e = document.createElement('div');
      (e.className = 'scrollbar-measure'), document.body.appendChild(e);
      const t = e.getBoundingClientRect().width - e.clientWidth;
      return document.body.removeChild(e), t;
    };
  var a = null;
  function l(e, t) {
    let n = e.querySelector('[x-spread="trigger"]'),
      i = e.querySelector('[x-spread="dropdown"]');
    n &&
      i &&
      (t
        ? (n.setAttribute('aria-expanded', !0),
          i.setAttribute('aria-hidden', !1))
        : (n.setAttribute('aria-expanded', !1),
          i.setAttribute('aria-hidden', !0)));
  }
  window.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll('[x-data="dropdown()"]').forEach(function (e) {
      !(function (e) {
        let t = e.querySelector('[x-spread="trigger"]'),
          n = e.querySelector('[x-spread="dropdown"]');
        if (t && n) {
          t.setAttribute('aria-haspopup', !0),
            t.setAttribute('aria-expanded', !1),
            t.setAttribute('aria-controls', e.id),
            n.setAttribute('role', 'menu'),
            n.setAttribute('aria-labelledby', t.id),
            n.setAttribute('aria-hidden', !0);
          let i = e.querySelectorAll('.dropdown-item');
          i.length &&
            [...i].forEach(function (e) {
              e.setAttribute('role', 'menuitem'),
                e.setAttribute('tabindex', -1);
            }),
            Popper.createPopper(t, n, {
              placement: n.getAttribute('x-position') || 'bottom-start',
            });
        }
      })(e);
    });
  }),
    (window.dropdown = function () {
      var e = -1;
      const t = '.dropdown-item';
      return {
        open: !1,
        trigger: {
          '@keydown.escape'() {
            (this.open = !1), i(this.$el), l(this.$el, this.open);
          },
          '@click'() {
            (this.open = !this.open),
              (e = -1),
              this.open ? (a = this.$el) : i(this.$el),
              l(this.$el, this.open);
          },
          '@keydown.arrow-down'(i) {
            i.preventDefault();
            var r = this.$el.querySelectorAll(t);
            e++, n(r, e);
          },
          '@keydown.arrow-up'(i) {
            i.preventDefault();
            var r = this.$el.querySelectorAll(t);
            (e = r.length - 1), n(r, e);
          },
          '@keydown.home'(i) {
            i.preventDefault(), (e = -1);
            var r = this.$el.querySelectorAll(t);
            e++, n(r, e);
          },
          '@keydown.end'(i) {
            i.preventDefault();
            var r = this.$el.querySelectorAll(t);
            (e = r.length - 1), n(r, e);
          },
        },
        dropdown: {
          '@keydown.escape'() {
            (this.open = !1), (e = -1), i(this.$el), l(this.$el, this.open);
          },
          'x-show.transition.in.duration.100ms.opacity.out.opacity.duration.100ms'() {
            return this.open;
          },
          '@click.away'() {
            (this.open = !1), (e = -1), i(a), l(this.$el, this.open);
          },
          '@keydown.arrow-down'(i) {
            i.preventDefault();
            var r = this.$el.querySelectorAll(t);
            e++, n(r, e);
          },
          '@keydown.arrow-up'(i) {
            i.preventDefault();
            var r = this.$el.querySelectorAll(t);
            (e = (function (e, t) {
              return t <= 0 ? e.length - 1 : t - 1;
            })(r, e)),
              n(r, e);
          },
          '@keydown.home'(i) {
            i.preventDefault(), (e = -1);
            var r = this.$el.querySelectorAll(t);
            e++, n(r, e);
          },
          '@keydown.end'(i) {
            i.preventDefault();
            var r = this.$el.querySelectorAll(t);
            (e = r.length - 1), n(r, e);
          },
        },
      };
    });
  const c = [
    '[href]:not([tabindex^="-"])',
    'input:not([disabled]):not([type="hidden"]):not([tabindex^="-"]):not([type="radio"])',
    'input[type="radio"]:checked',
    'select:not([disabled]):not([tabindex^="-"])',
    'textarea:not([disabled]):not([tabindex^="-"])',
    'button:not([disabled]):not([tabindex^="-"])',
    '[tabindex]:not([tabindex^="-"])',
    '[contenteditable="true"]:not([tabindex^="-"])',
  ];
  var u = null;
  function d(e, t) {
    (e = e.querySelectorAll('[x-spread="drawer"]')).length &&
      ((e = e[0]),
      t
        ? e.setAttribute('aria-hidden', !1)
        : e.setAttribute('aria-hidden', !0));
  }
  document.querySelectorAll('[x-data="drawer()"]').forEach(function (e) {
    !(function (e) {
      var t = e.querySelectorAll('[x-spread="trigger"]');
      t.length &&
        ((t = t[0]).setAttribute('aria-haspopup', 'dialog'),
        (e = e.querySelectorAll('[x-spread="drawer"]')).length &&
          ((e = e[0]).setAttribute('role', 'drawer'),
          e.setAttribute('aria-hidden', !0),
          e.setAttribute('aria-modal', !0),
          e.setAttribute('tabindex', -1)));
    })(e);
  }),
    (window.drawer = function () {
      var e = -1;
      return {
        open: !1,
        trigger: {
          '@click'() {
            if (((this.open = !this.open), this.open)) {
              u = this.$el;
              var t = this.$el
                .querySelector('[x-spread="drawer"]')
                .querySelectorAll(c);
              e++, n(t, e);
            } else e = -1;
            r(this.open), d(this.$el, this.open);
          },
          '@keydown.escape'() {
            (this.open = !1),
              (e = -1),
              i(u),
              r(this.open),
              d(this.$el, this.open);
          },
        },
        drawer: {
          'x-show.transition.opacity.duration.100ms'() {
            const e = this.$el.querySelector('[x-spread="drawer"]');
            return (
              this.open
                ? setTimeout(() => e.classList.add('active'), 100)
                : e.classList.remove('active'),
              this.open
            );
          },
          '@keydown.escape'() {
            (this.open = !1),
              (e = -1),
              i(u),
              r(this.open),
              d(this.$el, this.open);
          },
          '@keydown.tab'(t) {
            t.preventDefault();
            var i = this.$el
              .querySelector('[x-spread="drawer"]')
              .querySelectorAll(c);
            e++, n(i, e);
          },
          '@click'(t) {
            this.open &&
              t.target.hasAttribute('x-spread') &&
              ((this.open = !1),
              (e = -1),
              i(u),
              r(this.open),
              d(this.$el, this.open));
          },
        },
        close() {
          (this.open = !1),
            (e = -1),
            i(u),
            r(this.open),
            d(this.$el, this.open);
        },
      };
    });
  var p = null;
  function f(e, t) {
    (e = e.querySelectorAll('[x-spread="dialog"]')).length &&
      ((e = e[0]),
      t
        ? e.setAttribute('aria-hidden', !1)
        : e.setAttribute('aria-hidden', !0));
  }
  document.querySelectorAll('[x-data="dialog()"]').forEach(function (e) {
    !(function (e) {
      var t = e.querySelectorAll('[x-spread="trigger"]');
      t.length &&
        ((t = t[0]).setAttribute('aria-haspopup', 'dialog'),
        (e = e.querySelectorAll('[x-spread="dialog"]')).length &&
          ((e = e[0]).setAttribute('role', 'dialog'),
          e.setAttribute('aria-hidden', !0),
          e.setAttribute('aria-modal', !0),
          e.setAttribute('tabindex', -1)));
    })(e);
  }),
    (window.dialog = function () {
      var e = -1;
      return {
        open: !1,
        trigger: {
          '@click'() {
            if (((this.open = !this.open), this.open)) {
              p = this.$el;
              var t = this.$el
                .querySelector('[x-spread="dialog"]')
                .querySelectorAll(c);
              e++, n(t, e);
            } else e = -1;
            r(this.open), f(this.$el, this.open);
          },
          '@keydown.escape'() {
            (this.open = !1),
              (e = -1),
              i(p),
              r(this.open),
              f(this.$el, this.open);
          },
        },
        dialog: {
          'x-show.transition.opacity.duration.100ms.origin.center.center.scale.105'() {
            return this.open;
          },
          '@keydown.escape'() {
            (this.open = !1),
              (e = -1),
              i(p),
              r(this.open),
              f(this.$el, this.open);
          },
          '@keydown.tab'(t) {
            t.preventDefault();
            var i = this.$el
              .querySelector('[x-spread="dialog"]')
              .querySelectorAll(c);
            e++, n(i, e);
          },
          '@click'(t) {
            this.open &&
              t.target.hasAttribute('x-spread') &&
              ((this.open = !1),
              (e = -1),
              i(p),
              r(this.open),
              f(this.$el, this.open));
          },
        },
        close() {
          (this.open = !1),
            (e = -1),
            i(p),
            r(this.open),
            f(this.$el, this.open);
        },
      };
    });
  window.tooltip = function () {
    return {
      tooltip: {
        '@mouseenter'() {
          !(function (e) {
            let t = document.createElement('div');
            t.setAttribute('class', 'tooltip'),
              t.setAttribute('role', 'tooltip'),
              t.setAttribute('id', 'tooltip-kutty'),
              (t.innerText = e.getAttribute('title')),
              document.body.append(t),
              e.setAttribute('title', ''),
              Popper.createPopper(e, t, {
                placement: e.getAttribute('x-position') || 'top',
              });
          })(this.$el);
        },
        '@mouseleave'() {
          !(function (e) {
            let t = document.getElementById('tooltip-kutty'),
              n = t.innerText;
            e.setAttribute('title', n), t.parentNode.removeChild(t);
          })(this.$el);
        },
      },
    };
  };
})();
