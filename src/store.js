import Vue from 'vue'
import Vuex from 'vuex'
import Socket from 'socket.io-client/dist/socket.io.js';
Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    socket: null
  },
  mutations: {
    setSocket (state, instance) {
      state.socket = instance;
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
      });
      context.commit('setSocket', instance);
    }
  },
  getters: {
    socket (state) {
      return state.socket;
    }
  }
})
