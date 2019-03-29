<template>
  <div>
    <modal :user_name="name" :user_avatar="avatar" v-if="modal"/>
    <div id="chat-container" class="flex flex-between">
      <div class="leftside">
        <div class="search flex flex-between">
          <div class="language">
            <span>{{ $t('lang') }}:
              <a href="javascript:void(0)" @click="change_lang('en')" :class="{active: $i18n.locale === 'en'}">En</a>
              <a href="javascript:void(0)" @click="change_lang('ru')" :class="{active: $i18n.locale === 'ru'}">Ru</a>
            </span>
          </div>
          <button type="submit" @click="modal = !modal">{{ $t('create_channel') }}</button>
        </div>
        <div class="contacts">
          <div class="scroll">
            <div class="contact flex flex-align-center" v-for="channel in channels"
                 :class="{active: active_channel && channel.channel_name === active_channel[0].channel_name}"
                 @click="open_channel(channel.channel_name)">
              <div class="ava">
                <div class="image"
                     :style="{background: `url(http://lorempixel.com/80/80/people/${channel.user_avatar}) no-repeat center center`}"></div>
              </div>
              <div class="info flex flex-wrap flex-between">
                <div class="username">{{ channel.channel_name }}
                  <div class="date">{{ time_string(channel.createdAt) }}</div>
                </div>
                <div class="hist">{{ channel.message }}</div>
              </div>
            </div>
          </div>
        </div>
        <div class="nickname">
          <span>{{ $t('your_name') }}:</span>
          <input type="text" v-model="name">
        </div>
      </div>
      <chat :messages="active_channel" :user_name="name" :user_avatar="avatar"/>
    </div>
  </div>
</template>
<script>
  import modal from './modal'
  import chat from './chat'

  export default {
    components: {
      chat,
      modal
    },
    data () {
      return {
        name: !localStorage.getItem('name') ? '' : localStorage.getItem('name'),
        avatar: !localStorage.getItem('avatar') ? this.get_avatar() : localStorage.getItem('avatar'),
        message: '',
        channels: [],
        active_channel: null,
        modal: false
      }
    },
    mounted () {
      this.$root.$on('close_modal', () => {
        this.modal = false
      })
      this.$root.$on('open_channel', name => {
        this.open_channel(name)
      })

      if (!this.name) this.get_name()
      this.get_channels()
    },
    sockets: {
      channel_new (channel) {
        this.channels.unshift(channel)
      },
      message_new (msg) {
        let channels = [...this.channels]
        let i = channels.findIndex(channel => channel.channel_name === msg.channel_name)
        channels[i] = msg
        this.channels = channels.sort((a, b) => b.id - a.id)
        console.log(this.active_channel)
        if (!this.active_channel || this.active_channel[0].channel_name !== msg.channel_name) return
        this.active_channel.push(msg)
      }
    },
    methods: {
      change_lang (lang) {
        localStorage.setItem('lang', lang)
        this.$i18n.locale = lang
      },
      async get_channels () {
        try {
          const res = (await this.$http.post('/api/channels')).data

          this.channels = res.channels

        } catch (error) {
          this.$notify({
            group: 'notes',
            type: 'error',
            title: this.$t(`notification.server_error`),
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
            title: this.$t(`notification.server_error`),
            text: this.$t(`notification.error`)
          })
        }
      },
      async open_channel (name) {
        if (this.active_channel && this.active_channel[0].channel_name === name) return

        try {
          const res = (await this.$http.post('/api/channels/' + name)).data

          this.active_channel = res.messages

        } catch (error) {
          this.$notify({
            group: 'notes',
            type: 'error',
            title: this.$t(`notification.server_error`),
            text: this.$t(`notification.error`)
          })
        }
      },
      get_avatar () {
        localStorage.setItem('avatar', Math.floor(Math.random() * 10) + 1)
        return localStorage.getItem('avatar')
      },
      time_string (time) {
        let day = time.split('T')[0]
        let hour = time.split('T')[1].split('.')[0]
        return day + ' ' + hour
      }
    },
    watch: {
      name () {
        localStorage.setItem('name', this.name)
      }
    }
  }
</script>
