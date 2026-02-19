# Portfolio Analysis Update - Dynamic User Data

## Summary
The Portfolio Analysis page has been updated to display **real, calculated data** from your actual financial holdings instead of static placeholder values.

---

## Changes Made

### 1. Backend: `/portfolio/allocation` Endpoint
**File:** [backend/routes/portfolio.js](backend/routes/portfolio.js)

**What Changed:**
- Now calculates **actual current allocation** from user's assets
- Computes portfolio distribution across: Equity, Debt, Gold, Liquid
- Calculates risk score based on actual holdings (not just risk assessment)
- Returns comprehensive portfolio data

**Returns:**
```json
{
  "currentAllocation": {
    "equity": 45.5,
    "debt": 30.2,
    "gold": 12.1,
    "liquid": 12.2
  },
  "targetAllocation": {
    "equity": 50,
    "debt": 30,
    "gold": 10,
    "liquid": 10
  },
  "totalValue": 150000,
  "riskLevel": "Balanced",
  "riskScore": 52,
  "volatility": 10.4,
  "recommendation": "Balanced approach between growth and stability..."
}
```

---

### 2. Backend: `/portfolio/analysis` Endpoint
**File:** [backend/routes/portfolio.js](backend/routes/portfolio.js)

**Already Updated To:**
- Calculate current vs target allocation drift
- Suggest rebalancing actions (buy/sell specific buckets)
- Compute portfolio risk metrics
- Calculate total portfolio value dynamically

**Returns:**
```json
{
  "currentAllocation": {
    "equity": 45.5,
    "debt": 30.2,
    "gold": 12.1,
    "liquid": 12.2
  },
  "totalValue": 150000,
  "targetAllocation": {
    "equity": 50,
    "debt": 30,
    "gold": 10,
    "liquid": 10
  },
  "risk": {
    "score": 52,
    "level": "Balanced",
    "annualVolatility": 10.4
  },
  "rebalance": {
    "drift": {
      "equity": -4.5,
      "debt": 0.2,
      "gold": 2.1,
      "liquid": 2.2
    },
    "suggestions": [
      {
        "action": "buy",
        "bucket": "equity",
        "amount": 6750
      },
      {
        "action": "sell",
        "bucket": "gold",
        "amount": 3150
      }
    ]
  }
}
```

---

### 3. Frontend: PortfolioAllocation Component
**File:** [frontend/components/dashboard/PortfolioAllocation.tsx](frontend/components/dashboard/PortfolioAllocation.tsx)

**Updates:**
- Changed to use `currentAllocation` from API response
- Displays actual user portfolio percentages
- Shows total portfolio value
- Includes asset breakdown with real percentages
- Better empty state message: "Add assets and savings to see portfolio allocation"

---

### 4. Frontend: Portfolio Page
**File:** [frontend/app/dashboard/portfolio/page.tsx](frontend/app/dashboard/portfolio/page.tsx)

**New Feature - Auto-Populate Monte Carlo Form:**
- Fetches user's total assets value
- Fetches user's total savings
- Combines both to get **actual portfolio value**
- Pre-fills "Initial Amount" with user's current total
- Estimates "Monthly Contribution" as 10% of portfolio
- User can adjust these values before running simulation

**Function Added:**
```typescript
const loadUserPortfolioData = async () => {
  // Fetches /portfolio/holdings (asset total)
  // Fetches /savings (savings total)
  // Pre-populates form with actual values
}
```

---

## Data Flow

```
User's Financial Data (Database)
    ↓
    ├─ assets table
    ├─ savings table
    ├─ debts table
    └─ liabilities table
         ↓
Backend Calculations
    ├─ mapTypeToBucket() → Categorizes assets
    ├─ getCurrentAllocation() → Calculates % per category
    ├─ getTargetAllocation() → Gets goal allocation
    ├─ computeRiskScore() → Calculates volatility-based risk
    └─ computeRebalance() → Suggests buy/sell actions
         ↓
API Endpoints
    ├─ GET /portfolio/allocation → Current + Target allocation
    ├─ GET /portfolio/analysis → Risk + Rebalancing suggestions
    └─ GET /portfolio/holdings → Total asset value
         ↓
Frontend Components
    ├─ PortfolioAllocation.tsx → Shows pie chart with real data
    ├─ PortfolioLiveAnalysis.tsx → Shows risk metrics & suggestions
    └─ portfolio/page.tsx → Monte Carlo with pre-filled values
         ↓
User Interface
    └─ All display values are calculated from actual holdings
```

---

## Key Features Now Working

✅ **Asset Categorization**
- Stocks, ETFs, Crypto → Equity (18% volatility assumed)
- Bonds, Fixed Deposits → Debt (5% volatility assumed)
- Gold Holdings → Gold (12% volatility assumed)
- Cash, Savings, Bank → Liquid (1% volatility assumed)

✅ **Portfolio Allocation Calculation**
- Real-time calculation based on quantity × price
- Percentage distribution across categories
- Total portfolio value accurately computed

✅ **Risk Assessment**
- Based on actual portfolio composition
- Weighted volatility model generates risk score (0-100)
- Risk level (Conservative/Balanced/Aggressive) from score

✅ **Rebalancing Suggestions**
- Compares current vs target allocation
- 5% drift threshold (suggests change when drift > 5%)
- Buy/sell recommendations with amounts

✅ **Monte Carlo Simulation**
- Pre-populated with user's actual portfolio value
- Estimated monthly contribution based on current holdings
- Can be customized before running simulation

---

## How to Use

### To See Your Real Portfolio:
1. Go to **Dashboard → Portfolio Analysis**
2. **Portfolio Allocation** card shows your actual asset distribution
3. **Live Portfolio Analysis** shows current value and rebalancing needs

### To Run Monte Carlo Simulation:
1. Pre-filled form automatically uses your current portfolio value
2. Adjust parameters if desired:
   - **Initial Amount**: Your current portfolio value
   - **Monthly Contribution**: Estimated from 10% of portfolio (adjust as needed)
   - **Years**: Investment timeline (10 by default)
   - **Expected Return**: Assumed 8% annually (adjust for risk level)
   - **Volatility**: Based on portfolio composition
3. Click **Run Simulation** to see the distribution

---

## Important Notes

1. **Asset Categorization:** The system automatically maps asset types to categories. Make sure to use proper type names:
   - Equity: "Stock", "ETF", "Mutual Fund", "Crypto"
   - Debt: "Bond", "Fixed Deposit", "Debenture"
   - Gold: "Gold" (use this exact term)
   - Liquid: "Savings", "Cash", "Bank Account"

2. **Rebalancing Suggestions:** Based on your risk-assessed target allocation. Update your risk profile in Settings to change target allocation.

3. **Volatility Assumptions:** Risk scores use historical asset class volatility. Individual asset volatility may vary.

4. **Data Accuracy:** All calculations are based on current asset prices and quantities. Update prices regularly for accurate results.

---

## Technical Details

**Helper Functions (portfolio.js):**
- `mapTypeToBucket()` → Type → Category mapping
- `getCurrentAllocation()` → Calculates user's actual %
- `getTargetAllocation()` → Gets user's goal %
- `computeRiskScore()` → Portfolio risk (0-100)
- `computeRebalance()` → Buy/sell suggestions

**Database Queries:**
- Assets table for holdings
- Savings table for liquid assets
- Risk assessments for target allocation

**Frontend Integration:**
- Components auto-refresh when switching to portfolio page
- Data fetched on component mount
- Loading states while calculating
- Error handling for failed calculations

---

## Next Steps

The portfolio analysis is now fully dynamic! You can:
1. ✅ Add more assets to see allocation change
2. ✅ Run Monte Carlo with your actual portfolio
3. ✅ Get personalized rebalancing suggestions
4. ✅ Track how your portfolio matches target allocation

All values update based on your actual financial data in real-time.

