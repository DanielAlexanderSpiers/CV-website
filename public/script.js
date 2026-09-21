(function () {
  var tabs = Array.prototype.slice.call(document.querySelectorAll('[role="tab"]'));

  function animateIn(el) {
    el.classList.remove('enter');
    void el.offsetWidth;
    el.classList.add('enter');
  }

  var toast = document.getElementById('toast');
  var toastText = document.getElementById('toast-text');
  var toastTimer = null;

  function showToast(msg) {
    if (!toast) return;
    toastText.textContent = msg;
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { toast.classList.remove('show'); }, 2200);
  }

  function copyText(text) {
    if (navigator.clipboard && window.isSecureContext) {
      return navigator.clipboard.writeText(text);
    }
    return new Promise(function (resolve, reject) {
      var ta = document.createElement('textarea');
      ta.value = text;
      ta.setAttribute('readonly', '');
      ta.style.position = 'fixed';
      ta.style.top = '-1000px';
      document.body.appendChild(ta);
      ta.select();
      var ok = false;
      try { ok = document.execCommand('copy'); } catch (err) { ok = false; }
      document.body.removeChild(ta);
      ok ? resolve() : reject(new Error('copy failed'));
    });
  }

  document.addEventListener('click', function (e) {
    var btn = e.target.closest ? e.target.closest('.copybtn') : null;
    if (!btn) return;
    var value = btn.getAttribute('data-copy');
    if (!value) return;

    copyText(value).then(function () {
      var label = btn.querySelector('.lbl');
      var original = label ? label.textContent : null;

      btn.classList.add('copied');
      if (label && !btn.classList.contains('plain')) label.textContent = 'Copied!';
      showToast('Email address copied');

      setTimeout(function () {
        btn.classList.remove('copied');
        if (label && original !== null) label.textContent = original;
      }, 1700);
    }).catch(function () {
      showToast('Could not copy — the address is ' + value);
    });
  });

  var tabwrap = document.querySelector('.tabwrap');
  var tabbar = document.querySelector('.tabbar');

  function updateTabFades() {
    if (!tabwrap || !tabbar) return;
    var max = tabbar.scrollWidth - tabbar.clientWidth;
    tabwrap.classList.toggle('can-left', tabbar.scrollLeft > 4);
    tabwrap.classList.toggle('can-right', max > 4 && tabbar.scrollLeft < max - 4);
  }

  if (tabbar) {
    tabbar.addEventListener('scroll', updateTabFades, { passive: true });
    window.addEventListener('resize', updateTabFades);
    updateTabFades();
    setTimeout(updateTabFades, 300);
  }

  function revealTab(tab) {
    if (!tabbar || tabbar.scrollWidth <= tabbar.clientWidth) return;
    var left = tab.offsetLeft - (tabbar.clientWidth - tab.offsetWidth) / 2;
    if (tabbar.scrollTo) tabbar.scrollTo({ left: left, behavior: 'smooth' });
    else tabbar.scrollLeft = left;
  }

  function select(tab, moveFocus, animate) {
    tabs.forEach(function (t) {
      var on = t === tab;
      var panel = document.getElementById(t.getAttribute('aria-controls'));
      t.setAttribute('aria-selected', on ? 'true' : 'false');
      t.tabIndex = on ? 0 : -1;
      panel.hidden = !on;
      if (on && animate !== false) animateIn(panel);
    });
    if (moveFocus) tab.focus();
    revealTab(tab);
    setTimeout(updateTabFades, 350);
    if (history.replaceState) history.replaceState(null, '', '#' + tab.id.replace(/^t-/, ''));
  }

  tabs.forEach(function (tab, i) {
    tab.addEventListener("click", function () { select(tab, false, true); });
    tab.addEventListener('keydown', function (e) {
      var next = null;
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') next = tabs[(i + 1) % tabs.length];
      else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') next = tabs[(i - 1 + tabs.length) % tabs.length];
      else if (e.key === 'Home') next = tabs[0];
      else if (e.key === 'End') next = tabs[tabs.length - 1];
      if (next) { e.preventDefault(); select(next, true, true); }
    });
  });

  var hash = (location.hash || '').replace(/^#/, '');
  if (hash && hash !== 'resume') {
    var target = document.getElementById('t-' + hash);
    if (target) select(target, false, false);
  }

  var siteView = document.getElementById('site-view');
  var resumeView = document.getElementById('resume-view');
  var openBtn = document.getElementById('open-resume');
  var closeBtn = document.getElementById('close-resume');

  function showResume(push) {
    siteView.hidden = true;
    resumeView.hidden = false;
    animateIn(resumeView);
    window.scrollTo({ top: 0, behavior: 'auto' });
    closeBtn.focus();
    if (push && history.replaceState) history.replaceState(null, '', '#resume');
  }

  function hideResume() {
    resumeView.hidden = true;
    siteView.hidden = false;
    animateIn(siteView);
    window.scrollTo({ top: 0, behavior: 'auto' });
    openBtn.focus();
    if (history.replaceState) history.replaceState(null, '', location.pathname + location.search);
  }

  openBtn.addEventListener('click', function () { showResume(true); });
  closeBtn.addEventListener('click', hideResume);
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && !resumeView.hidden) hideResume();
  });

  if (hash === 'resume') showResume(false);

  var WEB3FORMS_KEY = 'a765c958-0fe9-4392-938d-570e20466073';

  var COOLDOWN_MS = 10 * 60 * 1000;
  var LAST_SENT_KEY = 'ds_contact_last_sent';
  var form = document.getElementById('contact-form');
  var statusEl = document.getElementById('contact-status');
  var submitEl = document.getElementById('contact-submit');
  var ticker = null;

  function readLastSent() {
    try {
      var v = parseInt(window.localStorage.getItem(LAST_SENT_KEY) || '0', 10);
      return isNaN(v) ? 0 : v;
    } catch (err) { return 0; }
  }

  function writeLastSent(t) {
    try { window.localStorage.setItem(LAST_SENT_KEY, String(t)); } catch (err) {}
  }

  function setStatus(kind, html) {
    statusEl.className = 'formstatus ' + kind;
    statusEl.innerHTML = html;
    statusEl.hidden = false;
  }

  function formatLeft(ms) {
    var total = Math.ceil(ms / 1000);
    var m = Math.floor(total / 60);
    var s = total % 60;
    return m + ':' + (s < 10 ? '0' : '') + s;
  }

  function lockForm(locked) {
    submitEl.disabled = locked;
    Array.prototype.forEach.call(form.querySelectorAll('input:not(.hp), textarea'), function (el) {
      el.disabled = locked;
    });
  }

  function stopTicker() {
    if (ticker) { clearInterval(ticker); ticker = null; }
  }

  function runCooldown(showMessage) {
    var left = readLastSent() + COOLDOWN_MS - Date.now();
    if (left <= 0) {
      stopTicker();
      lockForm(false);
      return false;
    }
    lockForm(true);
    if (showMessage !== false) {
      setStatus('wait', 'To keep the inbox clear, there is a 10 minute wait between messages. You can send another in <b>' + formatLeft(left) + '</b>.');
    }
    stopTicker();
    ticker = setInterval(function () {
      var remaining = readLastSent() + COOLDOWN_MS - Date.now();
      if (remaining <= 0) {
        stopTicker();
        lockForm(false);
        setStatus('ok', 'You can send another message now.');
        return;
      }
      var b = statusEl.querySelector('b');
      if (b) b.textContent = formatLeft(remaining);
    }, 1000);
    return true;
  }

  if (form) {
    runCooldown(true);

    var nameEl = document.getElementById('cf-name');
    var msgEl = document.getElementById('cf-message');
    var hpEl = form.querySelector('.hp');

    function fail(code, detail) {
      submitEl.disabled = false;
      setStatus('err',
        '<b>Message not sent.</b> ' + detail +
        '<br>Error code: <b>' + code + '</b> &middot; you can email me directly at ' +
        '<b>danielspiers10@gmail.com</b>.');
    }

    form.addEventListener('submit', function (e) {
      e.preventDefault();

      try {
        if (hpEl && hpEl.value) return;
        if (runCooldown(true)) return;

        var name = (nameEl.value || '').trim();
        var message = (msgEl.value || '').trim();

        if (!name) {
          setStatus('err', '<b>Message not sent.</b> Please add your name so I know who the message is from.<br>Error code: <b>FORM-10</b>.');
          nameEl.focus();
          return;
        }
        if (message.length < 10) {
          setStatus('err', '<b>Message not sent.</b> Please write a slightly longer message (at least 10 characters).<br>Error code: <b>FORM-11</b>.');
          msgEl.focus();
          return;
        }

        if (!WEB3FORMS_KEY) {
          fail('FORM-01', 'The message form has not been connected to an email service yet.');
          return;
        }

        submitEl.disabled = true;
        setStatus('wait', 'Sending your message&hellip;');

        fetch('https://api.web3forms.com/submit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
          body: JSON.stringify({
            access_key: WEB3FORMS_KEY,
            subject: 'New message from your CV site - ' + name,
            from_name: 'CV site contact form',
            name: name,
            email: 'no-reply@danielspiers.com',
            message: message
          })
        })
          .then(function (res) {
            return res.json().catch(function () { return { success: false, message: 'HTTP ' + res.status }; });
          })
          .then(function (data) {
            if (!data || data.success !== true) {
              fail('FORM-03', 'The email service rejected the message' + (data && data.message ? ' (' + String(data.message).slice(0, 120) + ')' : '') + '.');
              return;
            }
            writeLastSent(Date.now());
            form.reset();
            setStatus('ok', '<b>Message sent successfully.</b> It has gone straight to my inbox and I will get back to you as soon as I can.');
            setTimeout(function () { runCooldown(false); }, 4000);
          })
          .catch(function () {
            fail('FORM-02', 'The message could not reach the email service. This usually means no internet connection, or the page is running somewhere that blocks outgoing requests.');
          });
      } catch (err) {
        fail('FORM-99', 'Something went wrong in the page: ' + (err && err.message ? err.message : 'unknown error') + '.');
      }
    });
  }
})();
