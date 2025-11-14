/**
 * Date utility functions
 * Helper untuk format tanggal
 */

import { format, startOfMonth, endOfMonth, eachMonthOfInterval, subMonths } from 'date-fns';
import { id as idLocale, enUS } from 'date-fns/locale';

export function formatDate(date: Date, formatStr: string = 'dd MMM yyyy', locale: 'id' | 'en' = 'id'): string {
  return format(date, formatStr, { locale: locale === 'id' ? idLocale : enUS });
}

export function getMonthStart(date: Date = new Date()): Date {
  return startOfMonth(date);
}

export function getMonthEnd(date: Date = new Date()): Date {
  return endOfMonth(date);
}

export function getLastMonths(count: number = 6): Date[] {
  const now = new Date();
  const startDate = subMonths(now, count - 1);
  return eachMonthOfInterval({ start: startDate, end: now });
}

export function isToday(date: Date): boolean {
  const today = new Date();
  return date.toDateString() === today.toDateString();
}

export function getTodayISO(): string {
  return new Date().toISOString().split('T')[0];
}
