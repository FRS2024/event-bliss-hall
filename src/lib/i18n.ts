
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from '@/locales/en.json';
import fr from '@/locales/fr.json';
import ar from '@/locales/ar.json';

// Function to detect browser language
const detectBrowserLanguage = () => {
  const browserLang = navigator.language || navigator.languages[0];
  
  // Check if browser language matches our supported languages
  if (browserLang.startsWith('fr')) return 'fr';
  if (browserLang.startsWith('ar')) return 'ar';
  if (browserLang.startsWith('en')) return 'en';
  
  // Default to English if no match found
  return 'en';
};

// Get saved language or detect browser language
const savedLanguage = localStorage.getItem('language');
const initialLanguage = savedLanguage || detectBrowserLanguage();

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      fr: { translation: fr },
      ar: { translation: ar }
    },
    lng: initialLanguage,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    },
    // Add direction support
    react: {
      useSuspense: false
    }
  });

// Apply RTL/LTR direction based on language
const updateDirection = (language: string) => {
  const isRTL = language === 'ar';
  document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
  document.documentElement.lang = language;
};

// Set initial direction
updateDirection(initialLanguage);

// Listen for language changes
i18n.on('languageChanged', (lng) => {
  updateDirection(lng);
  localStorage.setItem('language', lng);
});

export default i18n;
