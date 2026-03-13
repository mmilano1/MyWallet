import { useState, useMemo } from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, LabelList } from 'recharts';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import Chip from '@mui/material/Chip';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';
import ChartCard from '../common/ChartCard';
import { useWalletAnalytics } from '../../context/WalletContext';
import { formatCurrency, formatShortMonth, abbreviateCurrency } from '../../utils/formatters';
import useChartTheme from '../../hooks/useChartTheme';

const COLORS = ['#6366f1', '#ef4444', '#10b981', '#f59e0b', '#a855f7', '#06b6d4', '#ec4899', '#f97316'];
const MAX_CATEGORIES = 6;

const CategoryPicker = styled(Autocomplete)({
  minWidth: 200,
  maxWidth: 400,
}) as typeof Autocomplete;

interface CategoryChipProps {
  chipColor: string;
}

const CategoryChip = styled(Chip, {
  shouldForwardProp: (prop) => prop !== 'chipColor',
})<CategoryChipProps>(({ chipColor }) => ({
  backgroundColor: chipColor + '18',
  color: chipColor,
  fontWeight: 600,
  borderRadius: '8px',
}));

export default function CategoryComparison() {
  const chart = useChartTheme();
  const { filteredTransactions, availableCategories } = useWalletAnalytics();
  const [selected, setSelected] = useState<string[]>([]);

  const chartData = useMemo(() => {
    if (selected.length === 0) return [];

    const groups: Record<string, Record<string, string | number>> = {};
    for (const t of filteredTransactions) {
      if (t.type !== 'expense') continue;
      if (!selected.includes(t.category)) continue;
      const mk = t.monthKey;
      if (!groups[mk]) groups[mk] = { monthKey: mk };
      groups[mk][t.category] = ((groups[mk][t.category] as number) || 0) + Math.abs(t.amount);
    }

    return Object.values(groups).sort((a, b) => (a.monthKey as string).localeCompare(b.monthKey as string));
  }, [filteredTransactions, selected]);

  const showLabels = chartData.length <= 12 && selected.length <= 3;

  const picker = (
    <CategoryPicker
      multiple
      size="small"
      options={availableCategories}
      value={selected}
      onChange={(_, newVal) => setSelected((newVal as string[]).slice(0, MAX_CATEGORIES))}
      renderInput={(params) => (
        <TextField {...params} placeholder={selected.length === 0 ? 'Pick categories...' : ''} />
      )}
      renderTags={(value, getTagProps) =>
        (value as string[]).map((option, index) => (
          <CategoryChip
            {...getTagProps({ index })}
            key={option}
            label={option}
            size="small"
            chipColor={COLORS[index % COLORS.length]}
          />
        ))
      }
      disableCloseOnSelect
    />
  );

  return (
    <ChartCard title="Category Comparison" subtitle="Compare spending across months" height={350} action={picker}>
      {selected.length === 0 ? (
        <Box display="flex" alignItems="center" justifyContent="center" height="100%">
          <Typography color="text.secondary" fontWeight={500}>
            Select up to {MAX_CATEGORIES} categories to compare
          </Typography>
        </Box>
      ) : (
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 20, right: 20, bottom: 5, left: 10 }}>
            <defs>
              {selected.map((_, i) => (
                <linearGradient key={i} id={`cmpGrad${i}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={COLORS[i % COLORS.length]} stopOpacity={0.9} />
                  <stop offset="100%" stopColor={COLORS[i % COLORS.length]} />
                </linearGradient>
              ))}
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke={chart.gridStroke} />
            <XAxis dataKey="monthKey" tickFormatter={formatShortMonth} fontSize={13} tick={chart.tick} />
            <YAxis fontSize={13} tick={chart.tick} tickFormatter={(v) => abbreviateCurrency(v)} />
            <Tooltip formatter={((value: number) => formatCurrency(value)) as never} labelFormatter={(l: unknown) => String(l)} />
            <Legend wrapperStyle={{ fontWeight: 600, fontSize: 13 }} />
            {selected.map((cat, i) => (
              <Bar key={cat} dataKey={cat} name={cat} fill={`url(#cmpGrad${i})`} radius={[6, 6, 0, 0]} activeBar={false}>
                {showLabels && (
                  <LabelList dataKey={cat} position="top" fontSize={10} fontWeight={600} fill={chart.labelFill} formatter={(v: unknown) => Number(v) ? abbreviateCurrency(Number(v)) : ''} />
                )}
              </Bar>
            ))}
          </BarChart>
        </ResponsiveContainer>
      )}
    </ChartCard>
  );
}
