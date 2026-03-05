// src/utils/track.js
// 环境判断（可根据项目实际的环境变量调整）
const isProduction = import.meta.env.MODE === 'production'

// 埋点配置
const TRACK_CONFIG = {
  // 替换为你的实际上报接口地址
  reportUrl: 'https://api.xxx.com/track',
  // 开发环境仅打印，不上报
  debug: !isProduction,
  // 应用标识
  appId: 'vue3-track-demo',
  // 用户唯一标识（从本地存储获取，无则为匿名）
  userId: localStorage.getItem('userId') || 'anonymous'
}

/**
 * 通用埋点上报函数
 * @param eventName 事件名称（如：btn_click、page_view）
 * @param eventParams 自定义业务参数
 */
export function trackEvent(eventName, eventParams = {}) {
  // 1. 构造埋点数据
  const trackData = {
    appId: TRACK_CONFIG.appId,
    userId: TRACK_CONFIG.userId,
    eventName,
    eventParams: {
      // 默认参数
      timestamp: Date.now(),
      url: window.location.href,
      referrer: document.referrer,
      // 合并自定义参数
      ...eventParams
    },
    // 设备基础信息
    device: {
      browser: navigator.userAgent,
      screen: `${window.screen.width}x${window.screen.height}`
    }
  }

  // 2. 调试模式：仅打印埋点信息
  if (TRACK_CONFIG.debug) {
    console.log('[埋点调试]', trackData)
    return
  }

  // 3. 生产环境：上报数据（优先用 sendBeacon 保证页面卸载时上报）
  try {
    if (navigator.sendBeacon) {
      navigator.sendBeacon(
        TRACK_CONFIG.reportUrl,
        JSON.stringify(trackData)
      )
    } else {
      // 降级方案：fetch 上报
      fetch(TRACK_CONFIG.reportUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(trackData),
        keepalive: true
      })
    }
  } catch (error) {
    console.error('[埋点上报失败]', error)
  }
}

/**
 * 页面访问埋点（路由专用）
 * @param route 路由信息对象
 */
export function trackPageView(route) {
  trackEvent('page_view', {
    pagePath: route.path,
    pageName: route.meta.title || route.path,
    routeFrom: route.from?.path || 'direct'
  })
}