<template>
  <div class="channel-chat">
    <div class="chat-container" v-if="currentUser">
      <div class="messages" ref="chatContainer">
        <ul class="list-unstyled">
          <li class="media" v-for="message in messageBuffer" :key="message.id">
            <Message :message="message"></Message>
          </li>
        </ul>
      </div>
      <div class="message-input">
        <input class="form-control input-sm" v-model="message" @keyup.enter="sendMessage" />
      </div>
    </div>
    <div class="alert alert-info" v-else>
      Login to join channel chat
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

const Message = () => import('@/components/chat/Message');

export default {
  props: ['channel', 'via'],

  data () {
    return {
      message: '',
      clients: [],
      socket: null,
      messageBuffer: []
    };
  },

  mounted () {
    const vm = this;
    vm.socket = vm.via;
    vm.socket.on('message', (msg) => {
      vm.messageBuffer.push({ type: 'message', payload: msg });
      this.$nextTick(() => {
        vm.$refs.chatContainer.scrollTop = vm.$refs.chatContainer.scrollHeight;
      });
    });

    vm.socket.on('user-left', (userWhoLeft) => {
      vm.messageBuffer.push({ type: 'user-left', payload: userWhoLeft });
    });

    vm.socket.on('user-joined', (userWhoJoined) => {
      vm.messageBuffer.push({ type: 'user-joined', payload: userWhoJoined });
    });
  },

  beforeDestroy () {
    this.socket.disconnect();
  },

  methods: {
    sendMessage () {
      this.socket.emit('message', this.message);
      this.message = '';
    }
  },

  computed: {
    ...mapGetters(['currentUser'])
  },

  components: {
    Message
  }
}
</script>

