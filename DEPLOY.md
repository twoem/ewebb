# EWEBB Cyber Café - Render.com Deployment Guide

## Quick Deploy to Render.com

### Option 1: Using render.yaml (Recommended)
1. Connect your GitHub repository to Render.com
2. The `render.yaml` file will automatically configure both frontend and backend services
3. Environment variables are pre-configured in the YAML file

### Option 2: Manual Service Setup

#### Backend Service
1. Create a new Web Service on Render.com
2. Connect your GitHub repository
3. Configure:
   - **Build Command**: `pip install -r backend/requirements.txt`
   - **Start Command**: `cd backend && python server.py`
   - **Environment Variables**:
     ```
     ADMIN_PASSWORD=$2b$12$DoAAIgvwk9.MSAYnYV5fQeCSbk9aHgZz2Ff5pbgiU0uNsqXjjgSLO
     ADMIN_USERNAME=Babuu
     APP_PASSWORD=vlgi tciy zwuu jxrp
     EMAIL_ADDRESS=jaysimburun@gmail.com
     MONGO_URL=Bb
     SECRET_KEY=Secret1
     ```

#### Frontend Service
1. Create a new Web Service on Render.com
2. Connect your GitHub repository
3. Configure:
   - **Build Command**: `cd frontend && yarn install && yarn build`
   - **Start Command**: `cd frontend && yarn start`
   - **Environment Variables**:
     ```
     REACT_APP_BACKEND_URL=https://your-backend-service-name.onrender.com
     ```

### Important Notes
- Replace `your-backend-service-name` with your actual backend service name on Render
- The admin credentials are: Username: `Babuu`, Password: `Pass@2025`
- Make sure to update the `REACT_APP_BACKEND_URL` in the frontend service to point to your deployed backend service

### Features Included
✅ Admin authentication (fixed hashed password handling)
✅ Contact form with email notifications
✅ Document upload/management system
✅ Professional responsive UI
✅ MongoDB integration ready
✅ CORS configured for cross-origin requests
✅ JWT-based authentication

### Test Credentials
- **Username**: Babuu
- **Password**: Pass@2025

### API Endpoints
- Health Check: `GET /api/health`
- Admin Login: `POST /api/admin/login`
- Contact Form: `POST /api/contact`
- Admin Dashboard: Protected routes under `/api/admin/*`

## Local Development
```bash
# Install dependencies
cd backend && pip install -r requirements.txt
cd ../frontend && yarn install

# Start backend (terminal 1)
cd backend && python server.py

# Start frontend (terminal 2)
cd frontend && yarn start
```

Backend runs on: http://localhost:8001
Frontend runs on: http://localhost:3000