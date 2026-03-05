import { createApp } from 'vue'
import './style.css'
import { createPinia } from 'pinia' // 导入Pinia
import App from './App.vue'
import router from './router' // 导入路由
import ElementPlus from 'element-plus' // 导入Element Plus
import 'element-plus/dist/index.css' // 导入样式
import * as ElementPlusIconsVue from '@element-plus/icons-vue' // 导入所有图标
import { setupTrackDirective } from './directives/track'
import { trackPageView } from './utils/track'


const app = createApp(App)

//注册全局埋点
setupTrackDirective(app)

//路由埋点
router.afterEach((to, from) => {
  //排除不必要的埋点页面
  const excludePath = ['/login', '/404']
  if (!excludePath.includes(to.path)) {
    trackPageView({path:to.path,meta:to.meta,from})
  }
})

app.use(createPinia())
app.use(router)

// 注册Element Plus
app.use(ElementPlus)

// 注册所有图标
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

app.mount('#app')
