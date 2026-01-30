#!/bin/bash

# Quick start script for Global Radio Platform - Phase 1 MVP

set -e

echo "🚀 Starting Global Radio Platform - Phase 1 MVP"
echo "================================================"
echo ""

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker first."
    exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker compose &> /dev/null && ! docker compose version &> /dev/null; then
    echo "❌ Docker Compose is not installed. Please install Docker Compose first."
    exit 1
fi

# Start database services
echo "📦 Starting PostgreSQL and Redis..."
docker compose -f docker-compose.db.yml up -d

# Wait for services to be healthy
echo "⏳ Waiting for databases to be ready..."
sleep 10

# Check if backend dependencies are installed
if [ ! -d "backend/node_modules" ]; then
    echo "📦 Installing backend dependencies..."
    cd backend && bun install && cd ..
fi

# Check if frontend dependencies are installed
if [ ! -d "frontend/node_modules" ]; then
    echo "📦 Installing frontend dependencies..."
    cd frontend && bun install && cd ..
fi

# Create .env files if they don't exist
if [ ! -f "backend/.env" ]; then
    echo "📝 Creating backend .env file..."
    cp backend/.env.example backend/.env
fi

if [ ! -f "frontend/.env" ]; then
    echo "📝 Creating frontend .env file..."
    cp frontend/.env.example frontend/.env
fi

echo ""
echo "✅ Setup complete!"
echo ""
echo "To start the application:"
echo "1. Backend: cd backend && bun run start:dev"
echo "2. Frontend: cd frontend && bun run dev"
echo ""
echo "Then open http://localhost:5173 in your browser"
echo ""
echo "API will be available at http://localhost:3000/api/v1"
echo ""
