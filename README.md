# 🎭 Emoji Profile Maker

Transform your profile images with emoji-inspired moods! This application uses Google's Gemini AI to convert your photos to match the emotional expression of your chosen emoji.

## ✨ Features

1. **Upload Your Image** - Select any profile photo from your device
2. **Choose Your Mood** - Pick from 4 emoji expressions: 😄 😠 😭 🥳
3. **AI Transformation** - Watch as your image is converted to match the emoji's mood
4. **Download Result** - Save your transformed profile image

## 🏗 Architecture

- **Frontend**: React.js with modern UI components
- **Backend**: FastAPI with Google Gemini AI integration
- **AI Model**: Gemini 2.5 Flash Image Preview

## 🚀 Quick Start

### Prerequisites

- Python 3.8+
- Node.js 16+
- Gemini API Key from Google AI Studio

### Setup

1. **Get your Gemini API Key**
   - Visit [Google AI Studio](https://aistudio.google.com/)
   - Create an API key
   - Set the environment variable:

   **Windows:**
   ```cmd
   set GEMINI_API_KEY=your_api_key_here
   ```

   **macOS/Linux:**
   ```bash
   export GEMINI_API_KEY=your_api_key_here
   ```

2. **Run the Application**

   **Windows:**
   ```cmd
   start.bat
   ```

   **macOS/Linux:**
   ```bash
   chmod +x start.sh
   ./start.sh
   ```

3. **Access the App**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8000

## 📁 Project Structure

```
kaggle-banana/
├── backend/
│   ├── main.py              # FastAPI application
│   └── requirements.txt     # Python dependencies
├── frontend/
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── App.js          # Main React component
│   │   ├── App.css         # Styling
│   │   ├── index.js        # React entry point
│   │   └── index.css       # Global styles
│   └── package.json        # Node.js dependencies
├── start.sh                # Launch script (Unix)
├── start.bat               # Launch script (Windows)
└── README.md               # This file
```
