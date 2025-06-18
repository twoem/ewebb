#!/bin/bash

# Build script for Render.com

echo "Installing backend dependencies..."
cd backend
pip install -r requirements.txt
cd ..

echo "Installing frontend dependencies..."
cd frontend
yarn install
yarn build
cd ..

echo "Build completed successfully!"