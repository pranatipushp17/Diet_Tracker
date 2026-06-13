# NutriTrack 🥗
## 🌐 Live Demo

https://diet-tracker-virid.vercel.app/
## 📌 About

A full-stack diet tracking web app that helps users log meals, track calories & macros, and analyze nutrition using AI.
## ✨ Features

JWT Authentication (Register/Login)
Food search with Indian food database (50+ items)
AI-powered meal analysis using Groq LLaMA
BMI, TDEE & BMR Calculator
Daily calorie & macro tracking with charts
Water intake tracker
Meal history with calendar view

## 🛠️ Tech Stack

Frontend: React, Vite, Recharts, Axios
Backend: Node.js, Express.js
Database: MongoDB Atlas
Auth: JWT + bcryptjs
AI: Groq API (LLaMA 4 Scout)
Deployment: Vercel (frontend) + Render (backend)

## 🚀 Getting Started
# Clone repo
git clone https://github.com/pranatipushp17/Diet_Tracker

# Backend
cd server
npm install
npm run dev

# Frontend
cd client
npm install
npm run dev


## 🔑 Environment Variables
PORT=5000
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_secret
GROQ_API_KEY=your_groq_key
