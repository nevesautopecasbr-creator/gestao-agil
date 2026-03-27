import React, { useState } from 'react';
import PageHeader from '../components/ui/PageHeader';
import { KM_RANGES, CONSULTING_HOUR_RANGES, CONSULTING_RATES, INSTRUCTIONAL_HOUR_RANGES, INSTRUCTIONAL_RATES, WORKSHOPS_DIAGNOSTICS_LECTURES } from '../components/utils/hourlyRateTables';
import { base44 } from '@/api/base44Client';

const tabs = [
  { key: 'consulting', label: 'Consultoria de Gestão' },
  { key: 'instructional', label: 'Instrutoria' },
  { key: 'workshops', label: 'Oficinas, Diagnósticos, Palestras' },
  { key: 'viability', label: 'Análise de Viabilidade' },
];

function formatBRL(val) {
  if (val === null || val === undefined) return '-';
  return `R$ ${val.toLocaleString('pt-BR')}`;
}

export default function HourlyRates() {
  const [activeTab, setActiveTab] = useState('consulting');
  const [filterKm, setFilterKm] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [analysisError, setAnalysisError] = useState('');
  const [analysisResult, setAnalysisResult] = useState(null);

  const filteredKmIndexes = KM_RANGES.map((_, i) => i).filter(i => {
    if (!filterKm) return true;
    const km = parseFloat(filterKm);
    return km >= KM_RANGES[i][0] && km <= KM_RANGES[i][1];
  });

  const formatNullable = (value, formatter) => {
    if (value === null || value === undefined || value === '') return 'Não encontrado';
    return formatter ? formatter(value) : String(value);
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    setAnalysisError('');
    setAnalysisResult(null);
    if (!file) {
      setSelectedFile(null);
      return;
    }
    if (!file.name.toLowerCase().endsWith('.pdf')) {
      setAnalysisError('Selecione um arquivo PDF válido.');
      setSelectedFile(null);
      return;
    }
    setSelectedFile(file);
  };

  const handleAnalyzePdf = async () => {
    if (!selectedFile) {
      setAnalysisError('Selecione um PDF antes de analisar.');
      return;
    }

    setIsUploading(true);
    setAnalysisError('');
    setAnalysisResult(null);

    try {
      const { file_url } = await base44.integrations.Core.UploadFile({ file: selectedFile });
      const response = await base44.functions.invoke('parseViabilityPdf', { file_url });
      const payload = response?.data;

      if (!payload?.success || !payload?.data) {
        throw new Error(payload?.error || 'Falha ao analisar o PDF.');
      }

      setAnalysisResult(payload.data);
    } catch (error) {
      setAnalysisError(error?.message || 'Erro ao enviar/analisar o arquivo.');
    } finally {
      setIsUploading(false);
    }
  };

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
      {activeTab !== 'workshops' && activeTab !== 'viability' && (
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

      {/* ANALISE DE VIABILIDADE */}
      {activeTab === 'viability' && (
        <div className="rounded-lg border border-slate-200 bg-white shadow-sm p-4 space-y-4 max-w-3xl">
          <div>
            <h3 className="text-base font-semibold text-slate-900">Análise de Viabilidade (Demanda de Consultoria)</h3>
            <p className="text-sm text-slate-500 mt-1">
              Envie o PDF do Sebrae para extrair: CEP destino, valor total, horas totais e dias na cidade.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
            <input
              type="file"
              accept=".pdf,application/pdf"
              onChange={handleFileChange}
              className="block w-full text-sm text-slate-600 file:mr-3 file:rounded-md file:border-0 file:bg-slate-100 file:px-3 file:py-2 file:text-sm file:font-medium hover:file:bg-slate-200"
            />
            <button
              type="button"
              onClick={handleAnalyzePdf}
              disabled={!selectedFile || isUploading}
              className="px-4 py-2 rounded-md bg-[#1e3a5f] text-white text-sm font-medium hover:bg-[#2d4a6f] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isUploading ? 'Analisando...' : 'Enviar e Analisar'}
            </button>
          </div>

          {selectedFile && (
            <p className="text-xs text-slate-500">
              Arquivo selecionado: <span className="font-medium">{selectedFile.name}</span>
            </p>
          )}

          {analysisError && (
            <div className="rounded-md border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700">
              {analysisError}
            </div>
          )}

          {analysisResult && (
            <div className="rounded-md border border-slate-200 overflow-hidden">
              <table className="w-full text-sm">
                <tbody>
                  <tr className="border-b">
                    <td className="px-3 py-2 font-medium text-slate-700 bg-slate-50 w-1/2">CEP da Cidade (Destino)</td>
                    <td className="px-3 py-2 text-slate-900">{formatNullable(analysisResult.cep_destino)}</td>
                  </tr>
                  <tr className="border-b">
                    <td className="px-3 py-2 font-medium text-slate-700 bg-slate-50">Valor Total a ser pago</td>
                    <td className="px-3 py-2 text-slate-900">
                      {formatNullable(analysisResult.valor_total, (v) => `R$ ${Number(v).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`)}
                    </td>
                  </tr>
                  <tr className="border-b">
                    <td className="px-3 py-2 font-medium text-slate-700 bg-slate-50">Número Total de Horas</td>
                    <td className="px-3 py-2 text-slate-900">{formatNullable(analysisResult.horas_totais)}</td>
                  </tr>
                  <tr>
                    <td className="px-3 py-2 font-medium text-slate-700 bg-slate-50">Número de Dias na Cidade</td>
                    <td className="px-3 py-2 text-slate-900">{formatNullable(analysisResult.dias_na_cidade)}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}