import { ActionTree } from 'vuex';
import { StateInterface } from '../index';
import { WordsList } from './types';
import axios from 'axios';
import Keys from '../../keys';

const actions: ActionTree<WordsList, StateInterface> = {
  async addWord({ commit }, arr) {
    try {
      const response = await axios.get(
        'https://words-48386-default-rtdb.firebaseio.com/words.json'
      );
      const wordsData = response.data;

      const exists = Object.values(wordsData).some(
        (e: any) => e.originalWord === arr.word
      );
      if (exists) {
        throw new Error('Слово уже есть в вашем словаре');
      }

      const yandexResponse = await axios.get(
        `https://dictionary.yandex.net/api/v1/dicservice.json/lookup?key=${Keys.apiKei}&lang=${Keys.lang}&text=${arr.word}`
      );

      const data = yandexResponse.data;

      if (!data.def || data.def.length === 0) {
        throw new Error('Yandex API вернул пустой или недействительный ответ');
      }

      let verb = null;
      let noun = null;
      let adjective = null;
      let adverb = null;
      let conjunction = null;
      let pronoun = null;
      let particle = null;
      let preposition = null;

      const mainChapter = data['def'][0].pos;

      for (let i = 0; i < data['def'].length; i++) {
        if (data['def'][i].pos === 'verb') {
          verb = data['def'][i].tr[0];
        }
        if (data['def'][i].pos === 'noun') {
          noun = data['def'][i].tr[0];
        }
        if (data['def'][i].pos === 'adjective') {
          adjective = data['def'][i].tr[0];
        }
        if (data['def'][i].pos === 'adverb') {
          adverb = data['def'][i].tr[0];
        }
        if (data['def'][i].pos === 'conjunction') {
          conjunction = data['def'][i].tr[0];
        }
        if (data['def'][i].pos === 'pronoun') {
          pronoun = data['def'][i].tr[0];
        }
        if (data['def'][i].pos === 'particle') {
          particle = data['def'][i].tr[0];
        }
        if (data['def'][i].pos === 'preposition') {
          preposition = data['def'][i].tr[0];
        }
        if (data['def'][i].pos === 'invariable') {
          commit('setMessage', {
            value: 'Неизменяемое слово.',
            type: 'Упс...',
          });

          return 'asd';
        }
      }

      await axios({
        method: 'post',
        url: 'https://words-48386-default-rtdb.firebaseio.com/words.json',
        data: JSON.stringify({
          originalWord: arr.word,
          adjective: adjective,
          noun: noun,
          verb: verb,
          adverb: adverb,
          conjunction: conjunction,
          pronoun: pronoun,
          particle: particle,
          preposition: preposition,
          mainChapter: mainChapter,
          count: 0,
        }),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      commit('setMessage', {
        value: 'Успешно добавлено.',
        type: 'Успех',
      });
    } catch (error) {
      commit('setMessage', {
        value:
          error.message === 'Слово уже есть в вашем словаре'
            ? 'Слово уже есть в вашем словаре.'
            : 'Простите, данное слово не найдено...',
        type: 'Ошибка',
      });
    }
  },

  async getWords({ commit }) {
    try {
      const { data } = await axios({
        method: 'get',
        url: 'https://words-48386-default-rtdb.firebaseio.com/words.json',
      });

      const requests = Object.keys(data).map((id) => ({ ...data[id], id }));

      commit('setRequestWords', requests);
    } catch (e) {
      console.log(e);
    }
  },

  async loadById(_, id) {
    try {
      const { data } = await axios({
        method: 'get',
        url: `https://words-48386-default-rtdb.firebaseio.com/words/${id}.json`,
      });
      return data;
    } catch (error) {
      console.log(error);
    }
  },

  async deleteById(_, id) {
    try {
      await axios({
        method: 'delete',
        url: `https://words-48386-default-rtdb.firebaseio.com/words/${id}.json`,
      });
    } catch (error) {
      console.log(error);
    }
  },

  async getRandomWords({ commit }) {
    try {
      const { data } = await axios({
        method: 'get',
        url: 'https://words-48386-default-rtdb.firebaseio.com/words.json',
      });

      const requests = Object.keys(data).map((id) => ({ ...data[id], id }));

      const randomWords = requests.sort(() => 0.5 - Math.random()).slice(0, 10);

      commit('setRequestRandomWords', randomWords);
    } catch (e) {
      console.log(e);
    }
  },

  async countSuccess(_, id) {
    try {
      const { data: word } = await axios({
        method: 'get',
        url: `https://words-48386-default-rtdb.firebaseio.com/words/${id}.json`,
      });

      const newCount = (word.count || 0) + 1;

      await axios({
        method: 'patch',
        url: `https://words-48386-default-rtdb.firebaseio.com/words/${id}.json`,
        data: {
          count: newCount,
        },
      });
    } catch (e) {
      console.log(e);
    }
  },
  async errorTranslate(_, id) {
    try {
      const newCount = 0;

      await axios({
        method: 'patch',
        url: `https://words-48386-default-rtdb.firebaseio.com/words/${id}.json`,
        data: {
          count: newCount,
        },
      });
    } catch (e) {
      console.log(e);
    }
  },
  async deleteLearnedWord(_, id) {
    await axios({
      method: 'delete',
      url: `https://words-48386-default-rtdb.firebaseio.com/words/${id}.json`,
    });
    console.log(`Запись с ID ${id} удалена`);
  },

  async randomWords() {
    try {
      const { data } = await axios({
        method: 'get',
        url: 'https://random-word-api.herokuapp.com/word?number=20',
      });
      let yandexResponse;
      const data2 = [];
      for (let i = 0; i < data.length; i++) {
        yandexResponse = await axios.get(
          `https://dictionary.yandex.net/api/v1/dicservice.json/lookup?key=${Keys.apiKei}&lang=${Keys.lang}&text=${data[i]}`
        );
        if (yandexResponse.data['def'].length != 0) {
          data2.push(yandexResponse.data['def']);
        }
      }
      return data2;
    } catch (error) {
      console.log(error);
    }
  },
};

export default actions;
