<template>
  <div class="app-wrapper">
    <Navbar></Navbar>
    <div id="content-wrapper" class="container-fluid">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex';
import Navbar from '@/components/Navbar';
import '@/sass/style.scss';

export default {
  created () {
    this.ioConnect();
  },

  methods: {
    ...mapActions(['ioConnect'])
  },
  
  components: { Navbar }
}
</script>

