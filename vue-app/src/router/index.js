import { createRouter, createWebHistory } from 'vue-router';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      redirect: '/presenter',
    },
    {
      path: '/presenter',
      name: 'presenter',
      component: () => import('@/views/PresenterView.vue'),
    },
    {
      path: '/team',
      name: 'team',
      component: () => import('@/views/TeamView.vue'),
    },
    {
      path: '/admin',
      name: 'admin',
      component: () => import('@/views/AdminView.vue'),
    },
  ],
});

export default router;
