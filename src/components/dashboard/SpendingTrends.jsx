import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import ChartCard from '../common/ChartCard';
import { useWalletAnalytics } from '../../context/WalletContext';
import { formatCurrency } from '../../utils/formatters';
import useChartTheme from '../../hooks/useChartTheme';

export default function SpendingTrends() {
  const chart = useChartTheme();
  const { spendingTrends } = useWalletAnalytics();

  return (
    <ChartCard title="Spending Over Time" subtitle="Cumulative daily spending">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={spendingTrends} margin={{ top: 5, right: 20, bottom: 5, left: 10 }}>
          <defs>
            <linearGradient id="spendGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#ef4444" stopOpacity={0.25} />
              <stop offset="95%" stopColor="#ef4444" stopOpacity={0.02} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke={chart.gridStroke} />
          <XAxis
            dataKey="date"
            fontSize={13}
            tick={chart.tick}
            tickFormatter={(d) => d.slice(5)}
          />
          <YAxis fontSize={13} tick={chart.tick} tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
          <Tooltip
            formatter={(value) => formatCurrency(value)}
            labelFormatter={(label) => `Date: ${label}`}
          />
          <Area
            type="monotone"
            dataKey="cumulative"
            name="Cumulative Spending"
            stroke="#ef4444"
            fill="url(#spendGradient)"
            strokeWidth={2.5}
          />
        </AreaChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}
