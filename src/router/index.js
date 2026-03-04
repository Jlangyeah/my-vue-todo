import { createRouter, createWebHashHistory } from 'vue-router'
import Home from '../pages/Home.vue'
import TodoList from '../pages/TodoList.vue'
import Stats from '../pages/Stats.vue'

const routes = [
  { path: '/', component: Home },
  { path: '/todos', component: TodoList },
  { path: '/stats', component: Stats },
  // 重定向：避免路径错误
  { path: '/:pathMatch(.*)*', redirect: '/' }
]

const router = createRouter({
  history: createWebHashHistory(), // 核心修改：改用hash模式
  routes
})

export default router