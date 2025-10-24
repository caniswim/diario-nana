"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ScaleSelector } from "./scale-selector"
import { MultiCheckbox } from "./multi-checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Trash2 } from "lucide-react"
import type { Refeicao, NivelFome, NivelSaciedade } from "@/types/diary"
import { cn } from "@/lib/utils"

interface MealCardProps {
  meal: Refeicao
  onChange: (meal: Refeicao) => void
  onDelete: () => void
  canDelete: boolean
}

const fomeOptions = [
  { value: "1", label: "1-2", description: "Sem fome" },
  { value: "2", label: "3-4", description: "Pouca fome" },
  { value: "3", label: "5-6", description: "Fome moderada", isIdeal: true },
  { value: "4", label: "7-8", description: "Muita fome" },
  { value: "5", label: "9-10", description: "Faminto" },
]

const saciedadeOptions = [
  { value: "1", label: "1-2", description: "Ainda com fome" },
  { value: "2", label: "3-4", description: "Pouco satisfeito" },
  { value: "3", label: "5-6", description: "Satisfeito, confortável", isIdeal: true },
  { value: "4", label: "7-8", description: "Cheio" },
  { value: "5", label: "9-10", description: "Muito cheio, desconforto" },
]

const sentimentosOptions = [
  "Estresse/ansiedade",
  "Tédio",
  "Tristeza",
  "Tranquilidade",
  "Pressa",
]

const comoComeuOptions = [
  "Com calma e atenção",
  "Rápido demais",
  "Distraído (TV/celular/trabalho)",
  "Presente e aproveitando",
]

const depoisFisicoOptions = [
  "Leve e confortável",
  "Um pouco cheio",
  "Muito cheio/pesado",
  "Com desconforto",
]

const depoisEmocionalOptions = [
  "Tranquilo/satisfeito",
  "Culpado",
  "Arrependido",
  "Neutro",
  "Feliz",
]

export function MealCard({ meal, onChange, onDelete, canDelete }: MealCardProps) {
  return (
    <Card className="relative">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 space-y-2">
            <Input
              placeholder="Nome da refeição (ex: Café da manhã)"
              value={meal.nome}
              onChange={(e) => onChange({ ...meal, nome: e.target.value })}
              className="font-semibold"
            />
            <Input
              type="time"
              value={meal.horario}
              onChange={(e) => onChange({ ...meal, horario: e.target.value })}
            />
          </div>
          {canDelete && (
            <Button
              variant="ghost"
              size="icon"
              onClick={onDelete}
              className="text-destructive hover:text-destructive hover:bg-destructive/10"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Fome antes */}
        <ScaleSelector
          label="Fome antes (1-10):"
          options={fomeOptions}
          value={meal.fomeAntes?.toString()}
          onChange={(value) =>
            onChange({ ...meal, fomeAntes: parseInt(value) as NivelFome })
          }
        />

        {/* Sentimentos */}
        <MultiCheckbox
          label="Estava sentindo/fazendo:"
          options={sentimentosOptions}
          value={meal.sentimentos}
          onChange={(value) => onChange({ ...meal, sentimentos: value })}
        />

        {meal.sentimentos.includes("Outro") && (
          <div className="space-y-2">
            <Label>Outro sentimento:</Label>
            <Input
              placeholder="Descreva..."
              value={meal.sentimentoOutro || ""}
              onChange={(e) =>
                onChange({ ...meal, sentimentoOutro: e.target.value })
              }
            />
          </div>
        )}

        {/* Vontade específica */}
        <div className="space-y-3">
          <Label className="text-base font-semibold">Tinha vontade específica?</Label>
          <RadioGroup
            value={meal.tinhaVontade?.toString()}
            onValueChange={(value) =>
              onChange({ ...meal, tinhaVontade: value === "true" })
            }
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="true" id="vontade-sim" />
              <Label htmlFor="vontade-sim">Sim</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="false" id="vontade-nao" />
              <Label htmlFor="vontade-nao">Não, comi o que tinha</Label>
            </div>
          </RadioGroup>

          {meal.tinhaVontade && (
            <Input
              placeholder="Qual vontade específica?"
              value={meal.vontadeEspecifica || ""}
              onChange={(e) =>
                onChange({ ...meal, vontadeEspecifica: e.target.value })
              }
            />
          )}
        </div>

        {/* Como comeu */}
        <MultiCheckbox
          label="Como comi:"
          options={comoComeuOptions}
          value={meal.comoComi}
          onChange={(value) => onChange({ ...meal, comoComi: value })}
        />

        {/* Gostou da comida */}
        <div className="space-y-3">
          <Label className="text-base font-semibold">Gostei da comida?</Label>
          <RadioGroup
            value={meal.gosteiDaComida}
            onValueChange={(value) =>
              onChange({ ...meal, gosteiDaComida: value })
            }
          >
            {["Sim, muito", "Foi ok", "Não muito", "Não prestei atenção"].map(
              (option) => (
                <div key={option} className="flex items-center space-x-2">
                  <RadioGroupItem value={option} id={`gostei-${option}`} />
                  <Label htmlFor={`gostei-${option}`}>{option}</Label>
                </div>
              )
            )}
          </RadioGroup>
        </div>

        {/* Saciedade final */}
        <ScaleSelector
          label="Saciedade final (1-10):"
          options={saciedadeOptions}
          value={meal.saciedadeFinal?.toString()}
          onChange={(value) =>
            onChange({
              ...meal,
              saciedadeFinal: parseInt(value) as NivelSaciedade,
            })
          }
        />

        {/* Depois da refeição - Físico */}
        <MultiCheckbox
          label="Depois da refeição me sinto (Físico):"
          options={depoisFisicoOptions}
          value={meal.depoisFisico}
          onChange={(value) => onChange({ ...meal, depoisFisico: value })}
        />

        {/* Depois da refeição - Emocional */}
        <MultiCheckbox
          label="Depois da refeição me sinto (Emocional):"
          options={depoisEmocionalOptions}
          value={meal.depoisEmocional}
          onChange={(value) => onChange({ ...meal, depoisEmocional: value })}
        />

        {/* Observação */}
        <div className="space-y-2">
          <Label>Observação importante (opcional):</Label>
          <Textarea
            placeholder="Alguma observação sobre esta refeição..."
            value={meal.observacao || ""}
            onChange={(e) =>
              onChange({ ...meal, observacao: e.target.value })
            }
            rows={3}
          />
        </div>
      </CardContent>
    </Card>
  )
}
