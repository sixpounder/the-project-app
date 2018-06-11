<template>
  <nav class="navbar navbar-expand-lg navbar-dark bg-primary fixed-top">
    <router-link class="navbar-brand" :to="{ name: 'home' }">
      <img src="../assets/monkey-small.png" />
      <span class="ml-2 d-none d-md-inline">NowStream</span>
    </router-link>
    <!-- <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
      <span class="navbar-toggler-icon"></span>
    </button> -->
    <div class="ml-auto">
      <ul class="navbar-nav flex-row" v-if="currentUser">
        <li class="nav-item">
          <router-link :to="{ name: 'upload' }" class="btn btn-primary">
            <font-awesome-icon icon="cloud-upload-alt"></font-awesome-icon>
            <span class="ml-2">Upload</span>
          </router-link>
        </li>
        <li class="nav-item">
          <a href="#" class="nav-link">
            {{ currentUser.identifier }}
          </a>
        </li>
        <li class="nav-item">
          <a href="#" class="nav-link" @click="signout">
            <font-awesome-icon icon="sign-out-alt"></font-awesome-icon>
          </a>
        </li>
      </ul>
      <ul class="navbar-nav" v-else>
        <li class="nav-item">
          <router-link class="nav-link" :to="{ name: 'register' }">
            Signup
          </router-link>
        </li>
        <li class="nav-item">
          <router-link class="nav-link" :to="{ name: 'login' }">
            Login
          </router-link>
        </li>
      </ul>
    </div>
  </nav>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';

export default {
  methods: {
    signout () {
      this.logout().then(() => {
        this.$router.replace({ name: 'home' });
      });
    },
    ...mapActions(['logout'])
  },
  computed: {
    ...mapGetters(['currentUser'])
  }
}
</script>

<style lang="scss" scoped>
  nav .navbar-nav {
    flex-direction: row;

    li {
      margin-left: 1em;

      &:first-child {
        margin-left: 0;
      }
    }
  }
</style>
