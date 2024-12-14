<template>
  <InputComponent v-model:text="word2" />
  <div class="btn_add" @click="click">
    <q-btn class="btn" color="primary" label="Submit" />
  </div>
</template>

<script setup lang="ts">
import InputComponent from '../shared/InputComponent.vue';
import { ref, watch } from 'vue';
const emit = defineEmits(['action', 'update:word']);
const props = defineProps<{ word: string }>();
const word2 = ref(props.word);

watch(word2, (newValue) => {
  emit('update:word', newValue);
});

watch(
  () => props.word,
  (newValue) => {
    word2.value = newValue;
  }
);

function click() {
  emit('action');
}
</script>

<style scoped>
.btn_add {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}
.btn {
  width: 30%;
}

@media (max-width: 992px) {
  .btn {
    width: 60%;
  }
}
@media (max-width: 500px) {
  .btn {
    width: 100%;
  }
}
</style>
