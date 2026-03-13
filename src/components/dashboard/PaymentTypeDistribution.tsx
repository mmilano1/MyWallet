import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';
import ChartCard from '../common/ChartCard';
import { useWalletAnalytics } from '../../context/WalletContext';
import { formatCurrency } from '../../utils/formatters';

const COLORS = ['#6366f1', '#f97316', '#10b981', '#a855f7', '#06b6d4', '#ec4899', '#f59e0b'];

interface LegendDotProps {
  dotColor: string;
}

const LegendDot = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'dotColor',
})<LegendDotProps>(({ dotColor }) => ({
  width: 10,
  height: 10,
  borderRadius: '50%',
  backgroundColor: dotColor,
  flexShrink: 0,
}));

export default function PaymentTypeDistribution() {
  const { paymentTypeData } = useWalletAnalytics();

  return (
    <ChartCard title="Payment Types" height={260}>
      <Box display="flex" flexDirection="column" height="100%">
        <Box flex={1} minHeight={0}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={paymentTypeData}
                dataKey="amount"
                nameKey="paymentType"
                cx="50%"
                cy="50%"
                outerRadius="80%"
                innerRadius="50%"
              >
                {paymentTypeData.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={((value: number) => formatCurrency(value)) as never} />
            </PieChart>
          </ResponsiveContainer>
        </Box>
        <Box display="flex" flexWrap="wrap" gap={0.5} mt={1}>
          {paymentTypeData.map((item, i) => (
            <Box key={item.paymentType} display="flex" alignItems="center" gap={0.5} mr={1}>
              <LegendDot dotColor={COLORS[i % COLORS.length]} />
              <Typography variant="caption" noWrap>
                {item.paymentType}
              </Typography>
            </Box>
          ))}
        </Box>
      </Box>
    </ChartCard>
  );
}
