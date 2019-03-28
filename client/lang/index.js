import Vue from 'vue'
import VueI18n from 'vue-i18n'
import ru from './ru.json'
import en from './en.json'

Vue.use(VueI18n)
let locale = 'ru'

export function defaultLocale(lang) {
  locale = lang
}

export default () => {
  return new VueI18n({
    locale,
    messages: {
      ru,
      en
    }
  })
}
