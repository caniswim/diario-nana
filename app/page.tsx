"use client"

import { useEffect, useState } from "react"
import { useDiaryEntry } from "@/hooks/use-diary-entry"
import { CheckInSection } from "@/components/diary/check-in-section"
import { MealsSection } from "@/components/diary/meals-section"
import { PracticesSection } from "@/components/diary/practices-section"
import { ReflectionSection } from "@/components/diary/reflection-section"
import { AlertSection } from "@/components/diary/alert-section"
import { WeeklySummarySection } from "@/components/diary/weekly-summary-section"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ThemeToggle } from "@/components/ui/theme-toggle"
import { Calendar, Download, History, Loader2, WifiOff, Home as HomeIcon } from "lucide-react"
import { formatDate } from "@/lib/utils"
import { startPeriodicSync } from "@/lib/sync"
import { Toaster } from "@/components/ui/sonner"
import Link from "next/link"

export default function Home() {
  const [currentDate] = useState(new Date())
  const { entry, loading, saving, updateEntry } = useDiaryEntry(currentDate)
  const [isOnline, setIsOnline] = useState(true)
  const isSunday = currentDate.getDay() === 0

  // Monitorar status online/offline
  useEffect(() => {
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    // Iniciar sincronização periódica
    const stopSync = startPeriodicSync(30000) // A cada 30 segundos

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
      stopSync()
    }
  }, [])

  if (loading || !entry) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">Carregando seu diário...</p>
        </div>
      </div>
    )
  }

  return (
    <>
      <main className="container mx-auto px-4 py-4 max-w-3xl pb-24">
        {/* Header */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-1">
            <h1 className="text-xl font-bold">Diário de Reconexão</h1>
            <div className="flex items-center gap-2">
              {!isOnline && (
                <WifiOff className="h-4 w-4 text-muted-foreground" />
              )}
              {saving && (
                <Loader2 className="h-4 w-4 animate-spin text-primary" />
              )}
              <ThemeToggle />
            </div>
          </div>
          <p className="text-sm text-muted-foreground">
            {formatDate(currentDate)}
          </p>
        </div>

        {/* Sections */}
        <div className="space-y-4">
          <CheckInSection
            checkIn={entry.checkIn}
            onChange={(checkIn) => updateEntry({ checkIn })}
          />

          <MealsSection
            meals={entry.refeicoes}
            onChange={(refeicoes) => updateEntry({ refeicoes })}
          />

          <PracticesSection
            praticas={entry.praticas}
            onChange={(praticas) => updateEntry({ praticas })}
          />

          <ReflectionSection
            reflexao={entry.reflexao}
            onChange={(reflexao) => updateEntry({ reflexao })}
          />

          <AlertSection
            sinais={entry.sinaisAlerta}
            onChange={(sinaisAlerta) => updateEntry({ sinaisAlerta })}
          />

          {isSunday && entry.resumoSemanal && (
            <WeeklySummarySection
              resumo={entry.resumoSemanal}
              onChange={(resumoSemanal) => updateEntry({ resumoSemanal })}
            />
          )}
        </div>
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-background border-t shadow-lg">
        <div className="container mx-auto px-4 py-2 max-w-3xl">
          <div className="flex items-center justify-around">
            <Link href="/" className="flex flex-col items-center gap-1 py-2 px-4">
              <div className="relative">
                <HomeIcon className="h-6 w-6 text-primary" />
                <Badge variant="default" className="absolute -top-1 -right-1 h-2 w-2 p-0 bg-primary" />
              </div>
            </Link>
            <Link href="/historico" className="flex flex-col items-center gap-1 py-2 px-4">
              <History className="h-6 w-6 text-muted-foreground" />
            </Link>
            <Link href="/exportar" className="flex flex-col items-center gap-1 py-2 px-4">
              <Download className="h-6 w-6 text-muted-foreground" />
            </Link>
          </div>
        </div>
      </nav>

      <Toaster />
    </>
  )
}
