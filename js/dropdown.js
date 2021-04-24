!(function () {
  'use strict';
  const e = (e, t) => {
      var r = Math.abs(t) % e.length;
      r >= 0 && e[r].focus();
    },
    t = (e) => {
      var t = e.querySelector('[x-spread="trigger"]');
      t && t.focus();
    };
  var r = null;
  function o(e, t) {
    let r = e.querySelector('[x-spread="trigger"]'),
      o = e.querySelector('[x-spread="dropdown"]');
    r &&
      o &&
      (t
        ? (r.setAttribute('aria-expanded', !0),
          o.setAttribute('aria-hidden', !1))
        : (r.setAttribute('aria-expanded', !1),
          o.setAttribute('aria-hidden', !0)));
  }
  window.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll('[x-data="dropdown()"]').forEach(function (e) {
      !(function (e) {
        let t = e.querySelector('[x-spread="trigger"]'),
          r = e.querySelector('[x-spread="dropdown"]');
        if (t && r) {
          t.setAttribute('aria-haspopup', !0),
            t.setAttribute('aria-expanded', !1),
            t.setAttribute('aria-controls', e.id),
            r.setAttribute('role', 'menu'),
            r.setAttribute('aria-labelledby', t.id),
            r.setAttribute('aria-hidden', !0);
          let o = e.querySelectorAll('.dropdown-item');
          o.length &&
            [...o].forEach(function (e) {
              e.setAttribute('role', 'menuitem'),
                e.setAttribute('tabindex', -1);
            }),
            Popper.createPopper(t, r, {
              placement: r.getAttribute('x-position') || 'bottom-start',
            });
        }
      })(e);
    });
  }),
    (window.dropdown = function () {
      var n = -1;
      const i = '.dropdown-item';
      return {
        open: !1,
        trigger: {
          '@keydown.escape'() {
            (this.open = !1), t(this.$el), o(this.$el, this.open);
          },
          '@click'() {
            (this.open = !this.open),
              (n = -1),
              this.open ? (r = this.$el) : t(this.$el),
              o(this.$el, this.open);
          },
          '@keydown.arrow-down'(t) {
            t.preventDefault();
            var r = this.$el.querySelectorAll(i);
            n++, e(r, n);
          },
          '@keydown.arrow-up'(t) {
            t.preventDefault();
            var r = this.$el.querySelectorAll(i);
            (n = r.length - 1), e(r, n);
          },
          '@keydown.home'(t) {
            t.preventDefault(), (n = -1);
            var r = this.$el.querySelectorAll(i);
            n++, e(r, n);
          },
          '@keydown.end'(t) {
            t.preventDefault();
            var r = this.$el.querySelectorAll(i);
            (n = r.length - 1), e(r, n);
          },
        },
        dropdown: {
          '@keydown.escape'() {
            (this.open = !1), (n = -1), t(this.$el), o(this.$el, this.open);
          },
          'x-show.transition.in.duration.100ms.opacity.out.opacity.duration.100ms'() {
            return this.open;
          },
          '@click.away'() {
            (this.open = !1), (n = -1), t(r), o(this.$el, this.open);
          },
          '@keydown.arrow-down'(t) {
            t.preventDefault();
            var r = this.$el.querySelectorAll(i);
            n++, e(r, n);
          },
          '@keydown.arrow-up'(t) {
            t.preventDefault();
            var r = this.$el.querySelectorAll(i);
            (n = (function (e, t) {
              return t <= 0 ? e.length - 1 : t - 1;
            })(r, n)),
              e(r, n);
          },
          '@keydown.home'(t) {
            t.preventDefault(), (n = -1);
            var r = this.$el.querySelectorAll(i);
            n++, e(r, n);
          },
          '@keydown.end'(t) {
            t.preventDefault();
            var r = this.$el.querySelectorAll(i);
            (n = r.length - 1), e(r, n);
          },
        },
      };
    });
})();
