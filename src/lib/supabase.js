// src/lib/supabase.js
// ============================================================
// Cliente Supabase — ponto central de conexão com o banco
// ============================================================
import { createClient } from '@supabase/supabase-js';

const supabaseUrl  = process.env.REACT_APP_SUPABASE_URL;
const supabaseKey  = process.env.REACT_APP_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error(
    '❌ Variáveis de ambiente não configuradas.\n' +
    'Copie .env.example para .env.local e preencha com os dados do Supabase.'
  );
}

export const supabase = createClient(supabaseUrl, supabaseKey);
