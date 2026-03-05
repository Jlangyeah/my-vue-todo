import axios from 'axios'
import { HmacSHA256 } from 'crypto-js'

// 核心修改：读取Vite环境变量（本地从.env读取，线上为undefined）
const GLM_API_KEY = import.meta.env.VITE_GLM_API_KEY || ''
const GLM_SECRET_KEY = import.meta.env.VITE_GLM_SECRET_KEY || ''
const GLM_BASE_URL = '/api/glm/chat/completions'

// 生成签名（兼容环境变量不存在的情况）
const getGLMAuthorization = () => {
  if (!GLM_API_KEY || !GLM_SECRET_KEY) return ''
  const timestamp = Math.floor(Date.now() / 1000)
  const signature = HmacSHA256(`${GLM_API_KEY}:${timestamp}`, GLM_SECRET_KEY).toString()
  return `Bearer ${GLM_API_KEY}:${timestamp}:${signature}`
}

export const aiClassifyTodo = async (text) => {
  // 降级处理：线上无环境变量时，直接返回未分类，不调用AI接口
  if (!GLM_API_KEY) {
    console.warn('⚠️ 未配置GLM API Key，跳过AI分类')
    return '未分类'
  }

  try {
    // 简化版鉴权（读取环境变量）
    const authHeader = `Bearer ${GLM_API_KEY}`
    // 标准版鉴权（可选）
    // const authHeader = getGLMAuthorization() || `Bearer ${GLM_API_KEY}`

    const res = await axios.post(
      GLM_BASE_URL,
      {
        model: 'glm-4-flash',
        messages: [
          { role: 'user', content: `请给以下待办事项分类，仅返回工作/学习/生活：${text}` }
        ],
        temperature: 0.1,
        stream: false,
        max_tokens: 10
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': authHeader
        },
        timeout: 30000
      }
    )

    const choice = res.data.choices?.[0] || {}
    const message = choice.message || {}
    const result = message.content?.trim() || '未分类'
    const validCategories = ['工作', '学习', '生活']
    return validCategories.includes(result) ? result : '未分类'
  } catch (err) {
    console.error('GLM分类失败：', err.message)
    return '未分类'
  }
}