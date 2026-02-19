# Project Structure

```
finance/
├── frontend/                 # Next.js frontend application
│   ├── app/                  # Next.js 14 app directory
│   │   ├── dashboard/       # Dashboard pages
│   │   ├── globals.css      # Global styles
│   │   ├── layout.tsx       # Root layout
│   │   └── page.tsx         # Landing page
│   ├── components/          # React components
│   │   ├── auth/           # Authentication components
│   │   ├── dashboard/      # Dashboard components
│   │   ├── layouts/        # Layout components
│   │   └── providers/      # Context providers
│   ├── hooks/              # Custom React hooks
│   ├── lib/                # Utility libraries
│   ├── .env.example        # Environment variables example
│   ├── next.config.js      # Next.js configuration
│   ├── package.json        # Frontend dependencies
│   └── tailwind.config.js  # Tailwind CSS configuration
│
├── backend/                 # Node.js/Express backend
│   ├── config/             # Configuration files
│   │   └── database.js     # PostgreSQL connection
│   ├── middleware/         # Express middleware
│   │   ├── auth.js        # JWT authentication
│   │   └── errorHandler.js # Error handling
│   ├── routes/             # API routes
│   │   ├── auth.js        # Authentication routes
│   │   └── finance.js     # Financial data routes
│   ├── .env.example        # Environment variables example
│   ├── package.json        # Backend dependencies
│   └── server.js           # Express server entry point
│
├── ml-service/              # Python FastAPI ML service
│   ├── models/             # Saved ML models (auto-generated)
│   ├── .env.example        # Environment variables example
│   ├── app.py              # FastAPI application
│   ├── requirements.txt    # Python dependencies
│   └── README.md           # ML service documentation
│
├── database/               # Database schemas and migrations
│   ├── schema.sql          # PostgreSQL schema
│   └── README.md           # Database setup guide
│
├── docs/                   # Additional documentation
│
├── .gitignore              # Git ignore rules
├── package.json            # Root package.json (workspace)
├── README.md               # Main project README
├── SETUP.md                # Detailed setup instructions
└── PROJECT_STRUCTURE.md    # This file
```

## Key Technologies

### Frontend
- **Next.js 14** - React framework with App Router
- **TypeScript** - Type safety
- **Tailwind CSS** - Utility-first CSS framework
- **Recharts** - Chart library for financial visualizations
- **Axios** - HTTP client
- **js-cookie** - Cookie management for JWT

### Backend
- **Express.js** - Web framework
- **PostgreSQL** - Relational database
- **JWT** - Authentication tokens
- **bcryptjs** - Password hashing
- **express-validator** - Input validation

### ML Service
- **FastAPI** - Python web framework
- **Scikit-learn** - Machine learning library
- **NumPy/Pandas** - Data processing
- **SciPy** - Scientific computing
- **Joblib** - Model serialization

## Architecture

```
┌─────────────┐
│   Browser   │
│  (Next.js)  │
└──────┬──────┘
       │ HTTP/REST
       │
┌──────▼──────┐
│   Backend   │
│  (Express)  │
└──────┬──────┘
       │
       ├──────────────┐
       │              │
┌──────▼──────┐  ┌───▼────────┐
│ PostgreSQL  │  │ ML Service │
│  Database   │  │  (FastAPI) │
└─────────────┘  └────────────┘
```

## Data Flow

1. **User Authentication**: Frontend → Backend → PostgreSQL
2. **Financial Data**: Frontend → Backend → PostgreSQL
3. **Risk Assessment**: Frontend → Backend → ML Service → Backend → Frontend
4. **Predictions**: Frontend → Backend → ML Service → Backend → Frontend

## Environment Variables

Each service has its own `.env.example` file:
- `frontend/.env.example` → Copy to `.env.local`
- `backend/.env.example` → Copy to `.env`
- `ml-service/.env.example` → Copy to `.env`

See individual service READMEs for details.
