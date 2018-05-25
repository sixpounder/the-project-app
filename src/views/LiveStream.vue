<template>
  <div id="stream-view">
    <div class="container-fluid mt-4">
      <div v-if="channelInfoError" class="alert alert-danger">
        This channel does not exist. Sorry about that.
      </div>
      <div class="row content">
        <div class="col-md-8 col-12">
          <VideoPlayer v-if="videoSource" :source="videoSource" :controllable="currentUserIsStreamMaster" @seek="playerSeek" @play="playerPlay" @pause="playerPause" @created="playerInstanceReady"></VideoPlayer>
        </div>
        <div class="col-md-4 col-12">
          <ChannelChat v-if="channelInfo" :channel="channelInfo._channelId" :via="chatChannel"></ChannelChat>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import http from '@/lib/http';
import { mapGetters } from 'vuex';

const VideoPlayer = () => import('@/components/player/Player');
const ChannelChat = () => import('@/components/chat/ChannelChat');

export default {
  data () {
    return {
      channelInfo: null,
      channelInfoError: null,
      socketRoomName: null,
      clientIsMaster: false,
      playerInstance: null,
      clipUUID: null,
      streamId: null
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
        // Just connect to it
      }

      if (next) {
        next();
      }
    },

    playerPlay () {
      this.videoChannel.emit('play', this.room);
    },

    playerPause () {
      this.videoChannel.emit('pause', this.room);
    },

    playerSeek () {
      this.videoChannel.emit('seeked', this.room, this.playerInstance.currentTime);
    },
  },

  computed: {
    currentUserIsStreamMaster () {
      return this.clientIsMaster;
    },

    videoSource () {
      return this.clipUUID && this.streamId ? `${this.apiHost}/api/streaming/channels/${this.clipUUID}/${this.streamId}` : null;
    },

    room () {
      return this.channelInfo._channelId;
    },

    playable () {
      return this.channelInfo && this.playerInstance;
    },

    ...mapGetters(['currentUser', 'videoChannel', 'chatChannel', 'apiHost'])
  },

  components: { ChannelChat, VideoPlayer }
}
</script>

