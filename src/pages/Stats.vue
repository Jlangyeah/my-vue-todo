<template>
  <div class="stats-page">
    <el-page-header content="Todo统计分析" @back="$router.push('/todos')"></el-page-header>
    
    <!-- 基础统计 -->
    <el-row :gutter="20">
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

    <!-- 分类统计 -->
    <el-card shadow="hover" class="category-card" style="margin-top: 20px;">
      <h3 style="margin: 0 0 20px 0; color: #333;">分类统计</h3>
      <el-row :gutter="20">
        <el-col :span="6" v-for="(list, type) in todoStore.todosByCategory" :key="type">
          <div class="category-item">
            <el-tag :type="getTagType(type)" size="large">{{ type }}</el-tag>
            <p class="count">{{ list.length }} 项</p>
          </div>
        </el-col>
      </el-row>
    </el-card>

    <!-- 完成率 -->
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

// 完成率
const completionRate = computed(() => {
  if (todoStore.totalTodos === 0) return 0
  return Math.round((todoStore.completedTodos / todoStore.totalTodos) * 100)
})

// 分类标签类型
const getTagType = (category) => {
  const typeMap = {
    学习: 'primary',
    工作: 'success',
    生活: 'warning',
    未分类: 'info'
  }
  return typeMap[category] || 'info'
}

// 清空已完成
const clearCompleted = () => {
  todoStore.todos = todoStore.todos.filter(t => !t.done)
  localStorage.setItem('todos', JSON.stringify(todoStore.todos))
  ElMessage.success('已清空所有已完成事项！')
}
</script>

<style scoped>
/* 原有样式不变，新增分类统计样式 */
.category-card {
  padding: 20px;
}

.category-item {
  text-align: center;
  padding: 10px;
  border: 1px solid #ebeef5;
  border-radius: 4px;
  margin-bottom: 10px;
}

.count {
  font-size: 18px;
  font-weight: bold;
  margin: 10px 0 0 0;
}
</style>