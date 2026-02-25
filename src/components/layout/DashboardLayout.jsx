import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import SummaryCards from '../dashboard/SummaryCards';
import ExpenseIncomeBreakdown from '../dashboard/ExpenseIncomeBreakdown';
import CategoryBreakdown from '../dashboard/CategoryBreakdown';
import SpendingTrends from '../dashboard/SpendingTrends';
import TopCategories from '../dashboard/TopCategories';
import AvgSpendByCategory from '../dashboard/AvgSpendByCategory';
import CategoryComparison from '../dashboard/CategoryComparison';
import MonthlyAvgSpend from '../dashboard/MonthlyAvgSpend';
import DayOfWeekSpending from '../dashboard/DayOfWeekSpending';
import SpendingByHour from '../dashboard/SpendingByHour';
import SavingsRate from '../dashboard/SavingsRate';

export default function DashboardLayout() {
  return (
    <Box sx={{ p: { xs: 2, md: 3 }, maxWidth: 1400, mx: 'auto' }}>
      <Grid container spacing={3}>
        {/* Row 1: Summary Cards */}
        <Grid size={12}>
          <SummaryCards />
        </Grid>

        {/* Row 2: Income vs Expenses (full width) */}
        <Grid size={12}>
          <ExpenseIncomeBreakdown />
        </Grid>

        {/* Row 3: Avg Daily Spend + Spending by Category */}
        <Grid size={{ xs: 12, md: 6 }}>
          <MonthlyAvgSpend />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <CategoryBreakdown />
        </Grid>

        {/* Row 4: Spending Trends (full width) */}
        <Grid size={12}>
          <SpendingTrends />
        </Grid>

        {/* Row 5: Top Categories + Avg Spend per Transaction */}
        <Grid size={{ xs: 12, md: 6 }}>
          <TopCategories />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <AvgSpendByCategory />
        </Grid>

        {/* Row 6: Spending by Day + Spending by Hour */}
        <Grid size={{ xs: 12, md: 6 }}>
          <DayOfWeekSpending />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <SpendingByHour />
        </Grid>

        {/* Row 7: Savings Rate (full width) */}
        <Grid size={12}>
          <SavingsRate />
        </Grid>

        {/* Row 8: Category Comparison (full width, at bottom) */}
        <Grid size={12}>
          <CategoryComparison />
        </Grid>
      </Grid>
    </Box>
  );
}
