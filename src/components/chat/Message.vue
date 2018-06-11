<template>
  <div class="media message-wrapper">
    <Avatar :email="message.payload.from.email" class="pr-3" :size="48"/>
    <div class="media-body">
      <h5 class="mt-0 mb-1">{{ message.payload.from.identifier }}</h5>
      <span>{{ message.payload.msg }}</span>
    </div>
    <div class="media message-left" v-if="message.type === 'user-left'">
      <div class="media-body">
        <span class="text-warning"><i>{{ message.payload.from.identifier }} left</i></span>
      </div>
    </div>

    <div class="media message-join" v-if="message.type === 'user-joined'">
      <div class="media-body">
        <span class="text-success"><b>{{ message.payload.from.identifier }} joined</b></span>
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
