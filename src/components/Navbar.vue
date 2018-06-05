<template>
  <nav class="navbar navbar-expand-lg navbar-dark bg-primary fixed-top">
    <router-link class="navbar-brand" :to="{ name: 'home' }">
      <img src="../assets/monkey-small.png" />
      <span class="ml-2 d-none d-md-inline">Stream Now</span>
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
            <font-awesome-icon icon="chevron-down"></font-awesome-icon>
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
import { mapGetters } from 'vuex';

export default {
  computed: {
    ...mapGetters(['currentUser'])
  }
}
</script>

