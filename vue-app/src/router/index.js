import { createRouter, createWebHistory } from 'vue-router';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'landing',
      component: () => import('@/views/LandingView.vue'),
    },
    {
      path: '/customize/:quizId',
      name: 'customize',
      component: () => import('@/views/CustomizationView.vue'),
    },
    {
      path: '/edit/:quizId',
      name: 'edit',
      component: () => import('@/views/EditView.vue'),
    },
    {
      path: '/presenter',
      name: 'presenter',
      component: () => import('@/views/PresenterView.vue'),
    },
  ],
});

export default router;
