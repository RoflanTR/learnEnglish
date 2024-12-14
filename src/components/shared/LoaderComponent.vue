<template>
  <div class="loader">
    <q-spinner-oval color="primary" size="5em" />
    <q-tooltip :offset="[0, 8]">QSpinnerOval</q-tooltip>
  </div>
</template>

<style scoped>
.loader {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
</style>
