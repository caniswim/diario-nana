import { getDiaryEntry, upsertDiaryEntry } from './supabase'
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
    const localEntry = await getEntry(date)
    if (!localEntry) return false

    // Se já sincronizado e não foi modificado, não faz nada
    if (localEntry.synced) return true

    // Tentar buscar do servidor
    const remoteEntry = await getDiaryEntry(date)

    let entryToSave = localEntry

    // Resolver conflito: prioridade para dados locais mais recentes
    if (remoteEntry) {
      const remoteUpdated = new Date(remoteEntry.updated_at).getTime()
      if (remoteUpdated > localEntry.updatedAt) {
        // Dados remotos são mais recentes, usar eles
        entryToSave = fromDBFormat(remoteEntry)
      }
    }

    // Upload para servidor
    const success = await upsertDiaryEntry(toDBFormat(entryToSave))

    if (success) {
      // Marcar como sincronizado localmente
      entryToSave.synced = true
      await saveEntry(entryToSave)
      return true
    }

    return false
  } catch (error) {
    console.error('Erro ao sincronizar entrada:', error)
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
