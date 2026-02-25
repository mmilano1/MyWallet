import { format } from 'date-fns';

export function formatCurrency(amount, currency = 'EUR') {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function formatNumber(num) {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(num);
}

export function formatPercent(value) {
  return `${(value * 100).toFixed(1)}%`;
}

export function formatDate(date) {
  return format(date, "MMM d, ''yy");
}

export function formatMonthYear(monthKey) {
  const [year, month] = monthKey.split('-');
  const date = new Date(Number(year), Number(month) - 1);
  return format(date, "MMM ''yy");
}

export function formatShortMonth(monthKey) {
  const [, month] = monthKey.split('-');
  const date = new Date(2000, Number(month) - 1);
  return format(date, 'MMM');
}

export function formatShortYear(yearStr) {
  return "'" + String(yearStr).slice(-2);
}

export function abbreviateCurrency(amount) {
  const abs = Math.abs(amount);
  if (abs >= 1_000_000) return `${(amount / 1_000_000).toFixed(1)}M`;
  if (abs >= 1_000) return `${(amount / 1_000).toFixed(1)}K`;
  return amount.toFixed(0);
}
