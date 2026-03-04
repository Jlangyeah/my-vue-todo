<template>
  <div 
    class="todo-item" 
    :class="{ completed: todo.done }"
    @click="handleToggle"
  >
    {{ todo.text }}
    <!-- 新增删除按钮 -->
    <button 
      class="delete-btn" 
      @click.stop="handleDelete" 
    >
      删除
    </button>
  </div>
</template>

<script setup>
const props = defineProps({
  todo: {
    type: Object,
    required: true,
    default: () => ({ id: 0, text: '', done: false })
  }
})

// 新增delete事件
const emit = defineEmits(['toggle', 'delete'])

const handleToggle = () => {
  emit('toggle', props.todo.id)
}

// 新增删除事件处理
const handleDelete = () => {
  emit('delete', props.todo.id)
}
</script>

<style scoped>
.todo-item {
  padding: 8px 12px;
  margin: 8px 0;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;  /* 新增：让文字和按钮并排 */
  justify-content: space-between;  /* 新增：两端对齐 */
  align-items: center;  /* 新增：垂直居中 */
}

.completed {
  text-decoration: line-through;
  color: #999;
  background-color: #f5f5f5;
}

.todo-item:hover {
  border-color: #42b983;
}

/* 新增删除按钮样式 */
.delete-btn {
  padding: 4px 8px;
  background-color: #ff4444;
  color: white;
  border: none;
  border-radius: 3px;
  cursor: pointer;
  font-size: 12px;
}

.delete-btn:hover {
  background-color: #cc0000;
}
</style>