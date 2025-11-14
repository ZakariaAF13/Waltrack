// Web Worker: analytics.worker.ts
// Menerima daftar transaksi dan mengembalikan data agregasi berat untuk laporan

export type Tx = {
  id: string;
  type: 'income' | 'expense';
  category: string;
  amount: number;
  description: string;
  date: string | Date;
};

export type MonthlySeriesItem = {
  monthKey: string; // e.g. 2025-11
  income: number;
  expense: number;
};

export type CategoriesBreakdownItem = {
  category: string;
  total: number;
};

export type AnalyticsResult = {
  monthlySeries: MonthlySeriesItem[];
  categoriesBreakdown: CategoriesBreakdownItem[];
};

function toMonthKey(d: Date): string {
  const y = d.getFullYear();
  const m = d.getMonth() + 1;
  return `${y}-${String(m).padStart(2, '0')}`;
}

self.onmessage = (e: MessageEvent<{ transactions: Tx[]; monthsBack?: number }>) => {
  const { transactions, monthsBack = 6 } = e.data;
  try {
    // Monthly aggregation
    const map = new Map<string, { income: number; expense: number }>();
    const now = new Date();
    for (let i = monthsBack - 1; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      map.set(toMonthKey(d), { income: 0, expense: 0 });
    }

    const catMap = new Map<string, number>();

    for (const t of transactions) {
      const d = new Date(t.date);
      const key = toMonthKey(new Date(d.getFullYear(), d.getMonth(), 1));
      if (map.has(key)) {
        const cur = map.get(key)!;
        if (t.type === 'income') cur.income += t.amount;
        else cur.expense += t.amount;
      }
      if (t.type === 'expense') {
        catMap.set(t.category, (catMap.get(t.category) || 0) + t.amount);
      }
    }

    const monthlySeries: MonthlySeriesItem[] = Array.from(map.entries()).map(([k, v]) => ({
      monthKey: k,
      income: v.income,
      expense: v.expense,
    }));

    const categoriesBreakdown: CategoriesBreakdownItem[] = Array.from(catMap.entries()).map(
      ([category, total]) => ({ category, total })
    );

    const result: AnalyticsResult = { monthlySeries, categoriesBreakdown };
    // @ts-ignore
    self.postMessage({ ok: true, result });
  } catch (err: any) {
    // @ts-ignore
    self.postMessage({ ok: false, error: err?.message || 'Worker error' });
  }
};
