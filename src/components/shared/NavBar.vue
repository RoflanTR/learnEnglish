<template>
  <div class="navbar">
    <router-link to="/"><BackArrow /></router-link>

    <router-link to="/"><h5>Back</h5></router-link>
  </div>
</template>

<script lang="ts" setup>
import BackArrow from './BackArrow.vue';
</script>

<style scoped>
h5 {
  margin: 0;
  color: #d48166;
}
.navbar {
  display: flex;
  align-items: center;
  gap: 10px;
}
@media (max-width: 500px) {
  h5 {
    font-size: 1.2rem;
  }
}
</style>
