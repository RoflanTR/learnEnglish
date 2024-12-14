<template>
  <q-input
    outlined
    v-model="text"
    label="Введите слово"
    input-class="text-black"
    @update:model-value="updateText"
  />
  {{ text }}
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';

const emit = defineEmits(['update:text']);
const props = defineProps<{ text: string | number | null }>();

const text = ref(props.text);

watch(
  () => props.text,
  (newValue) => {
    text.value = newValue;
  }
);
console.log(text);

function updateText(value: string | number | null) {
  text.value = value;
  emit('update:text', value);
}
</script>

<style scoped></style>
