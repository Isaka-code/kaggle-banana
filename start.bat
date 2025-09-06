@echo off
echo 🎭 Starting Emoji Profile Maker Application...

REM Check if GEMINI_API_KEY is set
if "%GEMINI_API_KEY%"=="" (
    echo ❌ Error: GEMINI_API_KEY environment variable is not set
    echo Please set your Gemini API key:
    echo set GEMINI_API_KEY=your_api_key_here
    pause
    exit /b 1
)

echo ✅ GEMINI_API_KEY is set

REM Install backend dependencies
echo 📦 Installing backend dependencies...
cd backend
if not exist "venv" (
    echo 🐍 Creating virtual environment...
    python -m venv venv
)

REM Activate virtual environment
call venv\Scripts\activate.bat

pip install -r requirements.txt

REM Start backend
echo 🚀 Starting backend server...
start "Backend Server" cmd /c "python main.py"

REM Wait for backend to start
timeout /t 3 /nobreak

REM Install frontend dependencies
echo 📦 Installing frontend dependencies...
cd ..\frontend
call npm install

REM Start frontend
echo 🌐 Starting frontend server...
start "Frontend Server" cmd /c "npm start"

echo ✨ Application is starting up...
echo 🌐 Frontend: http://localhost:3000
echo 🔧 Backend API: http://localhost:8000
echo.
echo Press any key to stop the application...
pause

REM Kill processes (Note: This is a simplified version)
taskkill /f /im python.exe 2>nul
taskkill /f /im node.exe 2>nul
echo 👋 Application stopped