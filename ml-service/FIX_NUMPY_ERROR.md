# Fix NumPy Installation Error on Windows

## Problem
NumPy fails to install on Windows, especially with Python 3.14.

## Solutions (Try in Order)

### Solution 1: Upgrade pip and install build tools (Recommended)

```powershell
# Make sure you're in the ml-service directory with venv activated
cd ml-service
venv\Scripts\activate

# Upgrade pip
python -m pip install --upgrade pip

# Install build tools
python -m pip install --upgrade setuptools wheel

# Install numpy separately first
python -m pip install numpy

# Then install other requirements
python -m pip install -r requirements.txt
```

### Solution 2: Use pre-built wheels

```powershell
# Install numpy with pre-built wheel
python -m pip install --only-binary :all: numpy

# Then install rest
python -m pip install -r requirements.txt
```

### Solution 3: Install packages one by one

```powershell
python -m pip install numpy
python -m pip install pandas
python -m pip install scikit-learn
python -m pip install scipy
python -m pip install joblib
python -m pip install fastapi
python -m pip install uvicorn[standard]
python -m pip install pydantic
python -m pip install python-multipart
python -m pip install python-dotenv
```

### Solution 4: Use Python 3.11 or 3.12 (Best Solution)

Python 3.14 is very new and some packages may not have pre-built wheels yet.

1. **Install Python 3.11 or 3.12** from https://www.python.org/downloads/
2. **Create new virtual environment** with Python 3.11/3.12:
   ```powershell
   # Remove old venv
   Remove-Item -Recurse -Force venv
   
   # Create new venv with Python 3.11 (adjust path if needed)
   py -3.11 -m venv venv
   
   # Activate
   venv\Scripts\activate
   
   # Install requirements
   pip install -r requirements.txt
   ```

### Solution 5: Use conda (Alternative)

If you have Anaconda/Miniconda:

```powershell
conda create -n finance python=3.11
conda activate finance
conda install numpy pandas scikit-learn scipy
pip install fastapi uvicorn[standard] pydantic python-multipart python-dotenv joblib python-dotenv
```

## Quick Fix Command

Run this in PowerShell (in ml-service directory with venv activated):

```powershell
python -m pip install --upgrade pip setuptools wheel
python -m pip install numpy --only-binary :all:
python -m pip install -r requirements.txt
```

## Recommended Python Version

For best compatibility, use **Python 3.11** or **Python 3.12**.

Check your Python version:
```powershell
python --version
```

If it shows 3.14, consider installing Python 3.11 or 3.12.
