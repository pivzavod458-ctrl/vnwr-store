(function(){
  'use strict';
  var shown=false;
  var started=performance.now();
  var reveal=function(){
    if(shown)return;
    shown=true;
    var delay=Math.max(0,1100-(performance.now()-started));
    window.setTimeout(function(){window.requestAnimationFrame(function(){window.requestAnimationFrame(function(){document.body.classList.add('page-ready');});});},delay);
  };
  window.addEventListener('load',reveal,{once:true});
  if(document.readyState==='complete')reveal();
  window.setTimeout(reveal,4200);
  var blockZoom=function(event){if((event.ctrlKey||event.metaKey)&&(event.type==='wheel'||['+','-','=','0'].includes(event.key)))event.preventDefault();};
  window.addEventListener('wheel',blockZoom,{passive:false});
  window.addEventListener('keydown',blockZoom);
  document.addEventListener('dblclick',function(event){event.preventDefault();},{passive:false});
  document.addEventListener('touchmove',function(event){if(event.touches.length>1)event.preventDefault();},{passive:false});
})();
