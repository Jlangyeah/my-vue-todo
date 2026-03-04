import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useTodoStore = defineStore('todo', () => {
  // 状态
  const todos = ref(JSON.parse(localStorage.getItem('todos')) || [
    { id: 1, text: '学习Vue3核心基础', done: false },
    { id: 2, text: '写TodoList静态页面', done: true },
    { id: 3, text: '理解Props和Emit通信', done: false }
  ])

  // 计算属性
  const totalTodos = computed(() => todos.value.length)
  const completedTodos = computed(() => todos.value.filter(t => t.done).length)
  const uncompletedTodos = computed(() => todos.value.filter(t => !t.done).length)

  // 方法：新增Todo
  const addTodo = (text) => {
    if (!text.trim()) return
    todos.value.push({
      id: Date.now(),
      text: text.trim(),
      done: false
    })
    localStorage.setItem('todos', JSON.stringify(todos.value))
  }

  // 方法：切换完成状态（核心修正：通过方法修改，保证响应式）
  const toggleTodo = (id) => {
    const todo = todos.value.find(t => t.id === id)
    if (todo) {
      todo.done = !todo.done // 这里修改会触发响应式
      localStorage.setItem('todos', JSON.stringify(todos.value))
    }
  }

  // 方法：删除Todo
  const deleteTodo = (id) => {
    todos.value = todos.value.filter(t => t.id !== id)
    localStorage.setItem('todos', JSON.stringify(todos.value))
  }

  // 方法：编辑Todo
  const editTodo = (id, text) => {
    const todo = todos.value.find(t => t.id === id)
    if (todo) {
      todo.text = text.trim()
      localStorage.setItem('todos', JSON.stringify(todos.value))
    }
  }

  return {
    todos,
    totalTodos,
    completedTodos,
    uncompletedTodos,
    addTodo,
    toggleTodo, // 暴露切换方法
    deleteTodo,
    editTodo
  }
})