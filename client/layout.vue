<template>
  <div id="app">
    <router-view :key="$route.fullPath"/>
    <notifications-block/>
  </div>
</template>

<script>
  import NotificationsBlock from './components/notifications.vue'

  export default {
    components: {
      NotificationsBlock
    },
    mounted () {
      console.log('%cBack-end -  https://t.me/codeman1337', 'color: green; font-size:15px;')
      console.log('%cFront-end -  https://t.me/codeman1337', 'color: blue; font-size:15px;')
      this.$i18n.locale = !localStorage.getItem('lang') ? 'en' : localStorage.getItem('lang')
    }
  }
</script>
<style>
  @import './assets/css/styles.css';
</style>
