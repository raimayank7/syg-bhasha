/* langs: filter and compare */
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
  var A = d.querySelector('[data-a]'), B = d.querySelector('[data-b]'), out = d.querySelector('[data-cmp]');
  if (A && B && out) {
    var D = null;
    var q = new URLSearchParams(location.search);
    A.value = q.get('a') || 'hi'; B.value = q.get('b') || 'en';
    if (!A.value) A.selectedIndex = 0; if (!B.value) B.selectedIndex = 1;
    var cell = function (x, l) { return '<td lang="' + SYG.esc(l) + '"' + '>' + SYG.esc(x) + '</td>'; };
    var run = function () {
      if (!D) return;
      var a = D[A.value], b = D[B.value]; if (!a || !b) return;
      var rows = [['Name in English', a.n, b.n, 'en'], ['Name in the language', a.e, b.e], ['Script', a.sc || '-', b.sc || '-', 'en'], ['Direction', a.r ? 'right to left' : 'left to right', b.r ? 'right to left' : 'left to right', 'en'],
        ['Full date (Sat 14 Nov 2026)', a.f, b.f], ['Short date', a.s, b.s], ['1,234,567.89 written', a.u, b.u]];
      for (var i = 0; i < 7; i++) rows.push(['Day ' + (i + 1), a.d[i], b.d[i]]);
      for (var j = 0; j < 12; j++) rows.push(['Month ' + (j + 1), a.m[j], b.m[j]]);
      out.innerHTML = '<div class="tbl"><table class="st"><thead><tr><th></th><th>' + SYG.esc(a.n) + '</th><th>' + SYG.esc(b.n) + '</th></tr></thead><tbody>' +
        rows.map(function (r) { return '<tr><th scope="row">' + SYG.esc(r[0]) + '</th>' + cell(r[1], r[3] || A.value) + cell(r[2], r[3] || B.value) + '</tr>'; }).join('') + '</tbody></table></div>';
    };
    SYG.json('/langs/data/langs.json').then(function (j) { D = j; run(); });
    A.addEventListener('change', run); B.addEventListener('change', run);
  }
})();
