<template>
  <div class="home">
    <el-card class="home-card" shadow="hover">
      <div slot="header" class="card-header">
        <h1>Vue3 TodoList 管理系统</h1>
      </div>
      <el-descriptions :column="1" border>
        <el-descriptions-item label="技术栈">Vue3 + Vue Router 4 + Pinia + Element Plus</el-descriptions-item>
        <el-descriptions-item label="核心功能">多页面路由、全局状态管理、数据持久化、权限控制</el-descriptions-item>
      </el-descriptions>
      <div class="btn-group">
        <el-button type="primary" icon="CircleCheck" @click="$router.push('/todos')">
          进入Todo列表
        </el-button>
        <el-button type="success" icon="DataAnalysis" @click="$router.push('/stats')">
          查看统计数据
        </el-button>
      </div>
    </el-card>
  </div>
</template>

<style scoped>
.home {
  max-width: 800px;
  margin: 100px auto;
  padding: 0 20px;
}

.home-card {
  padding: 20px;
}

.card-header {
  text-align: center;
  margin-bottom: 20px;
}

h1 {
  color: #409eff;
  margin: 0;
}

.btn-group {
  margin-top: 30px;
  display: flex;
  gap: 20px;
  justify-content: center;
}
</style>