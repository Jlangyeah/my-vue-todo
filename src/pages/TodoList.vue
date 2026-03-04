<template>
  <div class="todo-page">
    <el-page-header content="Todo列表" @back="$router.push('/')"></el-page-header>
    
    <!-- 新增Todo（带AI分类） -->
    <el-card shadow="hover" class="add-card">
      <!-- 核心修改：移除el-input的@keyup.enter，只保留el-form的@submit.prevent -->
<el-form :model="todoForm" :rules="rules" ref="formRef" inline @submit.prevent="handleAdd">
  <el-form-item prop="text">
    <el-input
      v-model="todoForm.text"
      placeholder="输入新的待办事项（最多20字）"
      maxlength="20"
      show-word-limit
    ></el-input>
  </el-form-item>
  <el-form-item>
    <el-button type="primary" icon="Plus" @click="handleAdd" :loading="aiLoading">
      添加（AI分类）
    </el-button>
  </el-form-item>
</el-form>
    </el-card>

    <!-- 分类筛选 -->
    <el-card shadow="hover" class="filter-card" style="margin-bottom: 20px;">
      <el-select v-model="activeCategory" placeholder="筛选分类" style="width: 200px;">
        <el-option label="全部" value="all"></el-option>
        <el-option label="学习" value="学习"></el-option>
        <el-option label="工作" value="工作"></el-option>
        <el-option label="生活" value="生活"></el-option>
        <el-option label="未分类" value="未分类"></el-option>
      </el-select>
    </el-card>

    <!-- Todo列表（带分类显示） -->
    <el-card shadow="hover" class="list-card" v-loading="loading">
      <template v-if="filteredTodos.length === 0">
        <el-empty description="暂无待办事项，赶紧添加吧！"></el-empty>
      </template>
      <template v-else>
        <div class="todo-list">
          <div
            v-for="todo in filteredTodos"
            :key="todo.id"
            :class="{ completed: todo.done }"
            class="todo-item"
          >
            <!-- 分类标签 -->
            <el-tag :type="getTagType(todo.category)">{{ todo.category }}</el-tag>
            <el-checkbox 
              :checked="todo.done"
              @change="() => todoStore.toggleTodo(todo.id)"
              class="todo-text"
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
        <!-- 编辑时可手动修改分类 -->
        <el-form-item label="分类：">
          <el-select v-model="editForm.category">
            <el-option label="学习" value="学习"></el-option>
            <el-option label="工作" value="工作"></el-option>
            <el-option label="生活" value="生活"></el-option>
            <el-option label="未分类" value="未分类"></el-option>
          </el-select>
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
import { ref, reactive, nextTick, computed } from 'vue'
import { useTodoStore } from '../stores/todoStore'
import { ElMessage } from 'element-plus'
import { aiClassifyTodo } from '../utils/aiRequest' // 导入AI分类方法

const todoStore = useTodoStore()
const loading = ref(false)
const aiLoading = ref(false) // AI请求加载状态
const formRef = ref(null)
const editFormRef = ref(null)
const editDialogVisible = ref(false)
const activeCategory = ref('all') // 选中的分类

// 新增表单
const todoForm = reactive({
  text: ''
})

// 编辑表单（新增category字段）
const editForm = reactive({
  id: '',
  text: '',
  category: '未分类'
})

// 校验规则
const rules = reactive({
  text: [
    { required: true, message: '请输入待办事项', trigger: 'blur' },
    { max: 20, message: '最多输入20个字', trigger: 'blur' }
  ]
})

// 筛选后的Todo列表
const filteredTodos = computed(() => {
  if (activeCategory.value === 'all') {
    return todoStore.todos
  }
  return todoStore.todos.filter(t => t.category === activeCategory.value)
})

// 根据分类返回标签类型
const getTagType = (category) => {
  const typeMap = {
    学习: 'primary',
    工作: 'success',
    生活: 'warning',
    未分类: 'info'
  }
  return typeMap[category] || 'info'
}

// 新增Todo（带AI分类）
const handleAdd = async () => {
  formRef.value.validate(async (valid) => {
    if (valid) {
      loading.value = true
      aiLoading.value = true
      try {
        await todoStore.addTodo(todoForm.text)
        todoForm.text = ''
        ElMessage.success('添加成功（已AI分类）！')
      } catch (err) {
        // 核心修改：打印完整错误信息
        console.error('添加Todo失败详情：', err)
        // 显示具体错误提示（方便调试）
        ElMessage.error(`添加失败：${err.message || '未知错误'}`)
      } finally {
        loading.value = false
        aiLoading.value = false
      }
    } else {
      ElMessage.error('请填写正确的待办事项！')
    }
  })
}

// 打开编辑弹窗
const openEditDialog = (todo) => {
  editForm.id = todo.id
  editForm.text = todo.text
  editForm.category = todo.category // 回显分类
  editDialogVisible.value = true
  nextTick(() => {
    editFormRef.value.clearValidate()
  })
}

// 确认编辑
const handleEditConfirm = () => {
  editFormRef.value.validate((valid) => {
    if (valid) {
      loading.value = true
      setTimeout(() => {
        const targetTodo = todoStore.todos.find(t => t.id === editForm.id)
        if (targetTodo) {
          targetTodo.text = editForm.text.trim()
          targetTodo.category = editForm.category // 更新分类
          localStorage.setItem('todos', JSON.stringify(todoStore.todos))
          ElMessage.success('修改成功！')
          editDialogVisible.value = false
          editForm.id = ''
          editForm.text = ''
          editForm.category = '未分类'
        }
        loading.value = false
      }, 300)
    } else {
      ElMessage.error('请填写正确的待办事项！')
    }
  })
}
</script>

<style scoped>
/* 原有样式不变，新增以下样式 */
.filter-card {
  padding: 10px 20px;
}

.todo-item {
  display: flex;
  align-items: center;
  padding: 12px 16px;
  border-bottom: 1px solid #ebeef5;
  gap: 10px; /* 增加间距 */
}

.todo-text {
  flex: 1; /* 文本占满剩余空间 */
}

.el-tag {
  margin-right: 8px;
}
</style>