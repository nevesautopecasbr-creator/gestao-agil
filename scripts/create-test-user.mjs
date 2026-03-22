/**
 * Cria (ou atualiza) usuário de teste no Supabase Auth e garante profile admin.
 *
 * Requer no .env.local na raiz do projeto:
 *   VITE_SUPABASE_URL (ou SUPABASE_URL)
 *   SUPABASE_SERVICE_ROLE_KEY  ← chave "service_role" em Project Settings → API (não commitar)
 *
 * Uso: npm run seed:test-user
 */
import { createClient } from '@supabase/supabase-js';
import { readFileSync, existsSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');

const TEST_EMAIL = 'teste@vanguarda.com';
const TEST_PASSWORD = 'vanguarda123';
const TEST_NAME = 'Usuário teste Vanguarda';

function loadEnvLocal() {
  const p = join(root, '.env.local');
  if (!existsSync(p)) {
    throw new Error(`Arquivo não encontrado: ${p}`);
  }
  const env = {};
  for (const line of readFileSync(p, 'utf8').split('\n')) {
    const t = line.trim();
    if (!t || t.startsWith('#')) continue;
    const i = t.indexOf('=');
    if (i === -1) continue;
    const key = t.slice(0, i).trim();
    let val = t.slice(i + 1).trim();
    if (
      (val.startsWith('"') && val.endsWith('"')) ||
      (val.startsWith("'") && val.endsWith("'"))
    ) {
      val = val.slice(1, -1);
    }
    env[key] = val;
  }
  return env;
}

const env = loadEnvLocal();
const url = env.VITE_SUPABASE_URL || env.SUPABASE_URL;
const serviceKey = env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !serviceKey) {
  console.error(
    'Defina VITE_SUPABASE_URL (ou SUPABASE_URL) e SUPABASE_SERVICE_ROLE_KEY no .env.local.\n' +
      'A service role fica em Supabase → Project Settings → API → service_role (secret).'
  );
  process.exit(1);
}

const admin = createClient(url, serviceKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

async function findUserByEmail(email) {
  let page = 1;
  const perPage = 200;
  for (;;) {
    const { data, error } = await admin.auth.admin.listUsers({ page, perPage });
    if (error) throw error;
    const users = data?.users ?? [];
    const found = users.find((u) => u.email?.toLowerCase() === email.toLowerCase());
    if (found) return found;
    if (users.length < perPage) return null;
    page += 1;
  }
}

async function ensureProfileAdmin(userId) {
  const { error } = await admin.from('profiles').upsert(
    {
      id: userId,
      email: TEST_EMAIL,
      full_name: TEST_NAME,
      user_type: 'admin',
      consultant_id: null,
      client_id: null,
    },
    { onConflict: 'id' }
  );
  if (error) throw error;
}

async function main() {
  let userId;

  const existing = await findUserByEmail(TEST_EMAIL);
  if (existing) {
    userId = existing.id;
    const { error } = await admin.auth.admin.updateUserById(userId, {
      password: TEST_PASSWORD,
      email_confirm: true,
    });
    if (error) throw error;
    console.log('Usuário já existia: senha atualizada e e-mail confirmado.');
  } else {
    const { data, error } = await admin.auth.admin.createUser({
      email: TEST_EMAIL,
      password: TEST_PASSWORD,
      email_confirm: true,
      user_metadata: { full_name: TEST_NAME },
    });
    if (error) throw error;
    userId = data.user.id;
    console.log('Usuário criado no Auth.');
  }

  await ensureProfileAdmin(userId);
  console.log('Profile garantido como admin.');
  console.log(`Login: ${TEST_EMAIL} / ${TEST_PASSWORD}`);
}

main().catch((e) => {
  console.error(e.message || e);
  process.exit(1);
});
