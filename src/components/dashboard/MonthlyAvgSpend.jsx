import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, LabelList } from 'recharts';
import ChartCard from '../common/ChartCard';
import { useWalletAnalytics } from '../../context/WalletContext';
import { formatCurrency, formatShortMonth, abbreviateCurrency } from '../../utils/formatters';
import useChartTheme from '../../hooks/useChartTheme';

export default function MonthlyAvgSpend() {
  const chart = useChartTheme();
  const { monthlyAvgDailySpend } = useWalletAnalytics();

  return (
    <ChartCard title="Avg Daily Spend" subtitle="Per month — identify expensive months" height={300}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={monthlyAvgDailySpend} margin={{ top: 20, right: 20, bottom: 5, left: 10 }}>
          <defs>
            <linearGradient id="avgSpendGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#a855f7" />
              <stop offset="100%" stopColor="#7c3aed" />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke={chart.gridStroke} />
          <XAxis dataKey="monthKey" tickFormatter={formatShortMonth} fontSize={13} tick={chart.tick} />
          <YAxis fontSize={13} tick={chart.tick} tickFormatter={(v) => abbreviateCurrency(v)} />
          <Tooltip
            formatter={(value) => formatCurrency(value)}
            labelFormatter={(label) => label}
          />
          <Bar
            dataKey="avgDaily"
            name="Avg Daily Spend"
            fill="url(#avgSpendGrad)"
            radius={[6, 6, 0, 0]}
          >
            <LabelList dataKey="avgDaily" position="top" fontSize={11} fontWeight={600} fill={chart.labelFill} formatter={(v) => abbreviateCurrency(v)} />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}
