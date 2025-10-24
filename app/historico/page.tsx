"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Calendar as CalendarIcon, ChevronLeft, ChevronRight, AlertTriangle, CheckCircle2 } from "lucide-react"
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
    <main className="container mx-auto px-4 py-4 max-w-3xl pb-24">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <Link href="/">
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <h1 className="text-xl font-bold">Histórico</h1>
      </div>

      {/* Calendar Navigation */}
      <Card className="mb-4">
        <CardContent className="p-3">
          <div className="flex items-center justify-between mb-3">
            <Button variant="ghost" size="icon" onClick={previousMonth} className="h-8 w-8">
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <h2 className="text-base font-semibold capitalize">
              {format(currentMonth, 'MMMM yyyy', { locale: ptBR })}
            </h2>
            <Button variant="ghost" size="icon" onClick={nextMonth} className="h-8 w-8">
              <ChevronRight className="h-5 w-5" />
            </Button>
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-1">
            {['D', 'S', 'T', 'Q', 'Q', 'S', 'S'].map((day, idx) => (
              <div key={idx} className="text-center text-xs font-medium text-muted-foreground p-1">
                {day}
              </div>
            ))}

            {/* Empty cells for days before month starts */}
            {Array.from({ length: monthStart.getDay() }).map((_, i) => (
              <div key={`empty-${i}`} className="p-1" />
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
                    "aspect-square flex items-center justify-center rounded-md border transition-all hover:scale-105 relative",
                    !isSameMonth(date, currentMonth) && "opacity-30",
                    today && "border-primary bg-primary/10 font-bold",
                    hasEntry && !today && "bg-green-50 border-green-300",
                    hasAlerts && "bg-red-50 border-red-300",
                    !hasEntry && !today && "border-gray-200 hover:bg-gray-50"
                  )}
                >
                  <div className="text-xs">
                    {format(date, 'd')}
                  </div>
                  {hasEntry && (
                    <div className="absolute bottom-0.5 right-0.5">
                      {hasAlerts ? (
                        <AlertTriangle className="h-2.5 w-2.5 text-red-600" />
                      ) : (
                        <CheckCircle2 className="h-2.5 w-2.5 text-green-600" />
                      )}
                    </div>
                  )}
                </Link>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <Card>
        <CardContent className="p-3">
          <h3 className="text-sm font-semibold mb-2">Estatísticas</h3>
          <div className="flex gap-3">
            <div className="flex-1">
              <p className="text-xs text-muted-foreground mb-1">Total</p>
              <Badge variant="secondary" className="text-base font-bold">
                {entries.length}
              </Badge>
            </div>
            <div className="flex-1">
              <p className="text-xs text-muted-foreground mb-1">Alertas</p>
              <Badge variant="destructive" className="text-base font-bold">
                {entries.filter(e => e.sinaisAlerta.length >= 3).length}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </main>
  )
}
