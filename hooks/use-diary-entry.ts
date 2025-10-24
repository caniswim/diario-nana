"use client"

import { useState, useEffect, useCallback, useRef } from 'react'
import { getEntry, saveEntry } from '@/lib/db'
import { syncEntry } from '@/lib/sync'
import type { DiaryEntry } from '@/types/diary'
import { getDateKey, generateId } from '@/lib/utils'
import { toast } from 'sonner'

export function useDiaryEntry(date: Date) {
  const [entry, setEntry] = useState<DiaryEntry | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const dateKey = getDateKey(date)

  // Carregar entrada
  useEffect(() => {
    loadEntry()
  }, [dateKey])

  const loadEntry = async () => {
    setLoading(true)
    try {
      const existingEntry = await getEntry(dateKey)
      if (existingEntry) {
        setEntry(existingEntry)
      } else {
        // Criar nova entrada
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
          updatedEntry.updatedAt = Date.now()
          updatedEntry.synced = false // Marcar como não sincronizado
          await saveEntry(updatedEntry)

          // Tentar sincronizar se online
          if (navigator.onLine) {
            await syncEntry(dateKey)
          }

          toast.success('Salvo automaticamente', {
            duration: 2000,
            position: 'bottom-center',
          })
        } catch (error) {
          console.error('Erro ao salvar:', error)
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
