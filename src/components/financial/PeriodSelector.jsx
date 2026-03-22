import React from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { CalendarDays } from 'lucide-react';

const MONTHS = Array.from({ length: 12 }, (_, i) => i + 1);
const YEARS = [2024, 2025, 2026, 2027];

/**
 * PeriodSelector — componente compacto de seleção de período
 * Props:
 *   selectedMonth: number (1-12)
 *   selectedYear: number
 *   onChange: ({ month, year }) => void
 */
export default function PeriodSelector({ selectedMonth, selectedYear, onChange }) {
  const label = format(new Date(selectedYear, selectedMonth - 1, 1), "MMMM 'de' yyyy", { locale: ptBR });

  return (
    <div className="flex items-center gap-2 bg-[#1e3a5f]/8 border border-[#1e3a5f]/20 rounded-xl px-4 py-2.5">
      <CalendarDays className="w-4 h-4 text-[#1e3a5f] shrink-0" />
      <span className="text-xs font-semibold text-[#1e3a5f] capitalize hidden sm:block">{label}</span>
      <div className="flex items-center gap-1.5 ml-1">
        <select
          value={selectedMonth}
          onChange={e => onChange({ month: Number(e.target.value), year: selectedYear })}
          className="border border-slate-200 rounded-lg px-2 py-1 text-xs font-medium text-slate-700 bg-white focus:outline-none focus:ring-1 focus:ring-[#1e3a5f]"
        >
          {MONTHS.map(m => (
            <option key={m} value={m}>
              {format(new Date(2000, m - 1, 1), 'MMM', { locale: ptBR })}
            </option>
          ))}
        </select>
        <select
          value={selectedYear}
          onChange={e => onChange({ month: selectedMonth, year: Number(e.target.value) })}
          className="border border-slate-200 rounded-lg px-2 py-1 text-xs font-medium text-slate-700 bg-white focus:outline-none focus:ring-1 focus:ring-[#1e3a5f]"
        >
          {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
        </select>
      </div>
    </div>
  );
}