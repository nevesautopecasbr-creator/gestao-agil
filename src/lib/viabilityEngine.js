/**
 * Motor de viabilidade — lógica pura (sem chamadas de rede).
 * Distância em km deve vir da Edge Function (Google Distance Matrix).
 */

const MARGEM_VIAVEL_MIN_PCT = 20;

function round2(n) {
  return Math.round(Number(n) * 100) / 100;
}

/**
 * @param {object} dadosPdf — saída do parse do PDF (snake_case)
 * @param {object} configuracoesSistema — config da API (camelCase)
 * @param {number} distanciaKm — km de ida (um trecho), da API
 * @returns {object}
 */
export function analisarViabilidadeProjeto(dadosPdf, configuracoesSistema, distanciaKm) {
  const err = (message) => ({
    success: false,
    error: message,
    distanciaKm: null,
    modoLogistico: null,
    modoLogisticoLabel: null,
    custos: null,
    receitaPdf: null,
    lucroBruto: null,
    margemLucroPercentual: null,
    viavelPorMargem: null,
    limiteKmBateVoltaUsado: null,
  });

  if (!configuracoesSistema) {
    return err('Configurações do sistema não informadas.');
  }

  if (distanciaKm === null || distanciaKm === undefined || !Number.isFinite(Number(distanciaKm))) {
    return err('Distância inválida ou não calculada.');
  }

  const km = Number(distanciaKm);
  if (km < 0) {
    return err('Distância não pode ser negativa.');
  }

  const limite = Number(configuracoesSistema.limiteKmBateVolta);
  if (!Number.isFinite(limite) || limite < 0) {
    return err('Limite de km (bate-volta) inválido nas configurações.');
  }

  const valorHoraConsultor = Number(configuracoesSistema.valorHoraConsultor);
  const custoHospedagemDiaria = Number(configuracoesSistema.custoHospedagemDiaria);
  const custoAlimentacaoDiaria = Number(configuracoesSistema.custoAlimentacaoDiaria);
  const custoPorKm = Number(configuracoesSistema.custoPorKm);

  if (
    !Number.isFinite(valorHoraConsultor) ||
    !Number.isFinite(custoHospedagemDiaria) ||
    !Number.isFinite(custoAlimentacaoDiaria) ||
    !Number.isFinite(custoPorKm)
  ) {
    return err('Parâmetros de custo inválidos nas configurações.');
  }

  const numeroDias = dadosPdf?.dias_na_cidade;
  const totalHoras = dadosPdf?.horas_totais;
  const valorTotal = dadosPdf?.valor_total;

  if (numeroDias === null || numeroDias === undefined || !Number.isFinite(Number(numeroDias)) || Number(numeroDias) < 0) {
    return err('Número de dias na cidade não encontrado ou inválido no PDF.');
  }
  if (totalHoras === null || totalHoras === undefined || !Number.isFinite(Number(totalHoras)) || Number(totalHoras) < 0) {
    return err('Total de horas não encontrado ou inválido no PDF.');
  }
  if (valorTotal === null || valorTotal === undefined || !Number.isFinite(Number(valorTotal))) {
    return err('Valor total do PDF não encontrado ou inválido.');
  }

  const dias = Number(numeroDias);
  const horas = Number(totalHoras);
  const receita = Number(valorTotal);

  let custoDeslocamento;
  let custoHospedagem;
  let custoAlimentacao;
  let modoLogistico;
  let modoLogisticoLabel;

  if (km <= limite) {
    modoLogistico = 'bate_volta';
    modoLogisticoLabel = 'Bate-volta';
    custoDeslocamento = km * 2 * dias * custoPorKm;
    custoHospedagem = 0;
    custoAlimentacao = dias * custoAlimentacaoDiaria;
  } else {
    modoLogistico = 'pernoite';
    modoLogisticoLabel = 'Pernoite';
    custoDeslocamento = km * 2 * custoPorKm;
    custoHospedagem = dias * custoHospedagemDiaria;
    custoAlimentacao = dias * custoAlimentacaoDiaria;
  }

  const custoMaoDeObra = horas * valorHoraConsultor;
  const custoTotal =
    custoDeslocamento + custoHospedagem + custoAlimentacao + custoMaoDeObra;

  const lucroBruto = receita - custoTotal;
  const margemLucroPercentual =
    receita > 0 ? (lucroBruto / receita) * 100 : null;
  const viavelPorMargem =
    margemLucroPercentual !== null && margemLucroPercentual > MARGEM_VIAVEL_MIN_PCT;

  return {
    success: true,
    error: null,
    distanciaKm: round2(km),
    modoLogistico,
    modoLogisticoLabel,
    limiteKmBateVoltaUsado: limite,
    custos: {
      deslocamento: round2(custoDeslocamento),
      hospedagem: round2(custoHospedagem),
      alimentacao: round2(custoAlimentacao),
      maoDeObra: round2(custoMaoDeObra),
      total: round2(custoTotal),
    },
    receitaPdf: round2(receita),
    lucroBruto: round2(lucroBruto),
    margemLucroPercentual:
      margemLucroPercentual === null ? null : round2(margemLucroPercentual),
    viavelPorMargem,
    margemMinimaConsideradaPct: MARGEM_VIAVEL_MIN_PCT,
  };
}
