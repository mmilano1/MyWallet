import { useState } from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell, LabelList } from 'recharts';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import ChartCard from '../common/ChartCard';
import { useWalletAnalytics } from '../../context/WalletContext';
import { formatCurrency, abbreviateCurrency } from '../../utils/formatters';
import useChartTheme from '../../hooks/useChartTheme';

const DAY_COLORS = ['#06b6d4', '#0ea5e9', '#6366f1', '#8b5cf6', '#a855f7', '#ec4899', '#f43f5e'];

type Metric = 'avg' | 'total';

export default function DayOfWeekSpending() {
  const chart = useChartTheme();
  const { dayOfWeekSpending } = useWalletAnalytics();
  const [metric, setMetric] = useState<Metric>('avg');

  const action = (
    <ToggleButtonGroup
      value={metric}
      exclusive
      onChange={(_, v: Metric | null) => v && setMetric(v)}
      size="small"
    >
      <ToggleButton value="avg">Avg</ToggleButton>
      <ToggleButton value="total">Total</ToggleButton>
    </ToggleButtonGroup>
  );

  return (
    <ChartCard
      title="Spending by Day"
      subtitle={metric === 'avg' ? 'Average spending per day of week' : 'Total spending per day of week'}
      height={300}
      action={action}
    >
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={dayOfWeekSpending} margin={{ top: 20, right: 20, bottom: 5, left: 10 }}>
          <defs>
            {DAY_COLORS.map((color, i) => (
              <linearGradient key={i} id={`dayGrad${i}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={color} stopOpacity={0.9} />
                <stop offset="100%" stopColor={color} />
              </linearGradient>
            ))}
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke={chart.gridStroke} />
          <XAxis dataKey="dayName" fontSize={13} tick={chart.tick} />
          <YAxis fontSize={13} tick={chart.tick} tickFormatter={(v) => abbreviateCurrency(v)} />
          <Tooltip
            formatter={((value: number) => [formatCurrency(value), metric === 'avg' ? 'Average' : 'Total']) as never}
          />
          <Bar dataKey={metric} name={metric === 'avg' ? 'Average' : 'Total'} radius={[6, 6, 0, 0]} activeBar={false}>
            {dayOfWeekSpending.map((_, i) => (
              <Cell key={i} fill={`url(#dayGrad${i})`} />
            ))}
            <LabelList dataKey={metric} position="top" fontSize={11} fontWeight={600} fill={chart.labelFill} formatter={(v: unknown) => abbreviateCurrency(Number(v))} />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}
