<template>
  <div v-if="!load">
    <ErrorBaner v-model:fail="fail" :message="message" position="bottom" />
    <CircleIcon class="icons" path="/" icon="home" />
    <div class="statusbar">
      <hr
        v-for="(item, idx) in countWords"
        :key="idx"
        :class="{ green: answer[idx] === 'green', red: answer[idx] === 'red' }"
      />
    </div>
    <div class="conteiner" v-if="!finall">
      <h3>
        {{
          iter < countWords
            ? words[iter]?.originalWord
            : words[iter - 1]?.originalWord
        }}
      </h3>
      <small>{{ additional(words) }}</small>
      <div class="field">
        <Input
          v-model="text"
          :regex="/^[а-яА-Я' '-]+$/"
          placeholder="Введите перевод"
        />
        <BtnComponent class="btn" label="Submit" @click="checkAnswer" />
      </div>
    </div>
    <div class="conteiner" v-else>
      <p class="title">Правильных ответов:</p>
      <p class="result">
        <span
          :class="{
            good: properly >= Math.round(countWords * 0.7),
            bad: properly < Math.round(countWords * 0.7),
          }"
          >{{ properly }}</span
        >/<span class="good">{{ countWords }}</span>
      </p>
      <BtnComponent class="btn btn_again" label="again" @click="again" />
    </div>
  </div>
  <Loader v-else />
</template>

<script setup lang="ts">
import Input from '../components/shared/InputComponent.vue';
import BtnComponent from '../components/shared/BtnComponent.vue';
import CircleIcon from '../components/shared/CircleIcons.vue';
import ErrorBaner from '../components/shared/ErrorBaner.vue';
import { onMounted, ref, watch } from 'vue';
import { useStore } from 'vuex';
import { Category } from '../components/enums/enumsList';
import Loader from '../components/shared/LoaderComponent.vue';

interface Word {
  id: number;
  mainChapter: string;
  originalWord: string;
  [key: string]: any;
}

interface Message {
  type: string;
  value: string;
  answer: string;
}

const load = ref(false);
const text = ref<string>('');
const store = useStore();
const words = ref<Word[]>([]);
const iter = ref<number>(0);
const fail = ref<boolean>(false);
const countWords = ref<number>(0);

const message = ref<Message>({ type: '', value: '', answer: '' });
const answer = ref<string[]>([]);
const finall = ref<boolean>(false);
const properly = ref<number>(0);

onMounted(async () => {
  load.value = true;
  await store.dispatch('words/getRandomWords');
  words.value = store.getters['words/getRandomWords'] as Word[];

  countWords.value = words.value.length >= 10 ? 10 : words.value.length;
  load.value = false;
});

watch(fail, (newValue) => {
  if (!newValue && iter.value >= words.value.length) {
    finall.value = true;
    properly.value = answer.value.filter((item) => item === 'green').length;
  }
});

async function checkAnswer(): Promise<void> {
  const currentWord = words.value[iter.value];
  const part = currentWord.mainChapter;
  let correctWord = '';
  let synonyms: { text: string }[] = [];

  if (typeof part === 'string') {
    correctWord = currentWord[part]?.text || '';
    synonyms = currentWord[part]?.syn || [];
  }

  const isCorrect =
    correctWord.toLowerCase() === text.value.toLowerCase() ||
    synonyms.some((syn) => syn.text.toLowerCase() === text.value.toLowerCase());

  if (isCorrect) {
    answer.value.push('green');
    await store.dispatch('words/countSuccess', currentWord.id);

    const count = currentWord.count || 0;

    if (count >= 4) {
      store.dispatch('words/deleteLearnedWord', currentWord.id);
    }
  } else {
    answer.value.push('red');
    store.dispatch('words/errorTranslate', currentWord.id);
    fail.value = true;
    message.value = {
      type: 'Ошибка',
      value: 'Правильный ответ',
      answer: correctWord,
    };
  }

  text.value = '';
  iter.value += 1;

  if (iter.value >= words.value.length && !fail.value) {
    finall.value = true;
    properly.value = answer.value.filter((item) => item === 'green').length;
  }
}

async function again(): Promise<void> {
  await store.dispatch('words/getRandomWords');
  words.value = store.getters['words/getRandomWords'] as Word[];
  finall.value = false;
  iter.value = 0;
  answer.value.splice(0, answer.value.length);
  countWords.value = words.value.length >= 10 ? 10 : words.value.length;
  properly.value = 0;
}

function additional(word: Word[]): string {
  const i = iter.value < countWords.value ? iter.value : iter.value - 1;
  const currentWord = word[i];
  switch (currentWord?.mainChapter) {
    case Category.adjective:
      return 'прилагательное';
    case Category.adverb:
      return 'наречие';
    case Category.conjunction:
      return 'союз';
    case Category.noun:
      return 'существительное';
    case Category.particle:
      return 'частица';
    case Category.preposition:
      return 'предлог';
    case Category.pronoun:
      return 'местоимение';
    case Category.verb:
      return 'глагол';
    default:
      return 'Неизвестно';
  }
}
</script>

<style scoped>
.conteiner {
  padding: 24px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 40%;
  display: grid;
}
h3 {
  text-align: center;
  margin-bottom: 15px;
}
small {
  font-size: 14px;
  text-align: center;
  margin-bottom: 176px;
}
.field {
  display: grid;
  gap: 10px;
}
.icons {
  position: fixed;
  right: 20px;
}
.statusbar {
  display: flex;
  width: 60%;
  margin: 0 auto;
}
hr {
  width: 8%;
  background-color: #b3b3b3;
  border: none;
  border-radius: 5px;
  height: 2px;
}
.green {
  background-color: #4a9e3f;
}
.red {
  background-color: #9e3f3f;
}
.title {
  font-size: 25px;
  font-weight: 500;
  text-align: center;
}
.good {
  color: #4a9e3f;
}
.bad {
  color: #9e3f3f;
}
.result {
  text-align: center;
  font-size: 32px;
  font-weight: 600;
}
.btn_again {
  margin-top: 90px;
}
@media (max-width: 1280px) {
  .conteiner {
    width: 60%;
  }
}
@media (max-width: 700px) {
  .conteiner {
    width: 80%;
  }
  .statusbar {
    display: flex;
    width: 100%;
    margin: 0 auto;
  }
}
@media (max-width: 500px) {
  .conteiner {
    width: 90%;
  }
}
</style>
