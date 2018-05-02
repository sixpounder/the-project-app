<template>
  <form @submit.prevent="onSignupFormSubmit">
    <FormGroup>
      <label for="">Email address</label>
      <input type="email" class="form-control" id="" placeholder="Enter email" v-model="signup.email">
      <small id="emailHelp" class="form-text text-danger">This email address is already in use</small>
    </FormGroup>
    <FormGroup>
      <label for="">Choose a password</label>
      <input type="password" class="form-control" id="" placeholder="Enter password" v-model="signup.password">
    </FormGroup>
    <FormGroup>
      <label for="">Enter your password again</label>
      <input type="password" class="form-control" id="" placeholder="Enter password" v-model="signup.passwordConfirm">
    </FormGroup>
    <FormGroup>
      <button type="submit" class="btn btn-primary">Signup</button>
    </FormGroup>
  </form>
</template>

<script>
import _ from 'lodash';

const FormGroup = () => import('@/components/common/FormGroup');

export default {
  components: { FormGroup },

  data () {
    return {
      signup: {
        email: null,
        password: null,
        passwordConfirm: null
      }
    };
  },

  created () {
    this.checkEmail = _.debounce(() => {
      // TODO
    }, 800);
  },

  methods: {
    onSignupFormSubmit () {
      
    }
  }
}
</script>

