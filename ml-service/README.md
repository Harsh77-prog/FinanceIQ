# ML Service

Python FastAPI service for financial predictions and analysis.

## Setup

1. **Create Virtual Environment:**
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

2. **Install Dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

3. **Set Environment Variables:**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. **Run Service:**
   ```bash
   python app.py
   ```

   Or with uvicorn:
   ```bash
   uvicorn app:app --host 0.0.0.0 --port 8000 --reload
   ```

## API Endpoints

- `POST /api/risk-assessment` - Calculate risk tolerance
- `POST /api/stress-prediction` - Predict financial stress probability
- `POST /api/monte-carlo` - Run Monte Carlo portfolio simulation

## Models

Models are saved in the `models/` directory:
- `stress_model.joblib` - Trained logistic regression model for stress prediction
- `scaler.joblib` - Feature scaler for the stress model

Models are automatically trained on first run if they don't exist.
