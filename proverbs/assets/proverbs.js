/* proverbs: random saying and filter */
(function () {
  'use strict';
  var d = document, SYG = window.SYG;
  var f = d.querySelector('[data-filter]');
  if (f) {
    var items = d.querySelectorAll('[data-item]'), none = d.querySelector('[data-none]');
    f.addEventListener('input', function () {
      var w = f.value.toLowerCase().split(/\s+/).filter(Boolean), n = 0;
      items.forEach(function (x) { var t = x.textContent.toLowerCase(), ok = w.every(function (y) { return t.indexOf(y) > -1; }); x.hidden = !ok; if (ok) n++; });
      if (none) none.hidden = n > 0;
    });
  }
  var box = d.querySelector('[data-rand]');
  if (box) {
    var data = null, s = box.querySelector('[data-s]'), m = box.querySelector('[data-m]'), a = box.querySelector('[data-link]');
    var show = function () {
      var r = data[Math.floor(Math.random() * data.length)];
      s.textContent = r.s.charAt(0).toUpperCase() + r.s.slice(1); m.textContent = r.m; a.href = r.u;
    };
    SYG.json('/proverbs/data/proverbs.json').then(function (j) { data = j; show(); });
    box.querySelector('[data-next]').addEventListener('click', function () { if (data) show(); });
  }
})();
