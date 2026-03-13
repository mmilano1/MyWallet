import { getDaysInMonth } from 'date-fns';
import type { Transaction, SpendingProfile, PredictionResult } from '../types';

function isExpense(t: Transaction): boolean {
  return t.type === 'expense';
}

function isIncome(t: Transaction): boolean {
  return t.type === 'income';
}

export function getAvailableProfileYears(transactions: Transaction[]): string[] {
  const years = new Set<string>();
  for (const t of transactions) {
    if (t.monthKey) years.add(t.monthKey.slice(0, 4));
  }
  return [...years].sort();
}

export function buildSpendingProfile(transactions: Transaction[], selectedYears: string[] | null = null): SpendingProfile {
  const filtered = selectedYears && selectedYears.length > 0
    ? transactions.filter((t) => selectedYears.includes(t.monthKey?.slice(0, 4)))
    : transactions;

  const expenses = filtered.filter(isExpense);
  const catMonths: Record<string, Record<string, number>> = {};
  const monthSet = new Set<string>();

  for (const t of expenses) {
    const cat = t.category;
    const mk = t.monthKey;
    monthSet.add(mk);
    if (!catMonths[cat]) catMonths[cat] = {};
    catMonths[cat][mk] = (catMonths[cat][mk] || 0) + Math.abs(t.amount);
  }

  const months = [...monthSet].sort();
  const categories = Object.keys(catMonths).sort(
    (a, b) => {
      const totalA = Object.values(catMonths[a]).reduce((s, v) => s + v, 0);
      const totalB = Object.values(catMonths[b]).reduce((s, v) => s + v, 0);
      return totalB - totalA;
    }
  );

  const avgMonthly: Record<string, number> = {};
  for (const cat of categories) {
    const vals = Object.values(catMonths[cat]);
    avgMonthly[cat] = vals.reduce((s, v) => s + v, 0) / Math.max(months.length, 1);
  }

  const incomeByMonth: Record<string, number> = {};
  for (const t of filtered.filter(isIncome)) {
    incomeByMonth[t.monthKey] = (incomeByMonth[t.monthKey] || 0) + Math.abs(t.amount);
  }
  const incomeMonths = Object.values(incomeByMonth);
  const avgMonthlyIncome = incomeMonths.length > 0
    ? incomeMonths.reduce((s, v) => s + v, 0) / incomeMonths.length
    : 0;

  return {
    categories,
    avgMonthly,
    avgMonthlyIncome,
    historicalMonths: months.length,
    selectedYears: selectedYears || [],
  };
}

export function generatePrediction(
  profile: SpendingProfile,
  targetYear: number,
  adjustments: Record<string, number> = {},
  monthlyIncome: number | null = null,
): PredictionResult {
  const income = monthlyIncome !== null ? monthlyIncome : profile.avgMonthlyIncome;
  const months: PredictionResult['months'] = [];

  for (let m = 1; m <= 12; m++) {
    const mk = `${targetYear}-${String(m).padStart(2, '0')}`;
    const daysInMonth = getDaysInMonth(new Date(targetYear, m - 1));
    let totalExpense = 0;
    const categoryBreakdown: Record<string, number> = {};

    for (const cat of profile.categories) {
      const base = profile.avgMonthly[cat] || 0;
      const multiplier = adjustments[cat] !== undefined ? adjustments[cat] : 1;
      const adjusted = base * multiplier;
      categoryBreakdown[cat] = adjusted;
      totalExpense += adjusted;
    }

    months.push({
      monthKey: mk,
      month: m,
      income,
      expense: totalExpense,
      net: income - totalExpense,
      avgDaily: totalExpense / daysInMonth,
      ...categoryBreakdown,
    });
  }

  const totalExpense = months.reduce((s, m) => s + m.expense, 0);
  const totalIncome = months.reduce((s, m) => s + m.income, 0);

  return {
    months,
    totalExpense,
    totalIncome,
    totalNet: totalIncome - totalExpense,
    avgDailySpend: totalExpense / 365,
  };
}
