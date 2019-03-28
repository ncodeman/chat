<template>
  <div>
    <div id="chat-container" class="flex flex-between">
      <div class="leftside">
        <div class="search flex flex-between">
          <input type="text" placeholder="Поиск по контактам...">
          <button type="submit">Создать канал</button>
        </div>
        <div class="contacts">
          <div class="scroll">
            <div class="contact active flex flex-between flex-align-center">
              <div class="ava">
                <div class="image"
                     style="background: url(https://pp.userapi.com/c841427/v841427747/72a5b/iqTxXkclKEM.jpg?ava=1) no-repeat center center;"></div>
              </div>
              <div class="info flex flex-wrap flex-between">
                <div class="username">Никита Сахаров
                  <div class="date">20:35</div>
                </div>
                <div class="hist">[#lox228] Если кто-то примет, то идите пожалуйста нахуй.</div>
              </div>
            </div>
          </div>
        </div>
        <div class="nickname">
          <span>Ваш никнейм:</span>
          <input type="text" v-model="name">
        </div>
      </div>
      <div class="chat-content">
        <div class="heading flex flex-between flex-align-center">
          <div class="info">
            <span>Никита Сахаров</span>
            <p>Был в сети сегодня, в 22:05</p>
          </div>
          <div class="language">
            <span>Language: <a href="#" class="active">En</a><a href="#">Ru</a></span>
          </div>
        </div>
        <div class="message-content">
          <div class="scroll">
            <div class="message user">
              <div class="msg">
                <span>Привет, ты тут? </span>
                <div class="date">
                  15:03
                </div>
              </div>
            </div>
            <div class="message your">
              <div class="msg">
                <span>Да</span>
                <div class="date">
                  15:05
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="bottom">
          <input type="text" placeholder="Введите сообщение">
          <button type="submit"><i class="fas fa-paper-plane"></i> Отправить</button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  export default {
    data () {
      return {
        name: !localStorage.getItem('name') ? '' : localStorage.getItem('name'),
        avatar: !localStorage.getItem('avatar') ? this.get_avatar() : localStorage.getItem('avatar'),
        message: ''
      }
    },
    mounted () {
      if (!this.name) this.get_name()
      this.get_channels()
    },
    methods: {
      async get_channels () {
        try {
          const res = (await this.$http.post('/api/channels')).data

          console.log(res)
        } catch (error) {
          this.$notify({
            group: 'notes',
            type: 'error',
            title: this.$t(`notification.serverError`),
            text: this.$t(`notification.error`)
          })
        }
      },
      async get_name () {
        try {
          const res = (await this.$http.get('https://randomuser.me/api')).data

          let name = res.results[0].name.first.charAt(0).toUpperCase() + res.results[0].name.first.slice(1)
          name += ' ' + res.results[0].name.last.charAt(0).toUpperCase() + res.results[0].name.last.slice(1)
          localStorage.setItem('name', name)
          this.name = name
        } catch (error) {
          this.$notify({
            group: 'notes',
            type: 'error',
            title: this.$t(`notification.serverError`),
            text: this.$t(`notification.error`)
          })
        }
      },
      get_avatar () {
        localStorage.setItem('avatar', Math.floor(Math.random() * 10) + 1)
        return localStorage.getItem('avatar')
      }
    },
    watch: {
      name () {
        localStorage.setItem('name', this.name)
      }
    }
  }
</script>
