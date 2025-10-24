'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { format, addDays, subDays, parseISO, isValid } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { useDiaryEntry } from '@/hooks/use-diary-entry'
import { CheckInSection } from '@/components/diary/check-in-section'
import { MealsSection } from '@/components/diary/meals-section'
import { PracticesSection } from '@/components/diary/practices-section'
import { ReflectionSection } from '@/components/diary/reflection-section'
import { AlertSection } from '@/components/diary/alert-section'

export default function EntradaPage() {
  const params = useParams()
  const router = useRouter()
  const dateParam = params.date as string

  // Validar e parsear data
  const [date, setDate] = useState<Date | null>(() => {
    try {
      const parsedDate = parseISO(dateParam)
      return isValid(parsedDate) ? parsedDate : null
    } catch {
      return null
    }
  })

  useEffect(() => {
    if (!date) {
      toast.error('Data inválida')
      router.push('/')
    }
  }, [date, router])

  const { entry, loading, saving, updateEntry } = useDiaryEntry(date || new Date())

  const goToPreviousDay = () => {
    if (!date) return
    const previousDay = format(subDays(date, 1), 'yyyy-MM-dd')
    router.push(`/entrada/${previousDay}`)
  }

  const goToNextDay = () => {
    if (!date) return
    const nextDay = format(addDays(date, 1), 'yyyy-MM-dd')
    router.push(`/entrada/${nextDay}`)
  }

  const goToToday = () => {
    const today = format(new Date(), 'yyyy-MM-dd')
    router.push(`/entrada/${today}`)
  }

  if (loading || !date || !entry) {
    return (
      <div className="min-h-screen bg-background p-4 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Carregando entrada...</p>
        </div>
      </div>
    )
  }

  const isToday = dateParam === format(new Date(), 'yyyy-MM-dd')

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header com navegação */}
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
        <div className="container max-w-2xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push('/historico')}
            >
              ← Histórico
            </Button>
            <div className="flex items-center gap-2">
              {saving && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                  <span>Salvando...</span>
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between">
            <Button
              variant="outline"
              size="sm"
              onClick={goToPreviousDay}
            >
              ← Dia Anterior
            </Button>

            <div className="text-center">
              <h1 className="text-lg font-semibold capitalize">
                {format(date, "EEEE, d 'de' MMMM", { locale: ptBR })}
              </h1>
              {isToday && (
                <span className="text-xs text-primary font-medium">Hoje</span>
              )}
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={goToNextDay}
            >
              Próximo Dia →
            </Button>
          </div>

          {!isToday && (
            <div className="mt-3 text-center">
              <Button
                variant="ghost"
                size="sm"
                onClick={goToToday}
              >
                Ir para Hoje
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Conteúdo do diário */}
      <div className="container max-w-2xl mx-auto px-4 py-6 space-y-6">
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

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-background border-t z-10">
        <div className="container max-w-2xl mx-auto px-4 py-3">
          <div className="flex items-center justify-around">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push('/')}
            >
              🏠 Hoje
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push('/historico')}
            >
              📅 Histórico
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push('/exportar')}
            >
              📤 Exportar
            </Button>
          </div>
        </div>
      </nav>
    </div>
  )
}
