<template>
  <div id="stream-view">
    <div class="container-fluid mt-4">
      <div class="row content">
        <div class="col-md-8 col-12">
          <video class="videoplayer" v-if="currentUserIsStreamMaster" controls ref="videoplayer"></video>
          <video class="videoplayer" v-else ref="videoplayer"></video>
        </div>
        <div class="col-md-4 col-12">
          chat here
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import http from '@/lib/http';
import { mapGetters } from 'vuex';

export default {
  data () {
    return {
      clipUUID: null,
      channelInfo: null,
      channelInfoError: null,
      socketRoomName: null,
      clientIsMaster: false
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

    stopPlayback () {
      this.$refs.videoplayer.stop();
    },

    playback () {
      const vm = this;

      vm.$refs.videoplayer.src = `http://localhost:3000/api/streaming/channels/stream/${vm.clipUUID}/${vm.channelInfo._channelId}`;

      vm.videoChannel.emit('join-stream-room', this.room);

      vm.videoChannel.on('joined-stream-room', (room, amITheMaster) => {
        vm.socketRoomName = room;
        vm.clientIsMaster = amITheMaster;
        
        if (vm.currentUserIsStreamMaster) {
          // Register listeners on video player
          vm.$refs.videoplayer.addEventListener('timeupdate', () => {
            vm.videoChannel.emit('timeupdate', vm.room, vm.$refs.videoplayer.currentTime);
          });
          vm.$refs.videoplayer.play();
        } else {
          vm.videoChannel.on('sync', (syncpoint) => {
            vm.$refs.videoplayer.currentTime = syncpoint;
            vm.$refs.videoplayer.play();
          });

          vm.videoChannel.emit('sync', vm.room);
        }
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
          vm.playback();
        }
      }).catch(err => {
        vm.channelInfoError = err;
      });

      if (next) {
        next();
      }
    }
  },

  computed: {
    currentUserIsStreamMaster () {
      return this.clientIsMaster;
    },

    room () {
      return this.channelInfo._channelId;
    },

    ...mapGetters(['currentUser', 'videoChannel', 'chatChannel'])
  }
}
</script>

