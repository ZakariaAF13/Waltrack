// analyticsClient.ts - helper untuk berkomunikasi dengan analytics.worker
import type { AnalyticsResult, Tx } from '@/workers/analytics.worker';

export async function analyzeTransactions(transactions: Tx[], monthsBack = 6): Promise<AnalyticsResult> {
  return new Promise((resolve, reject) => {
    const worker = new Worker(new URL('../workers/analytics.worker.ts', import.meta.url), { type: 'module' });
    const timer = setTimeout(() => {
      worker.terminate();
      reject(new Error('Analytics worker timeout'));
    }, 10000);

    worker.onmessage = (e: MessageEvent<{ ok: boolean; result?: AnalyticsResult; error?: string }>) => {
      clearTimeout(timer);
      worker.terminate();
      if (e.data.ok && e.data.result) {
        resolve(e.data.result);
      } else {
        reject(new Error(e.data.error || 'Unknown worker error'));
      }
    };

    worker.onerror = (err) => {
      clearTimeout(timer);
      worker.terminate();
      reject(err);
    };

    worker.postMessage({ transactions, monthsBack });
  });
}
