<template>
  <div id="login-view" class="container col-12 col-md-8 col-lg-6">
    <h1>Login</h1>
    <form @submit.prevent="doLogin">
      <FormGroup class="col-12 col-md-8 col-lg-6">
        <label for="email">Email address</label>
        <input type="email" class="form-control" id="email" aria-describedby="emailHelp" placeholder="Enter email" v-model="credentials.email">
      </FormGroup>
      <FormGroup class="col-12 col-md-8 col-lg-6">
        <label for="password">Password</label>
        <input type="password" class="form-control" id="password" aria-describedby="emailHelp" placeholder="Password" v-model="credentials.password">
      </FormGroup>
      <FormGroup class="text-center">
        <button class="btn btn-primary btn-lg" type="submit">Login</button>
      </FormGroup>
    </form>
    <div v-show="error !== null" class="alert alert-warning">
      Email or password are not correct
    </div>
  </div>
</template>

<script>
import FormGroup from '@/components/common/FormGroup.vue';

import { mapActions } from 'vuex';

export default {
  data () {
    return {
      credentials: {
        email: null,
        password: null
      },

      error: null
    };
  },

  methods: {
    doLogin () {
      const vm = this;
      this.error = null;

      this.login(this.credentials).then(() => {
        vm.$router.push({ name: 'home' });
      }).catch(err => {
        vm.error = err;
      });
    },

    ...mapActions(['login'])
  },

  components: { FormGroup }
}
</script>
