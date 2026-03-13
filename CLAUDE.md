# CLAUDE.md - MyWallet Project Guide

## Project Overview

MyWallet is a client-side personal finance dashboard that imports WalletApp CSV exports and provides interactive charts, analytics, and spending predictions. There is no backend or database — all data lives in React state/context and does not persist between sessions.

## Tech Stack

- **Framework:** React 19 (functional components, hooks)
- **Language:** TypeScript 5.9 (strict mode)
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
npx tsc --noEmit  # TypeScript type check
```

## Project Structure

```
src/
├── App.tsx                    # Root: routing, theme provider, color mode
├── main.tsx                   # Entry point
├── vite-env.d.ts              # Vite client types
├── types/
│   ├── index.ts               # All domain types & interfaces
│   └── theme.d.ts             # MUI palette augmentation (income/expense)
├── theme.ts                   # Light/dark MUI theme definitions
├── context/
│   └── WalletContext.tsx      # Global state (useReducer), useWallet(), useWalletAnalytics()
├── hooks/
│   └── useChartTheme.ts       # Chart color/style hook
├── components/
│   ├── layout/                # AppHeader, Sidebar, DashboardLayout
│   ├── dashboard/             # 15 chart components (SummaryCards, CategoryBreakdown, etc.)
│   ├── common/
│   │   └── ChartCard.tsx      # Reusable chart wrapper with expand modal
│   ├── filters/
│   │   └── FilterBar.tsx      # Standalone filter controls
│   ├── import/
│   │   └── CsvImporter.tsx    # Drag-drop CSV upload
│   └── predictions/
│       └── PredictionsLayout.tsx  # 12-month spending forecast
├── utils/
│   ├── csvParser.ts           # CSV parsing + date/amount normalization
│   ├── analytics.ts           # 16+ analytics computation functions
│   ├── formatters.ts          # Currency, date, number formatting
│   └── predictions.ts         # Spending profile & forecast generation
```

## Architecture & Patterns

### State Management
- **Context API + useReducer** in `WalletContext.tsx` for global state
- Two custom hooks: `useWallet()` (state + dispatch) and `useWalletAnalytics()` (memoized computed data)
- Separate `ColorModeContext` for light/dark theme toggle
- No prop drilling — all global data accessed via context hooks

### Data Flow
1. CSV uploaded → parsed by `csvParser.ts` → stored in context as `rawTransactions`
2. Filters applied via reducer actions → `useWalletAnalytics()` computes filtered data
3. Dashboard components consume analytics via `useWalletAnalytics()` hook
4. All expensive computations wrapped in `useMemo`

### Routing
- No React Router — simple `useState` page switching between 'dashboard' and 'predictions'
- Navigation via Sidebar component with `onNavigate` callback

### Styling
- **Primary:** MUI `styled()` API — styled components co-located at top of each file
- **Secondary:** MUI `sx` prop for trivial one-off styles (1-2 properties)
- Custom props via `shouldForwardProp` pattern
- Glassmorphism effects (backdrop blur, transparency) on cards
- Custom theme with extended palette: `theme.palette.income`, `theme.palette.expense`

### TypeScript
- Strict mode enabled, centralized types in `src/types/index.ts`
- MUI theme augmented in `src/types/theme.d.ts` for custom `income`/`expense` palette
- Recharts callback type mismatches handled with `as never` cast (standard workaround)
- MUI multi-select uses generic: `Select<string[]>`

## Coding Conventions

- **Components:** PascalCase filenames matching component name (e.g., `SummaryCards.tsx`)
- **Functions/variables:** camelCase (e.g., `formatCurrency`, `computeSummary`)
- **Constants:** UPPER_SNAKE_CASE (e.g., `EXCLUDED_CATEGORIES`, `DAY_NAMES`)
- **Booleans:** `is`/`has` prefix (e.g., `isLoading`, `isIncome`)
- **Styled components:** Descriptive PascalCase (e.g., `StyledCard`, `TooltipBox`, `CategoryDot`)
- **Types:** Interfaces for objects, type aliases for unions
- **Performance:** use `useMemo` for derived data, `useCallback` for event handlers
- **Charts:** wrap in `<ChartCard>` for consistent presentation and expand-modal support

## Key Files to Know

| File | Purpose |
|------|---------|
| `types/index.ts` | All TypeScript interfaces and domain types |
| `context/WalletContext.tsx` | Central state, reducer actions, analytics hook |
| `utils/analytics.ts` | All data computation functions |
| `utils/csvParser.ts` | CSV import logic, date format handling |
| `utils/predictions.ts` | Forecast/budget projection engine |
| `theme.ts` | MUI theme (colors, component overrides, glassmorphism) |
| `components/common/ChartCard.tsx` | Reusable chart container with expand modal |

## Global State Shape

```typescript
{
  rawTransactions: Transaction[],
  filters: {
    periodMode: 'monthly' | 'yearly',
    selectedYear: number | null,
    selectedMonth: 'YYYY-MM' | null,
    categoryFilter: string[],
    accountFilter: string[],
    excludeCategories: string[],
  },
  isLoading: boolean,
  error: string | null,
}
```

## CSV Format

WalletApp semicolon-delimited CSV. Key columns: `date`, `type` (income/expense), `category`, `account`, `payee`, `ref_currency_amount`, `payment_type`, `currency`. Transactions with category "transfer, withdraw" are filtered out.
