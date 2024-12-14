<template>
  <q-btn class="btn" color="primary" :label="label" />
</template>
<script setup lang="ts">
defineProps<{ label: string }>();
</script>
