"use client"

import { useState, useEffect, useCallback, useRef } from 'react'
import { getEntry, saveEntry } from '@/lib/db'
import { syncEntry } from '@/lib/sync'
import { getDiaryEntry, isSupabaseConfigured } from '@/lib/supabase'
import type { DiaryEntry, DiaryEntryDB } from '@/types/diary'
import { getDateKey, generateId } from '@/lib/utils'
import { toast } from 'sonner'

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

export function useDiaryEntry(date: Date) {
  const [entry, setEntry] = useState<DiaryEntry | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const hasShownWarningRef = useRef(false)
  const dateKey = getDateKey(date)

  // Avisar se Supabase não está configurado (apenas uma vez)
  useEffect(() => {
    if (!isSupabaseConfigured && !hasShownWarningRef.current) {
      hasShownWarningRef.current = true
      toast.error('⚠️ Supabase não configurado! Seus dados serão salvos apenas localmente.', {
        duration: 5000,
        description: 'Configure as variáveis de ambiente no arquivo .env.local para sincronizar com a nuvem.'
      })
    }
  }, [])

  // Carregar entrada
  useEffect(() => {
    loadEntry()
  }, [dateKey])

  const loadEntry = async () => {
    setLoading(true)
    try {
      let existingEntry = await getEntry(dateKey)

      // Se não tem local E está online, busca do servidor primeiro
      if (!existingEntry && navigator.onLine) {
        try {
          const remoteEntry = await getDiaryEntry(dateKey)
          if (remoteEntry) {
            existingEntry = fromDBFormat(remoteEntry)
            await saveEntry(existingEntry)
          }
        } catch (error) {
          console.error('Erro ao buscar entrada do servidor:', error)
          // Continua mesmo se falhar, criará entrada vazia
        }
      }

      if (existingEntry) {
        setEntry(existingEntry)
      } else {
        // Só cria vazia se realmente não existe em nenhum lugar
        const newEntry: DiaryEntry = {
          id: generateId(),
          date: dateKey,
          checkIn: {},
          refeicoes: [],
          praticas: {},
          reflexao: {},
          sinaisAlerta: [],
          synced: false,
          createdAt: Date.now(),
          updatedAt: Date.now(),
        }
        setEntry(newEntry)
        await saveEntry(newEntry)
      }
    } catch (error) {
      console.error('Erro ao carregar entrada:', error)
      toast.error('Erro ao carregar entrada do diário')
    } finally {
      setLoading(false)
    }
  }

  // Auto-save com debounce
  const debouncedSave = useCallback(
    async (updatedEntry: DiaryEntry) => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current)
      }

      setSaving(true)

      saveTimeoutRef.current = setTimeout(async () => {
        try {
          console.log(`💾 [useDiaryEntry] Salvando entrada para ${dateKey}`)
          updatedEntry.updatedAt = Date.now()
          updatedEntry.synced = false // Marcar como não sincronizado
          await saveEntry(updatedEntry)
          console.log(`✅ [useDiaryEntry] Salvo localmente. Online: ${navigator.onLine}`)

          // Tentar sincronizar se online
          if (navigator.onLine) {
            console.log(`🌐 [useDiaryEntry] Chamando syncEntry...`)
            const syncResult = await syncEntry(dateKey)
            console.log(`🔄 [useDiaryEntry] Resultado da sincronização: ${syncResult}`)
          } else {
            console.log(`📴 [useDiaryEntry] Offline, sincronização adiada`)
          }

          toast.success('Salvo automaticamente', {
            duration: 2000,
            position: 'bottom-center',
          })
        } catch (error) {
          console.error('❌ [useDiaryEntry] Erro ao salvar:', error)
          toast.error('Erro ao salvar entrada')
        } finally {
          setSaving(false)
        }
      }, 1000) // Debounce de 1 segundo
    },
    [dateKey]
  )

  // Atualizar entrada
  const updateEntry = useCallback(
    (updates: Partial<DiaryEntry>) => {
      if (!entry) return

      const updatedEntry = { ...entry, ...updates }
      setEntry(updatedEntry)
      debouncedSave(updatedEntry)
    },
    [entry, debouncedSave]
  )

  // Cleanup
  useEffect(() => {
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current)
      }
    }
  }, [])

  return {
    entry,
    loading,
    saving,
    updateEntry,
    reload: loadEntry,
  }
}
