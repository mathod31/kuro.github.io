// i18n - Internationalization System for Kuro

class I18n {
  constructor() {
    this.currentLang = this.getStoredLang() || this.detectBrowserLang();
    this.translations = translations;
  }

  // Detect browser language
  detectBrowserLang() {
    const browserLang = navigator.language || navigator.userLanguage;
    return browserLang.startsWith('fr') ? 'fr' : 'en';
  }

  // Get stored language preference
  getStoredLang() {
    return localStorage.getItem('kuro-lang');
  }

  // Set language
  setLang(lang) {
    if (this.translations[lang]) {
      this.currentLang = lang;
      localStorage.setItem('kuro-lang', lang);
      document.documentElement.lang = lang;
      this.updatePage();
      this.updateLangSwitcher();
    }
  }

  // Get translation
  t(key) {
    return this.translations[this.currentLang]?.[key] || this.translations['en']?.[key] || key;
  }

  // Update all elements with data-i18n attribute
  updatePage() {
    // Update text content
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      const translation = this.t(key);
      el.textContent = translation;
      // Hide element if translation is empty
      el.style.display = translation ? '' : 'none';
    });

    // Update placeholders
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
      const key = el.getAttribute('data-i18n-placeholder');
      el.placeholder = this.t(key);
    });

    // Update title attribute
    document.querySelectorAll('[data-i18n-title]').forEach(el => {
      const key = el.getAttribute('data-i18n-title');
      el.title = this.t(key);
    });

    // Update aria-label
    document.querySelectorAll('[data-i18n-aria]').forEach(el => {
      const key = el.getAttribute('data-i18n-aria');
      el.setAttribute('aria-label', this.t(key));
    });
    
    // Update select options
    document.querySelectorAll('select[data-i18n-options]').forEach(select => {
      const optionsKey = select.getAttribute('data-i18n-options');
      select.querySelectorAll('option[data-i18n]').forEach(option => {
        const key = option.getAttribute('data-i18n');
        option.textContent = this.t(key);
      });
    });
  }

  // Update language switcher button
  updateLangSwitcher() {
    const switchers = document.querySelectorAll('.lang-switch');
    switchers.forEach(switcher => {
      const otherLang = this.currentLang === 'fr' ? 'en' : 'fr';
      const flag = otherLang === 'fr' ? '🇫🇷' : '🇬🇧';
      const label = otherLang === 'fr' ? 'Français' : 'English';
      
      switcher.setAttribute('data-lang', otherLang);
      switcher.innerHTML = `<span class="flag">${flag}</span><span class="lang-label">${label}</span>`;
    });
  }

  // Toggle between languages
  toggleLang() {
    const newLang = this.currentLang === 'fr' ? 'en' : 'fr';
    this.setLang(newLang);
  }

  // Initialize
  init() {
    document.documentElement.lang = this.currentLang;
    this.updatePage();
    this.updateLangSwitcher();

    // Add click handlers to language switchers
    document.querySelectorAll('.lang-switch').forEach(switcher => {
      switcher.addEventListener('click', (e) => {
        e.preventDefault();
        this.toggleLang();
      });
    });
  }
}

// Initialize i18n when DOM is ready
let i18n;
document.addEventListener('DOMContentLoaded', () => {
  i18n = new I18n();
  i18n.init();
});

// Export for global access
window.i18n = {
  setLang: (lang) => i18n?.setLang(lang),
  toggleLang: () => i18n?.toggleLang(),
  t: (key) => i18n?.t(key)
};

