import { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [{ path: '', component: () => import('pages/MainPage.vue') }],
  },

  {
    path: '/dictionary',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/DictionaryPage.vue') },
    ],
  },
  {
    path: '/learn',
    component: () => import('layouts/MainLayout.vue'),
    children: [{ path: '', component: () => import('pages/LearnField.vue') }],
  },
  {
    path: '/random',
    component: () => import('layouts/MainLayout.vue'),
    children: [{ path: '', component: () => import('pages/RandomWords.vue') }],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
];

export default routes;
