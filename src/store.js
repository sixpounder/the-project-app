import Vue from 'vue'
import Vuex from 'vuex'
import Socket from 'socket.io-client/dist/socket.io.js';
import http from '@/lib/http';

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    socket: null,
    user: null
  },
  mutations: {
    setSocket (state, instance) {
      state.socket = instance;
    },

    setCurrentUser (state, user) {
      state.user = user;
    }
  },
  actions: {
    ioConnect (context) {
      let instance = Socket('http://localhost:3000');
      instance.on('connected', function() {
        console.info('Websocket connected!');
        // TODO: set auth token to identify user on subsequent requests via socket
      }).on('disconnected', () => {
        // TODO
      }).on('authenticated', () => {
        console.log('Websocket authenticated');
      }).on('forbidden', () => {
        console.log('Could not authenticate via websocket');
      });

      context.commit('setSocket', instance);
    },

    initializeUserContext (context) {
      return http.get('/api/auth/me').then(res => {
        context.commit('setCurrentUser', res.data.user);
      });
    },

    login (context, credentials) {
      return http.post('/api/auth/login', credentials).then(res => {
        context.commit('setCurrentUser', res.data);
        context.state.socket.emit('authenticate', context.state.user.id);
        return res.data;
      });
    }
  },
  getters: {
    socket (state) {
      return state.socket;
    },

    currentUser (state) {
      return state.user;
    }
  }
})
