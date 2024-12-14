<template>
  <div class="content" v-if="words.length != 0">
    <q-slide-item
      class="inside-items"
      right-color="negative"
      @click="open(word.id)"
      v-for="word in paginatedWords"
      :key="word.id"
      @right="(event) => onRight(event, word.id)"
    >
      <template v-slot:right>
        <q-icon name="delete_outline" />
      </template>

      <q-item class="item">
        <q-item-section class="inside-items">
          <q-item-label class="word">{{ word.originalWord }}</q-item-label>
          <q-item-label class="caption" caption
            >{{
              word.mainChapter === 'verb'
                ? word.verb.text
                : word.mainChapter === 'noun'
                ? word.noun.text
                : word.mainChapter === 'adjective'
                ? word.adjective.text
                : word.mainChapter === 'adverb'
                ? word.adverb.text
                : word.mainChapter === 'conjunction'
                ? word.conjunction.text
                : word.mainChapter === 'pronoun'
                ? word.pronoun.text
                : word.mainChapter === 'particle'
                ? word.particle.text
                : word.mainChapter === 'preposition'
                ? word.preposition.text
                : ''
            }}
          </q-item-label>
        </q-item-section>
      </q-item>
    </q-slide-item>
  </div>
  <Loader v-else />
  <q-pagination
    v-model="currentPage"
    :max="totalPages"
    color="primary"
    boundary-numbers
    class="q-mt-lg justify-center"
  />
  <teleport to="body">
    <WordInfo />
  </teleport>
</template>

<script setup lang="ts">
import WordInfo from './WordInfo.vue';
import Loader from '../shared/LoaderComponent.vue';
import { useRouter } from 'vue-router';
import { onMounted, ref, computed, onBeforeUnmount } from 'vue';
import { useStore } from 'vuex';
import { useQuasar } from 'quasar';
import debounce from 'debounce';
const words = ref([]);
const itemsPerPage = 10;
const currentPage = ref(1);

const timer = ref(null);
const resetRef = ref(null);

const store = useStore();
const router = useRouter();
const $q = useQuasar();

onMounted(async () => {
  await store.dispatch('words/getWords');
  words.value = await store.getters['words/getWords'];
});

const paginatedWords = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  return words.value.slice(start, end);
});

const totalPages = computed(() => {
  return Math.ceil(words.value.length / itemsPerPage);
});

const debouncedDelete = debounce((id: number) => {
  store.dispatch('words/deleteById', id);
}, 300);

async function deleteWord(id: number) {
  let isCancelled = false;
  const word = await store.dispatch('words/loadById', id);

  $q.notify({
    message: `Вы удалили слово \"${word.originalWord}\".`,
    color: 'negative',
    timeout: 3000,
    actions: [
      {
        label: 'Отменить',
        color: 'white',
        handler: () => {
          isCancelled = true;
        },
      },
    ],
    onDismiss: () => {
      if (!isCancelled) {
        debouncedDelete(id);
        words.value = words.value.filter((w) => w.id !== id);
      }
    },
  });
}

function open(id: number) {
  router.push({ path: '/dictionary', query: { id: id, name: 'open' } });
}

/*slide */
function finalize() {
  timer.value = setTimeout(() => {
    if (resetRef.value) {
      resetRef.value();
    }
  }, 100);
}

onBeforeUnmount(() => {
  clearTimeout(timer.value);
});

function onRight({ reset }, id: number) {
  resetRef.value = reset;
  deleteWord(id);
  finalize();
}
</script>

<style scoped>
.content {
  margin-top: 32px;
  display: grid;
  gap: 10px;
  margin-top: 32px;
  display: grid;
  position: relative;
  gap: 10px;
}
.item {
  border: 1px solid #d48166;
  border-radius: 6px;
  justify-content: space-between;
}
.inside-items {
  flex-direction: initial;
  gap: 25px;
  align-items: center;
  justify-content: start;
  max-width: 100%;
}
.caption {
  font-size: 14px;
}
.word {
  font-size: 16px;
  width: 80px;
}
.delete {
  width: 33px;
  display: flex;
  justify-content: end;
  align-items: center;
}
@media (max-width: 500px) {
  .inside-items {
    flex-direction: column;
    gap: 0;
    align-items: baseline;
  }
  .caption {
    font-size: 13px;
  }
  .word {
    font-size: 15px;
  }
}
</style>
