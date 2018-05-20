<template>
  <div class="stream-view">
    <video controls ref="videoplayer"></video>
  </div>
</template>

<script>
import http from '@/lib/http';
import io from 'socket.io-client';
import { mapGetters } from 'vuex';

export default {
  data () {
    return {
      socketRoomName: null,
      videoChannel: null,
      chatChannel: null,
      source: new MediaSource(),
      firstChunk: true,
      bufferQueue: [],
      channelInfo: null,
      channelInfoError: null,
      player: {
        pause: true
      }
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

  mounted () {
    const vm = this;
    this.socketRoomName = 'stream-4379657846'; // TODO: this should be fetched alongside clip infos BEFORE joining
    
    this.videoChannel = io('http://localhost:3000', {
      transports: ['websocket'],
      path: '/video'
    });

    this.videoChannel.on('connect', () => {
      // vm.videoSocket = socket;
      console.log('connected');
    });

    this.videoChannel.on('connected', (res) => {
      vm.socketToken = res.token;
      if(vm.currentUser) {
        vm.videoChannel.emit('authenticate', vm.currentUser.id);
      }
    });
    
    this.videoChannel.on('authenticated', () => {
      vm.videoChannel.emit('join-stream-room', vm.socketRoomName);
    });

    this.videoChannel.on('joined-stream-room', () => {
      vm.playback();
    });

    this.videoChannel.on('left-stream-room', () => {
      vm.stopPlayback();
    })
  },

  methods: {
    stopPlayback () {
      this.$refs.videoplayer.stop();
    },

    playback () {
      const vm = this;

      vm.$refs.videoplayer.src = URL.createObjectURL(this.source);

      vm.source.addEventListener('sourceopen', () => {

        const mediaBuffer = vm.source.addSourceBuffer('video/mp4; codecs="avc1.42E01E, mp4a.40.2"');
        
        mediaBuffer.addEventListener('updateend', () => {
          if (vm.bufferQueue.length) {
            mediaBuffer.appendBuffer(vm.bufferQueue.shift());
          }

          vm.$refs.videoplayer.play();
        });

        vm.videoChannel.on('stream', (data, encoding) => {
          console.log('Received data with encoding ' + encoding);
          const uIntArray = new Uint8Array(data);

          if(vm.firstChunk) {
            vm.firstChunk = false;
            mediaBuffer.appendBuffer(uIntArray);
          }

          vm.bufferQueue.push(uIntArray);
        });

        // TODO: on pause, seek and other video events notify the server
      });
    },

    purgeConnections () {
      if(this.videoSocket) {
        this.videoChannel.off('stream');
        this.videoChannel.emit('leave-stream-room', this.socketRoomName);
      }
    },

    init (to, from, next) {
      const clipUUID = to.params.id;
      const streamId = to.params.stream;

      http.get(`/api/streaming/channels/${clipUUID}${streamId ? '/' + streamId : ''}`).then(res => {
        vm.channelInfo = res.data;
      }).catch(err => {
        vm.channelInfoError = err;
      });

      if (next) {
        next();
      }
    }
  },

  computed: {
    ...mapGetters(['currentUser'])
  }
}
</script>

