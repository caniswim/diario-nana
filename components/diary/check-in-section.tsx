"use client"

import { SectionCard } from "./section-card"
import { ScaleSelector } from "./scale-selector"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import type { CheckIn, NivelEstresse, QualidadeSono } from "@/types/diary"

interface CheckInSectionProps {
  checkIn: CheckIn
  onChange: (checkIn: CheckIn) => void
}

const qualidadeSonoOptions = [
  { value: "1", label: "1 - Péssimo" },
  { value: "2", label: "2 - Ruim" },
  { value: "3", label: "3 - Ok" },
  { value: "4", label: "4 - Bom" },
  { value: "5", label: "5 - Ótimo" },
]

const nivelEstresseOptions = [
  { value: "1", label: "1", description: "Muito tranquilo" },
  { value: "2", label: "2" },
  { value: "3", label: "3" },
  { value: "4", label: "4" },
  { value: "5", label: "5", description: "Moderado" },
  { value: "6", label: "6" },
  { value: "7", label: "7" },
  { value: "8", label: "8" },
  { value: "9", label: "9" },
  { value: "10", label: "10", description: "Muito ansioso" },
]

export function CheckInSection({ checkIn, onChange }: CheckInSectionProps) {
  return (
    <SectionCard title="Check-in do Dia" icon="🌅">
      <div className="space-y-6">
        {/* Sentimentos */}
        <div className="space-y-3">
          <Label className="text-base font-semibold">Como estou me sentindo hoje?</Label>
          <div className="space-y-2">
            <Label htmlFor="emocional" className="text-sm text-muted-foreground">
              Emocional:
            </Label>
            <Textarea
              id="emocional"
              placeholder="Descreva como você está se sentindo emocionalmente..."
              value={checkIn.emocional || ""}
              onChange={(e) =>
                onChange({ ...checkIn, emocional: e.target.value })
              }
              rows={2}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="fisico" className="text-sm text-muted-foreground">
              Físico:
            </Label>
            <Textarea
              id="fisico"
              placeholder="Descreva como você está se sentindo fisicamente..."
              value={checkIn.fisico || ""}
              onChange={(e) =>
                onChange({ ...checkIn, fisico: e.target.value })
              }
              rows={2}
            />
          </div>
        </div>

        {/* Qualidade do sono */}
        <ScaleSelector
          label="Qualidade do sono:"
          options={qualidadeSonoOptions}
          value={checkIn.qualidadeSono?.toString()}
          onChange={(value) =>
            onChange({
              ...checkIn,
              qualidadeSono: parseInt(value) as QualidadeSono,
            })
          }
        />

        {/* Nível de estresse */}
        <ScaleSelector
          label="Nível de estresse/ansiedade hoje:"
          options={nivelEstresseOptions}
          value={checkIn.nivelEstresse?.toString()}
          onChange={(value) =>
            onChange({
              ...checkIn,
              nivelEstresse: parseInt(value) as NivelEstresse,
            })
          }
        />
      </div>
    </SectionCard>
  )
}
