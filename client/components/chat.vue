<template>
  <div class="chat-content" v-if="messages">
    <div class="heading flex flex-between flex-align-center">
      <div class="info">
        <span>{{ messages[0].channel_name }}</span>
      </div>
    </div>
    <div class="message-content">
      <div class="scroll" v-chat-scroll="{smooth: true}">
        <div class="message" v-for="msg in messages" :class="{your: msg.user_name === user_name}">
          <div class="msg">
            <span>{{ msg.message }}</span>
            <div class="date">
              {{ msg.createdAt.split('T')[1].split('.')[0] }}
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="bottom">
      <input type="text" v-model="message" @keyup.enter="send_message" :placeholder="$t('input_message')">
      <button @click="send_message"><i class="fas fa-paper-plane"></i> {{ $t('send') }}</button>
    </div>
  </div>
</template>

<script>
  export default {
    props: {
      messages: Array,
      user_name: String,
      user_avatar: String
    },
    data () {
      return {
        message: ''
      }
    },
    methods: {
      async send_message () {
        let {message, user_name, user_avatar} = this
        let channel_name = this.messages[0].channel_name

        try {
          const res = (await this.$http.post('/api/channels/message', {
            channel_name,
            message,
            user_name,
            user_avatar
          })).data

          if (res.error) return this.$notify({
            group: 'notes',
            type: 'error',
            title: this.$t(`notification.send_message`),
            text: this.$t(`notification.${res.error}`)
          })

          this.message = ''
        } catch (error) {
          this.$notify({
            group: 'notes',
            type: 'error',
            title: this.$t(`notification.server_error`),
            text: this.$t(`notification.error`)
          })
        }
      }
    }
  }
</script>