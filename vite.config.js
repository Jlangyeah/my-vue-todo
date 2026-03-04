import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  server: {
    proxy: {
      // 代理GLM接口（关键：确保路径匹配）
      '/api/glm': {
        target: 'https://open.bigmodel.cn',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/glm/, '/api/paas/v4'),
        // 强制设置请求头（解决GLM的跨域/鉴权问题）
        configure: (proxy, options) => {
          proxy.on('proxyReq', (proxyReq) => {
            proxyReq.setHeader('Referer', 'https://open.bigmodel.cn')
            proxyReq.setHeader('Origin', 'https://open.bigmodel.cn')
          })
        }
      }
    }
  }
})