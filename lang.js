// Language toggle shared by every page (ko / en / ja).
// Pages keep Korean in the HTML and define window.I18N = { en: {...}, ja: {...} } for the rest.
//   data-i18n="key"             -> innerHTML
//   data-i18n-attr="alt:key"    -> attributes (several separated by ";")
//   data-lang="en"              -> shown only in that language
//   data-set-lang="en"          -> button that switches language
(function () {
  var SUPPORTED = ['ko', 'en', 'ja'];
  var KEY = 'gamenest-lang';
  var dict = window.I18N || {};
  var original = { title: document.title };

  function initial() {
    var q = new URLSearchParams(location.search).get('lang');
    if (SUPPORTED.indexOf(q) > -1) return q;
    try {
      var saved = localStorage.getItem(KEY);
      if (SUPPORTED.indexOf(saved) > -1) return saved;
    } catch (e) {}
    var langs = navigator.languages || [navigator.language || 'ko'];
    for (var i = 0; i < langs.length; i++) {
      var l = String(langs[i]).slice(0, 2).toLowerCase();
      if (SUPPORTED.indexOf(l) > -1) return l;
    }
    return 'en';
  }

  function t(lang, key, fallback) {
    return lang !== 'ko' && dict[lang] && dict[lang][key] != null ? dict[lang][key] : fallback;
  }

  function apply(lang) {
    document.documentElement.lang = lang;
    document.title = t(lang, 'title', original.title);

    document.querySelectorAll('[data-i18n]').forEach(function (el) {
      if (el.dataset.ko == null) el.dataset.ko = el.innerHTML;
      el.innerHTML = t(lang, el.dataset.i18n, el.dataset.ko);
    });

    document.querySelectorAll('[data-i18n-attr]').forEach(function (el) {
      el.dataset.i18nAttr.split(';').forEach(function (pair) {
        var p = pair.split(':'), attr = p[0].trim(), key = p[1].trim();
        var store = 'ko' + attr.replace(/[^a-z]/gi, '');
        if (el.dataset[store] == null) el.dataset[store] = el.getAttribute(attr) || '';
        el.setAttribute(attr, t(lang, key, el.dataset[store]));
      });
    });

    document.querySelectorAll('[data-lang]').forEach(function (el) {
      el.hidden = el.dataset.lang !== lang;
    });

    document.querySelectorAll('[data-set-lang]').forEach(function (btn) {
      btn.setAttribute('aria-pressed', String(btn.dataset.setLang === lang));
    });
  }

  document.addEventListener('click', function (e) {
    var btn = e.target.closest('[data-set-lang]');
    if (!btn) return;
    var lang = btn.dataset.setLang;
    try { localStorage.setItem(KEY, lang); } catch (err) {}
    apply(lang);
  });

  apply(initial());
})();
