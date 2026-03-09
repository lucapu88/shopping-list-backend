/* eslint-env node */
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

export async function ensureUser(token) {
  const { data, error } = await supabase.from('users').select('*').eq('token', token).single();
  if (data) return data;

  console.log('Utente non trovato, creo nuovo utente...');
  const { data: newUser, error: insertError } = await supabase
    .from('users')
    .insert({ token, generazioni: 0 })
    .select()
    .single();

  if (insertError) console.error('Errore insert utente:', insertError.message);
  if (!newUser) console.error('newUser è null dopo insert');

  return newUser;
}

export async function addGenerazioni(token, quantita, dettaglio = '') {
  await ensureUser(token);
  await supabase.rpc('increment_generazioni', { user_token: token, amount: quantita });
  await supabase.from('transactions').insert({ token, tipo: 'acquisto', quantita, dettaglio });
  const { data } = await supabase.from('users').select('*').eq('token', token).single();
  return data;
}

export async function useGenerazione(token, dettaglio = 'Generazione ricetta') {
  const user = await ensureUser(token);
  if (!user) return { success: false, generazioni: 0 };  // ← aggiungi questo check
  if (user.generazioni <= 0) return { success: false, generazioni: 0 };
  await supabase.rpc('decrement_generazioni', { user_token: token });
  await supabase.from('transactions').insert({ token, tipo: 'utilizzo', quantita: 1, dettaglio });
  const { data } = await supabase.from('users').select('*').eq('token', token).single();
  if (!data) return { success: false, generazioni: 0 };  // ← aggiungi questo check
  return { success: true, generazioni: data.generazioni };
}

export async function getTransactions(token) {
  const { data } = await supabase.from('transactions').select('*').eq('token', token).order('created_at', { ascending: false });
  return data;
}