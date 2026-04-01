/**
 * Google Distance Matrix: distância em km entre dois CEPs (Brasil).
 * Chave: defina o secret GOOGLE_MAPS_API_KEY no projeto Supabase.
 * Fallback: se a matriz retornar ZERO_RESULTS com texto do CEP, geocodifica (Brasil)
 * e tenta novamente com lat,lng — exige Geocoding API habilitada no mesmo projeto Google.
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

type MatrixOk = { ok: true; meters: number; via: 'address' | 'coordinates' };
type MatrixErr = { ok: false; error: string; httpStatus?: number };

async function fetchDistanceMatrixMeters(
  origins: string,
  destinations: string,
  apiKey: string
): Promise<MatrixOk | MatrixErr> {
  const url = new URL('https://maps.googleapis.com/maps/api/distancematrix/json');
  url.searchParams.set('units', 'metric');
  url.searchParams.set('region', 'br');
  url.searchParams.set('origins', origins);
  url.searchParams.set('destinations', destinations);
  url.searchParams.set('key', apiKey);

  const gRes = await fetch(url.toString());
  if (!gRes.ok) {
    return {
      ok: false,
      error: `Falha HTTP na API do Google (${gRes.status}).`,
      httpStatus: 502,
    };
  }

  const data = await gRes.json();

  if (data.status !== 'OK') {
    return {
      ok: false,
      error: data.error_message || `Google Distance Matrix: ${data.status}`,
    };
  }

  const row = data.rows?.[0];
  const el = row?.elements?.[0];
  if (!el) {
    return { ok: false, error: 'Resposta vazia da API de distância.' };
  }

  if (el.status !== 'OK') {
    return { ok: false, error: `Não foi possível calcular a rota: ${el.status}` };
  }

  const meters = el.distance?.value;
  if (typeof meters !== 'number' || !Number.isFinite(meters) || meters < 0) {
    return { ok: false, error: 'Distância retornada inválida.' };
  }

  return { ok: true, meters, via: 'address' };
}

async function geocodeBrazilCep(
  cepDigits: string,
  apiKey: string
): Promise<{ lat: number; lng: number } | null> {
  const address = cepToQuery(cepDigits);
  if (!address) return null;

  const url = new URL('https://maps.googleapis.com/maps/api/geocode/json');
  url.searchParams.set('address', address);
  url.searchParams.set('components', 'country:BR');
  url.searchParams.set('region', 'br');
  url.searchParams.set('key', apiKey);

  const res = await fetch(url.toString());
  if (!res.ok) return null;
  const data = await res.json();
  if (data.status !== 'OK' || !data.results?.[0]?.geometry?.location) return null;
  const loc = data.results[0].geometry.location;
  if (typeof loc.lat !== 'number' || typeof loc.lng !== 'number') return null;
  return { lat: loc.lat, lng: loc.lng };
}

function coordPair(lat: number, lng: number): string {
  return `${lat},${lng}`;
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

    let first = await fetchDistanceMatrixMeters(qOrig, qDest, apiKey);

    if (!first.ok && first.httpStatus) {
      return Response.json({ success: false, error: first.error }, { status: first.httpStatus, headers: corsHeaders });
    }

    if (first.ok) {
      const distanceKm = first.meters / 1000;
      return Response.json(
        {
          success: true,
          distance_km: Math.round(distanceKm * 1000) / 1000,
          origin_query: qOrig,
          destination_query: qDest,
          distance_via: first.via,
        },
        { headers: corsHeaders }
      );
    }

    // Fallback: ZERO_RESULTS / NOT_FOUND com texto do CEP → geocodificar e usar lat,lng
    const errText = first.error || '';
    const needsGeoFallback =
      errText.includes('ZERO_RESULTS') ||
      errText.includes('NOT_FOUND');

    if (!needsGeoFallback) {
      return Response.json({ success: false, error: first.error }, { status: 422, headers: corsHeaders });
    }

    const [oLoc, dLoc] = await Promise.all([
      geocodeBrazilCep(origem, apiKey),
      geocodeBrazilCep(destino, apiKey),
    ]);

    if (!oLoc || !dLoc) {
      return Response.json(
        {
          success: false,
          error:
            'Não foi possível localizar um dos CEPs no mapa (geocoding). ' +
            'Confira os CEPs e habilite a Geocoding API no mesmo projeto da chave.',
        },
        { status: 422, headers: corsHeaders }
      );
    }

    const originsCoord = coordPair(oLoc.lat, oLoc.lng);
    const destCoord = coordPair(dLoc.lat, dLoc.lng);
    const second = await fetchDistanceMatrixMeters(originsCoord, destCoord, apiKey);

    if (!second.ok) {
      if (second.httpStatus) {
        return Response.json({ success: false, error: second.error }, { status: second.httpStatus, headers: corsHeaders });
      }
      return Response.json({ success: false, error: second.error }, { status: 422, headers: corsHeaders });
    }

    const distanceKm = second.meters / 1000;

    return Response.json(
      {
        success: true,
        distance_km: Math.round(distanceKm * 1000) / 1000,
        origin_query: qOrig,
        destination_query: qDest,
        distance_via: 'coordinates',
        origin_coords: oLoc,
        destination_coords: dLoc,
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
