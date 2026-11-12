
(function(){
  var voice=null;
  function pick(){var v=(window.speechSynthesis&&speechSynthesis.getVoices())||[];voice=v.filter(function(x){return /^hi/i.test(x.lang)})[0]||null}
  if(window.speechSynthesis){pick();speechSynthesis.onvoiceschanged=pick}
  function say(t){if(!window.speechSynthesis){SYG.toast('This browser cannot read aloud');return}
    speechSynthesis.cancel();var u=new SpeechSynthesisUtterance(t);u.lang='hi-IN';if(voice)u.voice=voice;u.rate=.8;speechSynthesis.speak(u);
    if(!voice&&!say.w){say.w=1;SYG.toast('No Hindi voice found on this device. The sound may be wrong.')}}
  document.addEventListener('click',function(e){var b=e.target.closest('[data-say]');if(!b)return;say(b.getAttribute('data-say'));
    document.querySelectorAll('[data-say].on').forEach(function(x){x.classList.remove('on')});b.classList.add('on')});
  var q=document.getElementById('cq');
  if(q){q.addEventListener('input',function(){var v=q.value.trim().toLowerCase();document.querySelectorAll('.chart tbody tr').forEach(function(r){
    r.hidden=!!v&&r.getAttribute('data-k').indexOf(v)<0})})}
  /* quiz */
  var qz=document.getElementById('quiz');
  if(qz){SYG.json('/barakhadi/data/b.json').then(function(D){
    var score=0,n=0,cur,mode=document.getElementById('qmode'),row=document.getElementById('qrow');
    D.L.forEach(function(l,i){var o=document.createElement('option');o.value=i;o.textContent=l.c+' ('+l.r+'a)';row.appendChild(o)});
    function rnd(a){return a[Math.floor(Math.random()*a.length)]}
    function next(){var pool=row.value==='all'?D.L:[D.L[+row.value]];var L=rnd(pool),i=Math.floor(Math.random()*12);cur={syl:L.c+D.M[i],rom:L.r+D.R[i]};
      var opts=[cur],guard=0;while(opts.length<4&&guard++<60){var j=Math.floor(Math.random()*12),L2=Math.random()<.5?L:rnd(D.L);var o={syl:L2.c+D.M[j],rom:L2.r+D.R[j]};
        if(!opts.some(function(x){return x.syl===o.syl||x.rom===o.rom}))opts.push(o)}
      opts.sort(function(){return Math.random()-.5});var m=mode.value;
      qz.querySelector('.ask').textContent=m==='read'?cur.syl:(m==='rom'?cur.rom:'🔊');
      qz.querySelector('.ask').lang=m==='read'?'hi':'en';
      if(m==='hear')say(cur.syl);
      var box=qz.querySelector('.opts');box.innerHTML='';opts.forEach(function(o){var b=document.createElement('button');b.type='button';b.textContent=m==='read'?o.rom:o.syl;
        b.onclick=function(){if(box.dataset.done)return;n++;if(o.syl===cur.syl){score++;b.className='ok'}else{b.className='no';[].forEach.call(box.children,function(c,k){if(opts[k].syl===cur.syl)c.className='ok'})}
          box.dataset.done=1;document.getElementById('qscore').textContent=score+' right out of '+n;setTimeout(function(){delete box.dataset.done;next()},900)};box.appendChild(b)})}
    mode.onchange=row.onchange=next;document.getElementById('qagain').onclick=function(){if(mode.value==='hear')say(cur.syl)};next()})}
  /* practice sheets */
  var sh=document.getElementById('sheet');
  if(sh){SYG.json('/barakhadi/data/b.json').then(function(D){
    var sl=document.getElementById('sl'),st=document.getElementById('st');
    D.L.forEach(function(l,i){var o=document.createElement('option');o.value=i;o.textContent=l.c+' ('+l.r+'a)';sl.appendChild(o)});
    var want=(location.search.match(/l=([a-z-]+)/)||[])[1];if(want)D.L.forEach(function(l,i){if(l.s===want)sl.value=i});
    function forms(L){return D.M.map(function(m){return L.c+m})}
    function draw(){var L=D.L[+sl.value],f=forms(L),t=st.value,h='<h3>'+L.c+' की बारहखड़ी</h3><p class="nm">नाम: ____________________  तारीख: ____________</p>';
      if(t==='trace'){h+='<div class="row">'+f.slice(0,6).join(' ')+'</div><div class="row t">'+f.slice(0,6).join(' ')+'</div><div class="row e"></div>'+
        '<div class="row">'+f.slice(6).join(' ')+'</div><div class="row t">'+f.slice(6).join(' ')+'</div><div class="row e"></div><div class="row e"></div>'}
      else if(t==='fill'){var hide={};while(Object.keys(hide).length<5)hide[Math.floor(Math.random()*12)]=1;
        h+='<p class="nm">खाली डिब्बों में सही अक्षर लिखो। (Write the missing forms in the empty boxes.)</p><div class="fill">'+f.map(function(x,i){return '<span>'+(hide[i]?'':x)+'</span>'}).join('')+'</div>'+
        '<div class="row e"></div><div class="row e"></div>'}
      else{var w=L.w.filter(function(x){return x}).slice(0,8);if(w.length<3){h+='<p class="nm">This letter has too few everyday words for a matching sheet. Choose "Trace" or "Fill the blanks".</p>'}
        else{var right=w.map(function(x){return x[1]}).sort(function(){return Math.random()-.5});
          h+='<p class="nm">शब्द को उसके अर्थ से मिलाओ। (Draw a line from each word to its meaning.)</p><div class="match">'+w.map(function(x,i){return '<span>'+x[0]+'  •</span><span lang="en">•  '+SYG.esc(right[i])+'</span>'}).join('')+'</div>'}}
      sh.innerHTML=h+'<p class="ft2">bhasha.shareyourgroup.com/barakhadi</p>'}
    sl.onchange=st.onchange=draw;document.getElementById('snew').onclick=draw;document.getElementById('sprint').onclick=function(){window.print()};draw()})}
})();
