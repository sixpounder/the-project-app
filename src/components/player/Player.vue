<template>
  <div class="player" v-if="source">
    <video :src="source" class="videoplayer" ref="videoplayer"></video>
    <div class="controls d-flex" v-if="controls">
      <button class="btn btn-primary" v-if="playerState === 'paused'" @click="play">Play</button>
      <button class="btn btn-primary" v-if="playerState === 'playing'" @click="pause">Pause</button>
      <progress :value="progressPercentage" :max="100"></progress>
      <span class="timer">{{ timeElapsed }} / {{ totalTime }}</span>
    </div>
  </div>
</template>

<script>
export default {
  props: ['source', 'controls'],
  
  data () {
    return {
      progressPercentage: 0
    };
  },

  mounted () {
    this.playerElement.addEventListener('durationchange', this.onDurationChange);
    this.playerElement.addEventListener('timeupdate', this.onTimeUpdate);
  },

  beforeDestroy () {
    this.playerElement.removeEventListener('durationchange', this.onDurationChange);
    this.playerElement.removeEventListener('timeupdate', this.onTimeUpdate);
  },

  methods: {
    onTimeUpdate (e) {
      this.progressPercentage = (this.playerElement.currentTime * 100) / this.playerElement.duration; 
    }
  },
  
  computed: {
    playerElement () {
      return this.$refs.videoplayer;
    },

    playerState () {
      return this.playerElement.paused ? 'paused' : 'playing';
    },

    play () {
      this.playerElement.play();
      this.$emit('play');
    },

    pause () {
      this.playerElement.pause();
      this.$emit('pause');
    }
  }
}
</script>

