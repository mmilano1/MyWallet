import { useState, useMemo } from 'react';
import {
  ResponsiveContainer, LineChart, Line, XAxis, YAxis,
  CartesianGrid, Tooltip, Legend,
} from 'recharts';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Slider from '@mui/material/Slider';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import Autocomplete from '@mui/material/Autocomplete';
import { useWallet } from '../../context/WalletContext';
import { buildSpendingProfile, generatePrediction, getAvailableProfileYears } from '../../utils/predictions';
import { formatCurrency, formatShortMonth, abbreviateCurrency } from '../../utils/formatters';
import useChartTheme from '../../hooks/useChartTheme';

const CAT_COLORS = [
  '#6366f1', '#ef4444', '#10b981', '#f59e0b', '#a855f7',
  '#06b6d4', '#ec4899', '#f97316', '#0ea5e9', '#84cc16',
  '#14b8a6', '#e11d48',
];

function SummaryCard({ label, value, color, sub }) {
  return (
    <Card sx={{ background: `${color}10`, border: 'none', borderTop: `3px solid ${color}` }}>
      <CardContent sx={{ py: 1.5, '&:last-child': { pb: 1.5 } }}>
        <Typography variant="body2" color="text.secondary" fontWeight={600}>{label}</Typography>
        <Typography variant="h6" fontWeight={700} sx={{ color }}>{value}</Typography>
        {sub && <Typography variant="caption" color="text.secondary">{sub}</Typography>}
      </CardContent>
    </Card>
  );
}

export default function PredictionsLayout() {
  const { rawTransactions } = useWallet();
  const chart = useChartTheme();
  const [adjustments, setAdjustments] = useState({});
  const [wage, setWage] = useState('');
  const [selectedYears, setSelectedYears] = useState([]);

  const availableYears = useMemo(
    () => getAvailableProfileYears(rawTransactions),
    [rawTransactions]
  );

  const profile = useMemo(
    () => buildSpendingProfile(rawTransactions, selectedYears.length > 0 ? selectedYears : null),
    [rawTransactions, selectedYears]
  );

  const currentYear = new Date().getFullYear();
  const targetYear = currentYear;
  const monthlyIncome = wage !== '' ? parseFloat(wage) || 0 : null;

  const baseline = useMemo(
    () => generatePrediction(profile, targetYear, {}, monthlyIncome),
    [profile, targetYear, monthlyIncome]
  );

  const adjusted = useMemo(
    () => generatePrediction(profile, targetYear, adjustments, monthlyIncome),
    [profile, targetYear, adjustments, monthlyIncome]
  );

  const topCategories = profile.categories.slice(0, 12);
  const hasAdjustments = Object.values(adjustments).some((v) => v !== 1 && v !== undefined);

  const comparisonData = baseline.months.map((bm, i) => ({
    monthKey: bm.monthKey,
    baseline: bm.expense,
    adjusted: adjusted.months[i].expense,
  }));

  const handleSlider = (cat, value) => {
    setAdjustments((prev) => ({ ...prev, [cat]: value / 100 }));
  };

  const resetAll = () => setAdjustments({});

  const savingsDiff = adjusted.totalNet - baseline.totalNet;
  const yearsLabel = selectedYears.length > 0
    ? selectedYears.map((y) => `'${y.slice(2)}`).join(', ')
    : 'all years';

  return (
    <Box sx={{ p: { xs: 2, md: 3 }, maxWidth: 1400, mx: 'auto' }}>
      <Box mb={3}>
        <Typography variant="h5" fontWeight={700}>
          {targetYear} Spending Predictions
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Based on {profile.historicalMonths} months of data ({yearsLabel}). Adjust category budgets to see the impact.
        </Typography>
      </Box>

      {/* Controls: year picker + wage input */}
      <Grid container spacing={2} mb={3}>
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <Autocomplete
            multiple
            size="small"
            options={availableYears}
            value={selectedYears}
            onChange={(_, newVal) => { setSelectedYears(newVal); setAdjustments({}); }}
            renderInput={(params) => (
              <TextField {...params} label="Base years" placeholder={selectedYears.length === 0 ? 'All years' : ''} />
            )}
            renderTags={(value, getTagProps) =>
              value.map((option, index) => (
                <Chip
                  {...getTagProps({ index })}
                  key={option}
                  label={`'${option.slice(2)}`}
                  size="small"
                  sx={{ fontWeight: 600 }}
                />
              ))
            }
            disableCloseOnSelect
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <TextField
            label="Monthly wage"
            size="small"
            type="number"
            fullWidth
            value={wage}
            onChange={(e) => setWage(e.target.value)}
            placeholder={abbreviateCurrency(profile.avgMonthlyIncome)}
            slotProps={{
              input: {
                startAdornment: <InputAdornment position="start">$</InputAdornment>,
              },
            }}
            helperText={wage === '' ? `Using avg: ${formatCurrency(profile.avgMonthlyIncome)}` : ''}
          />
        </Grid>
      </Grid>

      {/* Summary row */}
      <Grid container spacing={2} mb={3}>
        <Grid size={{ xs: 6, sm: 3 }}>
          <SummaryCard
            label="Predicted Expenses"
            value={formatCurrency(baseline.totalExpense)}
            color="#ef4444"
            sub={`${abbreviateCurrency(baseline.avgDailySpend)}/day avg`}
          />
        </Grid>
        <Grid size={{ xs: 6, sm: 3 }}>
          <SummaryCard
            label="Income (yearly)"
            value={formatCurrency(baseline.totalIncome)}
            color="#10b981"
            sub={wage !== '' ? 'From wage input' : 'Historical avg'}
          />
        </Grid>
        <Grid size={{ xs: 6, sm: 3 }}>
          <SummaryCard
            label="Adjusted Expenses"
            value={formatCurrency(adjusted.totalExpense)}
            color="#a855f7"
            sub={hasAdjustments ? `${savingsDiff > 0 ? '+' : ''}${formatCurrency(savingsDiff)} net change` : 'No changes yet'}
          />
        </Grid>
        <Grid size={{ xs: 6, sm: 3 }}>
          <SummaryCard
            label="Adjusted Net"
            value={formatCurrency(adjusted.totalNet)}
            color={adjusted.totalNet >= 0 ? '#10b981' : '#ef4444'}
            sub={hasAdjustments && savingsDiff > 0 ? `Saving ${formatCurrency(savingsDiff)} more` : hasAdjustments && savingsDiff < 0 ? `Spending ${formatCurrency(Math.abs(savingsDiff))} more` : ''}
          />
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        {/* Left: Monthly comparison line chart */}
        <Grid size={{ xs: 12, lg: 7 }}>
          <Card>
            <CardContent>
              <Typography variant="h6" fontSize={16} mb={2}>Monthly Forecast</Typography>
              <Box height={400}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={comparisonData} margin={{ top: 20, right: 20, bottom: 5, left: 10 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke={chart.gridStroke} />
                    <XAxis dataKey="monthKey" tickFormatter={formatShortMonth} fontSize={13} tick={chart.tick} />
                    <YAxis fontSize={13} tick={chart.tick} tickFormatter={(v) => abbreviateCurrency(v)} />
                    <Tooltip formatter={(value) => formatCurrency(value)} labelFormatter={formatShortMonth} />
                    <Legend wrapperStyle={{ fontWeight: 600, fontSize: 13 }} />
                    <Line
                      type="monotone"
                      dataKey="baseline"
                      name="Baseline"
                      stroke="#ef4444"
                      strokeWidth={2.5}
                      dot={{ fill: '#ef4444', r: 4, strokeWidth: 0 }}
                      activeDot={{ r: 6, fill: '#ef4444', stroke: '#fff', strokeWidth: 2 }}
                    />
                    {hasAdjustments && (
                      <Line
                        type="monotone"
                        dataKey="adjusted"
                        name="Adjusted"
                        stroke="#a855f7"
                        strokeWidth={2.5}
                        strokeDasharray="6 3"
                        dot={{ fill: '#a855f7', r: 4, strokeWidth: 0 }}
                        activeDot={{ r: 6, fill: '#a855f7', stroke: '#fff', strokeWidth: 2 }}
                      />
                    )}
                  </LineChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Right: Category adjustment sliders */}
        <Grid size={{ xs: 12, lg: 5 }}>
          <Card>
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h6" fontSize={16}>Adjust Category Budgets</Typography>
                {hasAdjustments && (
                  <Chip label="Reset all" size="small" onClick={resetAll} clickable sx={{ fontWeight: 600 }} />
                )}
              </Box>
              <Typography variant="body2" color="text.secondary" mb={2}>
                Slide to adjust spending per category. 100% = keep current average.
              </Typography>

              <Box sx={{ maxHeight: 560, overflow: 'auto', pr: 1 }}>
                {topCategories.map((cat, i) => {
                  const base = profile.avgMonthly[cat] || 0;
                  const pct = (adjustments[cat] !== undefined ? adjustments[cat] : 1) * 100;
                  const adjustedAmt = base * (pct / 100);
                  const diff = adjustedAmt - base;
                  const color = CAT_COLORS[i % CAT_COLORS.length];

                  return (
                    <Box key={cat} mb={2}>
                      <Box display="flex" justifyContent="space-between" alignItems="baseline" mb={0.5}>
                        <Box display="flex" alignItems="center" gap={1}>
                          <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: color, flexShrink: 0 }} />
                          <Typography variant="body2" fontWeight={600} noWrap sx={{ maxWidth: 140 }}>
                            {cat}
                          </Typography>
                        </Box>
                        <Box textAlign="right">
                          <Typography variant="body2" fontWeight={700} sx={{ color: pct !== 100 ? '#6366f1' : 'text.primary' }}>
                            {formatCurrency(adjustedAmt)}/mo
                          </Typography>
                          {diff !== 0 && (
                            <Typography variant="caption" sx={{ color: diff < 0 ? '#10b981' : '#ef4444' }}>
                              {diff > 0 ? '+' : ''}{formatCurrency(diff)}/mo
                            </Typography>
                          )}
                        </Box>
                      </Box>
                      <Box display="flex" alignItems="center" gap={2}>
                        <Slider
                          value={pct}
                          onChange={(_, v) => handleSlider(cat, v)}
                          min={0}
                          max={200}
                          step={5}
                          size="small"
                          sx={{
                            color,
                            '& .MuiSlider-thumb': { width: 14, height: 14 },
                          }}
                        />
                        <Typography variant="caption" fontWeight={600} sx={{ minWidth: 40, textAlign: 'right', color: pct !== 100 ? '#6366f1' : 'text.secondary' }}>
                          {pct.toFixed(0)}%
                        </Typography>
                      </Box>
                      {i < topCategories.length - 1 && <Divider sx={{ mt: 1, opacity: 0.4 }} />}
                    </Box>
                  );
                })}
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
