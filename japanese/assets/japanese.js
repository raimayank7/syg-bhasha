/* japanese: romaji typer and kana quiz */
(function () {
  'use strict';
  var d = document, SYG = window.SYG, K = null;
  function load(cb) { if (K) return cb(); SYG.json('/japanese/data/kana.json').then(function (j) { K = j; cb(); }); }
  function table(set) { var m = {}; set.forEach(function (p) { m[p[1]] = p[0]; }); return m; }
  // romaji -> kana by longest match (3, 2, 1 letters); double consonant = small tsu; n before a consonant = n
  function conv(s, set, tsu) {
    var m = table(set); s = s.toLowerCase().replace(/[^a-z' -]/g, ''); var out = '', i = 0;
    m.nn = m.n; delete m.nn;
    while (i < s.length) {
      var c = s[i], n2 = s[i + 1], t;
      if (c === ' ' || c === '-') { out += c === ' ' ? ' ' : (set === K.k ? 'ー' : ''); i++; continue; }
      if (c === 'n' && (n2 === "'" || (n2 === 'n' && !/[aiueoy]/.test(s[i + 2] || '')))) { out += m.n; i += (n2 === "'" || n2 === 'n') ? 2 : 1; continue; }
      if (c === 'n' && (!n2 || !/[aiueoy]/.test(n2))) { out += m.n; i++; continue; }
      if (c === n2 && /[bcdfghjklmpqrstvwxyz]/.test(c) && c !== 'n') { out += tsu; i++; continue; }
      t = null;
      for (var L = 3; L >= 1; L--) { var part = s.substr(i, L); if (m[part]) { t = part; break; } }
      if (t) { out += m[t]; i += t.length; } else { out += c; i++; }
    }
    return out;
  }
  var ty = d.querySelector('[data-typer]');
  if (ty) {
    var inp = ty.querySelector('input'), h = ty.querySelector('[data-h]'), k = ty.querySelector('[data-k]');
    inp.addEventListener('input', function () { load(function () { h.textContent = conv(inp.value, K.h, 'っ'); k.textContent = conv(inp.value, K.k, 'ッ'); }); });
  }
  var qz = d.querySelector('[data-quiz]');
  if (qz) {
    var box = qz.querySelector('.qbox'), kk = qz.querySelector('.qk'), form = qz.querySelector('[data-qf]'), ans = qz.querySelector('#qa'), stat = qz.querySelector('.qs');
    var pool = [], cur = null, right = 0, tries = 0;
    function next() {
      if (!pool.length) { kk.textContent = '✔'; stat.textContent = 'Done: ' + right + ' right out of ' + tries + ' answers.'; form.hidden = true; return; }
      cur = pool[Math.floor(Math.random() * pool.length)]; kk.textContent = cur[0]; ans.value = ''; ans.focus();
      stat.textContent = pool.length + ' left. Right so far: ' + right + ' of ' + tries + '.';
    }
    qz.querySelector('[data-start]').addEventListener('click', function () {
      load(function () {
        var sc = qz.querySelector('#qs').value, all = qz.querySelector('#qm').value === 'a', set = [];
        if (sc.indexOf('h') > -1) set = set.concat(K.h); if (sc.indexOf('k') > -1) set = set.concat(K.k);
        pool = set.filter(function (p, i) { return all || p[0].length === 1 && !/^(ga|gi|gu|ge|go|za|ji|zu|ze|zo|da|de|do|ba|bi|bu|be|bo|pa|pi|pu|pe|po)$/.test(p[1]); }).slice();
        right = 0; tries = 0; box.hidden = false; form.hidden = false; next();
      });
    });
    form.addEventListener('submit', function (e) {
      e.preventDefault(); if (!cur) return; tries++;
      if (ans.value.trim().toLowerCase() === cur[1]) { right++; pool.splice(pool.indexOf(cur), 1); next(); }
      else { stat.textContent = 'Not quite: ' + cur[0] + ' is "' + cur[1] + '". It will come back.'; ans.value = ''; }
    });
  }
})();
