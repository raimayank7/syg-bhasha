/* spoken English: Listen (the browser's own voice), Copy, language choice (Hindi / Punjabi / both), home search */
(function () {
  'use strict';
  var d = document, SYG = window.SYG, cur = null;
  function stop() { if (window.speechSynthesis) speechSynthesis.cancel(); if (cur) { cur.classList.remove('on'); cur = null; } }
  function say(text, btn) {
    if (!window.speechSynthesis) { SYG.toast('This browser cannot read aloud'); return; }
    if (cur === btn) { stop(); return; }
    stop();
    var u = new SpeechSynthesisUtterance(text), v = speechSynthesis.getVoices().filter(function (x) { return /^en/i.test(x.lang); });
    var best = v.filter(function (x) { return /IN/.test(x.lang); })[0] || v.filter(function (x) { return /GB/.test(x.lang); })[0] || v[0];
    if (best) u.voice = best;
    u.lang = best ? best.lang : 'en-IN'; u.rate = btn.getAttribute('data-rate') === 'slow' ? 0.65 : 0.9;
    u.onend = u.onerror = function () { if (cur === btn) { btn.classList.remove('on'); cur = null; } };
    cur = btn; btn.classList.add('on'); speechSynthesis.speak(u);
  }
  if (window.speechSynthesis) speechSynthesis.getVoices();
  window.addEventListener('pagehide', stop);

  d.addEventListener('click', function (e) {
    var b = e.target.closest('[data-say],[data-cp],[data-show-btn],[data-all]');
    if (!b) return;
    if (b.hasAttribute('data-say')) say(b.closest('li').querySelector('.en').textContent, b);
    else if (b.hasAttribute('data-cp')) {
      var li = b.closest('li');
      SYG.copy([].map.call(li.querySelectorAll('.en,.hi,.pa'), function (p) { return p.textContent; }).join('\n'), 'Copied');
    } else if (b.hasAttribute('data-all')) {
      var t = [].map.call(d.querySelectorAll('.sl .en'), function (p) { return p.textContent; }).join(' ... ');
      say(t, b);
    } else show(b.getAttribute('data-show-btn'), true);
  });

  function show(v, save) {
    d.body.setAttribute('data-show', v);
    d.querySelectorAll('[data-show-btn]').forEach(function (x) { x.setAttribute('aria-pressed', x.getAttribute('data-show-btn') === v ? 'true' : 'false'); });
    if (save) try { localStorage.setItem('speak-show', v); } catch (e) {}
  }
  var saved = 'both';
  try { saved = localStorage.getItem('speak-show') || 'both'; } catch (e) {}
  show(saved, false);

  var q = d.querySelector('[data-search]');
  if (q) {
    var box = d.querySelector('[data-results]'), all = null, tm;
    q.addEventListener('input', function () {
      clearTimeout(tm);
      tm = setTimeout(function () {
        var w = q.value.toLowerCase().split(/\s+/).filter(Boolean);
        if (!w.length) { box.innerHTML = ''; return; }
        (all ? Promise.resolve(all) : SYG.json('/speak/data/all.json').then(function (j) { all = j; return j; })).then(function (j) {
          var hit = j.filter(function (r) { var s = (r[0] + ' ' + r[1] + ' ' + r[2]).toLowerCase(); return w.every(function (x) { return s.indexOf(x) > -1; }); }).slice(0, 20);
          box.innerHTML = hit.length ? hit.map(function (r) {
            return '<li><a href="' + r[3] + '"><b>' + SYG.esc(r[0]) + '</b><small><span lang="hi">' + SYG.esc(r[1]) + '</span> · <span lang="pa">' + SYG.esc(r[2]) + '</span></small></a></li>';
          }).join('') : '<li class="hint">No sentence matches. Try one word, such as "ticket", "दवा" or "ਪਾਣੀ".</li>';
        });
      }, 120);
    });
  }
})();
