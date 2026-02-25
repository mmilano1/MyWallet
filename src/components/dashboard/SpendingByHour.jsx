import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell, LabelList } from 'recharts';
import ChartCard from '../common/ChartCard';
import { useWalletAnalytics } from '../../context/WalletContext';
import { formatCurrency, abbreviateCurrency } from '../../utils/formatters';
import useChartTheme from '../../hooks/useChartTheme';

function hourColor(h) {
  if (h < 6) return '#818cf8';
  if (h < 12) return '#f59e0b';
  if (h < 18) return '#f97316';
  return '#6366f1';
}

export default function SpendingByHour() {
  const chart = useChartTheme();
  const { spendingByHour } = useWalletAnalytics();
  const hasData = spendingByHour.some((d) => d.total > 0);

  return (
    <ChartCard title="Spending by Hour" subtitle="When do you spend the most?" height={300}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={spendingByHour} margin={{ top: 20, right: 20, bottom: 5, left: 10 }}>
          <defs>
            {spendingByHour.map((d) => (
              <linearGradient key={d.hour} id={`hourGrad${d.hour}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={hourColor(d.hour)} stopOpacity={0.85} />
                <stop offset="100%" stopColor={hourColor(d.hour)} />
              </linearGradient>
            ))}
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke={chart.gridStroke} />
          <XAxis
            dataKey="label"
            fontSize={11}
            tick={chart.tick}
            interval={1}
            angle={-45}
            textAnchor="end"
            height={40}
          />
          <YAxis fontSize={13} tick={chart.tick} tickFormatter={(v) => abbreviateCurrency(v)} />
          <Tooltip
            formatter={(value, name) => [
              formatCurrency(value),
              name === 'total' ? 'Total' : 'Avg per txn',
            ]}
            labelFormatter={(l) => `Time: ${l}`}
          />
          <Bar dataKey="total" name="Total" radius={[4, 4, 0, 0]}>
            {spendingByHour.map((d) => (
              <Cell key={d.hour} fill={`url(#hourGrad${d.hour})`} />
            ))}
            {hasData && (
              <LabelList
                dataKey="count"
                position="top"
                fontSize={10}
                fontWeight={600}
                fill={chart.labelFillSecondary}
                formatter={(v) => v > 0 ? v : ''}
              />
            )}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}
