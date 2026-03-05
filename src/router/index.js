import { createRouter, createWebHashHistory } from 'vue-router'
import Home from '../pages/Home.vue'
import TodoList from '../pages/TodoList.vue'
import Stats from '../pages/Stats.vue'

const routes = [
  { path: '/', component: Home ,meta:{title:'首页'}},
  { path: '/todos', component: TodoList,meta:{title:"待办事项页"} },
  { path: '/stats', component: Stats },
  // 重定向：避免路径错误
  { path: '/:pathMatch(.*)*', redirect: '/' }
]

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL), // 核心修改：改用hash模式
  routes
})

export default router