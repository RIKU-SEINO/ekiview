import i18n from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import { initReactI18next } from "react-i18next";
import en from './locales/en.json';
import ja from './locales/ja.json';
import zh from './locales/zh.json';
import fr from './locales/fr.json';
import ko from './locales/ko.json';
import es from './locales/es.json';

i18n
  .use(LanguageDetector)
  .use(initReactI18next).init({
  resources: {
    en: {
      translation: en,
    },
    ja: {
      translation: ja,
    },
    fr: {
      translation: fr,
    },
    ko: {
      translation: ko,
    },
    es: {
      translation: es,
    },
    zh: {
      translation: zh,
    },    
  },
  fallbackLng: "en",
  detection: {
    order: ["localStorage", "navigator"],
    caches: ["localStorage"],
  },
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
