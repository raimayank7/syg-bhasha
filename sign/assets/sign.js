
(function(){
  var K='syg-sign-first',box=document.getElementById('first');if(!box)return;
  var done={};try{done=JSON.parse(localStorage.getItem(K)||'{}')}catch(e){}
  var all=box.querySelectorAll('input[type=checkbox]');
  function show(){var n=0;all.forEach(function(c){if(c.checked)n++});document.getElementById('prog').textContent=n+' of '+all.length+' learnt';
    box.querySelectorAll('section').forEach(function(s){var c=s.querySelectorAll('input'),m=0;c.forEach(function(x){if(x.checked)m++});s.querySelector('.prog').textContent=m+' / '+c.length})}
  all.forEach(function(c){c.checked=!!done[c.value];c.addEventListener('change',function(){if(c.checked)done[c.value]=1;else delete done[c.value];try{localStorage.setItem(K,JSON.stringify(done))}catch(e){}show()})});
  document.getElementById('reset').onclick=function(){done={};all.forEach(function(c){c.checked=false});try{localStorage.removeItem(K)}catch(e){}show()};
  show();
})();
