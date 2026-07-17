(function () {
  'use strict';

  var navigating = false;
  var noticeTimer = 0;

  function showNotice(text, duration) {
    var target = document.getElementById('vnwr-notice');
    if (!target) {
      target = document.createElement('aside');
      target.id = 'vnwr-notice';
      target.className = 'vnwr-notice';
      target.setAttribute('role', 'status');
      target.setAttribute('aria-live', 'polite');
      target.innerHTML = '<b>Уведомление</b><span></span>';
      document.body.appendChild(target);
      var style = document.createElement('style');
      style.textContent = '.vnwr-notice{position:fixed;z-index:10000;top:max(16px,env(safe-area-inset-top));left:16px;right:16px;max-width:448px;margin:0 auto;padding:14px 16px;border-radius:15px;background:#111;color:#fff;box-shadow:0 12px 28px rgba(0,0,0,.22);opacity:0;pointer-events:none;transform:translateY(-12px);transition:opacity .22s ease,transform .28s cubic-bezier(.2,.8,.2,1)}.vnwr-notice.is-shown{opacity:1;transform:translateY(0)}.vnwr-notice b{display:block;font-family:"Factor A",Arial,sans-serif;font-size:15px;font-weight:700;line-height:20px}.vnwr-notice span{display:block;margin-top:3px;color:rgba(255,255,255,.72);font-family:"Factor A",Arial,sans-serif;font-size:14px;font-weight:400;line-height:19px}';
      document.head.appendChild(style);
    }
    target.querySelector('span').textContent = text;
    target.classList.add('is-shown');
    window.clearTimeout(noticeTimer);
    noticeTimer = window.setTimeout(function () {
      target.classList.remove('is-shown');
    }, typeof duration === 'number' ? duration : 2400);
  }

  function showLoader() {
    document.body.classList.add('is-navigating');
    if (document.getElementById('app-loader')) {
      document.documentElement.classList.add('vnwr-app-loading');
      document.body.classList.remove('is-ready');
      var appLoader = document.getElementById('app-loader');
      appLoader.style.transition = 'none';
      appLoader.style.opacity = '1';
      appLoader.style.visibility = 'visible';
      appLoader.style.pointerEvents = 'auto';
    }
    if (document.querySelector('.page-loader')) {
      document.body.classList.remove('page-ready');
      document.body.classList.add('page-loading');
      var pageLoader = document.querySelector('.page-loader');
      pageLoader.style.transition = 'none';
      pageLoader.style.opacity = '1';
      pageLoader.style.visibility = 'visible';
      pageLoader.style.pointerEvents = 'auto';
    }
  }

  function go(href) {
    if (!href || navigating) return;
    navigating = true;
    showLoader();
    window.requestAnimationFrame(function () {
      window.requestAnimationFrame(function () {
        window.setTimeout(function () {
          window.location.assign(href);
        }, 16);
      });
    });
  }

  function isInternalPageLink(anchor) {
    if (!anchor || anchor.hasAttribute('download') || anchor.target === '_blank' || anchor.dataset.noLoader !== undefined) return false;
    var raw = anchor.getAttribute('href') || '';
    if (!raw || raw.charAt(0) === '#' || /^(mailto:|tel:|javascript:)/i.test(raw)) return false;
    var url;
    try { url = new URL(raw, window.location.href); } catch (error) { return false; }
    if (url.origin !== window.location.origin) return false;
    return /\.html$/i.test(url.pathname) || /\/$/.test(url.pathname);
  }

  document.addEventListener('click', function (event) {
    if (event.defaultPrevented || event.button !== 0 || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
    var anchor = event.target.closest && event.target.closest('a[href]');
    if (!isInternalPageLink(anchor)) return;
    event.preventDefault();
    go(anchor.href);
  }, true);

  window.addEventListener('pageshow', function (event) {
    navigating = false;
    if (!event.persisted) return;
    document.body.classList.remove('is-navigating', 'page-loading');
    if (document.getElementById('app-loader')) {
      document.body.classList.add('is-ready');
      document.documentElement.classList.remove('vnwr-app-loading');
      var appLoader = document.getElementById('app-loader');
      appLoader.style.opacity = '0';
      appLoader.style.visibility = 'hidden';
      appLoader.style.pointerEvents = 'none';
    }
    if (document.querySelector('.page-loader')) {
      document.body.classList.add('page-ready');
      var pageLoader = document.querySelector('.page-loader');
      pageLoader.style.opacity = '0';
      pageLoader.style.visibility = 'hidden';
      pageLoader.style.pointerEvents = 'none';
    }
  });
  window.VNWRNavigation = { go: go, showLoader: showLoader };
  window.VNWRNotice = { show: showNotice };
})();
