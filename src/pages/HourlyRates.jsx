import React, { useState } from 'react';
import PageHeader from '../components/ui/PageHeader';
import { KM_RANGES, CONSULTING_HOUR_RANGES, CONSULTING_RATES, INSTRUCTIONAL_HOUR_RANGES, INSTRUCTIONAL_RATES, WORKSHOPS_DIAGNOSTICS_LECTURES } from '../components/utils/hourlyRateTables';

const tabs = [
  { key: 'consulting', label: 'Consultoria de Gestão' },
  { key: 'instructional', label: 'Instrutoria' },
  { key: 'workshops', label: 'Oficinas, Diagnósticos, Palestras' },
];

function formatBRL(val) {
  if (val === null || val === undefined) return '-';
  return `R$ ${val.toLocaleString('pt-BR')}`;
}

export default function HourlyRates() {
  const [activeTab, setActiveTab] = useState('consulting');
  const [filterKm, setFilterKm] = useState('');

  const filteredKmIndexes = KM_RANGES.map((_, i) => i).filter(i => {
    if (!filterKm) return true;
    const km = parseFloat(filterKm);
    return km >= KM_RANGES[i][0] && km <= KM_RANGES[i][1];
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Valores de Horas Técnicas"
        subtitle="Tabelas de referência - Resolução DIREX 072/2025 SEBRAE/GO"
      />

      {/* Tabs */}
      <div className="flex gap-2 border-b border-slate-200">
        {tabs.map(t => (
          <button
            key={t.key}
            onClick={() => setActiveTab(t.key)}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors -mb-px ${
              activeTab === t.key
                ? 'border-[#1e3a5f] text-[#1e3a5f]'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Filter */}
      {activeTab !== 'workshops' && (
        <div className="flex items-center gap-3 max-w-xs">
          <label className="text-sm font-medium text-slate-700 whitespace-nowrap">Filtrar por KM:</label>
          <input
            type="number"
            value={filterKm}
            onChange={e => setFilterKm(e.target.value)}
            placeholder="Ex: 120"
            className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm"
          />
        </div>
      )}

      {/* CONSULTORIA TABLE */}
      {activeTab === 'consulting' && (
        <div className="overflow-x-auto rounded-lg border border-slate-200 shadow-sm">
          <p className="text-xs text-slate-500 px-4 py-2 bg-slate-50 border-b">Tabela 1 – Valores para Pagamento de Horas Técnicas de Consultoria de Gestão (R$/hora)</p>
          <table className="text-xs w-full">
            <thead>
              <tr className="bg-[#1e3a5f] text-white">
                <th className="p-2 text-left whitespace-nowrap sticky left-0 bg-[#1e3a5f]" rowSpan={2}>KM De</th>
                <th className="p-2 text-left whitespace-nowrap sticky left-12 bg-[#1e3a5f]" rowSpan={2}>KM Até</th>
                {CONSULTING_HOUR_RANGES.map((h, i) => (
                  <th key={i} className="p-2 text-center whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredKmIndexes.map(kmIdx => (
                <tr key={kmIdx} className={kmIdx % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
                  <td className="p-2 font-medium sticky left-0 bg-inherit">{KM_RANGES[kmIdx][0]}</td>
                  <td className="p-2 font-medium sticky left-12 bg-inherit">{KM_RANGES[kmIdx][1]}</td>
                  {CONSULTING_RATES[kmIdx].map((val, hIdx) => (
                    <td key={hIdx} className="p-2 text-center whitespace-nowrap">{formatBRL(val)}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* INSTRUTORIA TABLE */}
      {activeTab === 'instructional' && (
        <div className="overflow-x-auto rounded-lg border border-slate-200 shadow-sm">
          <p className="text-xs text-slate-500 px-4 py-2 bg-slate-50 border-b">Tabela 2 – Valores para Pagamento de Horas Técnicas de Instrutoria (R$/hora)</p>
          <table className="text-xs w-full">
            <thead>
              <tr className="bg-[#1e3a5f] text-white">
                <th className="p-2 text-left whitespace-nowrap sticky left-0 bg-[#1e3a5f]">KM De</th>
                <th className="p-2 text-left whitespace-nowrap sticky left-12 bg-[#1e3a5f]">KM Até</th>
                {INSTRUCTIONAL_HOUR_RANGES.map((h, i) => (
                  <th key={i} className="p-2 text-center whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredKmIndexes.map(kmIdx => (
                <tr key={kmIdx} className={kmIdx % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
                  <td className="p-2 font-medium sticky left-0 bg-inherit">{KM_RANGES[kmIdx][0]}</td>
                  <td className="p-2 font-medium sticky left-12 bg-inherit">{KM_RANGES[kmIdx][1]}</td>
                  {INSTRUCTIONAL_RATES[kmIdx].map((val, hIdx) => (
                    <td key={hIdx} className="p-2 text-center whitespace-nowrap">{formatBRL(val)}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* WORKSHOPS TABLE */}
      {activeTab === 'workshops' && (
        <div className="overflow-x-auto rounded-lg border border-slate-200 shadow-sm">
          <p className="text-xs text-slate-500 px-4 py-2 bg-slate-50 border-b">Tabela 3 – Valores para Pagamento de Oficinas, Diagnósticos, Palestras e Programa Sebrae na Sua Empresa</p>
          <table className="text-xs w-full">
            <thead>
              <tr className="bg-[#1e3a5f] text-white">
                <th className="p-2 text-left whitespace-nowrap">KM De</th>
                <th className="p-2 text-left whitespace-nowrap">KM Até</th>
                {WORKSHOPS_DIAGNOSTICS_LECTURES.columns.map((col, i) => (
                  <th key={i} className="p-2 text-center whitespace-nowrap">{col}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {WORKSHOPS_DIAGNOSTICS_LECTURES.rates.map((row, kmIdx) => (
                <tr key={kmIdx} className={kmIdx % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
                  <td className="p-2 font-medium">{KM_RANGES[kmIdx][0]}</td>
                  <td className="p-2 font-medium">{KM_RANGES[kmIdx][1]}</td>
                  {row.map((val, i) => (
                    <td key={i} className="p-2 text-center whitespace-nowrap">{formatBRL(val)}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}