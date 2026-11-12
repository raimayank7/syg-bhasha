/* sanskrit: Listen (the device's Hindi voice reads Devanagari), Copy, filter, home search */
(function () {
  'use strict';
  var d = document, SYG = window.SYG, cur = null;
  function stop() { if (window.speechSynthesis) speechSynthesis.cancel(); if (cur) { cur.textContent = 'Listen'; cur = null; } }
  function say(text, btn) {
    if (!window.speechSynthesis) { SYG.toast('This browser cannot read aloud'); return; }
    if (cur === btn) { stop(); return; }
    stop();
    var v = speechSynthesis.getVoices().filter(function (x) { return /^(sa|hi)/i.test(x.lang); });
    if (!v.length) { SYG.toast('Your device has no Hindi voice. Use the roman reading.'); return; }
    var u = new SpeechSynthesisUtterance(text.replace(/[।॥]/g, ', ')); u.voice = v[0]; u.lang = v[0].lang; u.rate = 0.7;
    u.onend = u.onerror = function () { if (cur === btn) { btn.textContent = 'Listen'; cur = null; } };
    cur = btn; btn.textContent = 'Stop'; speechSynthesis.speak(u);
  }
  if (window.speechSynthesis) speechSynthesis.getVoices();
  window.addEventListener('pagehide', stop);
  d.addEventListener('click', function (e) {
    var b = e.target.closest('[data-say],[data-cp],[data-say-sh]'); if (!b) return;
    if (b.hasAttribute('data-say-sh')) say(b.closest('.shk').querySelector('.sh').innerText, b);
    else if (b.hasAttribute('data-say')) say(b.closest('li').querySelector('.sa').textContent, b);
    else SYG.copy([].map.call(b.closest('li').querySelectorAll('.sa,.ro,.hi,.en'), function (p) { return p.textContent; }).join('\n'), 'Copied');
  });
  var f = d.querySelector('[data-filter]');
  if (f) {
    var items = d.querySelectorAll('[data-list] li');
    f.addEventListener('input', function () {
      var w = f.value.toLowerCase().trim();
      items.forEach(function (li) { li.hidden = w && (li.textContent + ' ' + (li.getAttribute('data-q') || '')).toLowerCase().indexOf(w) < 0; });
    });
  }
  var q = d.querySelector('[data-search]');
  if (q) {
    var box = d.querySelector('[data-results]'), all = null, tm;
    q.addEventListener('input', function () {
      clearTimeout(tm);
      tm = setTimeout(function () {
        var w = q.value.toLowerCase().split(/\s+/).filter(Boolean);
        if (!w.length) { box.innerHTML = ''; return; }
        (all ? Promise.resolve(all) : SYG.json('/sanskrit/data/all.json').then(function (j) { all = j; return j; })).then(function (j) {
          var hit = j.filter(function (r) { var s = r.slice(0, 4).join(' ').toLowerCase(); return w.every(function (x) { return s.indexOf(x) > -1; }); }).slice(0, 20);
          box.innerHTML = hit.length ? hit.map(function (r) {
            return '<li><a href="' + r[4] + '"><b lang="sa">' + SYG.esc(r[0]) + '</b><small>' + SYG.esc(r[1]) + ' · <span lang="hi">' + SYG.esc(r[2]) + '</span> · ' + SYG.esc(r[3]) + '</small></a></li>';
          }).join('') : '<li class="hint">Nothing matches. Try an English or Hindi word.</li>';
        });
      }, 120);
    });
  }
})();
