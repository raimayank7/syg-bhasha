(function () {
  'use strict';
  var z = document.querySelector('[data-quiz]'); if (!z) return;
  var items = JSON.parse(z.getAttribute('data-items')), big = z.querySelector('.big'), opts = z.querySelector('.opts'), sc = z.querySelector('.sc'), nx = z.querySelector('[data-next]'), ans = z.querySelector('.ans');
  var score = 0, asked = 0, cur;
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function pick() {
    cur = items[Math.floor(Math.random() * items.length)];
    var o = [cur];
    while (o.length < 4 && o.length < items.length) { var c = items[Math.floor(Math.random() * items.length)]; if (o.every(function (x) { return x[1] !== c[1]; })) o.push(c); }
    o.sort(function () { return Math.random() - 0.5; });
    big.textContent = cur[0]; ans.hidden = true; nx.hidden = true; opts.removeAttribute('data-done');
    opts.innerHTML = o.map(function (x) { return '<button type="button" data-a="' + (x === cur ? 1 : 0) + '">' + esc(x[1]) + '</button>'; }).join('');
  }
  opts.addEventListener('click', function (e) {
    var b = e.target.closest('button'); if (!b || opts.getAttribute('data-done')) return;
    opts.setAttribute('data-done', '1'); asked++;
    if (b.getAttribute('data-a') === '1') { score++; b.className = 'ok'; } else { b.className = 'no'; opts.querySelector('[data-a="1"]').className = 'ok'; }
    sc.textContent = 'Score: ' + score + ' of ' + asked; ans.textContent = cur[0] + ' = ' + cur[1]; ans.hidden = false; nx.hidden = false;
  });
  nx.addEventListener('click', pick); pick();
})();
