import Vue from 'vue'
import Axios from 'axios'
import io from 'socket.io-client'
import Socket from 'vue-socket.io'
import ChatScroll from 'vue-chat-scroll'
import Notifications from 'vue-notification'
import create_i18n from './lang'
import create_router from './router'
import Layout from './layout'

Vue.prototype.$http = Axios
Vue.config.productionTip = false
Vue.use(Notifications)
Vue.use(ChatScroll)

Vue.use(new Socket({
  connection: io(`http://localhost:2053`, {
    forceJSONP: true
  })
}))

const i18n = create_i18n()
const router = create_router()

new Vue({
  router,
  i18n,
  render: h => h(Layout)
}).$mount('#app')