import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

import Backend from 'i18next-http-backend'
import fullCSV from '../public/translation.csv'

const resources = {
  ru: {
    translation: fullCSV[0]
  },
  en: {
    translation: fullCSV[1]
  }
}

i18n
  .use(Backend)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'ru',
    lng        : process.env.INTERFACE_LANGUAGE,
    debug      : process.env.DEV_SHOW_REDUCERS,
  })

export default i18n
