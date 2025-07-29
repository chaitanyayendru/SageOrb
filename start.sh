#!/bin/bash

# SageOrb Startup Script
# This script sets up and starts the SageOrb application

set -e

echo "🚀 Starting SageOrb - Advanced Liquidity Optimization Platform"
echo "================================================================"

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker and try again."
    exit 1
fi

# Check if Docker Compose is available
if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose is not installed. Please install Docker Compose and try again."
    exit 1
fi

echo "✅ Docker and Docker Compose are available"

# Create necessary directories
echo "📁 Creating necessary directories..."
mkdir -p backend/uploads
mkdir -p logs

# Set environment variables
export COMPOSE_PROJECT_NAME=sageorb
export FLASK_ENV=development

echo "🔧 Setting up environment..."

# Build and start services
echo "🏗️  Building and starting services..."
docker-compose down --remove-orphans
docker-compose build --no-cache
docker-compose up -d

echo "⏳ Waiting for services to be ready..."

# Wait for backend to be ready
echo "🔍 Checking backend health..."
for i in {1..30}; do
    if curl -f http://localhost:5000/health > /dev/null 2>&1; then
        echo "✅ Backend is ready!"
        break
    fi
    if [ $i -eq 30 ]; then
        echo "❌ Backend failed to start within 30 seconds"
        docker-compose logs backend
        exit 1
    fi
    echo "⏳ Waiting for backend... ($i/30)"
    sleep 2
done

# Wait for frontend to be ready
echo "🔍 Checking frontend health..."
for i in {1..30}; do
    if curl -f http://localhost:3000 > /dev/null 2>&1; then
        echo "✅ Frontend is ready!"
        break
    fi
    if [ $i -eq 30 ]; then
        echo "❌ Frontend failed to start within 30 seconds"
        docker-compose logs frontend
        exit 1
    fi
    echo "⏳ Waiting for frontend... ($i/30)"
    sleep 2
done

# Check database connection
echo "🔍 Checking database connection..."
for i in {1..10}; do
    if docker-compose exec -T postgres pg_isready -U postgres > /dev/null 2>&1; then
        echo "✅ Database is ready!"
        break
    fi
    if [ $i -eq 10 ]; then
        echo "❌ Database failed to start within 10 seconds"
        docker-compose logs postgres
        exit 1
    fi
    echo "⏳ Waiting for database... ($i/10)"
    sleep 1
done

# Check Redis connection
echo "🔍 Checking Redis connection..."
for i in {1..10}; do
    if docker-compose exec -T redis redis-cli ping > /dev/null 2>&1; then
        echo "✅ Redis is ready!"
        break
    fi
    if [ $i -eq 10 ]; then
        echo "❌ Redis failed to start within 10 seconds"
        docker-compose logs redis
        exit 1
    fi
    echo "⏳ Waiting for Redis... ($i/10)"
    sleep 1
done

echo ""
echo "🎉 SageOrb is now running!"
echo "================================================================"
echo "📊 Frontend: http://localhost:3000"
echo "🔧 Backend API: http://localhost:5000"
echo "🗄️  Database: localhost:5432"
echo "⚡ Redis: localhost:6379"
echo ""
echo "📚 API Documentation: http://localhost:5000/docs"
echo "🏥 Health Check: http://localhost:5000/health"
echo ""
echo "🛑 To stop the application, run: docker-compose down"
echo "📋 To view logs, run: docker-compose logs -f"
echo "================================================================"

# Show service status
echo ""
echo "📊 Service Status:"
docker-compose ps

echo ""
echo "🚀 Happy analyzing! 🚀" 