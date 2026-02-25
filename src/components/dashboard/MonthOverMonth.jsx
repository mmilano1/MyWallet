import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell, ReferenceLine, LabelList } from 'recharts';
import ChartCard from '../common/ChartCard';
import { useWalletAnalytics } from '../../context/WalletContext';
import { formatShortMonth } from '../../utils/formatters';

const TICK = { fill: '#334155', fontWeight: 600 };

export default function MonthOverMonth() {
  const { monthOverMonth } = useWalletAnalytics();

  return (
    <ChartCard title="Month-over-Month" subtitle="Spending % change vs prior month" height={300}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={monthOverMonth} margin={{ top: 20, right: 20, bottom: 5, left: 10 }}>
          <defs>
            <linearGradient id="momUp" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#f87171" />
              <stop offset="100%" stopColor="#ef4444" />
            </linearGradient>
            <linearGradient id="momDown" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#34d399" />
              <stop offset="100%" stopColor="#10b981" />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" />
          <XAxis dataKey="monthKey" tickFormatter={formatShortMonth} fontSize={13} tick={TICK} />
          <YAxis fontSize={13} tick={TICK} tickFormatter={(v) => `${v.toFixed(0)}%`} />
          <Tooltip formatter={(value) => `${value.toFixed(1)}%`} labelFormatter={(l) => l} />
          <ReferenceLine y={0} stroke="#94a3b8" strokeDasharray="4 4" />
          <Bar dataKey="changePercent" name="Change %" radius={[6, 6, 6, 6]}>
            {monthOverMonth.map((entry, i) => (
              <Cell
                key={i}
                fill={entry.changePercent >= 0 ? 'url(#momUp)' : 'url(#momDown)'}
              />
            ))}
            <LabelList dataKey="changePercent" position="top" fontSize={11} fontWeight={600} fill="#334155" formatter={(v) => `${v.toFixed(0)}%`} />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}
