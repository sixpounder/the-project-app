<template>
  <span class="clock-time">{{ computedTime }}</span>
</template>

<script>
import moment from 'moment';
import { setInterval } from 'timers';

export default {
  data () {
    return {
      time: moment()
    };
  },

  created () {
    const vm = this;
    setInterval(function () {
      vm.time = moment();
    }, 1000);
  },

  computed: {
    computedTime ()  {
      return this.time.format('HH:mm:ss');
    }
  }
}
</script>

<style lang="scss" scoped>

.clock-time {
  color: green;
}
</style>
