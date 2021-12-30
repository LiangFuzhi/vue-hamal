import { createRouter, createWebHashHistory } from 'vue-router'

// 配置页面
const routes = [
  {
    path: '/',
    // component: vhPageAnimation, // () => import('@/demo/components/Hello-1.vue')
    component: () => import('@/demo/components/Hello-1.vue'),
    children: [
      { path: '', redirect: '/Hello-1-1' },
      { path: 'Hello-1-1', component: () => import('@/demo/components/Hello-1-1.vue'), meta: { level: 0, animation: false } },
      { path: 'Hello-1-2', component: () => import('@/demo/components/Hello-1-2.vue'), meta: { level: 1, animation: false } }
    ]
  },
  { path: '/Hello-2', component: () => import('@/demo/components/Hello-2.vue'), meta: { level: 2 } },
  { path: '/Hello-3', component: () => import('@/demo/components/Hello-3.vue'), meta: { level: 3 } }
]

export default createRouter({
  history: createWebHashHistory(),
  routes
})
