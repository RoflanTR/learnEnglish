<template>
  <div class="container">
    <NavBar />
    <WordList />
  </div>
</template>

<script lang="ts" setup>
import NavBar from '../components/shared/NavBar.vue';
import WordList from '../components/dictionary/WordList.vue';
</script>

<style scoped>
.container {
  padding: 64px 46px;
  height: 100vh;
}

@media (max-width: 500px) {
  .container {
    padding: 27px 20px;
  }
}
</style>
