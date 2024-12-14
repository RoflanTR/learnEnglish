<template>
  <div class="q-pa-md q-gutter-sm">
    <q-dialog v-model="dialog" backdrop-filter="brightness(60%)">
      <q-card>
        <q-card-actions class="close">
          <q-icon
            id="cancel"
            color="primary"
            name="close"
            size="sm"
            v-close-popup
          />
        </q-card-actions>
        <div class="content">
          <q-card-section class="q-pa-none row items-center q-pb-none text-h6">
            <span class="first-part">Слово:</span>
            <span class="large">{{ word!.originalWord }}</span>
            <hr />
          </q-card-section>

          <q-card-section class="q-pa-none">
            <span class="first-part">Перевод :</span>
            <span class="select"> {{ word?.[mainPart].text }} </span>
          </q-card-section>

          <q-card-section
            v-if="Object.keys(word).length >= 5"
            class="q-pa-none words-list"
          >
            <p class="title">Другие варианты:</p>
            <p v-if="word.noun && mainPart !== 'noun'">
              <span class="first-part"> Сущ :</span>
              <span class="select">{{ word.noun.text }}</span>
            </p>
            <p v-if="word.adjective && mainPart !== 'adjective'">
              <span class="first-part">Прил:</span>
              <span class="select">{{ word.adjective.text }}</span>
            </p>
            <p v-if="word.verb && mainPart !== 'verb'">
              <span class="first-part"> Глагол:</span>
              <span class="select">{{ word.verb.text }}</span>
            </p>
            <p v-if="word.adverb && mainPart !== 'adverb'">
              <span class="first-part">Наречие:</span>
              <span class="select">{{ word.adverb.text }}</span>
            </p>
            <p v-if="word.conjunction && mainPart !== 'conjunction'">
              <span class="first-part">Связь:</span>
              <span class="select">{{ word.conjunction.text }}</span>
            </p>
            <p v-if="word.particle && mainPart !== 'particle'">
              <span class="first-part">Частица:</span>
              <span class="select">{{ word.particle.text }}</span>
            </p>
            <p v-if="word.preposition && mainPart !== 'preposition'">
              <span class="first-part">Предлог:</span>
              <span class="select">{{ word.preposition.text }}</span>
            </p>
            <p v-if="word.pronoun && mainPart !== 'pronoun'">
              <span class="first-part">Мест:</span>
              <span class="select">{{ word.pronoun.text }}</span>
            </p>
          </q-card-section>
        </div>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useStore } from 'vuex';

const hasSufficientParts = ref(false);

const store = useStore();
const router = useRouter();
const route = useRoute();

const dialog = ref(false);
const word = ref(null);
const mainPart = ref(null);
const idWord = ref(route.query.id);
let isClosing = false;

const loadWord = async (id: string | number) => {
  word.value = await store.dispatch('words/loadById', id);
  mainPart.value = word.value?.mainChapter || null;
};

onMounted(async () => {
  if (route.query.name === 'open') {
    const id = Array.isArray(idWord.value) ? idWord.value[0] : idWord.value;

    if (typeof id === 'string') {
      await loadWord(id);
      dialog.value = true;
    }
  }
});

watch(
  () => route.query.id,
  async (newId) => {
    if (!isClosing && route.query.name === 'open' && newId) {
      if (typeof newId === 'string') {
        await loadWord(newId);
        dialog.value = true;
      }
    }
  }
);

watch(dialog, (isOpen) => {
  if (!isOpen && route.query.id) {
    isClosing = true;
    router
      .push({
        path: route.path,
        query: { ...route.query, id: undefined, name: undefined },
      })
      .finally(() => {
        isClosing = false;
      });
  }
});

watch(word, (newWord) => {
  if (newWord) {
    const parts = [
      'noun',
      'adjective',
      'verb',
      'adverb',
      'conjunction',
      'particle',
      'preposition',
      'pronoun',
    ];
    const activeParts = parts.filter((part) => newWord[part]);
    hasSufficientParts.value = activeParts.length >= 3;
  }
});
</script>

<style scoped>
.q-dialog__inner .q-card .q-card__actions .q-btn--rectangle {
  min-width: 0 !important;
}
.q-card {
  padding: 26px;
  width: 60%;
  border-radius: 4px;
}
.close {
  position: absolute;
  top: 7px;
  right: 6px;
}
.q-card__actions {
  padding: 0;
}
.content {
  display: grid;
  gap: 10px;
}
.words-list {
  display: grid;
  gap: 5px;
}
p {
  margin: 0;
}
span {
  color: #d48166;
}
.large {
  font-weight: 700;
  font-weight: 700;
  font-size: 22px;
}
.first-part {
  color: black;
  width: 78px !important;
  display: inline-block;
}
.first-part:not(:first-child) {
  font-size: 15px;
}
hr {
  width: 100%;
  height: 0;
  transform: rotate(-0.24deg);
  stroke: 2px Средний rgb(0, 0, 0) rgba(212, 129, 102, 0.2) rgb(182, 115, 93)
    rgba(212, 129, 102, 0.25);
}
q-card-section {
  display: flex;
}
.select {
  font-size: 17px;
  font-weight: 600;
}
.margin-left .select {
  margin-left: 28px;
}
.title {
  font-size: 15px;
  font-weight: 600;
  margin-top: 16px;
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
