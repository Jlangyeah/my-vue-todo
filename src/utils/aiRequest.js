import axios from 'axios'
// 核心修正：正确导入 HmacSHA256 函数
import { HmacSHA256 } from 'crypto-js' 

// GLM-4.7-Flash 配置
const GLM_BASE_URL = '/api/glm/chat/completions' // 用Vite代理地址（避免跨域）
const GLM_API_KEY = '18a111a8e2764dab8714c1585e0216c8.ZTdih4PqWmWhEYHV' // 替换为自己的
const GLM_SECRET_KEY = '你的智谱Secret Key' // 替换为自己的

// 生成GLM鉴权签名（修复HmacSHA256使用方式）
const getGLMAuthorization = () => {
  const timestamp = Math.floor(Date.now() / 1000) // 秒级时间戳（必须）
  // 修正：直接使用 HmacSHA256 函数，不是 hmac.HmacSHA256
  const signature = HmacSHA256(`${GLM_API_KEY}:${timestamp}`, GLM_SECRET_KEY).toString()
  // return `Bearer ${GLM_API_KEY}:${timestamp}:${signature}`
  return `Bearer ${GLM_API_KEY}`
}

// 封装GLM-4.7-Flash分类请求
export const aiClassifyTodo = async (text) => {
  try {
    // 先测试简化版鉴权（跳过签名，避免鉴权复杂问题）
    // const authHeader = `Bearer ${GLM_API_KEY}`
    // 标准鉴权（修复后）
    const authHeader = getGLMAuthorization()

    const res = await axios.post(
      GLM_BASE_URL,
      {
        model: 'glm-4-flash', // GLM-4.7-Flash 正确模型名
        messages: [
          {
            role: 'user',
            content: `请给以下待办事项分类，仅返回分类结果（工作/学习/生活），不要多余内容：${text}`
          }
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

    // 容错处理：多层判断避免undefined
    const choice = res.data.choices?.[0] || {}
    const message = choice.message || {}
    const result = message.content?.trim() || '未分类'
    
    // 校验返回值是否合法
    const validCategories = ['工作', '学习', '生活']
    return validCategories.includes(result) ? result : '未分类'
  } catch (err) {
    console.error('GLM分类失败详情：', err.response?.data || err.message)
    // 明确提示签名错误（方便排查）
    if (err.message.includes('HmacSHA256')) {
      console.error('❌ 签名生成失败：crypto-js 导入/使用错误')
    }
    return '未分类'
  }
}