import { useState, useMemo } from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, LabelList } from 'recharts';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import ChartCard from '../common/ChartCard';
import { useWallet, useWalletAnalytics } from '../../context/WalletContext';
import { formatMonthYear, formatShortYear, formatCurrency, abbreviateCurrency } from '../../utils/formatters';
import useChartTheme from '../../hooks/useChartTheme';

type VisibleKey = 'income' | 'expense' | 'net';

export default function ExpenseIncomeBreakdown() {
  const chart = useChartTheme();
  const { filters } = useWallet();
  const { periodData } = useWalletAnalytics();
  const [visible, setVisible] = useState<VisibleKey[]>(['income', 'expense', 'net']);

  const dataWithNet = useMemo(
    () => periodData.map((d) => ({ ...d, net: d.income - d.expense })),
    [periodData]
  );

  const handleToggle = (_: unknown, newVisible: VisibleKey[]) => {
    if (newVisible.length > 0) setVisible(newVisible);
  };

  const formatLabel = (value: string) =>
    filters.periodMode === 'yearly' ? formatShortYear(value) : formatMonthYear(value);

  const showLabels = dataWithNet.length <= 12;

  const toggles = (
    <ToggleButtonGroup
      size="small"
      value={visible}
      onChange={handleToggle}
    >
      <ToggleButton value="income" style={{ color: '#10b981' }}>Income</ToggleButton>
      <ToggleButton value="expense" style={{ color: '#ef4444' }}>Expense</ToggleButton>
      <ToggleButton value="net" style={{ color: '#6366f1' }}>Net</ToggleButton>
    </ToggleButtonGroup>
  );

  return (
    <ChartCard
      title="Income vs Expenses"
      subtitle={`By ${filters.periodMode === 'yearly' ? 'year' : 'month'}`}
      action={toggles}
    >
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={dataWithNet} margin={{ top: 20, right: 20, bottom: 5, left: 10 }}>
          <defs>
            <linearGradient id="incomeGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#34d399" />
              <stop offset="100%" stopColor="#10b981" />
            </linearGradient>
            <linearGradient id="expenseGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#f87171" />
              <stop offset="100%" stopColor="#ef4444" />
            </linearGradient>
            <linearGradient id="netGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#818cf8" />
              <stop offset="100%" stopColor="#6366f1" />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke={chart.gridStroke} />
          <XAxis dataKey="period" tickFormatter={formatLabel} fontSize={13} tick={chart.tick} />
          <YAxis fontSize={13} tick={chart.tick} tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
          <Tooltip formatter={((value: number) => formatCurrency(value)) as never} labelFormatter={(l: unknown) => formatLabel(String(l))} />
          <Legend wrapperStyle={{ fontWeight: 600, fontSize: 13 }} />
          {visible.includes('income') && (
            <Bar dataKey="income" name="Income" fill="url(#incomeGrad)" radius={[6, 6, 0, 0]} activeBar={false}>
              {showLabels && <LabelList dataKey="income" position="top" fontSize={11} fontWeight={600} fill={chart.labelFill} formatter={(v: unknown) => abbreviateCurrency(Number(v))} />}
            </Bar>
          )}
          {visible.includes('expense') && (
            <Bar dataKey="expense" name="Expenses" fill="url(#expenseGrad)" radius={[6, 6, 0, 0]} activeBar={false}>
              {showLabels && <LabelList dataKey="expense" position="top" fontSize={11} fontWeight={600} fill={chart.labelFill} formatter={(v: unknown) => abbreviateCurrency(Number(v))} />}
            </Bar>
          )}
          {visible.includes('net') && (
            <Bar dataKey="net" name="Net" fill="url(#netGrad)" radius={[6, 6, 0, 0]} activeBar={false}>
              {showLabels && <LabelList dataKey="net" position="top" fontSize={11} fontWeight={600} fill={chart.labelFill} formatter={(v: unknown) => abbreviateCurrency(Number(v))} />}
            </Bar>
          )}
        </BarChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}
