(function () {
  'use strict';

  var navigating = false;
  var noticeTimer = 0;

  function showNotice(text, duration) {
    var target = document.querySelector('[data-vnwr-header-notice]');
    if (!target) return;
    if (!target.dataset.vnwrNoticeOriginal) target.dataset.vnwrNoticeOriginal = target.innerHTML;
    target.classList.add('is-notice');
    target.textContent = text;
    window.clearTimeout(noticeTimer);
    noticeTimer = window.setTimeout(function () {
      target.innerHTML = target.dataset.vnwrNoticeOriginal || '';
      target.classList.remove('is-notice');
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
