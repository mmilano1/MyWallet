import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import { styled } from '@mui/material/styles';
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

const DashboardContainer = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  maxWidth: 1400,
  marginLeft: 'auto',
  marginRight: 'auto',
  [theme.breakpoints.up('md')]: {
    padding: theme.spacing(3),
  },
}));

export default function DashboardLayout() {
  return (
    <DashboardContainer>
      <Grid container spacing={3}>
        <Grid size={12}>
          <SummaryCards />
        </Grid>
        <Grid size={12}>
          <ExpenseIncomeBreakdown />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <MonthlyAvgSpend />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <CategoryBreakdown />
        </Grid>
        <Grid size={12}>
          <SpendingTrends />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <TopCategories />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <AvgSpendByCategory />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <DayOfWeekSpending />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <SpendingByHour />
        </Grid>
        <Grid size={12}>
          <SavingsRate />
        </Grid>
        <Grid size={12}>
          <CategoryComparison />
        </Grid>
      </Grid>
    </DashboardContainer>
  );
}
