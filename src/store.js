import Vue from 'vue'
import Vuex from 'vuex'
import http from '@/lib/http';
import io from 'socket.io-client';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    videoChannel: null,
    chatChannel: null,
    chatSocket: null,
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
    }
  },
  actions: {

    initializeUserContext (context) {
      return http.get('/api/auth/me').then(res => {
        context.commit('setCurrentUser', res.data ? res.data.user : null);
        context.state.videoChannel.emit('authenticate', context.state.user.id);
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

    ioConnect ({ state }) {
      state.videoChannel = io('http://localhost:3000/video', {
        transports: ['websocket']
      });

      state.chatChannel = io('http://localhost:3000/chat', {
        transports: ['websocket'],
        path: '/chat'
      });
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
    }
  }
})
