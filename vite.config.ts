import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src')
    }
  },
  base: './',  // 确保资源路径正确
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    // 确保生成 sourcemap
    sourcemap: true,
    // 配置构建选项
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor': ['vue', '@vueuse/core', 'element-plus']
        }
      }
    }
  }
})
