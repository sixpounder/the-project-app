<template>
  <div class="media message-wrapper">
    <Avatar :email="message.payload.from.email" v-if="message.payload && message.payload.from" class="pr-3" :size="48"/>
    <img v-else class="pr-3" src="../../assets/monkey-small.png"/>
    <div class="media-body" v-if="message.payload && message.payload.from">
      <h5 class="mt-0 mb-1">{{ message.payload.from.identifier }}</h5>
      <span>{{ message.payload.msg }}</span>
    </div>
    <div class="media message-left" v-if="message.type === 'user-left'">
      <div class="media-body">
        <span class="text-warning"><i>{{ message.payload.identifier }} left the channel</i></span>
      </div>
    </div>

    <div class="media message-join" v-if="message.type === 'user-joined'">
      <div class="media-body">
        <span class="text-success"><b>{{ message.payload.identifier }} joined the channel</b></span>
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
