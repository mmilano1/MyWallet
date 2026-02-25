import {
  ResponsiveContainer, LineChart, Line, XAxis, YAxis,
  CartesianGrid, Tooltip, ReferenceLine,
} from 'recharts';
import ChartCard from '../common/ChartCard';
import { useWalletAnalytics } from '../../context/WalletContext';
import { formatShortMonth } from '../../utils/formatters';
import useChartTheme from '../../hooks/useChartTheme';

export default function SavingsRate() {
  const chart = useChartTheme();
  const { savingsRate } = useWalletAnalytics();

  return (
    <ChartCard title="Savings Rate" subtitle="Track your saving progress" height={300}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={savingsRate} margin={{ top: 5, right: 20, bottom: 5, left: 10 }}>
          <defs>
            <linearGradient id="savingsStroke" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#10b981" />
              <stop offset="100%" stopColor="#06b6d4" />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke={chart.gridStroke} />
          <XAxis dataKey="monthKey" tickFormatter={formatShortMonth} fontSize={13} tick={chart.tick} />
          <YAxis fontSize={13} tick={chart.tick} tickFormatter={(v) => `${v.toFixed(0)}%`} />
          <Tooltip formatter={(value) => `${value.toFixed(1)}%`} labelFormatter={(l) => l} />
          <ReferenceLine y={0} stroke={chart.refLineStroke} strokeDasharray="4 4" />
          <Line
            type="monotone"
            dataKey="savingsRate"
            name="Savings Rate"
            stroke="url(#savingsStroke)"
            strokeWidth={3}
            dot={{ fill: '#10b981', strokeWidth: 0, r: 4 }}
            activeDot={{ r: 6, fill: '#10b981', stroke: '#fff', strokeWidth: 2 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}
