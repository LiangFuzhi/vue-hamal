// 配置页面
import Vue from 'vue'
import VueRouter from 'vue-router'
import {vhPageAnimation} from 'vue-hamal'
Vue.use(VueRouter)
// 配置页面
const routes = [{
  path: '',
  component: vhPageAnimation,
  children: [
    {path: '/', component: () => import('@/demo/components/Hello-1.vue')},
    {path: '/Hello-2', component: () => import('@/demo/components/Hello-2.vue')},
    {path: '/Hello-3', component: () => import('@/demo/components/Hello-3.vue')}
  ]
}]

export default new VueRouter({
  routes
})
