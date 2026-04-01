/**
 * Google Distance Matrix: distância em km entre dois CEPs (Brasil).
 * Chave: secret GOOGLE_MAPS_API_KEY na Edge Function.
 *
 * Estratégia: (1) Distance Matrix com texto do CEP + region=br
 * (2) Geocoding (postal_code BR, depois texto)
 * (3) Distance Matrix com lat,lng
 * (4) Haversine entre coordenadas se a rota ainda falhar (distância em linha reta, aproximada).
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

/** Distância em km entre dois pontos (WGS84), linha reta — fallback quando não há rota na Matrix. */
function haversineKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371;
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function isRouteUnavailableError(message: string): boolean {
  const m = message || '';
  return m.includes('ZERO_RESULTS') || m.includes('NOT_FOUND');
}

type MatrixOk = { ok: true; meters: number };
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

  return { ok: true, meters };
}

function locationFromGeocodeData(data: unknown): { lat: number; lng: number } | null {
  const d = data as {
    status?: string;
    results?: Array<{ geometry?: { location?: { lat?: number; lng?: number } } }>;
  };
  if (d.status !== 'OK' || !d.results?.[0]?.geometry?.location) return null;
  const loc = d.results[0].geometry.location;
  if (typeof loc.lat !== 'number' || typeof loc.lng !== 'number') return null;
  return { lat: loc.lat, lng: loc.lng };
}

/**
 * Geocoding em duas tentativas: CEP como postal_code (BR) e depois endereço textual.
 */
async function geocodeBrazilCep(
  cepDigits: string,
  apiKey: string
): Promise<{ lat: number; lng: number } | null> {
  if (cepDigits.length !== 8) return null;

  const urlPostal = new URL('https://maps.googleapis.com/maps/api/geocode/json');
  urlPostal.searchParams.set('components', `country:BR|postal_code:${cepDigits}`);
  urlPostal.searchParams.set('key', apiKey);

  try {
    const res1 = await fetch(urlPostal.toString());
    if (res1.ok) {
      const data1 = await res1.json();
      const loc1 = locationFromGeocodeData(data1);
      if (loc1) return loc1;
    }
  } catch {
    /* tenta texto */
  }

  const address = cepToQuery(cepDigits);
  if (!address) return null;

  const urlAddr = new URL('https://maps.googleapis.com/maps/api/geocode/json');
  urlAddr.searchParams.set('address', address);
  urlAddr.searchParams.set('components', 'country:BR');
  urlAddr.searchParams.set('region', 'br');
  urlAddr.searchParams.set('key', apiKey);

  try {
    const res2 = await fetch(urlAddr.toString());
    if (!res2.ok) return null;
    const data2 = await res2.json();
    return locationFromGeocodeData(data2);
  } catch {
    return null;
  }
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

    const first = await fetchDistanceMatrixMeters(qOrig, qDest, apiKey);

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
          distance_via: 'driving_matrix',
        },
        { headers: corsHeaders }
      );
    }

    const needsGeoFallback = isRouteUnavailableError(first.error || '');

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
            'Não foi possível localizar um dos CEPs (geocoding). ' +
            'Habilite Geocoding API no projeto da chave e verifique restrições da chave.',
        },
        { status: 422, headers: corsHeaders }
      );
    }

    const second = await fetchDistanceMatrixMeters(
      coordPair(oLoc.lat, oLoc.lng),
      coordPair(dLoc.lat, dLoc.lng),
      apiKey
    );

    if (second.ok) {
      const distanceKm = second.meters / 1000;
      return Response.json(
        {
          success: true,
          distance_km: Math.round(distanceKm * 1000) / 1000,
          origin_query: qOrig,
          destination_query: qDest,
          distance_via: 'driving_matrix_coords',
          origin_coords: oLoc,
          destination_coords: dLoc,
        },
        { headers: corsHeaders }
      );
    }

    if (second.httpStatus) {
      return Response.json({ success: false, error: second.error }, { status: second.httpStatus, headers: corsHeaders });
    }

    // Matrix ainda sem rota (ex.: ZERO_RESULTS) — distância em linha reta entre os CEPs geocodificados
    if (isRouteUnavailableError(second.error || '')) {
      const straightKm = haversineKm(oLoc.lat, oLoc.lng, dLoc.lat, dLoc.lng);
      return Response.json(
        {
          success: true,
          distance_km: Math.round(straightKm * 1000) / 1000,
          origin_query: qOrig,
          destination_query: qDest,
          distance_via: 'straight_line_km',
          distance_note:
            'A API não retornou rota de direção; usada distância em linha reta entre os pontos do CEP (aproximação).',
          origin_coords: oLoc,
          destination_coords: dLoc,
        },
        { headers: corsHeaders }
      );
    }

    return Response.json({ success: false, error: second.error }, { status: 422, headers: corsHeaders });
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
