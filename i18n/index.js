import translations from './translations.js';

// Default language
let currentLanguage = 'en';

// Get browser language or use default
const getBrowserLanguage = () => {
  const browserLang = navigator.language || navigator.userLanguage;
  const shortLang = browserLang.split('-')[0];
  
  // Check if we support this language
  return translations[shortLang] ? shortLang : 'en';
};

// Initialize language from localStorage or browser settings
const initLanguage = () => {
  const savedLang = localStorage.getItem('appLanguage');
  if (savedLang && translations[savedLang]) {
    currentLanguage = savedLang;
  } else {
    currentLanguage = getBrowserLanguage();
    localStorage.setItem('appLanguage', currentLanguage);
  }
  return currentLanguage;
};

// Get current language
const getLanguage = () => currentLanguage;

// Set language
const setLanguage = (lang) => {
  if (translations[lang]) {
    currentLanguage = lang;
    localStorage.setItem('appLanguage', lang);
    
    // Notify components of language change
    if (window.eventBus) {
      window.eventBus.emit('language-changed', lang);
    }
    
    return true;
  }
  return false;
};

// Get available languages
const getAvailableLanguages = () => {
  return Object.keys(translations).map(code => ({
    code,
    name: code === 'en' ? 'English' : code === 'pt' ? 'Português' : code
  }));
};

// Get translation for a key
const t = (key) => {
  const keys = key.split('.');
  let result = translations[currentLanguage];
  
  for (const k of keys) {
    if (result && result[k] !== undefined) {
      result = result[k];
    } else {
      // Fallback to English if key not found in current language
      let fallback = translations['en'];
      for (const fk of keys) {
        if (fallback && fallback[fk] !== undefined) {
          fallback = fallback[fk];
        } else {
          return key; // Return the key itself if not found in fallback
        }
      }
      return fallback;
    }
  }
  
  return result;
};

// Format a translation with variables
const tf = (key, variables = {}) => {
  let text = t(key);
  
  // Replace variables in the format {varName}
  Object.keys(variables).forEach(varName => {
    const regex = new RegExp(`{${varName}}`, 'g');
    text = text.replace(regex, variables[varName]);
  });
  
  return text;
};

// Export the i18n API
export default {
  initLanguage,
  getLanguage,
  setLanguage,
  getAvailableLanguages,
  t,
  tf
}; 