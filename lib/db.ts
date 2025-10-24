import { openDB, DBSchema, IDBPDatabase } from 'idb'
import type { DiaryEntry } from '@/types/diary'

interface DiaryDB extends DBSchema {
  entries: {
    key: string // date in YYYY-MM-DD format
    value: DiaryEntry
    indexes: { 'by-date': string; 'by-synced': number }
  }
}

let db: IDBPDatabase<DiaryDB> | null = null

export async function initDB(): Promise<IDBPDatabase<DiaryDB>> {
  if (db) return db

  db = await openDB<DiaryDB>('diary-db', 1, {
    upgrade(db) {
      const entryStore = db.createObjectStore('entries', { keyPath: 'date' })
      entryStore.createIndex('by-date', 'date')
      entryStore.createIndex('by-synced', 'synced')
    },
  })

  return db
}

export async function getEntry(date: string): Promise<DiaryEntry | undefined> {
  const database = await initDB()
  return database.get('entries', date)
}

export async function saveEntry(entry: DiaryEntry): Promise<void> {
  const database = await initDB()
  await database.put('entries', entry)
}

export async function getUnsyncedEntries(): Promise<DiaryEntry[]> {
  const database = await initDB()
  const tx = database.transaction('entries', 'readonly')
  const index = tx.store.index('by-synced')
  const entries = await index.getAll(0) // 0 = não sincronizado
  return entries
}

export async function getAllEntries(): Promise<DiaryEntry[]> {
  const database = await initDB()
  return database.getAll('entries')
}

export async function getEntriesByDateRange(
  startDate: string,
  endDate: string
): Promise<DiaryEntry[]> {
  const database = await initDB()
  const allEntries = await database.getAll('entries')

  return allEntries.filter(
    (entry) => entry.date >= startDate && entry.date <= endDate
  )
}

export async function deleteEntry(date: string): Promise<void> {
  const database = await initDB()
  await database.delete('entries', date)
}

export async function clearAllEntries(): Promise<void> {
  const database = await initDB()
  await database.clear('entries')
}
