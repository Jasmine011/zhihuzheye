import { createRouter, createWebHashHistory } from 'vue-router'

const routes = [{
  path: '/',
  name: 'home',
  component: () =>
    import('../views/Home.vue')
}, {
  path: '/login',
  name: 'login',
  component: () =>
    import('../views/Login.vue')
}, {
  path: '/signup',
  name: 'signup',
  component: () =>
    import('../views/Signup.vue')
}, {
  path: '/column/:id',
  name: 'column',
  component: () =>
    import('../views/ColumnDetail.vue')
}, {
  path: '/CreatePost',
  name: 'CreatePost',
  component: () =>
    import('../views/CreatePost.vue'),
  meta: { requiredLogin: true } // 是否必须登录才能访问
}, {
  path: '/PostDetail/:id',
  name: 'PostDetail',
  component: () =>
    import('../views/PostDetail.vue'),
  meta: { requiredLogin: true } // 是否必须登录才能访问
}]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
