import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'
import About from './views/About.vue'
import Signup from './views/Signup.vue'
import Login from './views/Login.vue'
import Upload from './views/Upload.vue'
import HttpStream from './views/HttpStream.vue'

import SignupConfirm from './views/SignupConfirm.vue';

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/about',
      name: 'about',
      component: About
    },
    {
      path: '/signup',
      name: 'register',
      component: Signup
    },
    {
      path: '/login',
      name: 'login',
      component: Login
    },
    {
      path: '/upload',
      name: 'upload',
      component: Upload
    },
    {
      path: '/stream/:id/:stream?',
      name: 'stream',
      component: HttpStream
    },
    {
      path: '/signup/confirm',
      name: 'register-confirm',
      component: SignupConfirm
    },
  ]
})
