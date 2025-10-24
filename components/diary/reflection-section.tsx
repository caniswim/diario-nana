"use client"

import { SectionCard } from "./section-card"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Textarea } from "@/components/ui/textarea"
import { MultiCheckbox } from "./multi-checkbox"
import type { Reflexao } from "@/types/diary"

interface ReflectionSectionProps {
  reflexao: Reflexao
  onChange: (reflexao: Reflexao) => void
}

export function ReflectionSection({ reflexao, onChange }: ReflectionSectionProps) {
  return (
    <SectionCard title="Reflexão do Dia" icon="💭">
      <div className="space-y-6">
        {/* Pensou em comida fora dos horários */}
        <div className="space-y-3">
          <Label className="text-base font-semibold">
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
                  <Label htmlFor={`pensou-${option}`}>{option}</Label>
                </div>
              )
            )}
          </RadioGroup>

          <Textarea
            placeholder="Se sim, quando e o que sentia? (opcional)"
            value={reflexao.pensouComidaQuando || ""}
            onChange={(e) =>
              onChange({ ...reflexao, pensouComidaQuando: e.target.value })
            }
            rows={2}
          />
        </div>

        {/* Comeu sem fome física */}
        <div className="space-y-3">
          <Label className="text-base font-semibold">
            Comi sem fome física hoje?
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
                <Label htmlFor={`sem-fome-${option}`}>{option}</Label>
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
        <div className="space-y-2">
          <Label>Uma coisa que aprendi sobre mim hoje (opcional):</Label>
          <Textarea
            placeholder="Seus aprendizados..."
            value={reflexao.aprendizado || ""}
            onChange={(e) =>
              onChange({ ...reflexao, aprendizado: e.target.value })
            }
            rows={3}
          />
        </div>

        <div className="space-y-2">
          <Label>Nota para mim mesma (opcional):</Label>
          <Textarea
            placeholder="Algo que você quer lembrar..."
            value={reflexao.notaParaSi || ""}
            onChange={(e) =>
              onChange({ ...reflexao, notaParaSi: e.target.value })
            }
            rows={3}
          />
        </div>
      </div>
    </SectionCard>
  )
}
