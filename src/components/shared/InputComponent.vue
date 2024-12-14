<template>
  <q-input
    outlined
    v-model="text"
    :label="placeholder"
    input-class="text-black"
    @update:model-value="updateText"
    @keydown="validateInput"
  />
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';

const emit = defineEmits(['update:text']);
const props = defineProps<{
  text?: string;
  regex: RegExp;
  placeholder: string;
}>();

const text = ref(props.text);

watch(
  () => props.text,
  (newValue) => {
    text.value = newValue;
  }
);
function validateInput(event: KeyboardEvent) {
  if (!props.regex) {
    return;
  }

  if (
    !props.regex.test(event.key) &&
    ![
      'Backspace',
      'Delete',
      'ArrowLeft',
      'ArrowRight',
      'Tab',
      'Space',
      '-',
    ].includes(event.key)
  ) {
    event.preventDefault();
  }
}
function updateText(value: string) {
  text.value = value;
  emit('update:text', value);
}
</script>

<style scoped></style>
запретить инпуту ввод цифр
