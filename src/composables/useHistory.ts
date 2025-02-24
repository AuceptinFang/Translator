import { ref } from 'vue'

export interface TranslationRecord {
  original: string
  translated: string
  timestamp: number
}

const STORAGE_KEY = 'translation_history'
const MAX_HISTORY_LENGTH = 50

export function useHistory() {
  const history = ref<TranslationRecord[]>([])

  // 从本地存储加载历史记录
  const loadHistory = () => {
    try {
      const savedHistory = localStorage.getItem(STORAGE_KEY)
      if (savedHistory) {
        history.value = JSON.parse(savedHistory)
      }
    } catch (error) {
      console.error('加载历史记录失败:', error)
    }
  }

  // 保存历史记录到本地存储
  const saveHistory = () => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(history.value))
    } catch (error) {
      console.error('保存历史记录失败:', error)
    }
  }

  // 添加新的翻译记录
  const addRecord = (original: string, translated: string) => {
    if (!original.trim() || !translated.trim()) return

    history.value.unshift({
      original,
      translated,
      timestamp: Date.now()
    })

    // 限制历史记录长度
    if (history.value.length > MAX_HISTORY_LENGTH) {
      history.value = history.value.slice(0, MAX_HISTORY_LENGTH)
    }

    saveHistory()
  }

  // 清空历史记录
  const clearHistory = () => {
    history.value = []
    saveHistory()
  }

  // 初始化时加载历史记录
  loadHistory()

  return {
    history,
    addRecord,
    clearHistory
  }
} 