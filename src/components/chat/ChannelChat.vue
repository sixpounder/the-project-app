<template>
  <div class="channel-chat">
    <input class="form-control input-sm" v-model="message" @keyup.enter="sendMessage" />
  </div>
</template>

<script>
export default {
  props: ['channel', 'via'],

  data () {
    return {
      message: '',
      messageBuffer: []
    };
  },

  mounted () {
    const vm = this;
    console.debug('Will join chat room ' + this.channel);
    this.via.emit('join-room', this.channel, function(otherClients) {
      console.debug('Joined chat for room ' + vm.channel);
      console.debug(otherClients);
      vm.via.on('message', (msg) => {
        vm.messageBuffer.push(msg);
      });
    });
  },

  beforeDestroy () {
    const vm = this;
    this.via.emit('leave-room', this.channel, function() {
      console.debug('Left chat room ' + vm.channel);
    });
  },

  methods: {
    sendMessage () {
      this.via.emit('message', this.channel, this.message, function() {
        console.debug('Message sent');
      });
    }
  }
}
</script>

