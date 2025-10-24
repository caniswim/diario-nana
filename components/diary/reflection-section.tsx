"use client"

import { SectionCard } from "./section-card"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Textarea } from "@/components/ui/textarea"
import { MultiCheckbox } from "./multi-checkbox"
import { BookOpen } from "lucide-react"
import type { Reflexao } from "@/types/diary"

interface ReflectionSectionProps {
  reflexao: Reflexao
  onChange: (reflexao: Reflexao) => void
}

export function ReflectionSection({ reflexao, onChange }: ReflectionSectionProps) {
  return (
    <SectionCard title="Reflexão do Dia" icon={BookOpen}>
      <div className="space-y-3">
        {/* Pensou em comida fora dos horários */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">
            Pensei em comida fora dos horários?
          </Label>
          <RadioGroup
            value={reflexao.pensouComidaForaHorarios}
            onValueChange={(value) =>
              onChange({ ...reflexao, pensouComidaForaHorarios: value })
            }
          >
            {["Pouco (normal)", "Moderadamente", "Muito (obsessivamente)"].map(
              (option) => (
                <div key={option} className="flex items-center space-x-2">
                  <RadioGroupItem value={option} id={`pensou-${option}`} />
                  <Label htmlFor={`pensou-${option}`} className="text-sm">{option}</Label>
                </div>
              )
            )}
          </RadioGroup>

          <Textarea
            placeholder="Quando e o que sentia? (opcional)"
            value={reflexao.pensouComidaQuando || ""}
            onChange={(e) =>
              onChange({ ...reflexao, pensouComidaQuando: e.target.value })
            }
            rows={2}
            className="text-sm"
          />
        </div>

        {/* Comeu sem fome física */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">
            Comi sem fome física?
          </Label>
          <RadioGroup
            value={reflexao.comeuSemFome}
            onValueChange={(value) =>
              onChange({ ...reflexao, comeuSemFome: value })
            }
          >
            {["Não", "Sim, 1 vez", "Sim, várias vezes"].map((option) => (
              <div key={option} className="flex items-center space-x-2">
                <RadioGroupItem value={option} id={`sem-fome-${option}`} />
                <Label htmlFor={`sem-fome-${option}`} className="text-sm">{option}</Label>
              </div>
            ))}
          </RadioGroup>

          {reflexao.comeuSemFome && reflexao.comeuSemFome !== "Não" && (
            <MultiCheckbox
              label="Se sim, o que buscava?"
              options={[
                "Conforto emocional",
                "Distração/tédio",
                "Prazer/recompensa",
                "Hábito/automático",
                "Outro",
              ]}
              value={reflexao.comeuSemFomeBuscava || []}
              onChange={(value) =>
                onChange({ ...reflexao, comeuSemFomeBuscava: value })
              }
            />
          )}
        </div>

        {/* Aprendizados */}
        <div className="space-y-1">
          <Label className="text-sm">Aprendi sobre mim (opcional):</Label>
          <Textarea
            placeholder="Seus aprendizados..."
            value={reflexao.aprendizado || ""}
            onChange={(e) =>
              onChange({ ...reflexao, aprendizado: e.target.value })
            }
            rows={2}
            className="text-sm"
          />
        </div>

        <div className="space-y-1">
          <Label className="text-sm">Nota para mim (opcional):</Label>
          <Textarea
            placeholder="Algo que você quer lembrar..."
            value={reflexao.notaParaSi || ""}
            onChange={(e) =>
              onChange({ ...reflexao, notaParaSi: e.target.value })
            }
            rows={2}
            className="text-sm"
          />
        </div>
      </div>
    </SectionCard>
  )
}
