# How to Start ML Service

## Step-by-Step Instructions

### Step 1: Navigate to ML Service Directory

```powershell
cd c:\Users\harsh\Documents\finance\ml-service
```

### Step 2: Activate Virtual Environment

```powershell
venv\Scripts\activate
```

You should see `(venv)` in your PowerShell prompt.

### Step 3: Start the Service

**Option A: Using Python directly**
```powershell
python app.py
```

**Option B: Using uvicorn (recommended)**
```powershell
uvicorn app:app --host 0.0.0.0 --port 8000 --reload
```

The `--reload` flag enables auto-reload on code changes (useful for development).

### Step 4: Verify It's Running

You should see output like:
```
INFO:     Started server process [xxxx]
INFO:     Waiting for application startup.
INFO:     Application startup complete.
INFO:     Uvicorn running on http://0.0.0.0:8000 (Press CTRL+C to quit)
```

### Step 5: Test the Service

Open your browser and go to:
- **Health Check**: http://localhost:8000/health
- **API Docs**: http://localhost:8000/docs (Swagger UI)
- **Root**: http://localhost:8000

## Quick Start (All Commands Together)

```powershell
cd c:\Users\harsh\Documents\finance\ml-service
venv\Scripts\activate
python app.py
```

## Troubleshooting

### "venv\Scripts\activate : The term 'venv\Scripts\activate' is not recognized"

**Solution**: Use full path or check if venv exists:
```powershell
.\venv\Scripts\Activate.ps1
```

If you get execution policy error:
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### "Module not found" errors

**Solution**: Install dependencies first:
```powershell
pip install -r requirements.txt
```

### Port 8000 already in use

**Solution**: Change port in `.env` file or stop the service using port 8000:
```powershell
# Find process using port 8000
netstat -ano | findstr :8000

# Kill the process (replace PID with actual process ID)
taskkill /PID <PID> /F
```

### Service starts but shows errors

Check the terminal output for specific error messages. Common issues:
- Missing dependencies → Run `pip install -r requirements.txt`
- Port conflict → Change port in `.env` file
- Database connection → Not needed for ML service (it's independent)

## Stop the Service

Press `Ctrl + C` in the terminal where the service is running.

## Production Mode

For production (without auto-reload):
```powershell
uvicorn app:app --host 0.0.0.0 --port 8000
```

## Environment Variables

The ML service uses `ml-service/.env` file. Default values work for local development:
- `PORT=8000`
- `HOST=0.0.0.0`
- `ENVIRONMENT=development`

No changes needed unless you want to customize ports.
