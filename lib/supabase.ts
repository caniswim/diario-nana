import { createClient } from '@supabase/supabase-js'
import type { DiaryEntryDB } from '@/types/diary'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database schema para criar no Supabase
export const DATABASE_SCHEMA = `
-- Criar tabela de entradas do diário
CREATE TABLE IF NOT EXISTS diary_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  date DATE UNIQUE NOT NULL,
  check_in JSONB NOT NULL DEFAULT '{}',
  refeicoes JSONB NOT NULL DEFAULT '[]',
  praticas JSONB NOT NULL DEFAULT '{}',
  reflexao JSONB NOT NULL DEFAULT '{}',
  sinais_alerta JSONB NOT NULL DEFAULT '[]',
  resumo_semanal JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Criar índice na data
CREATE INDEX IF NOT EXISTS idx_diary_entries_date ON diary_entries(date);

-- Habilitar RLS (Row Level Security) - mas permitir acesso público
ALTER TABLE diary_entries ENABLE ROW LEVEL SECURITY;

-- Política para permitir acesso total (uso pessoal único)
CREATE POLICY "Permitir acesso total" ON diary_entries
  FOR ALL USING (true)
  WITH CHECK (true);

-- Trigger para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_diary_entries_updated_at BEFORE UPDATE
  ON diary_entries FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
`;

// Funções auxiliares
export async function getDiaryEntry(date: string): Promise<DiaryEntryDB | null> {
  const { data, error } = await supabase
    .from('diary_entries')
    .select('*')
    .eq('date', date)
    .single()

  if (error) {
    console.error('Error fetching diary entry:', error)
    return null
  }

  return data
}

export async function upsertDiaryEntry(entry: DiaryEntryDB): Promise<boolean> {
  const { error } = await supabase
    .from('diary_entries')
    .upsert(entry, {
      onConflict: 'date',
    })

  if (error) {
    console.error('Error upserting diary entry:', error)
    return false
  }

  return true
}

export async function getDiaryEntriesByDateRange(
  startDate: string,
  endDate: string
): Promise<DiaryEntryDB[]> {
  const { data, error } = await supabase
    .from('diary_entries')
    .select('*')
    .gte('date', startDate)
    .lte('date', endDate)
    .order('date', { ascending: false })

  if (error) {
    console.error('Error fetching diary entries:', error)
    return []
  }

  return data || []
}
