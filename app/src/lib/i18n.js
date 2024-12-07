export const i18n = {
  language:
    typeof localStorage !== 'undefined'
      ? localStorage.getItem('language') || 'en'
      : 'en',
  content: {},
  changeLanguage(lang) {
    this.language = lang
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('language', lang)
      document.cookie = `language=${lang}; Path=/;`
      window.location.reload()
    }
  },
}
