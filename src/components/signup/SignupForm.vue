<template>
  <div class="signup-form-wrapper">
    <div class="mt-4 alert alert-danger" v-show="error">
      {{ error }}
    </div>
    <form @submit.prevent="onSignupFormSubmit">
      <FormGroup>
        <label for="">Email address</label>
        <input type="email" class="form-control" placeholder="Enter email" v-model="signup.email" @change="onEmailChanged">
        <small id="emailHelp" class="form-text text-danger" v-show="status.emailExists === true">This email address is already in use</small>
        <small id="emailHelp" class="form-text text-success" v-show="status.emailExists === false">This email address is not yet being used</small>
      </FormGroup>
      <FormGroup>
        <label for="">Choose a username</label>
        <input type="text" class="form-control" placeholder="Enter a username" v-model="signup.identifier">
      </FormGroup>
      <FormGroup>
        <label for="">Choose a password</label>
        <input type="password" class="form-control" placeholder="Enter password" v-model="signup.password">
      </FormGroup>
      <FormGroup>
        <label for="">Enter your password again</label>
        <input type="password" class="form-control" placeholder="Enter password again" v-model="signup.passwordConfirm">
      </FormGroup>
      <FormGroup>
        <button type="submit" class="btn btn-primary">Signup</button>
      </FormGroup>
    </form>
  </div>
</template>

<script>
import _ from 'lodash';
import http from '@/lib/http';

const FormGroup = () => import('@/components/common/FormGroup');

let onEmailChangedDebouncedFn;

export default {
  components: { FormGroup },

  data () {
    return {
      signup: {
        email: null,
        identifier: null,
        password: null,
        passwordConfirm: null
      },

      status: {
        emailExists: null
      },

      error: null
    };
  },

  created () {
    this.onEmailChanged = _.debounce(() => {
      const vm = this;
      http.get('/api/auth/user/check', { params: { email: this.signup.email }}).then(res => {
        vm.status.emailExists = res.data.exists;
      });
    }, 800).bind(this);
  },

  methods: {
    onSignupFormSubmit () {
      const vm = this;
      vm.status.email = null;
      http.post('/api/auth/signup', this.signup).then(() => {
        vm.$router.push({ name: 'home' });
        // Show a message confirming signup
      }).catch(err => {
        vm.error = err;
      });
    },
  }
}
</script>

