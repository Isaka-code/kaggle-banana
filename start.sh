#!/bin/bash

echo "🎭 Starting Emoji Profile Maker Application..."

# Check if GEMINI_API_KEY is set
if [ -z "$GEMINI_API_KEY" ]; then
    echo "❌ Error: GEMINI_API_KEY environment variable is not set"
    echo "Please set your Gemini API key:"
    echo "export GEMINI_API_KEY='your_api_key_here'"
    exit 1
fi

echo "✅ GEMINI_API_KEY is set"

# Function to kill background processes on exit
cleanup() {
    echo ""
    echo "🛑 Shutting down application..."
    kill $BACKEND_PID 2>/dev/null
    kill $FRONTEND_PID 2>/dev/null
    wait
    echo "👋 Application stopped"
    exit 0
}

# Set up signal handlers
trap cleanup SIGINT SIGTERM

# Install backend dependencies
echo "📦 Installing backend dependencies..."
cd backend
if [ ! -d "venv" ]; then
    echo "🐍 Creating virtual environment..."
    python -m venv venv
fi

# Activate virtual environment
source venv/Scripts/activate 2>/dev/null || source venv/bin/activate

pip install -r requirements.txt

# Start backend
echo "🚀 Starting backend server..."
python main.py &
BACKEND_PID=$!

# Wait for backend to start
sleep 3

# Install frontend dependencies
echo "📦 Installing frontend dependencies..."
cd ../frontend
npm install

# Start frontend
echo "🌐 Starting frontend server..."
npm start &
FRONTEND_PID=$!

echo "✨ Application is starting up..."
echo "🌐 Frontend: http://localhost:3000"
echo "🔧 Backend API: http://localhost:8000"
echo ""
echo "Press Ctrl+C to stop the application"

# Wait for both processes
wait