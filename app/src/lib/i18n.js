import i18next from "i18next"

i18next.init({
  lng: "en", 
  fallbackLng: "en",
  resources: {
    en: {
      translation: {} 
    },
    it: {
      translation: {}
    }
  }
})

export const i18n = i18next