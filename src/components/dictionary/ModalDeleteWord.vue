<template>
  <div>
    <q-dialog v-model="dialog" backdrop-filter="brightness(60%)">
      <q-card>
        <q-card-section
          class="row q-pa-none items-center text-h6 justify-center"
        >
          Delete word
          <q-card-actions class="close">
            <q-icon
              id="cancel"
              color="primary"
              name="close"
              size="sm"
              v-close-popup
            ></q-icon>
          </q-card-actions>
        </q-card-section>

        <q-card-section class="q-pa-none block-btn justify-around">
          <q-btn color="primary" label="Да" @click="deleteWord()" />
          <q-btn outline color="primary" label="Нет" v-close-popup />
        </q-card-section>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useStore } from 'vuex';
const router = useRouter();
const route = useRoute();
const dialog = ref(false);
const store = useStore();

const idWord = ref(route.query.id);
let isClosing = false;

onMounted(() => {
  if (route.query.name === 'delete') {
    idWord.value = route.query.id;
    dialog.value = true;
  }
});

watch(
  () => route.query.id,
  (newV) => {
    if (!isClosing && route.query.name === 'delete' && newV !== null) {
      dialog.value = true;
      idWord.value = route.query.id;
    }
  }
);
const emit = defineEmits(['closePopUp']);

watch(dialog, (newV) => {
  if (!newV && route.query.id) {
    isClosing = true;
    router
      .push({
        path: route.path,
        query: { ...route.query, id: undefined, name: undefined },
      })
      .finally(() => {
        isClosing = false;
      });
    emit('closePopUp');
  }
});

function deleteWord() {
  store.dispatch('words/deleteById', idWord.value);
  router
    .push({
      path: route.path,
      query: { ...route.query, id: undefined, name: undefined },
    })
    .finally(() => {
      isClosing = false;
    });
}
</script>

<style scoped>
.block-btn {
  display: flex;
  gap: 68px;
  margin-top: 64px;
}
.q-dialog__inner .q-card .q-card__actions .q-btn--rectangle {
  min-width: 0 !important;
}
.q-card__actions {
  padding: 0;
}
.q-card {
  padding: 26px;
  width: 60%;
  border-radius: 4px;
}
.close {
  position: absolute;
  top: -12px;
  right: -13px;
}
@media (max-width: 700px) {
  .q-card {
    width: 80%;
  }
}
@media (max-width: 500px) {
  .q-card {
    width: 100%;
  }
}
</style>
