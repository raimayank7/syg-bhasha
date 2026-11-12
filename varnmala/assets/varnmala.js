
(function(){
  var V=[];function load(){V=(window.speechSynthesis&&speechSynthesis.getVoices())||[]}
  if(window.speechSynthesis){load();speechSynthesis.onvoiceschanged=load}
  function say(t,lang){if(!window.speechSynthesis){SYG.toast('This browser cannot read aloud');return}
    speechSynthesis.cancel();var u=new SpeechSynthesisUtterance(t),want=lang==='pa'?/^pa/i:/^hi/i,v=V.filter(function(x){return want.test(x.lang)})[0];
    u.lang=lang==='pa'?'pa-IN':'hi-IN';if(v)u.voice=v;u.rate=.8;speechSynthesis.speak(u);
    if(!v&&!say['w'+lang]){say['w'+lang]=1;SYG.toast(lang==='pa'?'No Punjabi voice on this device. The sound may be missing or wrong.':'No Hindi voice on this device. The sound may be wrong.')}}
  document.addEventListener('click',function(e){var b=e.target.closest('[data-say]');if(b)say(b.getAttribute('data-say'),b.getAttribute('data-sl')||b.lang||'hi')});
  var q=document.getElementById('lq');
  if(q)q.addEventListener('input',function(){var v=q.value.trim().toLowerCase();document.querySelectorAll('.lt li').forEach(function(li){li.hidden=!!v&&li.getAttribute('data-k').toLowerCase().indexOf(v)<0})});
  var FONT={hi:"'Noto Sans Devanagari','Nirmala UI','Mangal',sans-serif",pa:"'Noto Sans Gurmukhi','Raavi','Nirmala UI',sans-serif"};
  function fill(sel,D,sc){sel.innerHTML='';D[sc].forEach(function(l,i){var o=document.createElement('option');o.value=i;o.textContent=l[0]+'  '+l[1];sel.appendChild(o)})}
  /* trace pad */
  var pad=document.getElementById('pad');
  if(pad){SYG.json('/varnmala/data/v.json').then(function(D){
    var sc=document.getElementById('tsc'),sl=document.getElementById('tl'),ctx=pad.getContext('2d'),S=840,pen=22,down=false,last=null,strokes=[];
    pad.width=pad.height=S;
    function L(){return D[sc.value][+sl.value]}
    function base(){ctx.clearRect(0,0,S,S);ctx.fillStyle='#fff';ctx.fillRect(0,0,S,S);ctx.strokeStyle='#d5dbe5';ctx.lineWidth=2;ctx.setLineDash([10,10]);
      ctx.beginPath();ctx.moveTo(S/2,20);ctx.lineTo(S/2,S-20);ctx.moveTo(20,S/2);ctx.lineTo(S-20,S/2);ctx.stroke();ctx.setLineDash([]);
      ctx.fillStyle='#c9d2de';ctx.textAlign='center';ctx.textBaseline='middle';var t=L()[0],fs=t.length>2?360:520;ctx.font='700 '+fs+'px '+FONT[sc.value];ctx.fillText(t,S/2,S/2+20)}
    function redraw(){base();ctx.strokeStyle='#0e7a40';ctx.lineCap='round';ctx.lineJoin='round';ctx.lineWidth=pen;strokes.forEach(function(s){ctx.beginPath();s.forEach(function(p,i){i?ctx.lineTo(p[0],p[1]):ctx.moveTo(p[0],p[1])});if(s.length===1)ctx.lineTo(s[0][0]+.1,s[0][1]);ctx.stroke()})}
    function pos(e){var r=pad.getBoundingClientRect();return[(e.clientX-r.left)*S/r.width,(e.clientY-r.top)*S/r.height]}
    pad.addEventListener('pointerdown',function(e){down=true;pad.setPointerCapture(e.pointerId);strokes.push([pos(e)]);redraw();e.preventDefault()});
    pad.addEventListener('pointermove',function(e){if(!down)return;strokes[strokes.length-1].push(pos(e));redraw()});
    ['pointerup','pointercancel'].forEach(function(n){pad.addEventListener(n,function(){down=false})});
    function reset(){strokes=[];redraw();document.getElementById('tname').textContent=L()[0]+'  '+L()[1]+(L()[2]?'  ·  '+L()[2]:'')}
    sc.onchange=function(){fill(sl,D,sc.value);reset()};sl.onchange=reset;
    document.getElementById('tclear').onclick=function(){strokes=[];redraw()};
    document.getElementById('tundo').onclick=function(){strokes.pop();redraw()};
    document.getElementById('tnext').onclick=function(){sl.value=(+sl.value+1)%D[sc.value].length;reset()};
    document.getElementById('tprev').onclick=function(){sl.value=(+sl.value-1+D[sc.value].length)%D[sc.value].length;reset()};
    document.getElementById('thear').onclick=function(){say(sc.value==='pa'?(L()[3]||L()[0]):L()[0],sc.value)};
    document.getElementById('tpen').onchange=function(){pen=+this.value;redraw()};
    var m=location.search.match(/[?&]l=([^&]+)/),want=m&&decodeURIComponent(m[1]);if(/[?&]s=pa/.test(location.search))sc.value='pa';
    fill(sl,D,sc.value);if(want)D[sc.value].forEach(function(l,i){if(l[0]===want)sl.value=i});
    (document.fonts&&document.fonts.ready?document.fonts.ready:Promise.resolve()).then(reset);reset()})}
  /* tracing sheets */
  var sh=document.getElementById('sheet');
  if(sh){SYG.json('/varnmala/data/v.json').then(function(D){
    var sc=document.getElementById('ssc'),from=document.getElementById('sfrom'),cnt=document.getElementById('scnt');
    function draw(){var A=D[sc.value],st=+from.value,n=+cnt.value,h='<h3>'+(sc.value==='pa'?'ਪੰਜਾਬੀ ਅੱਖਰ':'हिंदी वर्णमाला')+'</h3><p class="nm">'+(sc.value==='pa'?'ਨਾਂ: ____________________  ਮਿਤੀ: ____________':'नाम: ____________________  तारीख: ____________')+'</p>';
      for(var i=st;i<Math.min(A.length,st+n);i++){var c=A[i][0],fs=c.length>2?40:54;
        h+='<div class="row" style="font-size:'+fs+'px;font-family:'+FONT[sc.value]+'"><span>'+c+'</span><span class="o">'+c+'</span><span class="o">'+c+'</span><span class="o">'+c+'</span><span></span><span></span><small lang="'+sc.value+'">'+SYG.esc(sc.value==='pa'?A[i][3]:(A[i][2]||A[i][1]))+'</small></div>'}
      sh.innerHTML=h+'<p class="ft2">bhasha.shareyourgroup.com/varnmala</p>'}
    function fillFrom(){from.innerHTML='';D[sc.value].forEach(function(l,i){if(i%6===0){var o=document.createElement('option');o.value=i;o.textContent=l[0]+' onwards';from.appendChild(o)}});draw()}
    sc.onchange=fillFrom;from.onchange=cnt.onchange=draw;document.getElementById('sprint').onclick=function(){window.print()};fillFrom()})}
  /* game */
  var qz=document.getElementById('quiz');
  if(qz){SYG.json('/varnmala/data/v.json').then(function(D){
    var mode=document.getElementById('qmode'),score=0,n=0,cur;
    function rnd(a){return a[Math.floor(Math.random()*a.length)]}
    function next(){var pa=mode.value==='pa',pool=D[pa?'pa':'hi'].filter(function(l){return pa?l[1]:l[2]});cur=rnd(pool);
      var opts=[cur];while(opts.length<4){var o=rnd(D[pa?'pa':'hi']);if(opts.indexOf(o)<0)opts.push(o)}opts.sort(function(){return Math.random()-.5});
      var ask=qz.querySelector('.ask');ask.lang=pa?'pa':'hi';
      if(pa){ask.textContent=cur[3]+'  ('+cur[1]+')'}else{var w=cur[2];ask.textContent='__ से '+w}
      var box=qz.querySelector('.opts');box.innerHTML='';opts.forEach(function(o){var b=document.createElement('button');b.type='button';b.lang=pa?'pa':'hi';b.textContent=o[0];
        b.onclick=function(){if(box.dataset.done)return;n++;if(o===cur){score++;b.className='ok'}else{b.className='no';[].forEach.call(box.children,function(c,k){if(opts[k]===cur)c.className='ok'})}
          box.dataset.done=1;document.getElementById('qscore').textContent=score+' right out of '+n;setTimeout(function(){delete box.dataset.done;next()},1000)};box.appendChild(b)})}
    mode.onchange=next;document.getElementById('qhear').onclick=function(){var pa=mode.value==='pa';say(pa?cur[3]:cur[2],pa?'pa':'hi')};next()})}
})();
