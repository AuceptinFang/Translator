# 实时翻译助手

这是一个基于 Vue 3 + TypeScript 开发的实时语音翻译工具，专门用于课堂同声传译。它可以将英语语音实时转换为文字，并自动翻译成中文。

## 功能特点

- 🎤 实时语音识别（英语）
- 🔄 即时英译中翻译
- 📝 自动保存翻译历史
- 🎯 支持调整显示字体大小
- 💾 本地存储历史记录
- 🌈 简洁现代的界面设计

## 使用前准备

1. 确保你使用的是最新版本的 Chrome 浏览器（推荐，支持语音识别）
2. 注册 Azure 账号并创建翻译服务
3. 获取 Azure 翻译服务的 API 密钥和区域信息

## 安装步骤

1. 克隆项目并安装依赖：
```bash
git clone [项目地址]
cd real-time-translation
npm install
```

2. 配置环境变量：
   - 复制 `.env.example` 文件并重命名为 `.env`
   - 在 `.env` 文件中填入你的 Azure 翻译服务密钥和区域：
```bash
VITE_AZURE_API_KEY=your_api_key_here
VITE_AZURE_REGION=your_region_here
```

3. 启动开发服务器：
```bash
npm run dev
```

## 使用说明

1. 打开应用后，点击"开始录音"按钮开始识别
2. 说话时会实时显示识别的英文内容
3. 识别的文本会自动翻译成中文
4. 翻译结果会自动保存到历史记录
5. 可以通过设置按钮调整字体大小
6. 可以通过清空按钮删除历史记录

## 注意事项

- 请确保麦克风正常工作并已授权网页使用
- 保持网络连接稳定以确保翻译服务正常
- 建议在安静的环境中使用，以提高识别准确率
- 历史记录保存在浏览器本地存储中，清除浏览器数据会导致记录丢失

## 技术栈

- Vue 3
- TypeScript
- Element Plus
- Web Speech API
- Azure Translator API

## 浏览器支持

- Chrome（推荐）
- Edge
- Safari（部分功能可能受限）
- Firefox（部分功能可能受限）

## 许可证

MIT
