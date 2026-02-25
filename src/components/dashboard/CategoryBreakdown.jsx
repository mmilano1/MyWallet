import { useState, useMemo } from 'react';
import {
  ResponsiveContainer, PieChart, Pie, Cell, Tooltip,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, LabelList,
} from 'recharts';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Chip from '@mui/material/Chip';
import ChartCard from '../common/ChartCard';
import { useWalletAnalytics } from '../../context/WalletContext';
import { formatCurrency, formatDate, abbreviateCurrency } from '../../utils/formatters';
import useChartTheme from '../../hooks/useChartTheme';

const COLORS = [
  '#6366f1', '#ef4444', '#10b981', '#f59e0b', '#a855f7',
  '#06b6d4', '#ec4899', '#8b5cf6', '#14b8a6', '#f97316',
  '#0ea5e9', '#84cc16', '#e11d48', '#22d3ee', '#d946ef',
];

export default function CategoryBreakdown() {
  const chart = useChartTheme();
  const { categoryData, rawTransactions } = useWalletAnalytics();
  const [expanded, setExpanded] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);

  const handleSliceClick = (_, index) => {
    setSelectedCategory(categoryData[index]?.category || null);
    setExpanded(true);
  };

  const handleBarClick = (data) => {
    if (data?.category) setSelectedCategory(data.category);
  };

  const categoryTransactions = useMemo(() => {
    if (!selectedCategory) return [];
    return rawTransactions
      .filter((t) => t.type === 'expense' && t.category === selectedCategory)
      .sort((a, b) => b.date - a.date);
  }, [rawTransactions, selectedCategory]);

  const expandedContent = (
    <Box display="flex" gap={3} height="100%">
      <Box flex="0 0 40%" height="100%">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={categoryData}
            layout="vertical"
            margin={{ top: 5, right: 60, bottom: 5, left: 100 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke={chart.gridStroke} horizontal={false} />
            <XAxis type="number" fontSize={13} tick={chart.tick} tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
            <YAxis type="category" dataKey="category" fontSize={13} width={90} tick={chart.tick} />
            <Tooltip formatter={(value) => formatCurrency(value)} />
            <Bar
              dataKey="amount"
              name="Total Spent"
              radius={[0, 8, 8, 0]}
              cursor="pointer"
              onClick={handleBarClick}
            >
              {categoryData.map((entry, i) => (
                <Cell
                  key={entry.category}
                  fill={entry.category === selectedCategory ? '#6366f1' : COLORS[i % COLORS.length]}
                  opacity={selectedCategory && entry.category !== selectedCategory ? 0.35 : 1}
                />
              ))}
              <LabelList
                dataKey="amount"
                position="right"
                fontSize={11}
                fill={chart.labelFill}
                formatter={(v) => abbreviateCurrency(v)}
              />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </Box>

      <Box flex={1} display="flex" flexDirection="column" minWidth={0}>
        {selectedCategory ? (
          <>
            <Box display="flex" alignItems="center" gap={1} mb={1}>
              <Chip
                label={selectedCategory}
                color="primary"
                size="small"
                onDelete={() => setSelectedCategory(null)}
                sx={{ borderRadius: '8px' }}
              />
              <Typography variant="body2" color="text.secondary">
                {categoryTransactions.length} transactions (all time)
              </Typography>
            </Box>
            <TableContainer sx={{ flex: 1, overflow: 'auto' }}>
              <Table size="small" stickyHeader>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 600 }}>Date</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Payee</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 600 }}>Amount</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Note</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {categoryTransactions.map((t, i) => (
                    <TableRow key={i} hover>
                      <TableCell sx={{ whiteSpace: 'nowrap' }}>{formatDate(t.date)}</TableCell>
                      <TableCell>{t.payee || '-'}</TableCell>
                      <TableCell align="right" sx={{ color: '#ef4444', fontWeight: 500 }}>
                        {formatCurrency(Math.abs(t.amount))}
                      </TableCell>
                      <TableCell sx={{ maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {t.note || '-'}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </>
        ) : (
          <Box display="flex" alignItems="center" justifyContent="center" height="100%">
            <Typography color="text.secondary">Click a category bar to see transactions</Typography>
          </Box>
        )}
      </Box>
    </Box>
  );

  return (
    <ChartCard
      title="Spending by Category"
      height={260}
      expandedHeight={520}
      expandedContent={expandedContent}
      expanded={expanded}
      onClose={() => { setExpanded(false); setSelectedCategory(null); }}
    >
      <Box display="flex" flexDirection="column" height="100%">
        <Box flex={1} minHeight={0}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={categoryData}
                dataKey="amount"
                nameKey="category"
                cx="50%"
                cy="50%"
                outerRadius="80%"
                innerRadius="45%"
                cursor="pointer"
                onClick={handleSliceClick}
              >
                {categoryData.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => formatCurrency(value)} />
            </PieChart>
          </ResponsiveContainer>
        </Box>
        <Box display="flex" flexWrap="wrap" gap={0.5} mt={1}>
          {categoryData.slice(0, 10).map((item, i) => (
            <Box key={item.category} display="flex" alignItems="center" gap={0.5} mr={1}>
              <Box
                sx={{
                  width: 10,
                  height: 10,
                  borderRadius: '50%',
                  bgcolor: COLORS[i % COLORS.length],
                  flexShrink: 0,
                }}
              />
              <Typography variant="caption" noWrap>
                {item.category}
              </Typography>
            </Box>
          ))}
          {categoryData.length > 10 && (
            <Typography variant="caption" color="text.secondary">
              +{categoryData.length - 10} more
            </Typography>
          )}
        </Box>
      </Box>
    </ChartCard>
  );
}
