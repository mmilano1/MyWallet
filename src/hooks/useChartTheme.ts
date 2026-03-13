import { useTheme } from '@mui/material/styles';
import type { ChartTheme } from '../types';

export default function useChartTheme(): ChartTheme {
  const theme = useTheme();
  const dark = theme.palette.mode === 'dark';
  return {
    tick: { fill: dark ? '#e2e8f0' : '#334155', fontWeight: 600 },
    labelFill: dark ? '#e2e8f0' : '#334155',
    labelFillSecondary: dark ? '#94a3b8' : '#64748b',
    gridStroke: dark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)',
    tooltipBg: dark ? '#1e293b' : '#ffffff',
    tooltipBorder: dark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.06)',
    refLineStroke: dark ? '#475569' : '#94a3b8',
  };
}
