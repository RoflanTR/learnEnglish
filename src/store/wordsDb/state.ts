import { WordsList } from './types';

function state(): WordsList {
  return {
    words: [],
    message: [],
    randomWords: [],
  };
}

export default state;
