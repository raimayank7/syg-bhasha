/* grammar: tense conjugator and quiz (JS twin of tenses.py) */
(function () {
  'use strict';
  var d = document, SYG = window.SYG;
  var T12 = ['simple-present', 'present-continuous', 'present-perfect', 'present-perfect-continuous', 'simple-past', 'past-continuous', 'past-perfect', 'past-perfect-continuous', 'simple-future', 'future-continuous', 'future-perfect', 'future-perfect-continuous'];
  var NAMES = { 'simple-present': 'Simple present', 'present-continuous': 'Present continuous', 'present-perfect': 'Present perfect', 'present-perfect-continuous': 'Present perfect continuous', 'simple-past': 'Simple past', 'past-continuous': 'Past continuous',
    'past-perfect': 'Past perfect', 'past-perfect-continuous': 'Past perfect continuous', 'simple-future': 'Simple future', 'future-continuous': 'Future continuous', 'future-perfect': 'Future perfect', 'future-perfect-continuous': 'Future perfect continuous' };
  function be(p, past) { if (past) return (p === 'you' || p === 'we' || p === 'they') ? 'were' : 'was'; return p === 'I' ? 'am' : (p === 'he' ? 'is' : 'are'); }
  function cap(s) { return s.charAt(0).toUpperCase() + s.slice(1); }
  function conj(f, t, p) {
    var b = f.base, s = f.s, ing = f.ing, past = f.past, pp = f.pp, has = p === 'he' ? 'has' : 'have', dd = p === 'he' ? 'does' : 'do', v;
    if (t === 'simple-present') {
      if (b === 'be') { v = be(p, false); return [p + ' ' + v, p + ' ' + v + ' not', cap(v) + ' ' + p + '?']; }
      return [p + ' ' + (p === 'he' ? s : b), p + ' ' + dd + ' not ' + b, cap(dd) + ' ' + p + ' ' + b + '?'];
    }
    if (t === 'simple-past') {
      if (b === 'be') { v = be(p, true); return [p + ' ' + v, p + ' ' + v + ' not', cap(v) + ' ' + p + '?']; }
      return [p + ' ' + past, p + ' did not ' + b, 'Did ' + p + ' ' + b + '?'];
    }
    if (t === 'simple-future') return [p + ' will ' + b, p + ' will not ' + b, 'Will ' + p + ' ' + b + '?'];
    var aux = { 'present-continuous': [be(p, false), ing], 'past-continuous': [be(p, true), ing], 'present-perfect': [has, pp], 'present-perfect-continuous': [has + ' been', ing], 'past-perfect': ['had', pp],
      'past-perfect-continuous': ['had been', ing], 'future-continuous': ['will be', ing], 'future-perfect': ['will have', pp], 'future-perfect-continuous': ['will have been', ing] }[t];
    var a = aux[0], rest = aux[1], i = a.indexOf(' '), first = i < 0 ? a : a.slice(0, i), tail = i < 0 ? '' : a.slice(i + 1) + ' ';
    return [p + ' ' + first + ' ' + tail + rest, p + ' ' + first + ' not ' + tail + rest, cap(first) + ' ' + p + ' ' + tail + rest + '?'];
  }
  window.GRAMMAR = { conj: conj, T12: T12 };
  var tool = d.querySelector('[data-conj]');
  var V = null;
  function form(v) { var r = V[v]; return r ? { base: v, s: r[0], ing: r[1], past: r[2], pp: r[3] } : null; }
  if (tool) {
    var inp = tool.querySelector('input'), sel = tool.querySelector('[data-list]'), out = d.querySelector('[data-out]');
    var run = function () {
      var v = inp.value.toLowerCase().trim(); if (!V) return;
      var f = form(v);
      if (!f) { out.innerHTML = '<p class="note">"' + SYG.esc(v) + '" is not in our list of ' + Object.keys(V).length + ' verbs. Pick one from the list below the box.</p>'; return; }
      var P = ['I', 'you', 'he', 'we', 'they'];
      out.innerHTML = '<p>Forms: <b>' + SYG.esc(f.base) + '</b>, <b>' + SYG.esc(f.s) + '</b>, <b>' + SYG.esc(f.ing) + '</b>, <b>' + SYG.esc(f.past) + '</b>, <b>' + SYG.esc(f.pp) + '</b> (base, he/she/it, -ing, past, past participle).</p>' +
        '<div class="tbl"><table class="st"><thead><tr><th>Tense</th>' + P.map(function (p) { return '<th>' + (p === 'he' ? 'he / she / it' : p) + '</th>'; }).join('') + '</tr></thead><tbody>' +
        T12.map(function (t) { return '<tr><th scope="row"><a href="/grammar/tenses/' + t + '/">' + NAMES[t] + '</a></th>' + P.map(function (p) { return '<td>' + SYG.esc(conj(f, t, p)[0]) + '</td>'; }).join('') + '</tr>'; }).join('') + '</tbody></table></div>';
    };
    SYG.json('/grammar/data/verbs.json').then(function (j) {
      V = j; sel.innerHTML = Object.keys(V).sort().map(function (v) { return '<option value="' + v + '">'; }).join(''); run();
    });
    inp.addEventListener('input', run);
  }
  var qz = d.querySelector('[data-quiz]');
  if (qz) {
    var box = qz.querySelector('.qbox'), q = qz.querySelector('.qq'), opts = qz.querySelector('.qo'), st = qz.querySelector('.qs'), n = 0, ok = 0, cur;
    var pick = function (a) { return a[Math.floor(Math.random() * a.length)]; };
    var next = function () {
      var keys = Object.keys(V), v = pick(keys), f = form(v), p = pick(['I', 'you', 'he', 'we', 'they']), t = pick(['simple-present', 'simple-past', 'present-perfect', 'present-continuous', 'past-continuous', 'future-perfect']);
      var ans = conj(f, t, p)[0], wrong = {};
      ['simple-present', 'simple-past', 'present-perfect', 'present-continuous', 'past-continuous', 'future-perfect', 'simple-future', 'past-perfect'].forEach(function (t2) { var x = conj(f, t2, p)[0]; if (x !== ans) wrong[x] = 1; });
      var choices = Object.keys(wrong).sort(function () { return Math.random() - 0.5; }).slice(0, 3); choices.push(ans); choices.sort(function () { return Math.random() - 0.5; });
      cur = ans; q.textContent = 'Which sentence is the ' + NAMES[t].toLowerCase() + ' of "' + v + '" with "' + (p === 'he' ? 'he/she/it' : p) + '"?';
      opts.innerHTML = choices.map(function (c) { return '<button class="btn ghost" type="button">' + SYG.esc(c) + '</button>'; }).join('');
    };
    qz.querySelector('[data-start]').addEventListener('click', function () { SYG.json('/grammar/data/verbs.json').then(function (j) { V = j; n = 0; ok = 0; box.hidden = false; st.textContent = ''; next(); }); });
    opts.addEventListener('click', function (e) {
      var b = e.target.closest('button'); if (!b) return; n++;
      if (b.textContent === cur) { ok++; st.textContent = 'Right! ' + ok + ' of ' + n + '.'; } else { st.textContent = 'Not quite: the answer is "' + cur + '". ' + ok + ' of ' + n + '.'; }
      next();
    });
  }
})();
