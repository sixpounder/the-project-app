<template>
  <div class="channel-chat">
    <div class="messages">
      <ul class="list-unstyled">
        <li class="media" v-for="message in messageBuffer" :key="message.id">
          <Message :model="message"></Message>
        </li>
      </ul>
    </div>
    <input class="form-control input-sm" v-model="message" @keyup.enter="sendMessage" />
  </div>
</template>

<script>
const Message = () => import('@/components/chat/Message');

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
    console.debug('Will join chat room ' + this.channel);
    this.via.on('connection', (socket) => {
      socket.on('message', (msg) => {
        this.messageBuffer.push({ type: 'message', payload: msg });
      });

      socket.on('user-left', (userWhoLeft) => {
        this.messageBuffer.push({ type: 'user-left', payload: userWhoLeft });
      });

      socket.on('user-joined', (userWhoJoined) => {
        this.messageBuffer.push({ type: 'user-joined', payload: userWhoJoined });
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
  },

  components: {
    Message
  }
}
</script>

