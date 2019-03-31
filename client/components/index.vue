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
          <div class="sub" :class="{active: type === 'chats'}" @click="type = 'chats'"><i class="fas fa-comments"></i>
            {{ $t('chats') }}
          </div>
          <div class="sub" :class="{active: type === 'online'}" @click="type = 'online'"><i class="fas fa-users"></i> {{
            $t('online') }}
          </div>
          <div class="scroll" v-if="type === 'chats'">
            <div class="contact flex flex-align-center" v-for="channel in channels"
                 :class="{active: active_channel && channel.channel_name === active_channel[0].channel_name}"
                 @click="open_channel(channel.channel_name)">
              <div class="ava">
                <div class="image"
                     :style="{background: `url(http://lorempixel.com/80/80/people/${get_avatar_channel(channel)}) no-repeat center center`}"></div>
              </div>
              <div class="info flex flex-wrap flex-between">
                <div class="username">{{ get_title(channel) }}
                  <div class="date">{{ time_string(channel.createdAt) }}</div>
                </div>
                <div class="hist">{{ channel.message }}</div>
              </div>
            </div>
          </div>
          <div class="scroll" v-else>
            <div class="contact flex flex-align-center" v-for="user in users" @click="send_user(user.name,user.avatar)"
                 v-if="user.name !== name">
              <div class="ava">
                <div class="image"
                     :style="{background: `url(http://lorempixel.com/80/80/people/${user.avatar}) no-repeat center center`}"></div>
              </div>
              <div class="info flex flex-wrap flex-between">
                <div class="username">{{ user.name }}
                  <div class="date">Active now</div>
                </div>
                <div class="hist">Write to {{ user.name }}</div>
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
        type: !localStorage.getItem('type') ? 'chats' : localStorage.getItem('type'),
        name: !localStorage.getItem('name') ? '' : localStorage.getItem('name'),
        avatar: !localStorage.getItem('avatar') ? this.get_avatar() : localStorage.getItem('avatar'),
        message: '',
        channels: [],
        users: [],
        active_channel: null,
        modal: false
      }
    },
    async mounted () {
      this.$root.$on('close_modal', () => {
        this.modal = false
      })
      this.$root.$on('open_channel', name => {
        this.open_channel(name)
      })

      if (!this.name) await this.get_name()
      this.get_channels()
      let {name, avatar} = this
      this.$socket.emit('online', {name, avatar})
    },
    sockets: {
      channel_new (channel) {
        this.channels.unshift(channel)
      },
      message_new (msg) {
        let channels = [...this.channels]
        let i = channels.findIndex(channel => channel.channel_name === msg.channel_name)
        if (msg.user2_name && !channels[i]) {
          channels.unshift(msg)
          if(this.active_channel) this.active_channel[0] = msg
        } else channels[i] = msg
        this.type = 'chats'
        this.channels = channels.sort((a, b) => b.id - a.id)
        if ((!this.active_channel && !this.active_channel[0]) || this.get_title(this.active_channel[0]) !== this.get_title(msg)) return
        if (channels[i]) this.active_channel.push(msg)
      },
      online (users) {
        this.users = []
        for (let id of Object.keys(users)) this.users.push(users[id])
      }
    },
    methods: {
      change_lang (lang) {
        localStorage.setItem('lang', lang)
        this.$i18n.locale = lang
      },
      async get_channels () {
        try {
          let {name} = this
          const res = (await this.$http.post('/api/channels', {name})).data

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
      async open_channel (channel) {
        if (this.active_channel && this.active_channel.channel_name === channel) return

        try {
          let {name} = this
          let priv = false
          if (channel.user2_name) priv = true
          const res = (await this.$http.post('/api/channels/' + channel, {priv, name})).data

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
      send_user (user2_name, user2_avatar) {
        let {name, avatar} = this
        this.active_channel = [{
          channel_name: name + '' + user2_name,
          user_avatar: avatar,
          user_name: name,
          user2_name,
          user2_avatar
        }]
      },
      get_avatar () {
        localStorage.setItem('avatar', Math.floor(Math.random() * 10) + 1)
        return localStorage.getItem('avatar')
      },
      time_string (time) {
        let day = time.split('T')[0]
        let hour = time.split('T')[1].split('.')[0]
        return day + ' ' + hour
      },
      get_title (channel) {
        if (!channel.user2_name) return channel.channel_name
        if (this.name === channel.user_name) return channel.user2_name
        return channel.user_name
      },
      get_avatar_channel (channel) {
        if (!channel.user2_name || (channel.user2_name && this.name === channel.user2_name)) return channel.user_avatar
        return channel.user2_avatar
      }
    },
    watch: {
      name () {
        localStorage.setItem('name', this.name)
      },
      type () {
        localStorage.setItem('type', this.type)
      }
    }
  }
</script>
