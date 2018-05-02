<template>
  <div class="app-wrapper">
    <Navbar></Navbar>
    <div id="content-wrapper" class="container-fluid">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
import Navbar from '@/components/Navbar';
import '@/sass/style.scss';

export default {
  components: { Navbar }
}
</script>

