"use client"

import { SectionCard } from "./section-card"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import type { SinalAlerta } from "@/types/diary"
import { cn } from "@/lib/utils"

interface AlertSectionProps {
  sinais: SinalAlerta[]
  onChange: (sinais: SinalAlerta[]) => void
}

const alertOptions: SinalAlerta[] = [
  "Tive episódio de compulsão hoje",
  "Pulei refeições intencionalmente",
  "Pesei comida ou contei calorias obsessivamente",
  "Fiz exercício como compensação",
  "Pensei em comida/corpo por mais de 50% do dia",
  "Me comparei muito com outras pessoas",
  "Senti vontade de me machucar ou pensamentos muito negativos",
]

export function AlertSection({ sinais, onChange }: AlertSectionProps) {
  const toggleAlert = (alert: SinalAlerta) => {
    if (sinais.includes(alert)) {
      onChange(sinais.filter((s) => s !== alert))
    } else {
      onChange([...sinais, alert])
    }
  }

  const hasWarning = sinais.length >= 3

  return (
    <SectionCard title="Sinais de Alerta" icon="⚠️">
      <div className="space-y-4">
        {hasWarning && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm font-semibold text-red-800">
              ⚠️ ATENÇÃO: Você marcou 3 ou mais sinais de alerta.
            </p>
            <p className="text-sm text-red-700 mt-1">
              Por favor, considere buscar ajuda profissional.
            </p>
          </div>
        )}

        <div className="space-y-3">
          <Label className="text-sm text-muted-foreground">
            Marcar se aplicar:
          </Label>
          {alertOptions.map((alert) => (
            <div
              key={alert}
              className={cn(
                "flex items-start space-x-3 p-3 rounded-lg transition-colors",
                sinais.includes(alert) && "bg-red-50 border border-red-200"
              )}
            >
              <Checkbox
                id={alert}
                checked={sinais.includes(alert)}
                onCheckedChange={() => toggleAlert(alert)}
                className="mt-0.5"
              />
              <Label
                htmlFor={alert}
                className="cursor-pointer flex-1 font-normal leading-relaxed"
              >
                {alert}
              </Label>
            </div>
          ))}
        </div>

        {hasWarning && (
          <p className="text-sm font-medium text-red-700 text-center mt-4">
            Se marcou 3 ou mais: PRECISO PROCURAR AJUDA PROFISSIONAL
          </p>
        )}
      </div>
    </SectionCard>
  )
}
