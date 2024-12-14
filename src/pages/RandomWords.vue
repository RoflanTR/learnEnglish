<template>
  <CircleIcon class="icons" path="/" icon="home" />
  <div class="content" v-if="!load">
    <q-slide-item
      @left="onLeft"
      @right="onRight"
      left-color="green"
      right-color="negative"
    >
      <template v-slot:left>
        <div class="row items-center">
          <q-icon left name="check_circle" /> Добавить
        </div>
      </template>
      <template v-slot:right>
        <div class="row items-center">
          Убрать <q-icon right name="delete_forever" />
        </div>
      </template>

      <q-item v-if="words != null">
        <q-item-section
          >{{ words[iter][0].text }}
          <span class="translate">{{ words[iter][0].tr[0].text }}</span>
        </q-item-section>
      </q-item>
    </q-slide-item>
  </div>
  <Loader v-else />
</template>

<script lang="ts" setup>
import { onBeforeUnmount } from 'vue';
import CircleIcon from '../components/shared/CircleIcons.vue';
import { useStore } from 'vuex';
import { ref, onMounted, watch } from 'vue';
import Loader from '../components/shared/LoaderComponent.vue';
const timer = ref();
const store = useStore();
const words = ref();
const iter = ref(0);
const load = ref(false);

function finalize(reset) {
  timer.value = setTimeout(() => {
    reset();
  }, 1000);
}

async function loadMoreWords() {
  const newWords = await store.dispatch('words/randomWords');
  words.value = [...words.value, ...newWords];
}

onMounted(async () => {
  load.value = true;
  words.value = await store.dispatch('words/randomWords');
  load.value = false;
});

onBeforeUnmount(() => {
  clearTimeout(timer.value);
});

watch(iter, async () => {
  if (iter.value >= words.value.length - 2) {
    await loadMoreWords();
  }
});

async function onLeft({ reset }) {
  await store.dispatch({
    type: 'words/addWord',
    word: words.value[iter.value][0].text,
  });
  iter.value += 1;
  finalize(reset);
}

async function onRight({ reset }) {
  iter.value += 1;

  finalize(reset);
}
</script>

<style scoped>
.content {
  border-radius: 8px;
  width: 60%;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
.q-slide-item {
  border-radius: 10px;
  font-size: 48px;
  text-align: center;
  box-shadow: 5px 4px 9px -3px;
  height: 300px;
}
.q-item__section {
  height: 300px;
}
.icons {
  position: fixed;
  right: 20px;
}
.translate {
  font-size: 16px;
}
@media (max-width: 700px) {
  .content {
    width: 95%;
  }
}
@media (max-width: 500px) {
  .content {
    width: 93%;
  }
  .q-slide-item {
    height: 200px;
    font-size: 36px;
  }
  .q-item__section {
    height: 200px;
  }
  .translate {
    font-size: 14px;
  }
}
</style>
