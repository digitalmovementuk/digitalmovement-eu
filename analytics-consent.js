/* One consent engine for the main site and the standalone campaign page. */
(() => {
  'use strict';
  if (window.DMAnalyticsConsent) return;
  const KEY = 'dm-eu-consent-v2', VERSION = '2026-09-11';
  const MAX_AGE = 180 * 24 * 60 * 60 * 1000;
  const ID = document.currentScript?.dataset.measurementId || '';
  let memory = null, loaded = false, timer, script;
  function valid(v) {
    if (!v || typeof v.analytics !== 'boolean' || v.version !== VERSION || typeof v.ts !== 'string') return null;
    const age = Date.now() - Date.parse(v.ts);
    return Number.isFinite(age) && age >= 0 && age < MAX_AGE ? v : null;
  }
  function read() {
    try {
      const raw = localStorage.getItem(KEY);
      if (!raw) return valid(memory);
      const value = valid(JSON.parse(raw));
      if (!value) { localStorage.removeItem(KEY); memory = null; }
      return value;
    }
    catch { return valid(memory); }
  }
  function isGranted() { return read()?.analytics === true; }
  function emit() { window.dispatchEvent(new CustomEvent('dm:consent-decided')); }
  function clearCookies() {
    const host = location.hostname;
    const domains = ['', host, '.' + host, '.' + host.split('.').slice(-2).join('.')];
    const paths = ['/'], segments = location.pathname.split('/').filter(Boolean);
    for (let i = 1; i <= segments.length; i++) {
      const path = '/' + segments.slice(0, i).join('/'); paths.push(path, path + '/');
    }
    document.cookie.split(';').forEach(cookie => {
      const name = cookie.split('=')[0].trim();
      if (!/^(_ga(?:_|$)|_gcl(?:_|$))/.test(name)) return;
      for (const domain of domains) for (const path of paths)
        document.cookie = name + '=; Max-Age=0; path=' + path + (domain ? '; domain=' + domain : '') + '; SameSite=Lax';
    });
  }
  window.dataLayer = window.dataLayer || [];
  window.gtag = window.gtag || function () { window.dataLayer.push(arguments); };
  window.gtag('consent', 'default', { analytics_storage: 'denied', ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied' });
  window.gtag('set', 'ads_data_redaction', true);
  window.gtag('set', 'url_passthrough', false);
  function schedule() {
    clearTimeout(timer);
    const v = read();
    if (v) timer = setTimeout(check, Math.min(MAX_AGE - (Date.now() - Date.parse(v.ts)) + 20, 2147483647));
  }
  function enable() {
    if (!isGranted() || loaded || !/^G-[A-Z0-9]+$/.test(ID)) return;
    loaded = true;
    window['ga-disable-' + ID] = false;
    window.gtag('consent', 'update', { analytics_storage: 'granted', ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied' });
    window.gtag('js', new Date());
    window.gtag('config', ID, { cookie_expires: MAX_AGE / 1000, cookie_update: false, cookie_flags: 'SameSite=Lax;Secure', allow_google_signals: false, allow_ad_personalization_signals: false });
    script = document.createElement('script'); script.async = true;
    script.src = 'https://www.googletagmanager.com/gtag/js?id=' + encodeURIComponent(ID);
    document.head.appendChild(script);
    schedule();
  }
  function stop() {
    window['ga-disable-' + ID] = true; clearTimeout(timer);
    window.gtag('consent', 'update', { analytics_storage: 'denied', ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied' });
    clearCookies();
    if (loaded) { script?.remove(); location.reload(); }
  }
  function choose(analytics) {
    const v = { analytics: analytics === true, ts: new Date().toISOString(), version: VERSION };
    memory = v;
    try {
      localStorage.setItem(KEY, JSON.stringify(v));
      localStorage.removeItem('dm-eu-consent-v1'); localStorage.removeItem('dm-eu-ads-consent-v1');
    } catch { /* A choice still works on this page when storage is blocked. */ }
    if (v.analytics) enable(); else stop();
    schedule(); emit(); return v;
  }
  function clear() {
    memory = null; try { localStorage.removeItem(KEY); } catch {}
    stop(); emit();
  }
  function check() {
    if (!isGranted() && loaded) stop();
    if (!read()) clearCookies();
    schedule(); emit();
  }
  function track(name, parameters = {}) {
    // Never queue or replay actions that happened before consent.
    if (!isGranted() || !loaded) return false;
    window.gtag('event', name, parameters); return true;
  }
  window.addEventListener('storage', event => {
    if (event.key !== KEY && event.key !== null) return;
    memory = null;
    if (isGranted()) enable(); else stop();
    schedule(); emit();
  });
  window.addEventListener('focus', check);
  document.addEventListener('visibilitychange', () => { if (!document.hidden) check(); });
  window.DMAnalyticsConsent = { key: KEY, version: VERSION, maxAge: MAX_AGE, read, choose, clear, enable, stop, track, isGranted };
  try { localStorage.removeItem('dm-eu-consent-v1'); localStorage.removeItem('dm-eu-ads-consent-v1'); } catch {}
  if (isGranted()) enable(); else clearCookies();
  schedule();
})();
