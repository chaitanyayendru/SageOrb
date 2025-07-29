@echo off
setlocal enabledelayedexpansion

echo 🚀 Starting SageOrb - Advanced Liquidity Optimization Platform
echo ================================================================

REM Check if Docker is running
docker info >nul 2>&1
if errorlevel 1 (
    echo ❌ Docker is not running. Please start Docker and try again.
    pause
    exit /b 1
)

REM Check if Docker Compose is available
docker-compose --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Docker Compose is not installed. Please install Docker Compose and try again.
    pause
    exit /b 1
)

echo ✅ Docker and Docker Compose are available

REM Create necessary directories
echo 📁 Creating necessary directories...
if not exist "backend\uploads" mkdir "backend\uploads"
if not exist "logs" mkdir "logs"

REM Set environment variables
set COMPOSE_PROJECT_NAME=sageorb
set FLASK_ENV=development

echo 🔧 Setting up environment...

REM Build and start services
echo 🏗️  Building and starting services...
docker-compose down --remove-orphans
docker-compose build --no-cache
docker-compose up -d

echo ⏳ Waiting for services to be ready...

REM Wait for backend to be ready
echo 🔍 Checking backend health...
for /l %%i in (1,1,30) do (
    curl -f http://localhost:5000/health >nul 2>&1
    if not errorlevel 1 (
        echo ✅ Backend is ready!
        goto :backend_ready
    )
    if %%i==30 (
        echo ❌ Backend failed to start within 30 seconds
        docker-compose logs backend
        pause
        exit /b 1
    )
    echo ⏳ Waiting for backend... (%%i/30)
    timeout /t 2 /nobreak >nul
)
:backend_ready

REM Wait for frontend to be ready
echo 🔍 Checking frontend health...
for /l %%i in (1,1,30) do (
    curl -f http://localhost:3000 >nul 2>&1
    if not errorlevel 1 (
        echo ✅ Frontend is ready!
        goto :frontend_ready
    )
    if %%i==30 (
        echo ❌ Frontend failed to start within 30 seconds
        docker-compose logs frontend
        pause
        exit /b 1
    )
    echo ⏳ Waiting for frontend... (%%i/30)
    timeout /t 2 /nobreak >nul
)
:frontend_ready

REM Check database connection
echo 🔍 Checking database connection...
for /l %%i in (1,1,10) do (
    docker-compose exec -T postgres pg_isready -U postgres >nul 2>&1
    if not errorlevel 1 (
        echo ✅ Database is ready!
        goto :db_ready
    )
    if %%i==10 (
        echo ❌ Database failed to start within 10 seconds
        docker-compose logs postgres
        pause
        exit /b 1
    )
    echo ⏳ Waiting for database... (%%i/10)
    timeout /t 1 /nobreak >nul
)
:db_ready

REM Check Redis connection
echo 🔍 Checking Redis connection...
for /l %%i in (1,1,10) do (
    docker-compose exec -T redis redis-cli ping >nul 2>&1
    if not errorlevel 1 (
        echo ✅ Redis is ready!
        goto :redis_ready
    )
    if %%i==10 (
        echo ❌ Redis failed to start within 10 seconds
        docker-compose logs redis
        pause
        exit /b 1
    )
    echo ⏳ Waiting for Redis... (%%i/10)
    timeout /t 1 /nobreak >nul
)
:redis_ready

echo.
echo 🎉 SageOrb is now running!
echo ================================================================
echo 📊 Frontend: http://localhost:3000
echo 🔧 Backend API: http://localhost:5000
echo 🗄️  Database: localhost:5432
echo ⚡ Redis: localhost:6379
echo.
echo 📚 API Documentation: http://localhost:5000/docs
echo 🏥 Health Check: http://localhost:5000/health
echo.
echo 🛑 To stop the application, run: docker-compose down
echo 📋 To view logs, run: docker-compose logs -f
echo ================================================================

REM Show service status
echo.
echo 📊 Service Status:
docker-compose ps

echo.
echo 🚀 Happy analyzing! 🚀
echo.
pause 