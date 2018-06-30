<template>
  <div id="stream-view">
    <div class="container-fluid mt-4">
      <div class="row content" v-if="! stillConverting">
        <div class="col-md-8 col-12 video-layout">
          <div v-if="streamWaiting" class="d-flex flex-column justify-content-center align-items-center">
            <h1>
              <font-awesome-icon icon="circle-notch" spin></font-awesome-icon>
            </h1>
            <h4>Stream is loading, stand by</h4>
          </div>
          <div v-if="streamEnded" class="d-flex flex-column justify-content-center align-items-center">
            <h1>
              <font-awesome-icon icon="hand-spock"></font-awesome-icon>
            </h1>
            <h4>Stream has ended, long live and prosper</h4>
          </div>
          <div v-if="videoSource">
            <VideoPlayer :source="videoSource" @created="playerInstanceReady"></VideoPlayer>
            <h3 class="mt-4">{{ clip.title }}</h3>
            <p>Uploaded by <strong>{{ clip.uploader.identifier}}</strong> {{ clip.createdAt | timeElapsed }}</p>
          </div>
        </div>
        <div class="col-md-4 col-12 chat-layout">
          <div class="text-center" v-if="chatConnecting">
            <font-awesome-icon icon="circle-notch" spin></font-awesome-icon>
            <span class="ml-2">Connecting to channel chat</span>
          </div>

          <div class="text-center" v-if="chatDisconnected">
            <font-awesome-icon icon="frown"></font-awesome-icon>
            <span class="ml-2">Disconnected from channel chat</span>
          </div>

          <ChannelChat v-if="chatConnected" :channel="streamId" :via="chatIo"></ChannelChat>
        </div>
      </div>
      
      <div v-if="stillConverting" class="d-flex align-items-center flex-column">
        <img class="img-fluid" src="../assets/monkey.png" />
        <h3>Your video is still being converted</h3>
        <p>Refresh this page in a few moments, thank you</p>
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
      clip: null,
      streamId: null,
      streamStatus: 'waiting',
      videoIo: null,
      chatIo: null,
      chatStatus: 'connecting',
      stillConverting: false
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

      http.get(`/api/streaming/channels/${vm.clipUUID}`).then(res => {
        if (res.status === 202) {
          // Video is still converting
          this.stillConverting = true;
        } else if (res.status === 200) {
          // Video available
          if (! this.streamId) {
            // Create the stream
            http.post(`/api/streaming/channels/${vm.clipUUID}`).then(res => {
              const newStreamId = res.data.streamId;
              vm.$router.replace({ name: 'stream', params: { id: vm.clipUUID, stream: newStreamId }});
            }).catch(err => {
              vm.channelInfoError = err;
            });
          } else {
            this.clip = res.data.details;

            this.videoIo = io(`${this.apiHost}/${this.streamId}/video`, {
              transports: ['websocket']
            });
            this.chatIo = io(`${this.apiHost}/${this.streamId}/chat`, {
              transports: ['websocket']
            });

            this.videoIo.on('connect', () => {
              console.debug('Video socket connected');
              vm.streamStatus = 'waiting';
            }).on('streaming', () => {
              vm.streamStatus = 'ready';
            }).on('disconnect', () => {
              vm.streamStatus = 'disconnected';
            }).on('closing', () => {
              vm.streamStatus = 'closing';
            });

            this.chatIo.on('connect', () => {
              vm.chatStatus = 'connected';
            }).on('connecting', () => {
              vm.chatStatus = 'connecting';
            }).on('disconnect', () => {
              vm.chatStatus = 'disconnected';
            });

            if (next) {
              next();
            }
          }
        } else {
          // TODO: Show a "not found" alert or something like that
        }
      });

      
    },
  },

  computed: {
    
    chatConnected () {
      return this.chatStatus === 'connected';
    },

    chatConnecting () {
      return this.chatStatus === 'connecting';
    },

    chatDisconnected () {
      return this.chatStatus === 'disconnected';
    },

    videoSource () {
      return this.clipUUID && this.streamId && this.streamReady ? `${this.apiHost}/api/streaming/channels/${this.clipUUID}/${this.streamId}/manifest.m3u8` : null;
    },

    streamWaiting () {
      return this.streamStatus === 'waiting';
    },

    streamReady () {
      return this.streamStatus === 'ready';
    },

    streamEnded () {
      return this.streamStatus === 'closing' || this.streamStatus === 'disconnected';
    },

    ...mapGetters(['currentUser', 'apiHost'])
  },

  components: { ChannelChat, VideoPlayer }
}
</script>

