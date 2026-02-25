import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import ChartCard from '../common/ChartCard';
import { useWalletAnalytics } from '../../context/WalletContext';
import { formatCurrency } from '../../utils/formatters';

export default function TopPayees() {
  const { topPayees } = useWalletAnalytics();

  return (
    <ChartCard title="Top 10 Payees" subtitle="By total spending" height={350}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={topPayees}
          layout="vertical"
          margin={{ top: 5, right: 20, bottom: 5, left: 100 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#eee" horizontal={false} />
          <XAxis type="number" fontSize={12} tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
          <YAxis
            type="category"
            dataKey="payee"
            fontSize={12}
            width={90}
            tick={{ fill: '#555' }}
          />
          <Tooltip formatter={(value) => formatCurrency(value)} />
          <Bar dataKey="amount" name="Total Spent" fill="#1565c0" radius={[0, 4, 4, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}
