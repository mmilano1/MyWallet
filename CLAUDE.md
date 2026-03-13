# CLAUDE.md - MyWallet Project Guide

## Project Overview

MyWallet is a client-side personal finance dashboard that imports WalletApp CSV exports and provides interactive charts, analytics, and spending predictions. There is no backend or database — all data lives in React state/context and does not persist between sessions.

## Tech Stack

- **Framework:** React 19 (functional components, hooks, JSX)
- **Language:** JavaScript (ES2020+) — no TypeScript
- **Build Tool:** Vite 7
- **UI Library:** Material UI (MUI) v7 with Emotion CSS-in-JS
- **Charts:** Recharts v3
- **Date Handling:** date-fns v4
- **CSV Parsing:** PapaParse v5 (semicolon-delimited)
- **Linting:** ESLint 9 (flat config) — no Prettier
- **Testing:** None configured

## Commands

```bash
npm run dev       # Start dev server (http://localhost:5173)
npm run build     # Production build to dist/
npm run preview   # Preview production build
npm run lint      # Run ESLint
```

## Project Structure

```
src/
├── App.jsx                    # Root: routing, theme provider, color mode
├── main.jsx                   # Entry point
├── theme.js                   # Light/dark MUI theme definitions
├── context/
│   └── WalletContext.jsx      # Global state (useReducer), useWallet(), useWalletAnalytics()
├── hooks/
│   └── useChartTheme.js       # Chart color/style hook
├── components/
│   ├── layout/                # AppHeader, Sidebar, DashboardLayout
│   ├── dashboard/             # 15 chart components (SummaryCards, CategoryBreakdown, etc.)
│   ├── common/
│   │   └── ChartCard.jsx      # Reusable chart wrapper with expand modal
│   ├── import/
│   │   └── CsvImporter.jsx    # Drag-drop CSV upload
│   └── predictions/
│       └── PredictionsLayout.jsx  # 12-month spending forecast
├── utils/
│   ├── csvParser.js           # CSV parsing + date/amount normalization
│   ├── analytics.js           # 20+ analytics computation functions
│   ├── formatters.js          # Currency, date, number formatting
│   └── predictions.js         # Spending profile & forecast generation
```

## Architecture & Patterns

### State Management
- **Context API + useReducer** in `WalletContext.jsx` for global state
- Two custom hooks: `useWallet()` (state + dispatch) and `useWalletAnalytics()` (memoized computed data)
- Separate `ColorModeContext` for light/dark theme toggle
- No prop drilling — all global data accessed via context hooks

### Data Flow
1. CSV uploaded → parsed by `csvParser.js` → stored in context as `rawTransactions`
2. Filters applied via reducer actions → `useWalletAnalytics()` computes filtered data
3. Dashboard components consume analytics via `useWalletAnalytics()` hook
4. All expensive computations wrapped in `useMemo`

### Routing
- No React Router — simple `useState` page switching between 'dashboard' and 'predictions'
- Navigation via Sidebar component with `onNavigate` callback

### Styling
- MUI's `sx` prop and theme system — no separate CSS files
- Glassmorphism effects (backdrop blur, transparency) on cards
- Custom theme with extended palette: `theme.palette.income`, `theme.palette.expense`

## Coding Conventions

- **Components:** PascalCase filenames matching component name (e.g., `SummaryCards.jsx`)
- **Functions/variables:** camelCase (e.g., `formatCurrency`, `computeSummary`)
- **Constants:** UPPER_SNAKE_CASE (e.g., `EXCLUDED_CATEGORIES`, `DAY_NAMES`)
- **Booleans:** `is`/`has` prefix (e.g., `isLoading`, `isIncome`)
- **Performance:** use `useMemo` for derived data, `useCallback` for event handlers
- **Charts:** wrap in `<ChartCard>` for consistent presentation and expand-modal support

## Key Files to Know

| File | Purpose |
|------|---------|
| `context/WalletContext.jsx` | Central state, reducer actions, analytics hook |
| `utils/analytics.js` | All data computation functions |
| `utils/csvParser.js` | CSV import logic, date format handling |
| `utils/predictions.js` | Forecast/budget projection engine |
| `theme.js` | MUI theme (colors, component overrides) |
| `components/common/ChartCard.jsx` | Reusable chart container |

## Global State Shape

```javascript
{
  rawTransactions: [],
  filters: {
    periodMode: 'monthly' | 'yearly',
    selectedYear: number | null,
    selectedMonth: 'YYYY-MM' | null,
    categoryFilter: [],
    accountFilter: [],
    excludeCategories: [],
  },
  isLoading: boolean,
  error: string | null,
}
```

## CSV Format

WalletApp semicolon-delimited CSV. Key columns: `date`, `type` (income/expense), `category`, `account`, `payee`, `ref_currency_amount`, `payment_type`, `currency`. Transactions with category "transfer, withdraw" are filtered out.
