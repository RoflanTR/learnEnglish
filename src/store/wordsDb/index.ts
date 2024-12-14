import { Module } from 'vuex';
import { StateInterface } from '../index';
import state from './state';
import actions from './actions';
import { WordsList } from './types';
import mutations from './mutations';
import getters from './getters';

const exampleModule: Module<WordsList, StateInterface> = {
  namespaced: true,
  actions,
  getters,
  state,
  mutations,
};

export default exampleModule;
