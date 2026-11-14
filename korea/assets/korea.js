/* korea: Hangul syllable builder */
(function () {
  'use strict';
  var d = document, SYG = window.SYG, box = d.querySelector('[data-build]'); if (!box) return;
  var NAMES_L = 'ㄱㄲㄴㄷㄸㄹㅁㅂㅃㅅㅆㅇㅈㅉㅊㅋㅌㅍㅎ', NAMES_V = 'ㅏㅐㅑㅒㅓㅔㅕㅖㅗㅘㅙㅚㅛㅜㅝㅞㅟㅠㅡㅢㅣ', NAMES_T = ['', 'ㄱ', 'ㄲ', 'ㄳ', 'ㄴ', 'ㄵ', 'ㄶ', 'ㄷ', 'ㄹ', 'ㄺ', 'ㄻ', 'ㄼ', 'ㄽ', 'ㄾ', 'ㄿ', 'ㅀ', 'ㅁ', 'ㅂ', 'ㅄ', 'ㅅ', 'ㅆ', 'ㅇ', 'ㅈ', 'ㅊ', 'ㅋ', 'ㅌ', 'ㅍ', 'ㅎ'];
  var l = box.querySelector('#bl'), v = box.querySelector('#bv'), t = box.querySelector('#bt'), out = box.querySelector('[data-syl]'), info = box.querySelector('[data-info]');
  Array.from(NAMES_L).forEach(function (c, i) { l.insertAdjacentHTML('beforeend', '<option value="' + i + '">' + c + '</option>'); });
  Array.from(NAMES_V).forEach(function (c, i) { v.insertAdjacentHTML('beforeend', '<option value="' + i + '">' + c + '</option>'); });
  NAMES_T.forEach(function (c, i) { t.insertAdjacentHTML('beforeend', '<option value="' + i + '">' + (c || '(none)') + '</option>'); });
  l.value = 18; v.value = 0; t.value = 4;
  function run() {
    var L = +l.value, V = +v.value, T = +t.value, cp = 0xAC00 + (L * 21 + V) * 28 + T;
    var s = String.fromCharCode(cp);
    out.textContent = s;
    info.textContent = 'Unicode U+' + cp.toString(16).toUpperCase() + ' = ' + NAMES_L[L] + ' + ' + NAMES_V[V] + (T ? ' + ' + NAMES_T[T] : '') + '. Formula: 0xAC00 + (' + L + ' x 21 + ' + V + ') x 28 + ' + T + '.';
  }
  [l, v, t].forEach(function (e) { e.addEventListener('change', run); });
  run();
})();
