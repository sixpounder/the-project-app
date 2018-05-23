<template>
  <div class="app-wrapper">
    <UserContextProvider @user-context-initialized="userContextReady">
      <Navbar></Navbar>
      <div id="content-wrapper" class="container-fluid">
        <router-view></router-view>
      </div>
    </UserContextProvider>
  </div>
</template>

<script>
import { mapActions } from 'vuex';
import Navbar from '@/components/Navbar';
import UserContextProvider from '@/components/UserContextProvider';
import '@/sass/style.scss';

export default {
  methods: {
    userContextReady () {
      this.ioConnect();
    },

    ...mapActions(['ioConnect', 'initializeUserContext'])
  },
  
  components: { Navbar, UserContextProvider }
}
</script>

