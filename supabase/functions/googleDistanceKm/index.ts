/**
 * Google Distance Matrix: distância em km entre dois CEPs (Brasil).
 * Chave: defina o secret GOOGLE_MAPS_API_KEY no projeto Supabase.
 * Deno.env.get('GOOGLE_MAPS_API_KEY') — equivalente server-side ao process.env.
 */

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

function normalizeCepDigits(raw: string): string {
  return String(raw || '').replace(/\D/g, '').slice(0, 8);
}

function cepToQuery(cepDigits: string): string | null {
  if (cepDigits.length !== 8) return null;
  return `${cepDigits.slice(0, 5)}-${cepDigits.slice(5)}, Brasil`;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const apiKey = Deno.env.get('GOOGLE_MAPS_API_KEY')?.trim();
    if (!apiKey) {
      return Response.json(
        {
          success: false,
          error: 'GOOGLE_MAPS_API_KEY não configurada no servidor (secrets da Edge Function).',
        },
        { status: 500, headers: corsHeaders }
      );
    }

    const body = await req.json().catch(() => ({}));
    const origem = normalizeCepDigits(body?.cep_origem ?? body?.cepOrigem ?? '');
    const destino = normalizeCepDigits(body?.cep_destino ?? body?.cepDestino ?? '');

    if (origem.length !== 8) {
      return Response.json(
        { success: false, error: 'CEP de origem inválido. Informe 8 dígitos.' },
        { status: 400, headers: corsHeaders }
      );
    }
    if (destino.length !== 8) {
      return Response.json(
        { success: false, error: 'CEP de destino inválido. Informe 8 dígitos.' },
        { status: 400, headers: corsHeaders }
      );
    }

    const qOrig = cepToQuery(origem);
    const qDest = cepToQuery(destino);
    if (!qOrig || !qDest) {
      return Response.json(
        { success: false, error: 'Não foi possível montar endereço a partir dos CEPs.' },
        { status: 400, headers: corsHeaders }
      );
    }

    const url = new URL('https://maps.googleapis.com/maps/api/distancematrix/json');
    url.searchParams.set('units', 'metric');
    url.searchParams.set('origins', qOrig);
    url.searchParams.set('destinations', qDest);
    url.searchParams.set('key', apiKey);

    const gRes = await fetch(url.toString());
    if (!gRes.ok) {
      return Response.json(
        {
          success: false,
          error: `Falha HTTP na API do Google (${gRes.status}).`,
        },
        { status: 502, headers: corsHeaders }
      );
    }

    const data = await gRes.json();

    if (data.status !== 'OK') {
      return Response.json(
        {
          success: false,
          error: data.error_message || `Google Distance Matrix: ${data.status}`,
        },
        { status: 422, headers: corsHeaders }
      );
    }

    const row = data.rows?.[0];
    const el = row?.elements?.[0];
    if (!el) {
      return Response.json(
        { success: false, error: 'Resposta vazia da API de distância.' },
        { status: 422, headers: corsHeaders }
      );
    }

    if (el.status !== 'OK') {
      return Response.json(
        {
          success: false,
          error: `Não foi possível calcular a rota: ${el.status}`,
        },
        { status: 422, headers: corsHeaders }
      );
    }

    const meters = el.distance?.value;
    if (typeof meters !== 'number' || !Number.isFinite(meters) || meters < 0) {
      return Response.json(
        { success: false, error: 'Distância retornada inválida.' },
        { status: 422, headers: corsHeaders }
      );
    }

    const distanceKm = meters / 1000;

    return Response.json(
      {
        success: true,
        distance_km: Math.round(distanceKm * 1000) / 1000,
        origin_query: qOrig,
        destination_query: qDest,
      },
      { headers: corsHeaders }
    );
  } catch (e) {
    console.error('googleDistanceKm:', e);
    return Response.json(
      {
        success: false,
        error: e instanceof Error ? e.message : 'Erro inesperado ao calcular distância.',
      },
      { status: 500, headers: corsHeaders }
    );
  }
});
