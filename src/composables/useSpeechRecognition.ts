import { ref } from 'vue'

interface IWindow extends Window {
  webkitSpeechRecognition: any;
}

interface SpeechRecognitionResult {
  isFinal: boolean;
  [key: number]: {
    transcript: string;
  };
}

interface SpeechRecognitionResults {
  resultIndex: number;
  results: {
    [key: number]: SpeechRecognitionResult;
    length: number;
  };
}

type SpeechRecognitionEvent = {
  resultIndex: number;
  results: SpeechRecognitionResults['results'];
}

type SpeechRecognitionErrorEvent = {
  error: string;
}

export function useSpeechRecognition() {
  const isRecording = ref(false)
  const currentText = ref('')
  const interimText = ref('') // 用于存储临时识别结果
  let recognition: any = null
  let autoRestartTimeout: number | null = null

  // 初始化语音识别
  const initRecognition = () => {
    if (!('webkitSpeechRecognition' in window)) {
      alert('您的浏览器不支持语音识别功能')
      return false
    }

    recognition = new ((window as unknown as IWindow).webkitSpeechRecognition)()
    recognition.continuous = true
    recognition.interimResults = true
    recognition.lang = 'en-US'

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      let finalTranscript = ''
      let interimTranscript = ''

      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript
        } else {
          interimTranscript += event.results[i][0].transcript
        }
      }

      // 更新临时识别结果
      if (interimTranscript) {
        interimText.value = interimTranscript
      }

      // 当有最终结果时，追加到当前文本并清空临时结果
      if (finalTranscript) {
        currentText.value += (currentText.value ? ' ' : '') + finalTranscript
        interimText.value = ''
      }
    }

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      console.error('语音识别错误:', event.error)
      if (event.error === 'no-speech') {
        // 如果是因为没有检测到语音而停止，则自动重启
        restartRecording()
      } else {
        stopRecording()
      }
    }

    recognition.onend = () => {
      // 如果仍处于录音状态，说明是意外结束，需要重启
      if (isRecording.value) {
        restartRecording()
      }
    }

    return true
  }

  // 重启录音
  const restartRecording = () => {
    if (!isRecording.value) return

    // 清除之前的超时计时器
    if (autoRestartTimeout) {
      window.clearTimeout(autoRestartTimeout)
      autoRestartTimeout = null
    }

    // 设置一个短暂的延迟后重启录音
    autoRestartTimeout = window.setTimeout(() => {
      if (isRecording.value) {
        recognition?.start()
      }
    }, 100)
  }

  // 开始录音
  const startRecording = () => {
    if (!recognition && !initRecognition()) {
      return
    }
    
    currentText.value = '' // 清空之前的内容
    interimText.value = ''
    recognition?.start()
    isRecording.value = true
  }

  // 停止录音
  const stopRecording = () => {
    // 清除自动重启的计时器
    if (autoRestartTimeout) {
      window.clearTimeout(autoRestartTimeout)
      autoRestartTimeout = null
    }

    recognition?.stop()
    isRecording.value = false
    interimText.value = '' // 清空临时结果
  }

  return {
    isRecording,
    currentText,
    interimText,
    startRecording,
    stopRecording
  }
} 