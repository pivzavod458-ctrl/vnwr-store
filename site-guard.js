(function(){
  'use strict';
  if(window.__vnwrSiteGuard)return;
  window.__vnwrSiteGuard=true;

  var style=document.createElement('style');
  style.textContent='img,svg,video,.vnwr-protected{-webkit-user-drag:none;-webkit-touch-callout:none}img{user-select:none;-webkit-user-select:none}';
  document.head.appendChild(style);

  document.addEventListener('dragstart',function(event){
    if(event.target&&event.target.closest&&event.target.closest('img,svg,video,.vnwr-protected'))event.preventDefault();
  },{capture:true});

  document.addEventListener('contextmenu',function(event){
    if(event.target&&event.target.closest&&event.target.closest('img,svg,video,.vnwr-protected'))event.preventDefault();
  },{capture:true});

  document.addEventListener('keydown',function(event){
    if(!(event.ctrlKey||event.metaKey))return;
    var key=String(event.key||'').toLowerCase();
    if(key==='s'||key==='u')event.preventDefault();
  },{capture:true});
})();
