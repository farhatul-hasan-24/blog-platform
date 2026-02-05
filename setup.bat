@echo off
REM Blog Platform - Development Setup Script for Windows

echo 🚀 Setting up Blog Platform...

REM Check if Node.js is installed
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Node.js is not installed. Please install Node.js first.
    exit /b 1
)

REM Check if MongoDB is installed
where mongod >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ⚠️  MongoDB not found. Please install MongoDB.
)

echo 📦 Installing Backend Dependencies...
cd backend
call npm install
if %ERRORLEVEL% EQU 0 (
    echo ✅ Backend dependencies installed
) else (
    echo ❌ Failed to install backend dependencies
    exit /b 1
)

REM Create .env if it doesn't exist
if not exist .env (
    echo 📝 Creating backend .env file...
    copy .env.example .env
    echo ✅ Created .env - Please update with your settings
)

cd ..

echo 📦 Installing Frontend Dependencies...
cd frontend
call npm install
if %ERRORLEVEL% EQU 0 (
    echo ✅ Frontend dependencies installed
) else (
    echo ❌ Failed to install frontend dependencies
    exit /b 1
)

REM Create .env if it doesn't exist
if not exist .env (
    echo 📝 Creating frontend .env file...
    copy .env.example .env
    echo ✅ Created .env
)

cd ..

echo.
echo ✨ Setup Complete!
echo.
echo 📋 Next Steps:
echo 1. Make sure MongoDB is running
echo 2. Update backend\.env with your settings (especially JWT_SECRET)
echo 3. Start the backend: cd backend ^&^& npm start
echo 4. Start the frontend: cd frontend ^&^& npm start
echo.
echo 🎉 Happy coding!
pause
