<script setup lang="ts">
import { ref, watch } from 'vue'
import { Microphone, Setting, Delete, Document, Reading, Timer, Edit } from '@element-plus/icons-vue'
import { ElMessageBox } from 'element-plus'
import 'element-plus/dist/index.css'
import { useSpeechRecognition } from './composables/useSpeechRecognition'
import { useTranslation } from './composables/useTranslation'
import { useHistory } from './composables/useHistory'

// 状态变量
const showSettings = ref(false)
const fontSize = ref(16)

// 获取本地存储的字体大小设置
const savedFontSize = localStorage.getItem('fontSize')
if (savedFontSize) {
  fontSize.value = parseInt(savedFontSize)
}

// 保存字体大小设置
watch(fontSize, (newSize) => {
  localStorage.setItem('fontSize', newSize.toString())
})

// 初始化各个功能模块
const { isRecording, currentText, interimText, startRecording, stopRecording } = useSpeechRecognition()
const { translatedText: voiceTranslatedText, isTranslating: isVoiceTranslating, translate: translateVoice } = useTranslation()
const { history, addRecord, clearHistory } = useHistory()

// 监听语音识别结果并触发翻译
watch([currentText, interimText], async ([newText, newInterimText]) => {
  // 优先处理最终结果
  if (newText.trim()) {
    const result = await translateVoice(newText)
    if (result && result !== '翻译失败，请重试') {
      addRecord(newText, result)
    }
  } 
  // 处理临时结果
  else if (newInterimText.trim()) {
    await translateVoice(newInterimText)
  }
})

// 录音控制
const toggleRecording = () => {
  if (isRecording.value) {
    stopRecording()
  } else {
    startRecording()
  }
}

// 清空历史记录确认
const confirmClearHistory = () => {
  ElMessageBox.confirm(
    '确定要清空所有历史记录吗？此操作不可恢复。',
    '警告',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    }
  ).then(() => {
    clearHistory()
  }).catch(() => {})
}

// 格式化时间戳
const formatTime = (timestamp: number) => {
  const date = new Date(timestamp)
  return date.toLocaleString('zh-CN', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  })
}

// 手动翻译相关
const { translatedText: manualTranslatedText, isTranslating: isManualTranslating, translate: translateManual } = useTranslation()
const manualInput = ref('')

// 手动翻译
const handleManualTranslate = async () => {
  if (!manualInput.value.trim()) return
  
  const result = await translateManual(manualInput.value)
  if (result && result !== '翻译失败，请重试') {
    addRecord(manualInput.value, result)
    manualInput.value = '' // 清空输入框
  }
}
</script>

<template>
  <div class="app-container">
    <el-config-provider>
      <el-container class="main-container">
        <el-header height="80px">
          <div class="header-content">
            <h1 class="app-title">实时翻译助手</h1>
            <div class="controls">
              <el-button 
                type="primary" 
                :icon="Microphone" 
                @click="toggleRecording"
                :class="{ 'recording': isRecording }"
                size="large"
                class="control-button"
              >
                {{ isRecording ? '停止录音' : '开始录音' }}
              </el-button>
              <el-button 
                type="info" 
                :icon="Setting" 
                @click="showSettings = true"
                size="large"
                class="control-button"
              >
                设置
              </el-button>
              <el-button 
                type="danger" 
                :icon="Delete" 
                @click="confirmClearHistory"
                size="large"
                class="control-button"
              >
                清空历史
              </el-button>
            </div>
          </div>
        </el-header>
        
        <el-main>
          <!-- 语音翻译区域 -->
          <div class="translation-container" :style="{ fontSize: fontSize + 'px' }">
            <div class="text-panel original-text">
              <div class="panel-header">
                <el-icon><Document /></el-icon>
                <h3>语音原文</h3>
              </div>
              <div class="text-content" v-loading="isRecording">
                <el-scrollbar height="100%">
                  <transition name="fade">
                    <div v-if="currentText || interimText" class="text">
                      <p>{{ currentText }}</p>
                      <p v-if="interimText" class="interim">{{ interimText }}</p>
                    </div>
                    <p v-else class="placeholder">等待语音输入...</p>
                  </transition>
                </el-scrollbar>
              </div>
            </div>
            <div class="text-panel translated-text">
              <div class="panel-header">
                <el-icon><Reading /></el-icon>
                <h3>语音译文</h3>
              </div>
              <div class="text-content" v-loading="isVoiceTranslating">
                <el-scrollbar height="100%">
                  <transition name="fade">
                    <p v-if="voiceTranslatedText" class="text">{{ voiceTranslatedText }}</p>
                    <p v-else class="placeholder">等待翻译...</p>
                  </transition>
                </el-scrollbar>
              </div>
            </div>
          </div>

          <!-- 手动翻译区域 -->
          <div class="manual-section">
            <div class="manual-input-container">
              <div class="manual-header">
                <el-icon><Edit /></el-icon>
                <h3>手动输入翻译</h3>
              </div>
              <div class="manual-content">
                <el-input
                  v-model="manualInput"
                  placeholder="输入需要翻译的英文内容"
                  :suffix-icon="Edit"
                  clearable
                  @keyup.enter="handleManualTranslate"
                >
                  <template #append>
                    <el-button 
                      type="primary" 
                      @click="handleManualTranslate"
                      :loading="isManualTranslating"
                    >
                      翻译
                    </el-button>
                  </template>
                </el-input>
              </div>
            </div>

            <div class="manual-result-container" v-show="manualTranslatedText">
              <div class="panel-header">
                <el-icon><Reading /></el-icon>
                <h3>翻译结果</h3>
              </div>
              <div class="manual-result-content" v-loading="isManualTranslating">
                <p class="text">{{ manualTranslatedText }}</p>
              </div>
            </div>
          </div>
        </el-main>

        <el-footer height="auto">
          <!-- 历史记录区域 -->
          <div class="history-container">
            <div class="history-header">
              <el-icon><Timer /></el-icon>
              <h3>历史记录</h3>
            </div>
            <el-scrollbar height="150px">
              <transition-group name="list" tag="div" class="history-list">
                <div v-for="(item, index) in history" 
                     :key="item.timestamp" 
                     class="history-item"
                     :style="{ animationDelay: index * 0.1 + 's' }"
                >
                  <div class="history-item-header">
                    <span class="timestamp">{{ formatTime(item.timestamp) }}</span>
                  </div>
                  <p class="original">{{ item.original }}</p>
                  <p class="translated">{{ item.translated }}</p>
                </div>
              </transition-group>
            </el-scrollbar>
          </div>
        </el-footer>
      </el-container>

      <!-- 设置对话框 -->
      <el-dialog v-model="showSettings" title="设置" width="400px" align-center>
        <div class="settings-content">
          <el-form label-position="top">
            <el-form-item label="字体大小">
              <div class="font-size-preview" :style="{ fontSize: fontSize + 'px' }">
                预览文本大小
              </div>
              <el-slider 
                v-model="fontSize" 
                :min="12" 
                :max="32" 
                :step="2"
                show-input
              />
            </el-form-item>
          </el-form>
        </div>
      </el-dialog>
    </el-config-provider>
  </div>
</template>

<style scoped>
.app-container {
  height: 100vh;
  width: 100vw;
  background-color: #f5f7fa;
}

.main-container {
  height: 100%;
  max-width: 1200px;
  margin: 0 auto;
  background-color: #fff;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 100%;
  padding: 0 20px;
}

.app-title {
  font-size: 24px;
  color: #303133;
  margin: 0;
}

.controls {
  display: flex;
  gap: 12px;
}

.control-button {
  min-width: 120px;
}

.recording {
  animation: pulse 1.5s infinite;
  background-color: #f56c6c;
}

@keyframes pulse {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
  100% {
    transform: scale(1);
  }
}

.translation-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
  padding: 20px;
  height: auto;
  min-height: 300px;
}

.text-panel {
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.panel-header {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 16px;
  background-color: #f5f7fa;
  border-bottom: 1px solid #e4e7ed;
}

.panel-header h3 {
  margin: 0;
  font-size: 16px;
  color: #303133;
}

.text-content {
  flex: 1;
  padding: 20px;
  background-color: #fff;
  position: relative;
  height: calc(100vh - 400px);
  min-height: 300px;
}

.text {
  margin: 0;
  line-height: 1.6;
  white-space: pre-wrap;
  padding: 0 10px;
}

.placeholder {
  color: #909399;
  font-style: italic;
  padding: 0 10px;
}

.history-container {
  padding: 20px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 -2px 12px 0 rgba(0, 0, 0, 0.1);
}

.history-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 16px;
}

.history-header h3 {
  margin: 0;
  font-size: 16px;
  color: #303133;
}

.history-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.history-item {
  padding: 12px;
  border-radius: 6px;
  background-color: #f5f7fa;
  transition: all 0.3s ease;
  animation: slideIn 0.3s ease-out forwards;
}

.history-item:hover {
  transform: translateX(4px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateX(-20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.history-item-header {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 8px;
}

.timestamp {
  font-size: 12px;
  color: #909399;
}

.history-item .original {
  margin: 0 0 8px 0;
  color: #606266;
}

.history-item .translated {
  margin: 0;
  color: #409eff;
  font-weight: 500;
}

.font-size-preview {
  margin-bottom: 16px;
  padding: 12px;
  background-color: #f5f7fa;
  border-radius: 4px;
  text-align: center;
  color: #606266;
}

/* 过渡动画 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.list-enter-active,
.list-leave-active {
  transition: all 0.3s ease;
}

.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateX(-20px);
}

:deep(.el-header) {
  background-color: #fff;
  border-bottom: 1px solid #dcdfe6;
  padding: 0;
}

:deep(.el-footer) {
  height: auto !important;
  padding: 0;
  background-color: #f5f7fa;
}

:deep(.el-main) {
  padding: 20px;
  overflow-y: auto;
}

.manual-section {
  margin-top: 24px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.manual-input-container {
  padding: 20px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.manual-result-container {
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.manual-result-content {
  padding: 20px;
  min-height: 60px;
  background-color: #fff;
}

.manual-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 16px;
}

.manual-header h3 {
  margin: 0;
  font-size: 16px;
  color: #303133;
}

.manual-content {
  display: flex;
  gap: 12px;
}

:deep(.el-input-group__append) {
  padding: 0;
}

:deep(.el-input-group__append button) {
  border: none;
  margin: 0;
  height: 100%;
  padding: 0 20px;
}

.interim {
  color: #909399;
  font-style: italic;
  margin-top: 8px;
}
</style>
