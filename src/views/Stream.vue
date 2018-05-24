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

  mounted () {
    if (! MediaSource.isTypeSupported('video/mp4; codecs="avc1.42E01E, mp4a.40.2"')) {
      console.error('Unsupported codec');
    }
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
      
      let mediaBuffer, bcount = 0;
      
      vm.$refs.videoplayer.pause();

      vm.$refs.videoplayer.src = URL.createObjectURL(this.source);
      
      vm.videoChannel.on('stream', (data, encoding) => {
        const uIntArray = new Uint8Array(data);
        bcount += uIntArray.length;
        console.log('Received ' + encoding + ' of ' + uIntArray.length + 'bytes');

        if (mediaBuffer.updating) {
          console.info('push into queue');
          vm.bufferQueue.push(uIntArray);
        } else {
          console.info('append');
          mediaBuffer.appendBuffer(uIntArray);
        }

        vm.videoChannel.emit('ack', { li: bcount });

      });

      vm.videoChannel.on('stream-end', () => {
        console.log('end received');
        vm.source.endOfStream();
        vm.$refs.videoplayer.play();
      });

      vm.source.addEventListener('sourceopen', () => {

        mediaBuffer = vm.source.addSourceBuffer('video/mp4; codecs="avc1.42E01E, mp4a.40.2"');
        
        mediaBuffer.addEventListener('update', () => {
          console.info('updating');
        });

        vm.source.addEventListener('updateend', () => {
          console.info('Updated');
          if (vm.bufferQueue.length > 0 && !mediaBuffer.updating) {
            console.info('append from queue');
            mediaBuffer.appendStream(vm.bufferQueue.shift());
          }
          vm.$refs.videoplayer.play();
        });

        // vm.source.addEventListener('sourceended', (e) => {
        //   console.info('END');
        //   console.warn(e);
        // });
        // vm.$refs.videoplayer.play();

        // TODO: on pause, seek and other video events notify the server
      }, false);

      vm.source.addEventListener('sourceclose', (e) => {
          console.info('CLOSED');
          console.warn(e);
        });

        vm.source.addEventListener('sourceended', (e) => {
          console.info('END');
          console.warn(e);
        });

        vm.source.addEventListener('error', (e) => {
          console.info('ERROR');
          console.warn(e);
        });
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
      
      this.videoChannel = io(this.apiHost, {
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
    ...mapGetters(['currentUser', 'apiHost'])
  }
}
</script>

