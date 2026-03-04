import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
// 核心修正：导入AI分类函数（路径要和你的文件结构匹配！）
import { aiClassifyTodo } from '../utils/aiRequest'

export const useTodoStore = defineStore('todo', () => {
  // 状态：新增category字段
  const todos = ref(JSON.parse(localStorage.getItem('todos')) || [
    { id: 1, text: '学习Vue3核心基础', done: false, category: '学习' },
    { id: 2, text: '写TodoList静态页面', done: true, category: '学习' },
    { id: 3, text: '理解Props和Emit通信', done: false, category: '学习' }
  ])

  // 计算属性：按分类筛选
  const todosByCategory = computed(() => {
    return {
      学习: todos.value.filter(t => t.category === '学习'),
      工作: todos.value.filter(t => t.category === '工作'),
      生活: todos.value.filter(t => t.category === '生活'),
      未分类: todos.value.filter(t => t.category === '未分类')
    }
  })

  // 方法：新增Todo（带AI分类）
  const addTodo = async (text) => {
    if (!text.trim()) return
    // 调用AI分类（捕获AI接口异常并抛出）
    let category = '未分类'
    try {
      category = await aiClassifyTodo(text)
    } catch (aiErr) {
      console.error('AI分类接口异常：', aiErr)
      // 抛出异常，让上层catch捕获
      throw new Error(`AI分类失败：${aiErr.message || '接口无响应'}`)
    }
    const newTodo = {
      id: Date.now(),
      text: text.trim(),
      done: false,
      category // 新增分类字段
    }
    todos.value.push(newTodo)
    localStorage.setItem('todos', JSON.stringify(todos.value))
    return newTodo
  }

  // 保留原有方法：toggleTodo/deleteTodo/editTodo
  const toggleTodo = (id) => {
    const todo = todos.value.find(t => t.id === id)
    if (todo) {
      todo.done = !todo.done
      localStorage.setItem('todos', JSON.stringify(todos.value))
    }
  }

  const deleteTodo = (id) => {
    todos.value = todos.value.filter(t => t.id !== id)
    localStorage.setItem('todos', JSON.stringify(todos.value))
  }

  const editTodo = (id, text) => {
    const todo = todos.value.find(t => t.id === id)
    if (todo) {
      todo.text = text.trim()
      localStorage.setItem('todos', JSON.stringify(todos.value))
    }
  }

  return {
    todos,
    todosByCategory, // 暴露分类筛选结果
    totalTodos: computed(() => todos.value.length),
    completedTodos: computed(() => todos.value.filter(t => t.done).length),
    uncompletedTodos: computed(() => todos.value.filter(t => !t.done).length),
    addTodo,
    toggleTodo,
    deleteTodo,
    editTodo
  }
})