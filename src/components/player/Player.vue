<template>
  <div class="player" v-if="source">
    <video autoplay="true" controls class="videoplayer" ref="videoplayer"></video>
  </div>
</template>

<script>
import moment from 'moment';
import Hls from 'hls.js';

export default {
  props: ['source'],
  
  data () {
    return {
      progressPercentage: 0,
      timeElapsed: 0,
      totalTime: 0,
      playerState: 'paused',
      hls: null
    };
  },

  mounted () {
    // this.$refs.videoplayer.addEventListener('durationchange', this.onDurationChange);
    // this.$refs.videoplayer.addEventListener('timeupdate', this.onTimeUpdate);
    // this.$refs.videoplayer.addEventListener('play', this.onPlayerStateChanged);
    // this.$refs.videoplayer.addEventListener('pause', this.onPlayerStateChanged);

    const vm = this;
    if(Hls.isSupported()) {
      this.hls = new Hls({
        manifestLoadingTimeOut: 30000
      });
      this.hls.loadSource(this.source);
      this.hls.attachMedia(this.$refs.videoplayer);
      this.hls.on(Hls.Events.MANIFEST_PARSED, () => {
        vm.$refs.videoplayer.play();
      });
    }
  },

  // beforeDestroy () {
  //   this.$refs.videoplayer.removeEventListener('durationchange', this.onDurationChange);
  //   this.$refs.videoplayer.removeEventListener('timeupdate', this.onTimeUpdate);
  //   this.$refs.videoplayer.removeEventListener('play', this.onPlayerStateChanged);
  //   this.$refs.videoplayer.removeEventListener('pause', this.onPlayerStateChanged);
  // },

  methods: {
    onPlayerStateChanged () {
      this.playerState = this.$refs.videoplayer.paused ? 'paused' : 'playing';
    },

    onDurationChange () {
      this.$emit('created', this.$refs.videoplayer);
      console.debug('PLAYER:: duration set to ' + this.$refs.videoplayer.duration);
      this.totalTime = this.$refs.videoplayer.duration;
    },

    onTimeUpdate () {
      this.$emit('timeupdate', this.$refs.videoplayer.currentTime);
      try {
        this.timeElapsed = this.$refs.videoplayer.currentTime;
        this.progressPercentage = (this.$refs.videoplayer.currentTime * 100) / this.$refs.videoplayer.duration; 
      } catch (e) {
        this.progressPercentage = 0; // Should never happen (...)
      }
    },

    play () {
      if (this.controllable) {
        this.$refs.videoplayer.play();
        this.$emit('play');
      }
    },

    pause () {
      if (this.controllable) {
        this.$refs.videoplayer.pause();
        this.$emit('pause');
      }
    }
  },
  
  computed: {

    humanReadableTimeElapsed () {
      return moment(this.timeElapsed).format('mm:ss');
    },

    humanReadableTotalTime () {
      return moment(this.totalTime).format('mm:ss');
    }
  }
}
</script>

