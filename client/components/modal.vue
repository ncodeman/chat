<template>
  <div class="modals flex flex-center flex-wrap">
    <div class="modal-content flex flex-center">
      <div class="modal">
        <h3 class="title">{{ $t('create_channel') }} <a href="javascript:void(0)" @click="$root.$emit('close_modal')">{{ $t('close') }}</a></h3>
        <form @submit="create_channel">
          <div class="bx-input">
            <h4>{{ $t('input_channel') }}</h4>
            <input type="text" v-model="channel_name" :placeholder="$t('channel')">
            <h4>{{ $t('input_message') }}</h4>
            <input type="text" v-model="message" :placeholder="$t('message')">
          </div>
          <button type="submit">{{ $t('create') }}</button>
        </form>
      </div>
    </div>
  </div>
</template>
<script>
  export default {
    props: {
      user_name: String,
      user_avatar: String
    },
    data () {
      return {
        channel_name: '',
        message: ''
      }
    },
    methods: {
      async create_channel () {
        let {channel_name, message, user_name, user_avatar} = this

        try {
          const res = (await this.$http.post('/api/channels/create', {
            channel_name,
            message,
            user_name,
            user_avatar
          })).data

          if (res.error) return this.$notify({
            group: 'notes',
            type: 'error',
            title: this.$t(`notification.create_channel`),
            text: this.$t(`notification.${res.error}`)
          })

          this.$root.$emit('close_modal')
          this.$root.$emit('open_channel', res.channel.channel_name)
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