import { startOfMonth, endOfMonth, subMonths, isWithinInterval, parseISO } from 'date-fns';

/**
 * Obtém o intervalo de datas baseado no período selecionado
 */
export function getDateRange(period) {
  const now = new Date();
  
  switch (period) {
    case 'week':
      return { start: subMonths(now, 0.25), end: now };
    case 'month':
      return { start: startOfMonth(now), end: endOfMonth(now) };
    case 'quarter':
      return { start: startOfMonth(subMonths(now, 2)), end: endOfMonth(now) };
    case 'year':
      return { start: startOfMonth(subMonths(now, 11)), end: endOfMonth(now) };
    case 'all':
    default:
      return null;
  }
}

/**
 * Filtra itens por período de data
 */
export function filterByPeriod(items, dateField, dateRange) {
  if (!dateRange) return items;
  
  return items.filter(item => {
    if (!item[dateField]) return false;
    
    try {
      const date = typeof item[dateField] === 'string' 
        ? parseISO(item[dateField]) 
        : item[dateField];
      return isWithinInterval(date, dateRange);
    } catch {
      return false;
    }
  });
}