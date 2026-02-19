# AI-Driven Financial Decision Intelligence System

An enterprise-level financial analysis platform that provides personalized financial insights, risk assessment, and investment recommendations using AI and machine learning.

## 🏗️ Project Structure

```
finance/
├── frontend/          # Next.js frontend application
├── backend/           # Node.js/Express API server
├── ml-service/        # Python ML service for predictions
├── database/          # Database schemas and migrations
└── docs/              # Documentation
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- Python 3.9+
- Neon PostgreSQL (recommended) OR Local PostgreSQL 14+

### Installation

See [SETUP.md](./SETUP.md) for detailed setup instructions.

**Quick Setup:**

1. **Set up Database:**
   
   **Option A: Neon PostgreSQL (Recommended - No Local Installation)**
   - Sign up at https://neon.tech
   - Create a project and get your connection string
   - Run schema using Neon SQL Editor or: `psql "your_connection_string" -f database/schema.sql`
   
   **Option B: Local PostgreSQL**
   ```bash
   psql -U postgres
   CREATE DATABASE finance_db;
   \q
   psql -U postgres -d finance_db -f database/schema.sql
   ```

2. **Install all dependencies:**
   ```bash
   npm run install:all
   cd ml-service
   python -m venv venv
   source venv/bin/activate  # Windows: venv\Scripts\activate
   pip install -r requirements.txt
   cd ..
   ```

3. **Set up environment variables:**
   - Copy `.env.example` files in each service directory to `.env` (or `.env.local` for frontend)
   - **For Neon:** Add `DATABASE_URL` with your Neon connection string
   - **For Local:** Set database credentials (`DB_HOST`, `DB_USER`, `DB_PASSWORD`, etc.)

4. **Start all services:**
   ```bash
   # Terminal 1: Backend
   cd backend && npm run dev
   
   # Terminal 2: ML Service
   cd ml-service && python app.py
   
   # Terminal 3: Frontend
   cd frontend && npm run dev
   ```

   Or use the convenience script:
   ```bash
   npm run dev:all  # Starts backend and frontend (ML service needs separate terminal)
   ```

   Services run on:
   - Frontend: http://localhost:3000
   - Backend: http://localhost:5000
   - ML Service: http://localhost:8000

## 🛠️ Tech Stack

### Frontend
- Next.js 14
- Tailwind CSS
- Recharts
- JWT Authentication

### Backend
- Node.js
- Express.js
- PostgreSQL
- JWT & bcrypt

### ML Service
- Python 3.9+
- FastAPI
- Scikit-learn
- NumPy, Pandas
- SciPy
- Joblib

## 📊 Features

- ✅ Financial Health Score
- ✅ Risk Tolerance Assessment
- ✅ Financial Stress Prediction
- ✅ Monte Carlo Portfolio Simulation
- ✅ Asset Allocation Recommendations
- ✅ Behavioral Bias Detection
- ✅ Emergency Fund Analyzer
- ✅ What-If Scenario Simulator
- ✅ Goal Optimization Engine
- ✅ Portfolio Stress Testing
- ✅ Risk Alert System

## 🔐 Security

- JWT-based authentication
- Password hashing with bcrypt
- Input validation
- SQL injection prevention
- HTTPS encryption (production)

## 📝 Environment Variables

See `.env.example` files in each service directory for required environment variables.

## 📄 License

MIT
