# Database Setup

## Option 1: Neon PostgreSQL (Recommended - Cloud Database)

Neon is a serverless PostgreSQL service. No local installation needed!

### Setup Steps:

1. **Create a Neon account:**
   - Go to https://neon.tech
   - Sign up for a free account
   - Create a new project

2. **Get your connection string:**
   - In Neon dashboard, go to your project
   - Click "Connection Details"
   - Copy the connection string (format: `postgresql://user:password@host/database?sslmode=require`)

3. **Add to backend/.env:**
   ```env
   DATABASE_URL=postgresql://user:password@ep-xxx-xxx.region.aws.neon.tech/neondb?sslmode=require
   ```

4. **Run schema using Neon connection:**
   ```bash
   # Using psql with connection string
   psql "postgresql://user:password@ep-xxx-xxx.region.aws.neon.tech/neondb?sslmode=require" -f schema.sql
   
   # Or using Neon's SQL Editor:
   # - Go to Neon dashboard
   # - Open SQL Editor
   # - Copy and paste contents of schema.sql
   # - Run the query
   ```

5. **Verify tables:**
   ```bash
   psql "your_connection_string" -c "\dt"
   ```

## Option 2: Local PostgreSQL

If you prefer local PostgreSQL:

1. **Create Database:**
   ```bash
   psql -U postgres
   CREATE DATABASE finance_db;
   \q
   ```

2. **Run Schema:**
   ```bash
   psql -U postgres -d finance_db -f schema.sql
   ```

3. **Configure backend/.env:**
   ```env
   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=finance_db
   DB_USER=postgres
   DB_PASSWORD=your_password
   ```

## Database Schema

The database includes the following tables:
- `users` - User accounts and authentication
- `transactions` - Income and expense records
- `savings` - Savings account information
- `debts` - Debt tracking
- `goals` - Financial goals
- `risk_assessments` - Risk tolerance assessments
- `portfolio_allocations` - Recommended asset allocations
- `simulation_results` - Monte Carlo simulation results
- `risk_alerts` - Risk warnings and alerts
