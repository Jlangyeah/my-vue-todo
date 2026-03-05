// src/directives/track.js
import { trackEvent } from '@/utils/track'

/**
 * 注册全局埋点指令 v-track
 * 使用方式：v-track="'btn_click'" 或 v-track="{ eventName: 'btn_click', params: { btnName: '提交' } }"
 */
export function setupTrackDirective(app) {
  app.directive('track', {
    mounted(el, binding) {
      // 解析指令传参
      let eventName = ''
      let eventParams = {}

      if (typeof binding.value === 'string') {
        eventName = binding.value
      } else if (typeof binding.value === 'object' && binding.value !== null) {
        eventName = binding.value.eventName
        eventParams = binding.value.params || {}
      }

      // 无事件名则不绑定
      if (!eventName) return

      // 绑定点击事件触发埋点
      el.addEventListener('click', () => {
        trackEvent(eventName, eventParams)
      })
    }
  })
}