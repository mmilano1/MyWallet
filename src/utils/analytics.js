import { format, differenceInDays, getDaysInMonth, getDay, getHours } from 'date-fns';

function isIncome(t) {
  return t.type === 'income';
}

function isExpense(t) {
  return t.type === 'expense';
}

export function computeSummary(transactions) {
  const totalIncome = transactions.filter(isIncome).reduce((s, t) => s + Math.abs(t.amount), 0);
  const totalExpense = transactions.filter(isExpense).reduce((s, t) => s + Math.abs(t.amount), 0);
  const net = totalIncome - totalExpense;

  // Average daily spend
  let avgDailySpend = 0;
  const expenses = transactions.filter(isExpense);
  if (expenses.length > 0) {
    const dates = expenses.map((t) => t.date);
    const minDate = new Date(Math.min(...dates));
    const maxDate = new Date(Math.max(...dates));
    const days = Math.max(differenceInDays(maxDate, minDate), 1);
    avgDailySpend = totalExpense / days;
  }

  return { totalIncome, totalExpense, net, avgDailySpend, transactionCount: transactions.length };
}

export function groupByPeriod(transactions, periodMode) {
  const groups = {};

  for (const t of transactions) {
    const key = periodMode === 'yearly' ? String(t.year) : t.monthKey;
    if (!groups[key]) {
      groups[key] = { period: key, income: 0, expense: 0 };
    }
    if (isIncome(t)) {
      groups[key].income += Math.abs(t.amount);
    } else if (isExpense(t)) {
      groups[key].expense += Math.abs(t.amount);
    }
  }

  return Object.values(groups).sort((a, b) => a.period.localeCompare(b.period));
}

export function groupByCategory(transactions) {
  const expenses = transactions.filter(isExpense);
  const groups = {};

  for (const t of expenses) {
    const cat = t.category;
    if (!groups[cat]) {
      groups[cat] = { category: cat, amount: 0, count: 0 };
    }
    groups[cat].amount += Math.abs(t.amount);
    groups[cat].count += 1;
  }

  return Object.values(groups).sort((a, b) => b.amount - a.amount);
}

export function computeSpendingTrends(transactions) {
  const expenses = transactions.filter(isExpense);
  const groups = {};

  for (const t of expenses) {
    const dayKey = format(t.date, 'yyyy-MM-dd');
    if (!groups[dayKey]) {
      groups[dayKey] = { date: dayKey, amount: 0 };
    }
    groups[dayKey].amount += Math.abs(t.amount);
  }

  // Sort and compute cumulative
  const sorted = Object.values(groups).sort((a, b) => a.date.localeCompare(b.date));
  let cumulative = 0;
  return sorted.map((d) => {
    cumulative += d.amount;
    return { ...d, cumulative };
  });
}

export function groupByPaymentType(transactions) {
  const groups = {};

  for (const t of transactions) {
    const pt = t.paymentType || 'other';
    if (!groups[pt]) {
      groups[pt] = { paymentType: pt, amount: 0, count: 0 };
    }
    groups[pt].amount += Math.abs(t.amount);
    groups[pt].count += 1;
  }

  return Object.values(groups).sort((a, b) => b.amount - a.amount);
}

export function computeTopPayees(transactions, limit = 10) {
  const expenses = transactions.filter(isExpense);
  const groups = {};

  for (const t of expenses) {
    const payee = t.payee || 'Unknown';
    if (!groups[payee]) {
      groups[payee] = { payee, amount: 0, count: 0 };
    }
    groups[payee].amount += Math.abs(t.amount);
    groups[payee].count += 1;
  }

  return Object.values(groups)
    .sort((a, b) => b.amount - a.amount)
    .slice(0, limit);
}

export function computeAccountSummary(transactions) {
  const groups = {};

  for (const t of transactions) {
    const acc = t.account;
    if (!groups[acc]) {
      groups[acc] = { account: acc, income: 0, expense: 0, count: 0 };
    }
    if (isIncome(t)) {
      groups[acc].income += Math.abs(t.amount);
    } else if (isExpense(t)) {
      groups[acc].expense += Math.abs(t.amount);
    }
    groups[acc].count += 1;
  }

  return Object.values(groups)
    .map((g) => ({ ...g, net: g.income - g.expense }))
    .sort((a, b) => b.net - a.net);
}

export function getAvailableYears(transactions) {
  const years = [...new Set(transactions.map((t) => t.year))];
  return years.sort((a, b) => b - a);
}

export function getAvailableMonths(transactions, year) {
  if (!year) return [];
  const months = [
    ...new Set(transactions.filter((t) => t.year === year).map((t) => t.monthKey)),
  ];
  return months.sort();
}

export function getAvailableCategories(transactions) {
  return [...new Set(transactions.map((t) => t.category))].sort();
}

export function getAvailableAccounts(transactions) {
  return [...new Set(transactions.map((t) => t.account))].sort();
}

export function computeMonthlyAvgDailySpend(transactions) {
  const expenses = transactions.filter(isExpense);
  const groups = {};

  for (const t of expenses) {
    const mk = t.monthKey;
    if (!groups[mk]) {
      groups[mk] = { monthKey: mk, total: 0, date: t.date };
    }
    groups[mk].total += Math.abs(t.amount);
  }

  return Object.values(groups)
    .map((g) => {
      const [year, month] = g.monthKey.split('-').map(Number);
      const days = getDaysInMonth(new Date(year, month - 1));
      return { monthKey: g.monthKey, avgDaily: g.total / days, total: g.total };
    })
    .sort((a, b) => a.monthKey.localeCompare(b.monthKey));
}

const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const DAY_ORDER = [1, 2, 3, 4, 5, 6, 0]; // Mon-Sun

export function computeDayOfWeekSpending(transactions) {
  const expenses = transactions.filter(isExpense);
  const totals = Array(7).fill(0);
  const counts = Array(7).fill(0);

  for (const t of expenses) {
    const day = getDay(t.date); // 0=Sun ... 6=Sat
    totals[day] += Math.abs(t.amount);
    counts[day] += 1;
  }

  return DAY_ORDER.map((d) => ({
    dayName: DAY_NAMES[d],
    total: totals[d],
    avg: counts[d] > 0 ? totals[d] / counts[d] : 0,
  }));
}

export function computeSavingsRate(transactions) {
  const groups = {};

  for (const t of transactions) {
    const mk = t.monthKey;
    if (!groups[mk]) {
      groups[mk] = { monthKey: mk, income: 0, expense: 0 };
    }
    if (isIncome(t)) {
      groups[mk].income += Math.abs(t.amount);
    } else if (isExpense(t)) {
      groups[mk].expense += Math.abs(t.amount);
    }
  }

  return Object.values(groups)
    .map((g) => ({
      monthKey: g.monthKey,
      income: g.income,
      expense: g.expense,
      savingsRate: g.income > 0 ? ((g.income - g.expense) / g.income) * 100 : 0,
    }))
    .sort((a, b) => a.monthKey.localeCompare(b.monthKey));
}

export function computeSpendingByHour(transactions) {
  const expenses = transactions.filter(isExpense);
  const totals = Array(24).fill(0);
  const counts = Array(24).fill(0);

  for (const t of expenses) {
    const hour = getHours(t.date);
    totals[hour] += Math.abs(t.amount);
    counts[hour] += 1;
  }

  return Array.from({ length: 24 }, (_, h) => ({
    hour: h,
    label: `${h.toString().padStart(2, '0')}:00`,
    total: totals[h],
    avg: counts[h] > 0 ? totals[h] / counts[h] : 0,
    count: counts[h],
  }));
}

export function computeAvgSpendByCategory(transactions, limit = 12) {
  const expenses = transactions.filter(isExpense);
  const groups = {};

  for (const t of expenses) {
    const cat = t.category;
    if (!groups[cat]) {
      groups[cat] = { category: cat, total: 0, count: 0 };
    }
    groups[cat].total += Math.abs(t.amount);
    groups[cat].count += 1;
  }

  return Object.values(groups)
    .map((g) => ({ ...g, avgSpend: g.total / g.count }))
    .sort((a, b) => b.avgSpend - a.avgSpend)
    .slice(0, limit);
}

export function computeMonthOverMonth(transactions) {
  const expenses = transactions.filter(isExpense);
  const groups = {};

  for (const t of expenses) {
    const mk = t.monthKey;
    if (!groups[mk]) groups[mk] = 0;
    groups[mk] += Math.abs(t.amount);
  }

  const sorted = Object.entries(groups).sort(([a], [b]) => a.localeCompare(b));

  return sorted.map(([monthKey, total], i) => {
    const prev = i > 0 ? sorted[i - 1][1] : null;
    const changePercent = prev !== null && prev > 0 ? ((total - prev) / prev) * 100 : 0;
    return { monthKey, total, changePercent };
  });
}
