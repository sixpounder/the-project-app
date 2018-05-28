<template>
  <div id="stream-view">
    <div class="container-fluid mt-4">
      <div class="row content">
        <div class="col-md-8 col-12">
          <VideoPlayer v-if="videoSource" :source="videoSource" :controllable="currentUserIsStreamMaster" @created="playerInstanceReady"></VideoPlayer>
        </div>
        <div class="col-md-4 col-12">
          <ChannelChat v-if="chatConnected" :channel="streamId" :via="chatIo"></ChannelChat>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import io from 'socket.io-client';
import http from '@/lib/http';
import { mapGetters } from 'vuex';

const VideoPlayer = () => import('@/components/player/Player');
const ChannelChat = () => import('@/components/chat/ChannelChat');

export default {
  data () {
    return {
      playerInstance: null,
      clipUUID: null,
      streamId: null,
      streamReady: false,
      streamEnded: false,
      videoIo: null,
      chatIo: null,
      chatConnected: false
    };
  },

  beforeRouteEnter (to, from, next) {
    next(vm => {
      vm.init(to, from);
    });
  },

  beforeRouteUpdate (to, from, next) {
    this.init(to, from, next);
  },

  beforeRouteLeave (to, from, next) {
    this.purgeConnections();
    next();
  },

  beforeDestroy () {
    this.purgeConnections();
  },

  methods: {
    playerInstanceReady (instance) {
      this.playerInstance = instance;
    },

    purgeConnections () {
      if(this.videoSocket) {
        this.videoChannel.emit('leave-stream-room', this.room);
      }
    },

    init (to, from, next) {
      const vm = this;
      this.clipUUID = to.params.id;
      this.streamId = to.params.stream;

      if (! this.streamId) {
        // Create the stream
        http.post(`/api/streaming/channels/${vm.clipUUID}`).then(res => {
          const newStreamId = res.data.streamId;
          vm.$router.replace({ name: 'stream', params: { id: vm.clipUUID, stream: newStreamId }});
        }).catch(err => {
          vm.channelInfoError = err;
        });
      } else {
        this.videoIo = io(`${this.apiHost}/${this.streamId}/video`, {
          transports: ['websocket']
        });
        this.chatIo = io(`${this.apiHost}/${this.streamId}/chat`, {
          transports: ['websocket']
        });

        this.videoIo.on('connection', () => {
          console.debug('Video socket connected');
        }).on('streaming', () => {
          vm.streamReady = true;
        }).on('disconnect', () => {
          vm.streamReady = false;
        }).on('closing', () => {
          vm.streamEnded = true;
        });

        this.chatIo.on('connect', () => {
          vm.chatConnected = true;
        }).on('disconnect', () => {
          vm.chatConnected = false;
        });

        if (next) {
          next();
        }
      }
    },
  },

  computed: {
    currentUserIsStreamMaster () {
      return this.clientIsMaster;
    },

    videoSource () {
      return this.clipUUID && this.streamId && this.streamReady ? `${this.apiHost}/api/streaming/channels/${this.clipUUID}/${this.streamId}/manifest.m3u8` : null;
    },

    ...mapGetters(['currentUser', 'apiHost'])
  },

  components: { ChannelChat, VideoPlayer }
}
</script>

