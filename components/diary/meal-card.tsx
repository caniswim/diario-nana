"use client"

import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScaleSelector } from "./scale-selector"
import { MultiCheckbox } from "./multi-checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Trash2, Clock } from "lucide-react"
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
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 space-y-2">
            <Input
              placeholder="Nome da refeição"
              value={meal.nome}
              onChange={(e) => onChange({ ...meal, nome: e.target.value })}
              className="font-semibold text-sm h-9"
            />
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <Input
                type="time"
                value={meal.horario}
                onChange={(e) => onChange({ ...meal, horario: e.target.value })}
                className="h-8 text-sm"
              />
            </div>
          </div>
          {canDelete && (
            <Button
              variant="ghost"
              size="icon"
              onClick={onDelete}
              className="text-destructive hover:text-destructive hover:bg-destructive/10 h-8 w-8"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-3 pt-2">
        <Tabs defaultValue="antes" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="antes" className="text-xs">Antes</TabsTrigger>
            <TabsTrigger value="durante" className="text-xs">Durante</TabsTrigger>
            <TabsTrigger value="depois" className="text-xs">Depois</TabsTrigger>
          </TabsList>

          {/* Aba ANTES */}
          <TabsContent value="antes" className="space-y-3 mt-3">
            <ScaleSelector
              label="Nível de fome:"
              options={fomeOptions}
              value={meal.fomeAntes?.toString()}
              onChange={(value) =>
                onChange({ ...meal, fomeAntes: parseInt(value) as NivelFome })
              }
            />

            <MultiCheckbox
              label="Estava sentindo:"
              options={sentimentosOptions}
              value={meal.sentimentos}
              onChange={(value) => onChange({ ...meal, sentimentos: value })}
            />

            <div className="space-y-2">
              <Label className="text-sm font-medium">Tinha vontade específica?</Label>
              <RadioGroup
                value={meal.tinhaVontade?.toString()}
                onValueChange={(value) =>
                  onChange({ ...meal, tinhaVontade: value === "true" })
                }
                className="flex gap-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="true" id={`vontade-sim-${meal.id}`} />
                  <Label htmlFor={`vontade-sim-${meal.id}`} className="text-sm">Sim</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="false" id={`vontade-nao-${meal.id}`} />
                  <Label htmlFor={`vontade-nao-${meal.id}`} className="text-sm">Não</Label>
                </div>
              </RadioGroup>

              {meal.tinhaVontade && (
                <Input
                  placeholder="Qual vontade?"
                  value={meal.vontadeEspecifica || ""}
                  onChange={(e) =>
                    onChange({ ...meal, vontadeEspecifica: e.target.value })
                  }
                  className="text-sm h-8"
                />
              )}
            </div>
          </TabsContent>

          {/* Aba DURANTE */}
          <TabsContent value="durante" className="space-y-3 mt-3">
            <MultiCheckbox
              label="Como comi:"
              options={comoComeuOptions}
              value={meal.comoComi}
              onChange={(value) => onChange({ ...meal, comoComi: value })}
            />

            <div className="space-y-2">
              <Label className="text-sm font-medium">Gostei da comida?</Label>
              <RadioGroup
                value={meal.gosteiDaComida}
                onValueChange={(value) =>
                  onChange({ ...meal, gosteiDaComida: value })
                }
              >
                {["Sim, muito", "Foi ok", "Não muito", "Não prestei atenção"].map(
                  (option) => (
                    <div key={option} className="flex items-center space-x-2">
                      <RadioGroupItem value={option} id={`gostei-${meal.id}-${option}`} />
                      <Label htmlFor={`gostei-${meal.id}-${option}`} className="text-sm">{option}</Label>
                    </div>
                  )
                )}
              </RadioGroup>
            </div>
          </TabsContent>

          {/* Aba DEPOIS */}
          <TabsContent value="depois" className="space-y-3 mt-3">
            <ScaleSelector
              label="Nível de saciedade:"
              options={saciedadeOptions}
              value={meal.saciedadeFinal?.toString()}
              onChange={(value) =>
                onChange({
                  ...meal,
                  saciedadeFinal: parseInt(value) as NivelSaciedade,
                })
              }
            />

            <MultiCheckbox
              label="Me sinto (Físico):"
              options={depoisFisicoOptions}
              value={meal.depoisFisico}
              onChange={(value) => onChange({ ...meal, depoisFisico: value })}
            />

            <MultiCheckbox
              label="Me sinto (Emocional):"
              options={depoisEmocionalOptions}
              value={meal.depoisEmocional}
              onChange={(value) => onChange({ ...meal, depoisEmocional: value })}
            />

            <div className="space-y-2">
              <Label className="text-sm">Observação (opcional):</Label>
              <Textarea
                placeholder="Observações sobre esta refeição..."
                value={meal.observacao || ""}
                onChange={(e) =>
                  onChange({ ...meal, observacao: e.target.value })
                }
                rows={2}
                className="text-sm"
              />
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
