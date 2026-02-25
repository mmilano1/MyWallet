# MyWallet

A personal finance dashboard that visualizes spending data from [WalletApp](https://budgetbakers.com/) CSV exports. Import your data and get instant insights into your income, expenses, savings, and spending patterns.

## Features

- **CSV Import** — Drag & drop or browse to import WalletApp CSV exports (semicolon-delimited)
- **Interactive Dashboard** — Summary cards, income vs expenses, category breakdowns, spending trends, and more
- **Category Drill-down** — Click any category in the pie chart to see a full transaction list
- **Spending Insights** — Average daily spend, spending by day of week, spending by hour, savings rate
- **Category Comparison** — Compare spending across categories over time
- **Predictions Page** — Forecast yearly spending based on historical averages with adjustable category budgets and custom wage input
- **Filters** — Filter by year, month, category, account. Searchable category include/exclude
- **Dark Mode** — Toggle between light and dark themes
- **Expand Charts** — Full-screen modal view for any chart

## Tech Stack

- **React 19** with functional components and hooks
- **Material UI (MUI) v7** for UI components
- **Recharts v3** for charts and data visualization
- **date-fns v4** for date utilities
- **PapaParse** for CSV parsing
- **Vite v7** for development and builds

## Getting Started

### Prerequisites

- Node.js 18+
- npm

### Install

```bash
npm install
```

### Development

```bash
npm run dev
```

Opens at [http://localhost:5173](http://localhost:5173).

### Build

```bash
npm run build
```

Output goes to `dist/`.

### Preview production build

```bash
npm run preview
```

### Lint

```bash
npm run lint
```

## Usage

1. Export your transactions as CSV from WalletApp
2. Open the app and drag & drop (or browse) your CSV file
3. Explore the dashboard — use filters in the top bar to narrow down by year, month, category, or account
4. Click the wallet icon to open the sidebar and navigate to the Predictions page
5. Toggle dark mode with the sun/moon icon in the top bar

## Project Structure

```
src/
  components/
    common/         # Shared components (ChartCard)
    dashboard/      # Dashboard chart components
    import/         # CSV import UI
    layout/         # AppHeader, Sidebar, DashboardLayout
    predictions/    # Predictions page
  context/          # WalletContext (global state + analytics)
  hooks/            # Custom hooks (useChartTheme)
  utils/            # CSV parser, analytics, formatters, predictions
  theme.js          # Light & dark MUI themes
  App.jsx           # Root component with routing and theme provider
```

## License

MIT
