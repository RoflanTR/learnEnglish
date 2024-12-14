<template>
  <div class="menu">
    <CircleIcons
      v-for="(item, idx) in menuItem"
      :key="idx"
      :path="item?.path"
      :icon="item?.icons"
    />
  </div>
</template>

<script setup lang="ts">
import CircleIcons from '../shared/CircleIcons.vue';

interface MenuItem {
  path: string;
  icons: string;
}

defineProps<{ menuItem: MenuItem[] }>();
</script>

<style scoped>
.menu {
  display: flex;
  justify-content: center;
  gap: 10px;
}
</style>
