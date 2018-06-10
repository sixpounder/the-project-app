<template>
  <div class="clips-showcase">
    <div class="row">
      <div class="col-6 col-md-4 col-lg-3" v-for="clip in clips" :key="clip.uuid">
        <ClipShowcaseItem class="mt-2" :clip="clip"></ClipShowcaseItem>
      </div>
    </div>
  </div>
</template>

<script>
import ClipShowcaseItem from '@/components/clips/ClipShowcaseItem';

export default {
  props: ['clips'],
  components: { ClipShowcaseItem }
}
</script>

