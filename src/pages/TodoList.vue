<template>
  <div class="todo-page">
    <el-page-header content="Todo列表" @back="$router.push('/')"></el-page-header>
    
    <!-- 新增Todo -->
    <el-card shadow="hover" class="add-card">
      <el-form :model="todoForm" :rules="rules" ref="formRef" inline @submit.prevent="handleAdd">
        <el-form-item prop="text">
          <el-input
            v-model="todoForm.text"
            placeholder="输入新的待办事项（最多20字）"
            maxlength="20"
            show-word-limit
            @keyup.enter="handleAdd"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="Plus" @click="handleAdd">添加</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- Todo列表 -->
    <el-card shadow="hover" class="list-card" v-loading="loading">
      <template v-if="todoStore.todos.length === 0">
        <el-empty description="暂无待办事项，赶紧添加吧！"></el-empty>
      </template>
      <template v-else>
        <div class="todo-list">
          <!-- 核心修正：复选框去掉v-model，用checked属性 + change事件 -->
          <div
            v-for="todo in todoStore.todos"
            :key="todo.id"
            :class="{ completed: todo.done }"
            class="todo-item"
          >
            <el-checkbox 
              :checked="todo.done"  
              @change="() => todoStore.toggleTodo(todo.id)"  
            >
              {{ todo.text }}
            </el-checkbox>
            <el-button 
              type="primary" 
              size="small" 
              icon="Edit" 
              @click="openEditDialog(todo)"
              class="edit-btn"
            >
              编辑
            </el-button>
            <el-button 
              type="danger" 
              size="small" 
              icon="Delete" 
              @click="todoStore.deleteTodo(todo.id)"
              class="delete-btn"
            >
              删除
            </el-button>
          </div>
        </div>
      </template>
    </el-card>

    <!-- 底部导航 -->
    <div class="nav-btn">
      <el-button type="default" icon="Back" @click="$router.push('/')">返回首页</el-button>
      <el-button type="info" icon="TrendCharts" @click="$router.push('/stats')">查看统计</el-button>
    </div>

    <!-- 编辑弹窗 -->
    <el-dialog
      v-model="editDialogVisible"
      title="编辑待办事项"
      width="500px"
      :close-on-click-modal="false"
    >
      <el-form :model="editForm" :rules="rules" ref="editFormRef" label-width="0px">
        <el-form-item prop="text">
          <el-input
            v-model="editForm.text"
            placeholder="修改待办事项（最多20字）"
            maxlength="20"
            show-word-limit
          ></el-input>
        </el-form-item>
      </el-form>
      <template v-slot:footer>
        <el-button @click="editDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleEditConfirm">确认修改</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, nextTick } from 'vue'
import { useTodoStore } from '../stores/todoStore'
import { ElMessage } from 'element-plus'

const todoStore = useTodoStore()
const loading = ref(false)
const formRef = ref(null)
const editFormRef = ref(null)
const editDialogVisible = ref(false)

const todoForm = reactive({
  text: ''
})

const editForm = reactive({
  id: '',
  text: ''
})

const rules = reactive({
  text: [
    { required: true, message: '请输入待办事项', trigger: 'blur' },
    { max: 20, message: '最多输入20个字', trigger: 'blur' }
  ]
})

const handleAdd = () => {
  formRef.value.validate((valid) => {
    if (valid) {
      loading.value = true
      setTimeout(() => {
        todoStore.addTodo(todoForm.text)
        todoForm.text = ''
        ElMessage.success('添加成功！')
        loading.value = false
      }, 300)
    } else {
      ElMessage.error('请填写正确的待办事项！')
    }
  })
}

const openEditDialog = (todo) => {
  editForm.id = todo.id
  editForm.text = todo.text
  editDialogVisible.value = true
  nextTick(() => {
    editFormRef.value.clearValidate()
  })
}

const handleEditConfirm = () => {
  editFormRef.value.validate((valid) => {
    if (valid) {
      loading.value = true
      setTimeout(() => {
        todoStore.editTodo(editForm.id, editForm.text) // 调用Pinia的编辑方法
        ElMessage.success('修改成功！')
        editDialogVisible.value = false
        editForm.id = ''
        editForm.text = ''
        loading.value = false
      }, 300)
    } else {
      ElMessage.error('请填写正确的待办事项！')
    }
  })
}
</script>

<style scoped>
.todo-page {
  max-width: 800px;
  margin: 40px auto;
  padding: 0 20px;
  font-family: Arial, sans-serif;
}

.add-card {
  margin-bottom: 20px;
  padding: 20px;
}

.list-card {
  padding: 20px;
  margin-bottom: 20px;
}

.todo-list {
  border: 1px solid #ebeef5;
  border-radius: 4px;
}

.todo-item {
  display: flex;
  align-items: center;
  padding: 12px 16px;
  border-bottom: 1px solid #ebeef5;
  transition: background-color 0.2s;
}

.todo-item:last-child {
  border-bottom: none;
}

.todo-item:hover {
  background-color: #f5f7fa;
}

.completed {
  color: #909399;
  text-decoration: line-through;
}

.edit-btn {
  margin-left: auto;
  margin-right: 8px;
}

.delete-btn {
  margin-right: 8px;
}

.nav-btn {
  display: flex;
  gap: 10px;
  justify-content: center;
  margin-top: 20px;
}
</style>