/* hello: Listen (device voice), Copy, filters */
(function () {
  'use strict';
  var d = document, SYG = window.SYG, cur = null;
  var VOICE = {hi:'hi-IN',pa:'pa-IN',ur:'ur-PK',bn:'bn-IN',ta:'ta-IN',te:'te-IN',mr:'mr-IN',gu:'gu-IN',kn:'kn-IN',ml:'ml-IN',es:'es-ES',fr:'fr-FR',de:'de-DE',it:'it-IT',pt:'pt-PT',ru:'ru-RU',ja:'ja-JP',ko:'ko-KR',zh:'zh-CN',ar:'ar-SA',tr:'tr-TR',id:'id-ID',th:'th-TH',vi:'vi-VN',el:'el-GR',sw:'sw-KE'};
  function stop() { if (window.speechSynthesis) speechSynthesis.cancel(); if (cur) { cur.classList.remove('on'); cur = null; } }
  function say(code, text, btn) {
    if (!window.speechSynthesis) { SYG.toast('This browser cannot read aloud'); return; }
    if (cur === btn) { stop(); return; }
    stop();
    var want = (VOICE[code] || code).slice(0, 2).toLowerCase();
    var v = speechSynthesis.getVoices().filter(function (x) { return x.lang.replace('_', '-').toLowerCase().indexOf(want) === 0; });
    if (!v.length) { SYG.toast('Your device has no voice for this language. Use the sound spelling.'); return; }
    var u = new SpeechSynthesisUtterance(text); u.voice = v[0]; u.lang = v[0].lang; u.rate = 0.85;
    u.onend = u.onerror = function () { if (cur === btn) { btn.classList.remove('on'); cur = null; } };
    cur = btn; btn.classList.add('on'); speechSynthesis.speak(u);
  }
  if (window.speechSynthesis) speechSynthesis.getVoices();
  window.addEventListener('pagehide', stop);
  d.addEventListener('click', function (e) {
    var b = e.target.closest('[data-say],[data-cp]'); if (!b) return;
    var tr = b.closest('tr');
    var nat = tr.querySelector('.nat'), snd = tr.querySelector('.snd');
    if (b.hasAttribute('data-say')) say(nat.getAttribute('lang'), nat.textContent, b);
    else SYG.copy(nat.textContent + (snd ? '  (' + snd.textContent + ')' : ''), 'Copied');
  });
  var f = d.querySelector('[data-filter]');
  if (f) {
    var items = d.querySelectorAll('[data-item]'), none = d.querySelector('[data-none]');
    f.addEventListener('input', function () {
      var w = f.value.toLowerCase().split(/\s+/).filter(Boolean), n = 0;
      items.forEach(function (x) { var t = x.textContent.toLowerCase(), ok = w.every(function (y) { return t.indexOf(y) > -1; }); x.hidden = !ok; if (ok) n++; });
      if (none) none.hidden = n > 0;
    });
  }
})();
