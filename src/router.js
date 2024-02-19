import { createRouter, createWebHistory } from 'vue-router';
import MainQuestionnaire from './views/app/MainQuestionnaire.vue';
import ExampleDemo from './views/ExampleDemo.vue';
import WelcomeView from './views/WelcomeView.vue';

const routes = [
  {
    path: '/',
    name: 'Welcome',
    component: WelcomeView,
  },
  {
    path: '/app',
    name: 'App',
    component: MainQuestionnaire,
  },
  {
    path: '/demo',
    name: 'Example',
    component: ExampleDemo,
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
