<template>
  <div id="user-context-provider">
    <slot v-if="contextInitialized"></slot>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';

export default {
  created () {
    const vm = this;

    this.initializeUserContext().then(() => {
      vm.$emit('user-context-initialized');
    });
  },

  methods: {
    ...mapActions(['initializeUserContext'])
  },

  computed: {
    ...mapGetters(['contextInitialized'])
  }
}
</script>
