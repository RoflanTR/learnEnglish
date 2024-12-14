import { store } from 'quasar/wrappers';
import { createStore, Store as VuexStore } from 'vuex';
import words from './wordsDb/index';

export interface StateInterface {
  example: unknown;
}

declare module 'vue' {
  interface ComponentCustomProperties {
    $store: VuexStore<StateInterface>;
  }
}

export default store(function () {
  const Store = createStore<StateInterface>({
    modules: {
      words,
    },

    strict: !!process.env.DEBUGGING,
  });

  return Store;
});
