import { createRouter, createWebHistory } from 'vue-router'
import Home from '../pages/Home.vue'
import TodoList from '../pages/TodoList.vue'
import Stats from '../pages/Stats.vue'

// 路由规则
const routes = [
  {
    path: '/',          // 默认首页
    name: 'Home',
    component: Home
  },
  {
    path: '/todos',     // Todo列表页
    name: 'TodoList',
    component: TodoList
  },
  {
    path: '/stats',     // 统计页
    name: 'Stats',
    component: Stats,
    // 路由守卫：只有有Todo数据时才能访问统计页
    beforeEnter: (to, from, next) => {
      // 这里先简单判断，后面会结合Pinia
      const hasTodos = localStorage.getItem('todos') || false
      hasTodos ? next() : next('/todos') // 没有数据跳转到列表页
    }
  }
]

// 创建路由实例
const router = createRouter({
  history: createWebHistory(), // HTML5历史模式（无#号）
  routes
})

export default router