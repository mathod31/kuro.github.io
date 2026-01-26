// i18n - Internationalization System for Kuro (i18next)

(() => {
  const markReady = () => {
    if (typeof document === 'undefined') {
      return;
    }
    document.documentElement.classList.remove('i18n-loading');
    document.documentElement.classList.add('i18n-ready');
  };

  if (typeof document !== 'undefined') {
    document.documentElement.classList.remove('no-js');
    document.documentElement.classList.add('js');
  }
  const STORAGE_KEY = 'kuro-lang';
  const LANGUAGE_METADATA = {
    fr: { label: 'Français', flag: '🇫🇷' },
    en: { label: 'English', flag: '🇬🇧' },
    es: { label: 'Español', flag: '🇪🇸' },
    de: { label: 'Deutsch', flag: '🇩🇪' }
  };
  const SUPPORTED_LANGS = Object.keys(LANGUAGE_METADATA);
  const DEFAULT_LANG = 'fr';

  const getStoredLang = () => {
    try {
      return localStorage.getItem(STORAGE_KEY);
    } catch (error) {
      return null;
    }
  };

  const setStoredLang = (lang) => {
    try {
      localStorage.setItem(STORAGE_KEY, lang);
    } catch (error) {
      // Ignore storage errors (private mode, disabled storage, etc.)
    }
  };

  const detectBrowserLang = () => {
    const browserLang = (navigator.language || navigator.userLanguage || '').toLowerCase();
    const match = SUPPORTED_LANGS.find((lang) => browserLang.startsWith(lang));
    return match || DEFAULT_LANG;
  };

  const getTranslations = () => {
    if (typeof window !== 'undefined' && window.kuroTranslations) {
      return window.kuroTranslations;
    }

    if (typeof translations !== 'undefined') {
      return translations;
    }

    return null;
  };

  const translateKey = (key) => {
    return i18next.t(key, { defaultValue: '' });
  };

  const updatePage = () => {
    document.documentElement.lang = i18next.language || DEFAULT_LANG;

    document.querySelectorAll('[data-i18n]').forEach((el) => {
      const key = el.getAttribute('data-i18n');
      const translation = translateKey(key);
      if (!translation) {
        el.style.display = 'none';
        return;
      }

      el.innerHTML = translation;
      el.style.removeProperty('display');
    });

    document.querySelectorAll('[data-i18n-placeholder]').forEach((el) => {
      const key = el.getAttribute('data-i18n-placeholder');
      const translation = translateKey(key);
      if (translation) {
        el.setAttribute('placeholder', translation);
      }
    });

    document.querySelectorAll('[data-i18n-title]').forEach((el) => {
      const key = el.getAttribute('data-i18n-title');
      const translation = translateKey(key);
      if (translation) {
        el.title = translation;
      }
    });

    document.querySelectorAll('[data-i18n-aria]').forEach((el) => {
      const key = el.getAttribute('data-i18n-aria');
      const translation = translateKey(key);
      if (translation) {
        el.setAttribute('aria-label', translation);
      }
    });
  };

  const buildLangOptions = (menu) => {
    if (!menu || menu.dataset.built === 'true') {
      return;
    }

    const fragment = document.createDocumentFragment();
    SUPPORTED_LANGS.forEach((lang) => {
      const option = document.createElement('button');
      option.type = 'button';
      option.className = 'lang-option';
      option.setAttribute('role', 'option');
      option.setAttribute('data-lang', lang);
      const { flag, label } = LANGUAGE_METADATA[lang] || { flag: '', label: lang };
      option.innerHTML = `<span class="flag">${flag}</span><span class="lang-label">${label}</span>`;
      fragment.appendChild(option);
    });

    menu.appendChild(fragment);
    menu.dataset.built = 'true';
  };

  const closeAllPickers = () => {
    document.querySelectorAll('.lang-picker.open').forEach((picker) => {
      picker.classList.remove('open');
      const toggle = picker.querySelector('.lang-switch');
      if (toggle) {
        toggle.setAttribute('aria-expanded', 'false');
      }
    });
  };

  const updateLangPickers = () => {
    const currentLang = i18next.language || DEFAULT_LANG;
    const { flag, label } = LANGUAGE_METADATA[currentLang] || LANGUAGE_METADATA[DEFAULT_LANG];

    document.querySelectorAll('.lang-picker').forEach((picker) => {
      const toggle = picker.querySelector('.lang-switch');
      const menu = picker.querySelector('.lang-menu');

      if (toggle) {
        const flagEl = toggle.querySelector('.flag');
        const labelEl = toggle.querySelector('.lang-label');
        if (flagEl) {
          flagEl.textContent = flag;
        }
        if (labelEl) {
          labelEl.textContent = label;
        }
      }

      if (menu) {
        buildLangOptions(menu);
        menu.querySelectorAll('.lang-option').forEach((option) => {
          const isActive = option.getAttribute('data-lang') === currentLang;
          option.setAttribute('aria-selected', isActive ? 'true' : 'false');
        });
      }
    });
  };

  const setLang = (lang) => {
    if (!SUPPORTED_LANGS.includes(lang) || !i18next.isInitialized) {
      return;
    }

    i18next.changeLanguage(lang).then(() => {
      setStoredLang(lang);
      updatePage();
      markReady();
      updateLangPickers();
    });
  };

  const attachPickers = () => {
    const pickers = document.querySelectorAll('.lang-picker');

    pickers.forEach((picker) => {
      const toggle = picker.querySelector('.lang-switch');
      const menu = picker.querySelector('.lang-menu');

      if (menu) {
        buildLangOptions(menu);
      }

      if (toggle) {
        toggle.addEventListener('click', (event) => {
          event.preventDefault();
          event.stopPropagation();
          const isOpen = picker.classList.contains('open');
          closeAllPickers();
          if (!isOpen) {
            picker.classList.add('open');
            toggle.setAttribute('aria-expanded', 'true');
          }
        });
      }

      if (menu) {
        menu.addEventListener('click', (event) => {
          const option = event.target.closest('.lang-option');
          if (!option) {
            return;
          }
          const targetLang = option.getAttribute('data-lang');
          closeAllPickers();
          setLang(targetLang);
        });
      }
    });

    document.addEventListener('click', (event) => {
      if (!event.target.closest('.lang-picker')) {
        closeAllPickers();
      }
    });

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') {
        closeAllPickers();
      }
    });
  };

  const init = (attempt = 0) => {
    const resources = getTranslations();
    if (!window.i18next || !resources) {
      if (attempt < 20) {
        window.setTimeout(() => init(attempt + 1), 50);
        return;
      }
      console.warn('i18n dependencies are not available.');
      markReady();
      return;
    }

    const initialLang = getStoredLang() || detectBrowserLang();

    i18next
      .init({
        lng: initialLang,
        fallbackLng: 'en',
        resources,
        interpolation: { escapeValue: false },
        returnNull: false,
        returnEmptyString: false
      })
      .then(() => {
        updatePage();
        markReady();
        updateLangPickers();
        attachPickers();
      });
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  window.i18n = {
    setLang,
    t: (key, options) => {
      if (window.i18next) {
        return window.i18next.t(key, options);
      }
      return (options && options.defaultValue) || key;
    },
    getLang: () => (window.i18next ? window.i18next.language : DEFAULT_LANG),
    supportedLangs: SUPPORTED_LANGS
  };
})();
