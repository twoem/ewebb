#!/bin/bash

# Start script for Render.com

# Start backend in background
echo "Starting backend server..."
cd backend
python server.py &
BACKEND_PID=$!

# Start frontend
echo "Starting frontend server..."
cd ../frontend
yarn start &
FRONTEND_PID=$!

# Wait for both processes
wait $BACKEND_PID $FRONTEND_PID