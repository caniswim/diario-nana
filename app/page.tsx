"use client"

import { useEffect, useState } from "react"
import { useDiaryEntry } from "@/hooks/use-diary-entry"
import { CheckInSection } from "@/components/diary/check-in-section"
import { MealsSection } from "@/components/diary/meals-section"
import { PracticesSection } from "@/components/diary/practices-section"
import { ReflectionSection } from "@/components/diary/reflection-section"
import { AlertSection } from "@/components/diary/alert-section"
import { Button } from "@/components/ui/button"
import { Calendar, Download, History, Loader2, Wifi, WifiOff } from "lucide-react"
import { formatDate } from "@/lib/utils"
import { startPeriodicSync } from "@/lib/sync"
import { Toaster } from "@/components/ui/sonner"
import Link from "next/link"

export default function Home() {
  const [currentDate] = useState(new Date())
  const { entry, loading, saving, updateEntry } = useDiaryEntry(currentDate)
  const [isOnline, setIsOnline] = useState(true)

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
      <main className="container mx-auto px-4 py-6 max-w-3xl pb-24">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-3xl font-bold">Diário de Reconexão</h1>
            <div className="flex items-center gap-2">
              {isOnline ? (
                <Wifi className="h-5 w-5 text-green-600" />
              ) : (
                <WifiOff className="h-5 w-5 text-gray-400" />
              )}
              {saving && (
                <Loader2 className="h-5 w-5 animate-spin text-primary" />
              )}
            </div>
          </div>
          <p className="text-lg text-muted-foreground">
            {formatDate(currentDate)}
          </p>
        </div>

        {/* Sections */}
        <div className="space-y-6">
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
        </div>
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-background border-t shadow-lg">
        <div className="container mx-auto px-4 py-3 max-w-3xl">
          <div className="flex items-center justify-around gap-2">
            <Link href="/historico">
              <Button variant="outline" className="gap-2">
                <History className="h-4 w-4" />
                Histórico
              </Button>
            </Link>
            <Link href="/exportar">
              <Button variant="outline" className="gap-2">
                <Download className="h-4 w-4" />
                Exportar
              </Button>
            </Link>
            <Button variant="outline" className="gap-2" disabled>
              <Calendar className="h-4 w-4" />
              Hoje
            </Button>
          </div>
        </div>
      </nav>

      <Toaster />
    </>
  )
}
