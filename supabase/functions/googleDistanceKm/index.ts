/**
 * Google Distance Matrix: distância em km entre dois CEPs (Brasil).
 * Geocoding em paralelo para retornar cidade/UF de origem e destino.
 * Fallback: Haversine (linha reta) se a rota não existir na Matrix.
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

type GeocodePlace = {
  lat: number;
  lng: number;
  cidade: string | null;
  uf: string | null;
  endereco_formatado: string | null;
};

type AddrComp = { long_name: string; short_name: string; types: string[] };

function extractCityUf(components: AddrComp[]): { cidade: string | null; uf: string | null } {
  let uf: string | null = null;
  let cidade: string | null = null;
  for (const c of components) {
    if (c.types.includes('administrative_area_level_1')) {
      uf = c.short_name || null;
    }
  }
  for (const c of components) {
    if (c.types.includes('locality')) {
      cidade = c.long_name || null;
      break;
    }
  }
  if (!cidade) {
    for (const c of components) {
      if (c.types.includes('administrative_area_level_2')) {
        cidade = c.long_name || null;
        break;
      }
    }
  }
  return { cidade, uf };
}

function placeFromGeocodeJson(data: {
  status?: string;
  results?: Array<{
    formatted_address?: string;
    address_components?: AddrComp[];
    geometry?: { location?: { lat?: number; lng?: number } };
  }>;
}): GeocodePlace | null {
  if (data.status !== 'OK' || !data.results?.[0]) return null;
  const r = data.results[0];
  const loc = r.geometry?.location;
  if (typeof loc?.lat !== 'number' || typeof loc?.lng !== 'number') return null;
  const { cidade, uf } = extractCityUf(r.address_components || []);
  return {
    lat: loc.lat,
    lng: loc.lng,
    cidade,
    uf,
    endereco_formatado: r.formatted_address || null,
  };
}

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

async function geocodeBrazilCepPlace(cepDigits: string, apiKey: string): Promise<GeocodePlace | null> {
  if (cepDigits.length !== 8) return null;

  const urlPostal = new URL('https://maps.googleapis.com/maps/api/geocode/json');
  urlPostal.searchParams.set('components', `country:BR|postal_code:${cepDigits}`);
  urlPostal.searchParams.set('key', apiKey);

  try {
    const res1 = await fetch(urlPostal.toString());
    if (res1.ok) {
      const data1 = await res1.json();
      const p1 = placeFromGeocodeJson(data1);
      if (p1) return p1;
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
    return placeFromGeocodeJson(data2);
  } catch {
    return null;
  }
}

function coordPair(lat: number, lng: number): string {
  return `${lat},${lng}`;
}

function localityJson(o: GeocodePlace | null, d: GeocodePlace | null) {
  return {
    origem_cidade: o?.cidade ?? null,
    origem_uf: o?.uf ?? null,
    origem_endereco_formatado: o?.endereco_formatado ?? null,
    destino_cidade: d?.cidade ?? null,
    destino_uf: d?.uf ?? null,
    destino_endereco_formatado: d?.endereco_formatado ?? null,
  };
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

    const [first, oPlace, dPlace] = await Promise.all([
      fetchDistanceMatrixMeters(qOrig, qDest, apiKey),
      geocodeBrazilCepPlace(origem, apiKey),
      geocodeBrazilCepPlace(destino, apiKey),
    ]);

    if (!first.ok && first.httpStatus) {
      return Response.json({ success: false, error: first.error }, { status: first.httpStatus, headers: corsHeaders });
    }

    const locFields = localityJson(oPlace, dPlace);

    if (first.ok) {
      const distanceKm = first.meters / 1000;
      return Response.json(
        {
          success: true,
          distance_km: Math.round(distanceKm * 1000) / 1000,
          origin_query: qOrig,
          destination_query: qDest,
          distance_via: 'driving_matrix',
          rota_encontrada: true,
          ...locFields,
          ...(oPlace && { origem_coords: { lat: oPlace.lat, lng: oPlace.lng } }),
          ...(dPlace && { destino_coords: { lat: dPlace.lat, lng: dPlace.lng } }),
        },
        { headers: corsHeaders }
      );
    }

    const needsGeoFallback = isRouteUnavailableError(first.error || '');

    if (!needsGeoFallback) {
      return Response.json({ success: false, error: first.error }, { status: 422, headers: corsHeaders });
    }

    if (!oPlace || !dPlace) {
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
      coordPair(oPlace.lat, oPlace.lng),
      coordPair(dPlace.lat, dPlace.lng),
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
          rota_encontrada: true,
          ...locFields,
          origem_coords: { lat: oPlace.lat, lng: oPlace.lng },
          destino_coords: { lat: dPlace.lat, lng: dPlace.lng },
        },
        { headers: corsHeaders }
      );
    }

    if (second.httpStatus) {
      return Response.json({ success: false, error: second.error }, { status: second.httpStatus, headers: corsHeaders });
    }

    if (isRouteUnavailableError(second.error || '')) {
      const straightKm = haversineKm(oPlace.lat, oPlace.lng, dPlace.lat, dPlace.lng);
      return Response.json(
        {
          success: true,
          distance_km: Math.round(straightKm * 1000) / 1000,
          origin_query: qOrig,
          destination_query: qDest,
          distance_via: 'straight_line_km',
          rota_encontrada: false,
          distance_note:
            'A API do Google não retornou rota de direção entre os pontos; foi usada a distância em linha reta entre os CEPs geocodificados (aproximação).',
          ...locFields,
          origem_coords: { lat: oPlace.lat, lng: oPlace.lng },
          destino_coords: { lat: dPlace.lat, lng: dPlace.lng },
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
