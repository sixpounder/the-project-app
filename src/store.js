import Vue from 'vue'
import Vuex from 'vuex'
import http from '@/lib/http';
import hosts from '@/hosts';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    io: null,
    user: undefined,
    contextInitialized: false
  },
  mutations: {
    setCurrentUser (state, user) {
      state.user = user;
    },

    ioConnect () {
    }
  },
  actions: {

    initializeUserContext (context) {
      return http.get('/api/auth/me').then(res => {
        context.commit('setCurrentUser', res.data ? res.data.user : null);
        context.state.contextInitialized = true;
      }).catch(() => {
        context.commit('setCurrentUser', null);
        context.state.contextInitialized = true;
      });
    },

    login (context, credentials) {
      return http.post('/api/auth/login', credentials).then(res => {
        context.commit('setCurrentUser', res.data);
        return res.data;
      });
    },

    ioConnect ({ commit }) {
      commit('ioConnect');
    }
  },
  getters: {
    io (state) {
      return state.io;
    },

    currentUser (state) {
      return state.user;
    },

    contextInitialized (state) {
      return state.contextInitialized;
    },

    apiHost () {
      return hosts.apiHost;
    }
  }
})
