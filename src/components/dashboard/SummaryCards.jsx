import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import { useTheme } from '@mui/material/styles';
import { useWalletAnalytics } from '../../context/WalletContext';
import { formatCurrency } from '../../utils/formatters';

const cardsConfig = [
  {
    key: 'income',
    label: 'Total Income',
    icon: TrendingUpIcon,
    color: '#10b981',
    lightBg: 'linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%)',
    darkBg: 'linear-gradient(135deg, #064e3b 0%, #065f46 100%)',
    getValue: (s) => s.totalIncome,
  },
  {
    key: 'expense',
    label: 'Total Expenses',
    icon: TrendingDownIcon,
    color: '#ef4444',
    lightBg: 'linear-gradient(135deg, #fee2e2 0%, #fecaca 100%)',
    darkBg: 'linear-gradient(135deg, #7f1d1d 0%, #991b1b 100%)',
    getValue: (s) => s.totalExpense,
  },
  {
    key: 'net',
    label: 'Net Balance',
    icon: AccountBalanceIcon,
    color: '#6366f1',
    lightBg: 'linear-gradient(135deg, #e0e7ff 0%, #c7d2fe 100%)',
    darkBg: 'linear-gradient(135deg, #312e81 0%, #3730a3 100%)',
    getValue: (s) => s.net,
  },
  {
    key: 'daily',
    label: 'Avg Daily Spend',
    icon: CalendarTodayIcon,
    color: '#f59e0b',
    lightBg: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)',
    darkBg: 'linear-gradient(135deg, #78350f 0%, #92400e 100%)',
    getValue: (s) => s.avgDailySpend,
  },
];

export default function SummaryCards() {
  const { summary } = useWalletAnalytics();
  const theme = useTheme();
  const dark = theme.palette.mode === 'dark';

  return (
    <Grid container spacing={2}>
      {cardsConfig.map(({ key, label, icon: Icon, color, lightBg, darkBg, getValue }) => (
        <Grid key={key} size={{ xs: 6, sm: 3 }}>
          <Card
            sx={{
              background: dark ? darkBg : lightBg,
              border: 'none',
              borderTop: `3px solid ${color}`,
            }}
          >
            <CardContent>
              <Box display="flex" alignItems="center" gap={1} mb={1}>
                <Box
                  sx={{
                    width: 32,
                    height: 32,
                    borderRadius: '10px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    bgcolor: `${color}20`,
                  }}
                >
                  <Icon sx={{ color, fontSize: 18 }} />
                </Box>
                <Typography variant="body2" color="text.secondary" fontWeight={500}>
                  {label}
                </Typography>
              </Box>
              <Typography variant="h5" fontWeight={700} sx={{ color }}>
                {formatCurrency(getValue(summary))}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
}
