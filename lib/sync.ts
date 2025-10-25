import { getDiaryEntry, upsertDiaryEntry, isSupabaseConfigured } from './supabase'
import { getEntry, saveEntry, getUnsyncedEntries } from './db'
import type { DiaryEntry, DiaryEntryDB } from '@/types/diary'
import { toast } from 'sonner'

// Converter DiaryEntry para DiaryEntryDB
function toDBFormat(entry: DiaryEntry): DiaryEntryDB {
  return {
    id: entry.id,
    date: entry.date,
    check_in: entry.checkIn,
    refeicoes: entry.refeicoes,
    praticas: entry.praticas,
    reflexao: entry.reflexao,
    sinais_alerta: entry.sinaisAlerta,
    resumo_semanal: entry.resumoSemanal,
    created_at: new Date(entry.createdAt).toISOString(),
    updated_at: new Date(entry.updatedAt).toISOString(),
  }
}

// Converter DiaryEntryDB para DiaryEntry
function fromDBFormat(dbEntry: DiaryEntryDB): DiaryEntry {
  return {
    id: dbEntry.id,
    date: dbEntry.date,
    checkIn: dbEntry.check_in,
    refeicoes: dbEntry.refeicoes,
    praticas: dbEntry.praticas,
    reflexao: dbEntry.reflexao,
    sinaisAlerta: dbEntry.sinais_alerta,
    resumoSemanal: dbEntry.resumo_semanal,
    synced: true,
    createdAt: new Date(dbEntry.created_at).getTime(),
    updatedAt: new Date(dbEntry.updated_at).getTime(),
  }
}

// Sincronizar entrada específica
export async function syncEntry(date: string): Promise<boolean> {
  try {
    console.log(`🔄 [syncEntry] Iniciando sincronização para ${date}`)

    // Verificar se Supabase está configurado
    if (!isSupabaseConfigured) {
      console.warn('⚠️ Sincronização pulada: Supabase não configurado')
      return false
    }

    const localEntry = await getEntry(date)
    if (!localEntry) {
      console.log(`❌ [syncEntry] Entrada local não encontrada para ${date}`)
      return false
    }

    console.log(`📝 [syncEntry] Entrada local encontrada. synced=${localEntry.synced}, updatedAt=${new Date(localEntry.updatedAt).toISOString()}`)

    // Se já sincronizado e não foi modificado, não faz nada
    if (localEntry.synced) {
      console.log(`✅ [syncEntry] Entrada já sincronizada, pulando`)
      return true
    }

    // Tentar buscar do servidor
    console.log(`🌐 [syncEntry] Buscando entrada remota...`)
    const remoteEntry = await getDiaryEntry(date)

    let entryToSave = localEntry

    // Resolver conflito: prioridade para dados locais mais recentes
    if (remoteEntry) {
      const remoteUpdated = new Date(remoteEntry.updated_at).getTime()
      console.log(`📊 [syncEntry] Entrada remota encontrada. remoteUpdated=${new Date(remoteUpdated).toISOString()}, localUpdated=${new Date(localEntry.updatedAt).toISOString()}`)

      if (remoteUpdated > localEntry.updatedAt) {
        console.log(`⬇️ [syncEntry] Dados remotos são mais recentes, usando eles`)
        entryToSave = fromDBFormat(remoteEntry)
      } else {
        console.log(`⬆️ [syncEntry] Dados locais são mais recentes, fazendo upload`)
      }
    } else {
      console.log(`📤 [syncEntry] Nenhuma entrada remota, criando nova`)
    }

    // Upload para servidor
    console.log(`💾 [syncEntry] Fazendo upsert no Supabase...`)
    const success = await upsertDiaryEntry(toDBFormat(entryToSave))

    if (success) {
      console.log(`✅ [syncEntry] Upsert bem-sucedido! Marcando como sincronizado...`)
      // Marcar como sincronizado localmente
      entryToSave.synced = true
      await saveEntry(entryToSave)
      console.log(`🎉 [syncEntry] Sincronização completa!`)
      return true
    }

    console.error(`❌ [syncEntry] Upsert falhou`)
    return false
  } catch (error) {
    console.error('❌ [syncEntry] Erro ao sincronizar entrada:', error)
    return false
  }
}

// Sincronizar todas as entradas não sincronizadas
export async function syncAll(): Promise<{ success: number; failed: number }> {
  const unsyncedEntries = await getUnsyncedEntries()

  if (unsyncedEntries.length === 0) {
    return { success: 0, failed: 0 }
  }

  let success = 0
  let failed = 0

  for (const entry of unsyncedEntries) {
    const synced = await syncEntry(entry.date)
    if (synced) {
      success++
    } else {
      failed++
    }
  }

  return { success, failed }
}

// Sincronização automática em background
export async function backgroundSync(): Promise<void> {
  if (!navigator.onLine) return

  try {
    const result = await syncAll()
    if (result.success > 0) {
      toast.success(`${result.success} entrada(s) sincronizada(s)`)
    }
    if (result.failed > 0) {
      toast.error(`${result.failed} entrada(s) falharam na sincronização`)
    }
  } catch (error) {
    console.error('Erro na sincronização em background:', error)
  }
}

// Iniciar sincronização periódica
export function startPeriodicSync(intervalMs: number = 60000): () => void {
  const intervalId = setInterval(() => {
    backgroundSync()
  }, intervalMs)

  // Retornar função para parar
  return () => clearInterval(intervalId)
}

// Baixar entrada do servidor para local (útil para visualização de histórico)
export async function downloadEntry(date: string): Promise<DiaryEntry | null> {
  try {
    const remoteEntry = await getDiaryEntry(date)
    if (!remoteEntry) return null

    const entry = fromDBFormat(remoteEntry)
    await saveEntry(entry)
    return entry
  } catch (error) {
    console.error('Erro ao baixar entrada:', error)
    return null
  }
}
