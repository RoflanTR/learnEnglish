import { GetterTree } from 'vuex';
import { StateInterface } from '../index';
import { WordsList } from './types';

const getters: GetterTree<WordsList, StateInterface> = {
  getWords(state) {
    return state.words;
  },
  getMessage(state) {
    return state.message;
  },
  getRandomWords(state) {
    return state.randomWords;
  },
};

export default getters;
