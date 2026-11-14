/* spanish: conjugator */
(function () {
  'use strict';
  var d = document, SYG = window.SYG;
  var tool = d.querySelector('[data-conj]'); if (!tool) return;
  var inp = tool.querySelector('input'), out = d.querySelector('[data-out]'), D = null;
  var NAMES = { present: 'Present', preterite: 'Preterite', imperfect: 'Imperfect', future: 'Future', conditional: 'Conditional', subjunctive: 'Present subjunctive' };
  function run() {
    if (!D) return;
    var v = inp.value.toLowerCase().trim(), r = D.v[v];
    if (!r) { out.innerHTML = '<p class="note">"' + SYG.esc(v) + '" is not in our list of ' + Object.keys(D.v).length + ' verbs. Pick one from the suggestions.</p>'; return; }
    var h = '<p><a href="/spanish/verb/' + encodeURIComponent(v) + '/"><b lang="es">' + SYG.esc(v) + '</b></a>: ' + SYG.esc(r.g) + '. Gerund <b lang="es">' + SYG.esc(r.ger) + '</b>, participle <b lang="es">' + SYG.esc(r.pp) + '</b>.</p>';
    h += '<div class="tbl"><table class="st"><thead><tr><th>Tense</th>' + D.p.map(function (p) { return '<th>' + SYG.esc(p) + '</th>'; }).join('') + '</tr></thead><tbody>' +
      D.t.map(function (t) { return '<tr><th scope="row"><a href="/spanish/tense/' + t + '/">' + NAMES[t] + '</a></th>' + r[t].map(function (f) { return '<td lang="es">' + SYG.esc(f) + '</td>'; }).join('') + '</tr>'; }).join('') + '</tbody></table></div>';
    out.innerHTML = h;
  }
  SYG.json('/spanish/data/verbs.json').then(function (j) { D = j; run(); });
  inp.addEventListener('input', run);
})();
