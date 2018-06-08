<template>
  <div class="clip-showcase-item card">
    <img class="card-img-top" :src="`${apiHost}${clip.cover}`" alt="">
    <div class="card-body">
      <h5 class="card-title">{{ clip.title }}</h5>
      <h6 class="card-subtitle mb-2 text-muted">Uploaded by {{ clip.uploader.identifier }}</h6>
      <p class="card-text" v-html="clip.description"></p>
      <a href="#" class="card-link">Card link</a>
      <a href="#" class="card-link">Another link</a>
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

