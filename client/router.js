import Vue from 'vue'
import Router from 'vue-router'
import Index from './components/index'

Vue.use(Router)

const routes = [
  {path: '/', component: Index}
]

export default () => {
  return new Router({
    mode: 'history',
    base: __dirname,
    linkExactActiveClass: 'active',
    routes
  })
}