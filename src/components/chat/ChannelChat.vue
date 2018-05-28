<template>
  <div class="channel-chat">
    <div class="messages">
      <ul class="list-unstyled">
        <li class="media" v-for="message in messageBuffer" :key="message.id">
          <img :src="avatar(message.user.email)" />
          <div class="media-body">
            <h5 class="mt-0 mb-1">{{ message.user.identifier }}</h5>
            <span>{{ message.msg }}</span>
          </div>
        </li>
      </ul>
    </div>
    <input class="form-control input-sm" v-model="message" @keyup.enter="sendMessage" />
  </div>
</template>

<script>
export default {
  props: ['channel', 'via'],

  data () {
    return {
      message: '',
      clients: [],
      messageBuffer: []
    };
  },

  mounted () {
    const vm = this;
    console.debug('Will join chat room ' + this.channel);
    this.via.on('connection', function(otherClients) {
      vm.clients = otherClients;
      vm.via.on('message', (msg) => {
        vm.messageBuffer.push(msg);
      });
    });
  },

  beforeDestroy () {
    this.via.disconnect();
  },

  methods: {
    sendMessage () {
      this.via.emit('message', this.message, function() {
        console.debug('Message sent');
      });
    }
  }
}
</script>

