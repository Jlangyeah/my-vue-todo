import { createApp } from 'vue'
import './style.css'
import { createPinia } from 'pinia' // 导入Pinia
import App from './App.vue'
import router from './router' // 导入路由
import ElementPlus from 'element-plus' // 导入Element Plus
import 'element-plus/dist/index.css' // 导入样式
import * as ElementPlusIconsVue from '@element-plus/icons-vue' // 导入所有图标


const app = createApp(App)

app.use(createPinia())
app.use(router)

// 注册Element Plus
app.use(ElementPlus)

// 注册所有图标
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

app.mount('#app')
