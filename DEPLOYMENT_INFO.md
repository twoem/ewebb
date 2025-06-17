# EWEBB Cyber Café - Modernized Website

## 🎉 Deployment Ready for Render

This is a completely modernized, full-stack web application for EWEBB Cyber Café with beautiful UI, modern functionality, and comprehensive admin features.

## 🏗️ Architecture

### Backend (FastAPI + MongoDB)
- **Framework**: FastAPI (Python)
- **Database**: MongoDB
- **Port**: 8001
- **Features**: 
  - Contact form with email notifications
  - Admin authentication with JWT
  - Document upload/management
  - RESTful API endpoints

### Frontend (React + Tailwind CSS)
- **Framework**: React 18
- **Styling**: Tailwind CSS with custom animations
- **Port**: 3000
- **Features**:
  - Beautiful loading screen (3-6 seconds)
  - Modern responsive design with bright colors
  - Contact form with validation
  - Admin dashboard
  - Gallery with modal view
  - Services showcase with WhatsApp integration

## 🔧 Environment Variables

### Backend (.env)
```
MONGO_URL=mongodb://localhost:27017
SECRET_KEY=your-super-secret-key-change-this-in-production
ADMIN_USERNAME=admin
ADMIN_PASSWORD=Pass@2025
EMAIL_ADDRESS=ewebbcybercafe@gmail.com
APP_PASSWORD=your-gmail-app-password-here
```

### Frontend (.env)
```
REACT_APP_BACKEND_URL=http://localhost:8001
```

## 🚀 For Render Deployment

1. **Build Command**: 
   ```bash
   cd backend && pip install -r requirements.txt && cd ../frontend && yarn install && yarn build
   ```

2. **Start Command**:
   ```bash
   cd backend && python server.py
   ```

3. **Environment Variables to Set**:
   - `MONGO_URL`: Your MongoDB connection string
   - `EMAIL_ADDRESS`: ewebbcybercafe@gmail.com  
   - `APP_PASSWORD`: Your Gmail app password
   - `SECRET_KEY`: Generate a secure secret key
   - `ADMIN_USERNAME`: admin
   - `ADMIN_PASSWORD`: Pass@2025

## 📧 Email Setup

To enable contact form emails:
1. Go to Google Account settings
2. Enable 2-Factor Authentication
3. Generate an App Password for Gmail
4. Set `APP_PASSWORD` environment variable

## 🔐 Admin Access

- **URL**: `/admin`
- **Username**: `admin`
- **Password**: `Pass@2025`

## 📱 Features Implemented

### ✅ User Features
- Beautiful animated loading screen
- Modern responsive design with bright colors
- Contact form with email notifications
- Services showcase with WhatsApp integration
- Image gallery with modal view
- Document downloads
- Data protection policy

### ✅ Admin Features
- Secure admin login
- Contact message management
- Document upload/management
- Overview dashboard with statistics
- Status tracking for contact messages

## 🎨 Modern UI Features

- Gradient backgrounds and modern color scheme
- Smooth animations and transitions
- Responsive design for all devices
- Modern card layouts and typography
- Interactive elements and hover effects
- Professional loading states

## 🔗 Page Titles

All pages have proper titles as requested:
- "Ewebb | Home"
- "Ewebb | Contact" 
- "Ewebb | Services"
- "Ewebb | Gallery"
- "Ewebb | Downloads"
- "Ewebb | Data Protection"
- "Ewebb | Admin Login"
- "Ewebb | Admin Dashboard"

## 📞 Contact Integration

- **Email**: ewebbcybercafe@gmail.com
- **Phone**: +254 700 644 973
- **WhatsApp**: Integrated throughout the site
- **Location**: Kagwe Town, Blessed Mall Building, Ground Floor

## ✅ Testing Status

- ✅ Backend API endpoints tested and working
- ✅ Contact form submission working
- ✅ Admin authentication working
- ✅ Document management working
- ✅ Email integration configured
- ✅ MongoDB integration working
- ✅ Frontend compiling and serving correctly

The application is fully functional and ready for deployment on Render!