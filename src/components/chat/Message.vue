<template>
  <div class="message-wrapper">
    <div class="message-text" v-if="message.type === 'message'">
      <Avatar email="message.payload.user.email" :size="80"/>
      <div class="media-body">
        <h5 class="mt-0 mb-1">{{ message.payload.user.identifier }}</h5>
        <span>{{ message.payload.msg }}</span>
      </div>
    </div>
    <div class="message-left" v-if="message.type === 'user-left'">
      <div class="media-body">
        <span class="text-warning"><i>{{ message.payload.user.identifier }} left</i></span>
      </div>
    </div>

    <div class="message-join" v-if="message.type === 'user-joined'">
      <div class="media-body">
        <span class="text-success"><b>{{ message.payload.user.identifier }} joined</b></span>
      </div>
    </div>
  </div>
</template>

<script>
const Avatar = () => import('vue-gravatar');

export default {
  props: ['message'],
  components: {
    Avatar
  }
}
</script>
