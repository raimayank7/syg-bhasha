/* german: conjugator, noun filter, article quiz */
(function () {
  'use strict';
  var d = document, SYG = window.SYG, D = null;
  function load(cb) { if (D) return cb(); SYG.json('/german/data/de.json').then(function (j) { D = j; cb(); }); }
  var NAMES = { present: 'Present', preterite: 'Preterite', perfect: 'Perfect', future: 'Future' };
  var tool = d.querySelector('[data-conj]');
  if (tool) {
    var inp = tool.querySelector('input'), out = d.querySelector('[data-out]');
    var run = function () {
      if (!D) return;
      var v = inp.value.toLowerCase().trim(), r = D.v[v];
      if (!r) { out.innerHTML = '<p class="note">"' + SYG.esc(v) + '" is not in our list of ' + Object.keys(D.v).length + ' verbs. Pick one from the suggestions.</p>'; return; }
      var T = ['present', 'preterite', 'perfect', 'future'];
      out.innerHTML = '<p><a href="/german/verb/' + encodeURIComponent(v) + '/"><b lang="de">' + SYG.esc(v) + '</b></a>: ' + SYG.esc(r.g) + '. Participle <b lang="de">' + SYG.esc(r.pp) + '</b>, auxiliary <b lang="de">' + SYG.esc(r.aux) + '</b>.</p>' +
        '<div class="tbl"><table class="st"><thead><tr><th>Tense</th>' + D.p.map(function (p) { return '<th>' + SYG.esc(p) + '</th>'; }).join('') + '</tr></thead><tbody>' +
        T.map(function (t) { return '<tr><th scope="row">' + NAMES[t] + '</th>' + r[t].map(function (f) { return '<td lang="de">' + SYG.esc(f) + '</td>'; }).join('') + '</tr>'; }).join('') + '</tbody></table></div>';
    };
    load(run); inp.addEventListener('input', function () { load(run); });
  }
  var f = d.querySelector('[data-filter]');
  if (f) {
    var items = d.querySelectorAll('[data-item]');
    f.addEventListener('input', function () {
      var w = f.value.toLowerCase().split(/\s+/).filter(Boolean);
      items.forEach(function (x) { var t = x.textContent.toLowerCase(); x.hidden = !w.every(function (y) { return t.indexOf(y) > -1; }); });
    });
  }
  var qz = d.querySelector('[data-quiz]');
  if (qz) {
    var box = qz.querySelector('.qbox'), q = qz.querySelector('.qq'), st = qz.querySelector('.qs'), n = 0, ok = 0, cur = null;
    var next = function () { cur = D.n[Math.floor(Math.random() * D.n.length)]; q.textContent = cur[1]; };
    qz.querySelector('[data-start]').addEventListener('click', function () { load(function () { n = 0; ok = 0; box.hidden = false; st.textContent = ''; next(); }); });
    qz.querySelector('.qo').addEventListener('click', function (e) {
      var b = e.target.closest('button'); if (!b || !cur) return; n++;
      if (b.getAttribute('data-a') === cur[0]) { ok++; st.textContent = 'Right: ' + cur[0] + ' ' + cur[1] + ' (plural: die ' + (cur[2] === '-' ? 'none' : cur[2]) + '). ' + ok + ' of ' + n + '.'; }
      else { st.textContent = 'Not quite: ' + cur[0] + ' ' + cur[1] + ' (plural: die ' + (cur[2] === '-' ? 'none' : cur[2]) + '). ' + ok + ' of ' + n + '.'; }
      next();
    });
  }
})();
