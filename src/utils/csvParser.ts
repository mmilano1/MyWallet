import Papa from 'papaparse';
import { parse, isValid } from 'date-fns';
import type { Transaction } from '../types';

const DATE_FORMATS = ['dd/MM/yyyy', 'yyyy-MM-dd', 'MM/dd/yyyy', 'dd.MM.yyyy'];

interface CsvRow {
  date?: string;
  type?: string;
  category?: string;
  account?: string;
  payee?: string;
  ref_currency_amount?: string;
  refCurrencyAmount?: string;
  amount?: string;
  payment_type?: string;
  paymentType?: string;
  note?: string;
  labels?: string;
  currency?: string;
}

function parseDate(dateStr: string | undefined): Date | null {
  if (!dateStr) return null;
  const trimmed = dateStr.trim();
  for (const fmt of DATE_FORMATS) {
    const parsed = parse(trimmed, fmt, new Date());
    if (isValid(parsed)) return parsed;
  }
  const fallback = new Date(trimmed);
  return isValid(fallback) ? fallback : null;
}

function normalizeRow(row: CsvRow): Transaction | null {
  const date = parseDate(row.date);
  if (!date) return null;

  const amount = parseFloat(
    String(row.ref_currency_amount || row.refCurrencyAmount || row.amount || '0').replace(',', '.')
  );
  if (isNaN(amount)) return null;

  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const monthKey = `${year}-${String(month).padStart(2, '0')}`;

  const type = (row.type || '').toLowerCase().trim();
  const category = (row.category || 'Uncategorized').trim();
  const account = (row.account || 'Unknown').trim();
  const payee = (row.payee || row.labels || row.note || '').trim();
  const paymentType = (row.payment_type || row.paymentType || 'other').trim();
  const note = (row.note || '').trim();
  const labels = row.labels
    ? row.labels
        .split(',')
        .map((l) => l.trim())
        .filter(Boolean)
    : [];
  const currency = (row.currency || 'EUR').trim();

  return {
    date,
    year,
    month,
    monthKey,
    amount,
    type,
    category,
    account,
    payee,
    paymentType,
    note,
    labels,
    currency,
    rawAmount: parseFloat(String(row.amount || '0').replace(',', '.')) || amount,
  };
}

export function parseCsvFile(file: File): Promise<Transaction[]> {
  return new Promise((resolve, reject) => {
    Papa.parse<CsvRow>(file, {
      delimiter: ';',
      header: true,
      skipEmptyLines: true,
      transformHeader: (header: string) => header.trim(),
      complete: (results) => {
        if (results.errors.length > 0) {
          const critical = results.errors.filter((e) => e.type !== 'FieldMismatch');
          if (critical.length > 0) {
            reject(new Error(`CSV parsing errors: ${critical.map((e) => e.message).join(', ')}`));
            return;
          }
        }

        const EXCLUDED_CATEGORIES = new Set(['transfer, withdraw']);
        const transactions = results.data
          .map(normalizeRow)
          .filter((t): t is Transaction => t !== null && !EXCLUDED_CATEGORIES.has(t.category.toLowerCase()));

        if (transactions.length === 0) {
          reject(new Error('No valid transactions found in CSV file.'));
          return;
        }

        transactions.sort((a, b) => a.date.getTime() - b.date.getTime());
        resolve(transactions);
      },
      error: (err: Error) => reject(new Error(`Failed to read CSV: ${err.message}`)),
    });
  });
}
