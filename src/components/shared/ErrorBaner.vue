<template>
  <q-dialog v-model="dialog" :position="position">
    <q-card style="width: 350px">
      <q-linear-progress
        :value="1"
        :color="message.type === 'Ошибка' ? 'red-8' : 'green-9'"
      />

      <q-card-section class="row items-center no-wrap">
        <div>
          <div class="text-weight-bold">{{ message.type }}</div>
          <div class="text-grey">
            {{ message.value }}
            <span class="text-weight-bold">{{
              message.answer != '' ? message.answer : ''
            }}</span>
          </div>
        </div>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { ref, watch, defineEmits } from 'vue';

const props = defineProps<{
  fail: boolean;
  message: { type: string; value: string; answer?: string };
  position: 'top' | 'bottom';
}>();

const emit = defineEmits(['update:fail']);

const dialog = ref(false);

watch(
  () => props.fail,
  (newValue) => {
    dialog.value = newValue;
  }
);

watch(dialog, (newValue) => {
  emit('update:fail', newValue);
});
</script>
<style scoped>
.text-weight-bold {
  color: black !important;
}
</style>
