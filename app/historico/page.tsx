"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Calendar as CalendarIcon } from "lucide-react"
import Link from "next/link"
import { getAllEntries } from "@/lib/db"
import type { DiaryEntry } from "@/types/diary"
import { format, parseISO, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isToday } from "date-fns"
import { ptBR } from "date-fns/locale"
import { cn } from "@/lib/utils"

export default function HistoricoPage() {
  const [entries, setEntries] = useState<DiaryEntry[]>([])
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadEntries()
  }, [])

  const loadEntries = async () => {
    setLoading(true)
    const allEntries = await getAllEntries()
    setEntries(allEntries)
    setLoading(false)
  }

  const monthStart = startOfMonth(currentMonth)
  const monthEnd = endOfMonth(currentMonth)
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd })

  const getEntryForDate = (date: Date) => {
    const dateKey = format(date, 'yyyy-MM-dd')
    return entries.find(e => e.date === dateKey)
  }

  const previousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))
  }

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Carregando histórico...</p>
      </div>
    )
  }

  return (
    <main className="container mx-auto px-4 py-6 max-w-3xl pb-24">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Link href="/">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <h1 className="text-2xl font-bold">Histórico</h1>
      </div>

      {/* Calendar Navigation */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-4">
            <Button variant="outline" size="sm" onClick={previousMonth}>
              ←
            </Button>
            <h2 className="text-lg font-semibold capitalize">
              {format(currentMonth, 'MMMM yyyy', { locale: ptBR })}
            </h2>
            <Button variant="outline" size="sm" onClick={nextMonth}>
              →
            </Button>
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-2">
            {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map(day => (
              <div key={day} className="text-center text-sm font-medium text-muted-foreground p-2">
                {day}
              </div>
            ))}

            {/* Empty cells for days before month starts */}
            {Array.from({ length: monthStart.getDay() }).map((_, i) => (
              <div key={`empty-${i}`} className="p-2" />
            ))}

            {/* Days */}
            {daysInMonth.map(date => {
              const entry = getEntryForDate(date)
              const hasEntry = !!entry
              const hasAlerts = entry?.sinaisAlerta.length && entry.sinaisAlerta.length >= 3
              const today = isToday(date)

              return (
                <Link
                  key={date.toISOString()}
                  href={`/entrada/${format(date, 'yyyy-MM-dd')}`}
                  className={cn(
                    "aspect-square flex items-center justify-center rounded-lg border-2 transition-all hover:scale-105",
                    !isSameMonth(date, currentMonth) && "opacity-30",
                    today && "border-primary bg-primary/10",
                    hasEntry && !today && "bg-green-50 border-green-200",
                    hasAlerts && "bg-red-50 border-red-400",
                    !hasEntry && !today && "border-gray-200 hover:bg-gray-50"
                  )}
                >
                  <div className="text-center">
                    <div className={cn(
                      "text-sm font-medium",
                      today && "text-primary font-bold",
                      hasEntry && "text-green-700",
                      hasAlerts && "text-red-700"
                    )}>
                      {format(date, 'd')}
                    </div>
                    {hasEntry && (
                      <div className="text-xs mt-1">
                        {hasAlerts ? '⚠️' : '✓'}
                      </div>
                    )}
                  </div>
                </Link>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <Card>
        <CardContent className="p-4">
          <h3 className="font-semibold mb-3">Estatísticas</h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground">Total de entradas</p>
              <p className="text-2xl font-bold">{entries.length}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Com sinais de alerta</p>
              <p className="text-2xl font-bold text-red-600">
                {entries.filter(e => e.sinaisAlerta.length >= 3).length}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </main>
  )
}
