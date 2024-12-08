let currentLang = 'en'

export const setServerLang = (lang) => {
  currentLang = lang
}

export const getServerLang = () => currentLang
