<template>
  <div class="clip-showcase-item card">
    <img class="card-img-top" :src="`${apiHost}${clip.cover}`" alt="">
    <div class="card-body">
      <h5 class="card-title">{{ clip.title }}</h5>
      <h6 class="card-subtitle mb-2 text-muted">Uploaded by {{ clip.uploader.identifier }} {{ clip.createdAt | timeElapsed }}</h6>
      <p class="card-text" v-html="clip.description"></p>
      <router-link :to="{ name: 'stream', params: { id: clip.uuid }}" class="card-link">Start new stream</router-link>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  props: ['clip'],

  computed: {
    ...mapGetters(['apiHost'])
  }
}
</script>
