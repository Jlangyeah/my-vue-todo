<template>
  <div class="stats-page">
    <el-page-header content="Todo统计分析" @back="$router.push('/todos')"></el-page-header>
    
    <el-row :gutter="20">
      <!-- 统计卡片 -->
      <el-col :span="8">
        <el-card shadow="hover" class="stat-card">
          <div class="stat-item">
            <el-icon size="24" color="#409eff"><Document /></el-icon>
            <div>
              <p class="label">总待办数</p>
              <p class="value">{{ todoStore.totalTodos }}</p>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card shadow="hover" class="stat-card">
          <div class="stat-item">
            <el-icon size="24" color="#67c23a"><CircleCheck /></el-icon>
            <div>
              <p class="label">已完成数</p>
              <p class="value">{{ todoStore.completedTodos }}</p>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card shadow="hover" class="stat-card">
          <div class="stat-item">
            <el-icon size="24" color="#f56c6c"><Clock /></el-icon>
            <div>
              <p class="label">未完成数</p>
              <p class="value">{{ todoStore.uncompletedTodos }}</p>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 完成率 + 清空按钮 -->
    <el-card shadow="hover" class="rate-card" style="margin-top: 20px;">
      <div class="rate-content">
        <p>完成率：{{ completionRate }}%</p>
        <el-progress :percentage="completionRate" :stroke-width="20"></el-progress>
        <el-button 
          type="warning" 
          icon="Delete" 
          @click="clearCompleted"
          v-if="todoStore.completedTodos > 0"
        >
          清空已完成
        </el-button>
      </div>
    </el-card>

    <!-- 底部导航 -->
    <div class="nav-btn" style="margin-top: 30px;">
      <el-button type="primary" icon="List" @click="$router.push('/todos')">返回列表</el-button>
      <el-button type="default" icon="Home" @click="$router.push('/')">返回首页</el-button>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useTodoStore } from '../stores/todoStore'
import { ElMessage } from 'element-plus'
import { Document, CircleCheck, Clock } from '@element-plus/icons-vue'

const todoStore = useTodoStore()

// 完成率计算
const completionRate = computed(() => {
  if (todoStore.totalTodos === 0) return 0
  return Math.round((todoStore.completedTodos / todoStore.totalTodos) * 100)
})

// 清空已完成
const clearCompleted = () => {
  todoStore.todos = todoStore.todos.filter(t => !t.done)
  localStorage.setItem('todos', JSON.stringify(todoStore.todos))
  ElMessage.success('已清空所有已完成事项！')
}
</script>

<style scoped>
.stats-page {
  max-width: 800px;
  margin: 40px auto;
  padding: 0 20px;
}

.stat-card {
  height: 120px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 15px;
}

.label {
  color: #666;
  margin: 0;
}

.value {
  font-size: 24px;
  font-weight: bold;
  margin: 0;
  color: #333;
}

.rate-card {
  padding: 20px;
}

.rate-content {
  display: flex;
  flex-direction: column;
  gap: 15px;
  align-items: center;
}

.rate-content p {
  font-size: 18px;
  margin: 0;
}

.nav-btn {
  display: flex;
  gap: 10px;
  justify-content: center;
}
</style>