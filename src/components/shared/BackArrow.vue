<template>
  <q-icon
    id="matArrowBack"
    color="primary"
    :name="matArrowBack"
    size="md"
  ></q-icon>
</template>
<script setup lang="ts">
import { matArrowBack } from '@quasar/extras/material-icons';
</script>
<style scoped>
@media (max-width: 500px) {
  #matArrowBack {
    font-size: 26px !important;
  }
}
</style>
