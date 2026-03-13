import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell, LabelList } from 'recharts';
import ChartCard from '../common/ChartCard';
import { useWalletAnalytics } from '../../context/WalletContext';
import { formatCurrency, abbreviateCurrency } from '../../utils/formatters';
import useChartTheme from '../../hooks/useChartTheme';

const COLORS = [
  '#f97316', '#fb923c', '#fdba74', '#f59e0b', '#fbbf24',
  '#a855f7', '#c084fc', '#6366f1', '#818cf8', '#ec4899',
];

export default function TopCategories() {
  const chart = useChartTheme();
  const { categoryData } = useWalletAnalytics();
  const top10 = categoryData.slice(0, 10);

  return (
    <ChartCard title="Top 10 Categories" subtitle="By total spending" height={350}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={top10}
          layout="vertical"
          margin={{ top: 5, right: 60, bottom: 5, left: 100 }}
        >
          <defs>
            {COLORS.map((color, i) => (
              <linearGradient key={i} id={`catGrad${i}`} x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor={color} stopOpacity={0.85} />
                <stop offset="100%" stopColor={color} />
              </linearGradient>
            ))}
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke={chart.gridStroke} horizontal={false} />
          <XAxis type="number" fontSize={13} tick={chart.tick} tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
          <YAxis
            type="category"
            dataKey="category"
            fontSize={13}
            width={90}
            tick={chart.tick}
          />
          <Tooltip formatter={((value: number) => formatCurrency(value)) as never} />
          <Bar dataKey="amount" name="Total Spent" radius={[0, 8, 8, 0]} activeBar={false}>
            {top10.map((_, i) => (
              <Cell key={i} fill={`url(#catGrad${i})`} />
            ))}
            <LabelList dataKey="amount" position="right" fontSize={12} fontWeight={600} fill={chart.labelFill} formatter={(v: unknown) => abbreviateCurrency(Number(v))} />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}
