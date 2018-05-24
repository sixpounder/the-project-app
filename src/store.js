import Vue from 'vue'
import Vuex from 'vuex'
import http from '@/lib/http';
import io from 'socket.io-client';
import hosts from '@/hosts';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    videoChannel: null,
    chatChannel: null,
    user: undefined,
    contextInitialized: false
  },
  mutations: {
    setVideoSocket (state, instance) {
      state.videoSocket = instance;
    },

    setChatSocket (state, instance) {
      state.chatSocket = instance;
    },

    setCurrentUser (state, user) {
      state.user = user;
    },

    ioConnect (state) {
      state.videoChannel = io(`${hosts.apiHost}/video`, {
        transports: ['websocket']
      });

      state.chatChannel = io(`${hosts.apiHost}/chat`, {
        transports: ['websocket'],
        path: '/chat'
      });
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
        context.state.videoChannel.emit('authenticate', context.state.user.id);
        return res.data;
      });
    },

    ioConnect ({ commit, state }) {
      commit('ioConnect');
      if (state.user !== null) {
        state.videoChannel.emit('authenticate', state.user.id);
      }
    }
  },
  getters: {
    videoSocket (state) {
      return state.videoSocket
    },

    chatSocket (state) {
      return state.chatSocket
    },

    currentUser (state) {
      return state.user;
    },

    contextInitialized (state) {
      return state.contextInitialized;
    },

    videoChannel (state) {
      return state.videoChannel;
    },

    chatChannel (state) {
      return state.chatChannel;
    },

    apiHost () {
      return hosts.apiHost;
    }
  }
})
