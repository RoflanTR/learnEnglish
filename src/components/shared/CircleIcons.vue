<template>
  <div class="icons">
    <router-link :to="path"><q-icon class="icon" :name="icon" /></router-link>
  </div>
</template>

<script setup lang="ts">
defineProps<{ path: string; icon: string }>();
</script>

<style scoped>
.icon {
  background-color: #d48166;
  color: white;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  padding: 6px;
}
.icons {
  margin-top: 32px;
  display: flex;
  justify-content: center;
  gap: 20px;
}
.q-icon {
  font-size: 21px;
}
</style>
