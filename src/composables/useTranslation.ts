import { ref } from 'vue'

const API_KEY = import.meta.env.VITE_AZURE_API_KEY
const REGION = import.meta.env.VITE_AZURE_REGION

// 文本格式化工具函数
function formatTranslatedText(text: string): string {
  if (!text) return ''
  
  return text
    // 将英文标点替换为中文标点
    .replace(/\./g, '。')
    .replace(/,/g, '，')
    .replace(/\?/g, '？')
    .replace(/!/g, '！')
    .replace(/:/g, '：')
    .replace(/;/g, '；')
    // 处理括号
    .replace(/\(/g, '（')
    .replace(/\)/g, '）')
    // 处理引号
    .replace(/"/g, '\u201c')  // 替换为中文左引号
    .replace(/'/g, '\u2018')  // 替换为中文左单引号
    // 删除多余空格
    .replace(/\s+/g, ' ')
    .trim()
    // 确保句子之间有适当的空格
    .replace(/([。！？])\s*/g, '$1\n')
    // 删除连续的换行
    .replace(/\n+/g, '\n')
    .trim()
}

export function useTranslation() {
  const translatedText = ref('')
  const isTranslating = ref(false)

  const translate = async (text: string): Promise<string> => {
    if (!text.trim()) {
      return ''
    }

    isTranslating.value = true
    try {
      const response = await fetch(
        'https://api.cognitive.microsofttranslator.com/translate?api-version=3.0&from=en&to=zh-Hans',
        {
          method: 'POST',
          headers: {
            'Ocp-Apim-Subscription-Key': API_KEY,
            'Ocp-Apim-Subscription-Region': REGION,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify([{ text }]),
        }
      )

      if (!response.ok) {
        throw new Error('翻译请求失败')
      }

      const data = await response.json()
      const result = data[0]?.translations[0]?.text || ''
      // 对翻译结果进行格式化
      const formattedResult = formatTranslatedText(result)
      translatedText.value = formattedResult
      return formattedResult
    } catch (error) {
      console.error('翻译错误:', error)
      return '翻译失败，请重试'
    } finally {
      isTranslating.value = false
    }
  }

  return {
    translatedText,
    isTranslating,
    translate
  }
} 