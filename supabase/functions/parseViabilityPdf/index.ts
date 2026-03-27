import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';
import pdfParse from 'npm:pdf-parse@1.1.1';
import { Buffer } from 'node:buffer';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

type ViabilityData = {
  cep_destino: string | null;
  valor_total: number | null;
  horas_totais: number | null;
  dias_na_cidade: number | null;
  source_checks: {
    cep_match: boolean;
    valor_source: 'totais' | 'first_valor' | 'none';
    horas_source: 'totais' | 'none';
    dias_source: 'fase_count' | 'unique_dates' | 'none';
  };
};

function normalizeText(raw: string): string {
  return (raw || '')
    .replace(/\r\n/g, '\n')
    .replace(/\r/g, '\n')
    .replace(/\u00A0/g, ' ')
    .replace(/[ \t]+\n/g, '\n')
    .trim();
}

function parseCurrencyBR(value: string): number | null {
  if (!value) return null;
  const cleaned = value.replace(/\s/g, '').replace(/\./g, '').replace(',', '.');
  const n = Number(cleaned);
  return Number.isFinite(n) ? n : null;
}

function parseHours(value: string): number | null {
  if (!value) return null;
  const normalized = value.replace(/\./g, '').replace(',', '.').trim();
  const n = Number(normalized);
  return Number.isFinite(n) ? n : null;
}

function extractViabilityData(textRaw: string): ViabilityData {
  const text = normalizeText(textRaw);

  // 1) CEP: primeira ocorrência após palavra CEP
  const cepMatch = text.match(/CEP\s*\n?\s*(\d{5}-\d{3})/i);
  const cep_destino = cepMatch?.[1] ?? null;

  // 2) Valor: prioriza seção Totais > Valor > R$
  const totalsBlockMatch = text.match(/Totais[\s\S]{0,4000}/i);
  const totalsBlock = totalsBlockMatch?.[0] ?? '';
  const totalsValueMatch = totalsBlock.match(/Valor\s*\n?\s*R\$\s*([\d.]+,\d{2})/i);

  let valor_total: number | null = null;
  let valorSource: ViabilityData['source_checks']['valor_source'] = 'none';

  if (totalsValueMatch?.[1]) {
    valor_total = parseCurrencyBR(totalsValueMatch[1]);
    valorSource = valor_total !== null ? 'totais' : 'none';
  } else {
    const firstValueMatch = text.match(/Valor\s*\n?\s*R\$\s*([\d.]+,\d{2})/i);
    if (firstValueMatch?.[1]) {
      valor_total = parseCurrencyBR(firstValueMatch[1]);
      valorSource = valor_total !== null ? 'first_valor' : 'none';
    }
  }

  // 3) Horas totais: dentro de Totais
  const totalsHoursMatch = totalsBlock.match(/Horas\s*\n?\s*([\d.,]+)/i);
  const horas_totais = totalsHoursMatch?.[1] ? parseHours(totalsHoursMatch[1]) : null;
  const horasSource: ViabilityData['source_checks']['horas_source'] = horas_totais !== null ? 'totais' : 'none';

  // 4) Dias na cidade:
  // Primário: contar fases únicas "Fase N"
  const phaseMatches = [...text.matchAll(/Fase\s+(\d+)/gi)];
  const uniquePhases = new Set(phaseMatches.map(m => m[1]).filter(Boolean));

  let dias_na_cidade: number | null = null;
  let diasSource: ViabilityData['source_checks']['dias_source'] = 'none';

  if (uniquePhases.size > 0) {
    dias_na_cidade = uniquePhases.size;
    diasSource = 'fase_count';
  } else {
    // Fallback: datas únicas de "De dd/mm/aaaa até"
    const dateMatches = [...text.matchAll(/De\s+(\d{2}\/\d{2}\/\d{4})\s+at[ée]\b/gi)];
    const uniqueDates = new Set(dateMatches.map(m => m[1]).filter(Boolean));
    if (uniqueDates.size > 0) {
      dias_na_cidade = uniqueDates.size;
      diasSource = 'unique_dates';
    }
  }

  return {
    cep_destino,
    valor_total,
    horas_totais,
    dias_na_cidade,
    source_checks: {
      cep_match: !!cep_destino,
      valor_source: valorSource,
      horas_source: horasSource,
      dias_source: diasSource,
    },
  };
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) {
      return Response.json(
        { error: 'Unauthorized' },
        { status: 401, headers: corsHeaders }
      );
    }

    const body = await req.json();
    const file_url = body?.file_url;

    if (!file_url) {
      return Response.json(
        { error: 'file_url is required' },
        { status: 400, headers: corsHeaders }
      );
    }

    const pdfRes = await fetch(file_url);
    if (!pdfRes.ok) {
      return Response.json(
        { error: `Failed to download PDF (${pdfRes.status})` },
        { status: 500, headers: corsHeaders }
      );
    }

    const buffer = await pdfRes.arrayBuffer();
    const parsed = await pdfParse(Buffer.from(buffer));
    const rawText = parsed?.text ?? '';

    const data = extractViabilityData(rawText);

    return Response.json({
      success: true,
      data,
    }, { headers: corsHeaders });
  } catch (error) {
    console.error('parseViabilityPdf error:', error?.message || error);
    return Response.json(
      { error: error?.message || 'Unexpected error while parsing PDF' },
      { status: 500, headers: corsHeaders }
    );
  }
});

