import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// 注意：base的值 = /你的GitHub仓库名/（必须以/开头和结尾）
// 例如仓库名是vue3-todolist，就写 '/vue3-todolist/'
const base = '/my-vue-todo/' 

export default defineConfig({
  plugins: [vue()],
  // 核心配置：适配GitHub Pages路径
  base: process.env.NODE_ENV === 'production' ? base : '/',
  server: {
    // 保留之前的AI接口代理配置（本地开发用）
    proxy: {
      '/api/glm': {
        target: 'https://open.bigmodel.cn',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/glm/, '/api/paas/v4'),
        configure: (proxy, options) => {
          proxy.on('proxyReq', (proxyReq) => {
            proxyReq.setHeader('Referer', 'https://open.bigmodel.cn')
            proxyReq.setHeader('Origin', 'https://open.bigmodel.cn')
          })
        }
      }
    }
  },
  // 可选：打包优化（减小体积）
  build: {
    outDir: 'dist', // 打包输出目录（默认dist，不用改）
    assetsDir: 'assets' // 静态资源目录
  }
})