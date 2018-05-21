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

  methods: {
    stopPlayback () {
      this.$refs.videoplayer.stop();
    },

    playback () {
      const vm = this;

      vm.$refs.videoplayer.src = URL.createObjectURL(this.source);

      vm.source.addEventListener('sourceopen', () => {
        vm.$refs.videoplayer.pause();

        const mediaBuffer = vm.source.addSourceBuffer('video/webm; codecs="vorbis,vp8"');
        
        mediaBuffer.addEventListener('update', () => {
          console.log('updating');
          if (vm.bufferQueue.length > 0 && !mediaBuffer.updating) {
            mediaBuffer.appendBuffer(vm.bufferQueue.shift());
          }
        });
        

        // vm.$refs.videoplayer.play();

        vm.videoChannel.on('stream', (data) => {
          
          const uIntArray = new Uint8Array(data);

          if (mediaBuffer.updating || vm.bufferQueue.length > 0) {
            vm.bufferQueue.push(uIntArray);
          } else {
            mediaBuffer.appendBuffer(uIntArray);
          }
        });

        vm.videoChannel.on('end-stream', () => {
          vm.source.endOfStream();
        });

        // TODO: on pause, seek and other video events notify the server
      }, false);
    },

    purgeConnections () {
      if(this.videoSocket) {
        this.videoChannel.off('stream');
        this.videoChannel.off('end-stream');
        this.videoChannel.emit('leave-stream-room', this.channelInfo._channelId);
      }
    },

    attach () {
      const vm = this;
      // this.socketRoomName = null; // TODO: this should be fetched alongside clip infos BEFORE joining
      
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
        if (vm.channelInfo) {
          vm.videoChannel.emit('join-stream-room', vm.channelInfo._channelId);
        }
        
      });

      this.videoChannel.on('joined-stream-room', () => {
        vm.playback();
      });

      this.videoChannel.on('left-stream-room', () => {
        vm.stopPlayback();
      });
    },

    init (to, from, next) {
      const vm = this;
      const clipUUID = to.params.id;
      const streamId = to.params.stream;

      http.get(`/api/streaming/channels/${clipUUID}${streamId ? '/' + streamId : ''}`).then(res => {
        vm.channelInfo = res.data;
        vm.attach();
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

