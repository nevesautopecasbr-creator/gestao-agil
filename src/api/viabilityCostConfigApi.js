import { supabase } from './supabaseClient';

/** Linha singleton na tabela `viability_cost_config`. */
export const VIABILITY_COST_CONFIG_ROW_ID = 'viability_cost_cfg_row_000000001';

/**
 * @typedef {Object} ViabilityCostConfig
 * @property {string} id
 * @property {string} [created_date]
 * @property {string} [updated_date]
 * @property {string|null} [created_by]
 * @property {number} valorHoraConsultor
 * @property {number} custoHospedagemDiaria
 * @property {number} custoAlimentacaoDiaria
 * @property {number} custoPorKm
 * @property {string} cepOrigem
 * @property {number} limiteKmBateVolta
 */

function num(v) {
  if (v === null || v === undefined) return 0;
  const n = typeof v === 'number' ? v : Number(String(v).replace(',', '.'));
  return Number.isFinite(n) ? n : 0;
}

function mapRowToConfig(row) {
  if (!row) return null;
  return {
    id: row.id,
    created_date: row.created_date,
    updated_date: row.updated_date,
    created_by: row.created_by,
    valorHoraConsultor: num(row.valor_hora_consultor),
    custoHospedagemDiaria: num(row.custo_hospedagem_diaria),
    custoAlimentacaoDiaria: num(row.custo_alimentacao_diaria),
    custoPorKm: num(row.custo_por_km),
    cepOrigem: row.cep_origem != null ? String(row.cep_origem) : '',
    limiteKmBateVolta: num(row.limite_km_bate_volta),
  };
}

/**
 * GET — recupera a configuração global (singleton).
 * @returns {Promise<{ data: ViabilityCostConfig | null, error: Error | null }>}
 */
export async function getViabilityCostConfig() {
  try {
    const { data, error } = await supabase
      .from('viability_cost_config')
      .select('*')
      .eq('id', VIABILITY_COST_CONFIG_ROW_ID)
      .maybeSingle();

    if (error) {
      return { data: null, error: new Error(error.message || 'Erro ao carregar configurações de viabilidade.') };
    }
    return { data: mapRowToConfig(data), error: null };
  } catch (e) {
    return { data: null, error: e instanceof Error ? e : new Error(String(e)) };
  }
}

/**
 * PUT — cria ou atualiza os quatro valores (upsert na linha singleton).
 * @param {Object} params
 * @param {number} params.valorHoraConsultor
 * @param {number} params.custoHospedagemDiaria
 * @param {number} params.custoAlimentacaoDiaria
 * @param {number} params.custoPorKm
 * @param {string} params.cepOrigem
 * @param {number} params.limiteKmBateVolta
 * @param {string} [params.createdBy]
 * @returns {Promise<{ data: ViabilityCostConfig | null, error: Error | null }>}
 */
export async function upsertViabilityCostConfig({
  valorHoraConsultor,
  custoHospedagemDiaria,
  custoAlimentacaoDiaria,
  custoPorKm,
  cepOrigem,
  limiteKmBateVolta,
  createdBy,
}) {
  try {
    const now = new Date().toISOString();
    const row = {
      id: VIABILITY_COST_CONFIG_ROW_ID,
      updated_date: now,
      valor_hora_consultor: valorHoraConsultor,
      custo_hospedagem_diaria: custoHospedagemDiaria,
      custo_alimentacao_diaria: custoAlimentacaoDiaria,
      custo_por_km: custoPorKm,
      cep_origem: cepOrigem != null ? String(cepOrigem).replace(/\D/g, '').slice(0, 8) : '',
      limite_km_bate_volta: limiteKmBateVolta,
    };

    if (createdBy) {
      row.created_by = createdBy;
    }

    const { data, error } = await supabase
      .from('viability_cost_config')
      .upsert(row, { onConflict: 'id' })
      .select('*')
      .single();

    if (error) {
      return { data: null, error: new Error(error.message || 'Erro ao guardar configurações de viabilidade.') };
    }
    return { data: mapRowToConfig(data), error: null };
  } catch (e) {
    return { data: null, error: e instanceof Error ? e : new Error(String(e)) };
  }
}
