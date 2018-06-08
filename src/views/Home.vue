<template>
  <div class="mt-4">
    <section id="latest-clips">
      <header class="major">
        <h1>Latest uploads</h1>
      </header>
      <div class="mt-2">
        <ClipShowcase v-if="clips" :clips="clips"></ClipShowcase>
        <Loader v-if="!clips"></Loader>
      </div>
    </section>
  </div>
</template>

<script>
import Loader from '@/components/common/Loader';
import ClipShowcase from '@/components/clips/ClipShowcase';
import http from '@/lib/http';

export default {
  data () {
    return {
      clips: null,
      error: null
    };
  },
  beforeRouteEnter (to, from, next) {
    next(vm => {
      vm.init(to, from);
    });
  },

  methods: {
    init (to, from, next) {
      this.loadLatestClips().then(() => {
        if (next) {
          next();
        }
      });
    },

    loadLatestClips () {
      return http.get('/api/content/clips/latest').then(res => {
        this.clips = res.data;
      }).catch(err => {
        this.error = err;
      });
    }
  },

  components: {
    ClipShowcase,
    Loader
  }
}
</script>
