import { useState, useMemo } from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell, LabelList } from 'recharts';
import Box from '@mui/material/Box';
import Slider from '@mui/material/Slider';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';
import ChartCard from '../common/ChartCard';
import { useWalletAnalytics } from '../../context/WalletContext';
import { formatCurrency, abbreviateCurrency } from '../../utils/formatters';
import { groupByCategory } from '../../utils/analytics';
import useChartTheme from '../../hooks/useChartTheme';

const COLORS = [
  '#06b6d4', '#0ea5e9', '#6366f1', '#8b5cf6', '#a855f7',
  '#ec4899', '#f43f5e', '#f97316', '#f59e0b', '#10b981',
  '#14b8a6', '#84cc16',
];

const SliderLabel = styled(Typography)({
  fontWeight: 600,
});

const CompactSlider = styled(Slider)(({ theme }) => ({
  width: 80,
  color: theme.palette.primary.main,
}));

interface TooltipBoxProps {
  tooltipBg: string;
  tooltipBorder: string;
}

const TooltipBox = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'tooltipBg' && prop !== 'tooltipBorder',
})<TooltipBoxProps>(({ tooltipBg, tooltipBorder }) => ({
  backgroundColor: tooltipBg,
  padding: 12,
  borderRadius: 8,
  boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
  border: `1px solid ${tooltipBorder}`,
}));

export default function AvgSpendByCategory() {
  const chart = useChartTheme();
  const { filteredTransactions } = useWalletAnalytics();
  const [minTxns, setMinTxns] = useState(10);

  const data = useMemo(() => {
    const cats = groupByCategory(filteredTransactions);
    return cats
      .filter((c) => c.count >= minTxns)
      .map((c) => ({ ...c, avgSpend: c.amount / c.count }))
      .sort((a, b) => b.avgSpend - a.avgSpend)
      .slice(0, 12);
  }, [filteredTransactions, minTxns]);

  const maxCount = useMemo(() => {
    const cats = groupByCategory(filteredTransactions);
    return cats.length > 0 ? Math.max(...cats.map((c) => c.count)) : 50;
  }, [filteredTransactions]);

  const slider = (
    <Box display="flex" alignItems="center" gap={1} minWidth={160}>
      <SliderLabel variant="caption" color="text.secondary" noWrap>
        Min {minTxns} txns
      </SliderLabel>
      <CompactSlider
        value={minTxns}
        onChange={(_, v) => setMinTxns(v as number)}
        min={1}
        max={Math.min(maxCount, 100)}
        step={1}
        size="small"
      />
    </Box>
  );

  return (
    <ChartCard title="Avg Spend per Transaction" subtitle="Filter out rare categories" height={350} action={slider}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          layout="vertical"
          margin={{ top: 5, right: 60, bottom: 5, left: 100 }}
        >
          <defs>
            {COLORS.map((color, i) => (
              <linearGradient key={i} id={`avgCatGrad${i}`} x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor={color} stopOpacity={0.8} />
                <stop offset="100%" stopColor={color} />
              </linearGradient>
            ))}
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke={chart.gridStroke} horizontal={false} />
          <XAxis type="number" fontSize={13} tick={chart.tick} tickFormatter={(v) => abbreviateCurrency(v)} />
          <YAxis
            type="category"
            dataKey="category"
            fontSize={13}
            width={90}
            tick={chart.tick}
          />
          <Tooltip
            formatter={((value: number, name: string) => [
              formatCurrency(value),
              name === 'avgSpend' ? 'Avg per transaction' : name,
            ]) as never}
            content={({ payload, label }) => {
              if (!payload?.length) return null;
              const d = payload[0].payload;
              return (
                <TooltipBox tooltipBg={chart.tooltipBg} tooltipBorder={chart.tooltipBorder}>
                  <Typography variant="body2" fontWeight={700}>{label}</Typography>
                  <Typography variant="body2">Avg: {formatCurrency(d.avgSpend)}</Typography>
                  <Typography variant="body2" color="text.secondary">{d.count} transactions, {formatCurrency(d.amount)} total</Typography>
                </TooltipBox>
              );
            }}
          />
          <Bar dataKey="avgSpend" name="Avg Spend" radius={[0, 8, 8, 0]} activeBar={false}>
            {data.map((_, i) => (
              <Cell key={i} fill={`url(#avgCatGrad${i})`} />
            ))}
            <LabelList dataKey="avgSpend" position="right" fontSize={12} fontWeight={600} fill={chart.labelFill} formatter={(v: unknown) => abbreviateCurrency(Number(v))} />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}
