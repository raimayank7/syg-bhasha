/* rishte: filter */
(function () {
  'use strict';
  var d = document, f = d.querySelector('[data-filter]');
  if (!f) return;
  var items = d.querySelectorAll('[data-item]'), none = d.querySelector('[data-none]');
  f.addEventListener('input', function () {
    var w = f.value.toLowerCase().split(/\s+/).filter(Boolean), n = 0;
    items.forEach(function (x) { var t = x.textContent.toLowerCase(), ok = w.every(function (y) { return t.indexOf(y) > -1; }); x.hidden = !ok; if (ok) n++; });
    if (none) none.hidden = n > 0;
  });
})();
