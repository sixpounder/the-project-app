<template>
  <div class="mt-4">
    <h1>Signup</h1>
    <SignupForm></SignupForm>
  </div>
</template>

<script>
const SignupForm = () => import('@/components/signup/SignupForm');
export default {
  components: { SignupForm }
}
</script>
