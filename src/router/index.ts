import { createWebHistory, createRouter } from 'vue-router';

const routes = [
  {
    path: '/',
    name: 'home',
    component: () => import('../views/HomeView.vue'),
  },
  {
    path: '/search',
    name: 'search',
    component: () => import('../views/SearchView.vue'),
  },
  {
    path: '/word',
    name: 'word',
    component: () => import('../views/WordView.vue'),
  },
  {
    path: '/tutorial',
    name: 'tutorial',
    component: () => import('../views/TutorialView.vue'),
  },
  {
    path: '/help',
    name: 'help',
    component: () => import('../views/HelpView.vue'),
  },
  {
    path: '/about',
    name: 'about',
    component: () => import('../views/AboutView.vue'),
  },
  {
    path: '/tool',
    name: 'tool',
    component: () => import('../views/ToolView.vue'),
  },
  {
    path: '/tool/phonetic-convert',
    name: 'phonetic-convert',
    component: () => import('../views/PhoneticConvertView.vue'),
  },
  {
    path: '/tool/relatives-calculator',
    name: 'relatives-calculator',
    meta: { noScroll: true },
    component: () => import('../views/RelativesCalculatorView.vue'),
  },
];

if (import.meta.env.DEV) {
  routes.push({
    path: '/styleguide',
    name: 'Styleguide',
    component: () => import('../views/StyleguideView.vue'),
  });
}

const base = import.meta.env.VITE_BASE_URL || '/';
const router = createRouter({
  history: createWebHistory(base),
  routes,
  scrollBehavior(to, _from, savedPosition) {
    if (to.meta.noScroll) {
      return false;
    }

    if (savedPosition) {
      return savedPosition;
    }

    if (!to.hash) {
      return { top: 0 };
    }
  },
});

export default router;
