import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import SignInView from '@/views/SignInView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/AboutView.vue'),
    },
    {
      path: '/sign-in',
      name: 'sign-in',
      component: SignInView,
      children: [
        {
          path: 'callback',
          name: 'callback',
          component: () => import('@/views/GithubCallbackView.vue'),
        }
      ]
    },
    {
      path: '/repositories',
      name: 'repositories',
      component: () => import('@/views/RepositoriesView.vue'),
    },
    {
      path: '/:repoId',
      name: 'mainTask',
      component: () => import('@/views/MainTask.vue'),
    }
  ],
})

export default router
