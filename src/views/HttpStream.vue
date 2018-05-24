<template>
  <div id="stream-view">
    <div class="container-fluid mt-4">
      <div v-if="channelInfoError" class="alert alert-danger">
        This channel does not exist. Sorry about that.
      </div>
      <div class="row content" v-if="channelInfo">
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
      clipUUID: null,
      channelInfo: null,
      channelInfoError: null,
      socketRoomName: null,
      clientIsMaster: false,
      playerInstance: null
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

    playback () {
      const vm = this;

      vm.videoChannel.emit('join-stream-room', this.room);

      vm.videoChannel.on('joined-stream-room', (room, amITheMaster) => {
        vm.socketRoomName = room;
        vm.clientIsMaster = amITheMaster;
        
        if (vm.currentUserIsStreamMaster) {
          vm.playerInstance.play();
          // Register listeners on video player
          // vm.$refs.videoplayer.addEventListener('timeupdate', () => {
          //   vm.videoChannel.emit('timeupdate', vm.room, vm.$refs.videoplayer.currentTime);
          // });

          // vm.$refs.videoplayer.addEventListener('seeked', () => {
          //   vm.videoChannel.emit('seeked', vm.room, vm.$refs.videoplayer.currentTime);
          // });

          // vm.$refs.videoplayer.addEventListener('pause', () => {
          //   vm.videoChannel.emit('pause', vm.room);
          // });

          // vm.$refs.videoplayer.addEventListener('play', () => {
          //   vm.videoChannel.emit('play', vm.room);
          // });

          // vm.$refs.videoplayer.play();
        } else {
          vm.videoChannel.emit('sync', vm.room);
        }

        vm.videoChannel.on('sync', (syncpoint) => {
          vm.playerInstance.currentTime = syncpoint;
          vm.playerInstance.play();
        });

        vm.videoChannel.on('becomes-master', () => {
          vm.clientIsMaster = true;
        });
      });
    },

    purgeConnections () {
      if(this.videoSocket) {
        this.videoChannel.emit('leave-stream-room', this.room);
      }
    },

    init (to, from, next) {
      const vm = this;
      const clipUUID = to.params.id;
      const streamId = to.params.stream;

      http.get(`/api/streaming/channels/${clipUUID}${streamId ? '/' + streamId : ''}`).then(res => {
        if (!streamId) {
          vm.$router.replace({ name: 'stream', params: { id: clipUUID, stream: res.data._channelId} });
        } else {
          vm.channelInfo = res.data;
          vm.clipUUID = clipUUID;
          
          vm.$nextTick(() => {
            vm.playback();
          });
        }
      }).catch(err => {
        vm.channelInfoError = err;
      });

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
      return this.channelInfo && this.clipUUID ? `http://localhost:3000/api/streaming/channels/stream/${this.clipUUID}/${this.channelInfo._channelId}` : null;
    },

    room () {
      return this.channelInfo._channelId;
    },

    playable () {
      return this.channelInfo && this.playerInstance;
    },

    ...mapGetters(['currentUser', 'videoChannel', 'chatChannel'])
  },

  components: { ChannelChat, VideoPlayer }
}
</script>

