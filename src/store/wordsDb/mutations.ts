import { MutationTree } from 'vuex';
import { WordsList } from './types';

const mutation: MutationTree<WordsList> = {
  setRequestWords(state, requests) {
    state.words = requests;
  },
  setMessage(state, message) {
    state.message = message;
  },
  deleteMessage(state) {
    state.message = [];
  },
  setRequestRandomWords(state, randomWords) {
    state.randomWords = randomWords;
  },
};

export default mutation;
