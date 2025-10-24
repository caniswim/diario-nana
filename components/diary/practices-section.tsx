"use client"

import { SectionCard } from "./section-card"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Target } from "lucide-react"
import type { Praticas } from "@/types/diary"

interface PracticesSectionProps {
  praticas: Praticas
  onChange: (praticas: Praticas) => void
}

export function PracticesSection({ praticas, onChange }: PracticesSectionProps) {
  return (
    <SectionCard title="Práticas do Dia" icon={Target}>
      <div className="space-y-3">
        {/* Parou no nível 5-6 */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">
            Parar no nível 5-6?
          </Label>
          <RadioGroup
            value={praticas.parouNivel56}
            onValueChange={(value) =>
              onChange({ ...praticas, parouNivel56: value })
            }
          >
            {[
              "Sim, em todas",
              "Sim, em 2 refeições",
              "Sim, em 1 refeição",
              "Não consegui",
            ].map((option) => (
              <div key={option} className="flex items-center space-x-2">
                <RadioGroupItem value={option} id={`parou-${option}`} />
                <Label htmlFor={`parou-${option}`} className="text-sm">{option}</Label>
              </div>
            ))}
          </RadioGroup>

          {praticas.parouNivel56 === "Sim, em 1 refeição" && (
            <Input
              placeholder="Qual refeição?"
              value={praticas.parouNivel56Qual || ""}
              onChange={(e) =>
                onChange({ ...praticas, parouNivel56Qual: e.target.value })
              }
              className="text-sm h-8"
            />
          )}

          {praticas.parouNivel56 === "Não consegui" && (
            <Input
              placeholder="O que aconteceu?"
              value={praticas.parouNivel56Obs || ""}
              onChange={(e) =>
                onChange({ ...praticas, parouNivel56Obs: e.target.value })
              }
              className="text-sm h-8"
            />
          )}
        </div>

        {/* Serviu menos */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">
            Me servi menos?
          </Label>
          <RadioGroup
            value={praticas.serviuMenos}
            onValueChange={(value) =>
              onChange({ ...praticas, serviuMenos: value })
            }
          >
            {["Sim, funcionou bem", "Sim, mas foi difícil", "Não"].map(
              (option) => (
                <div key={option} className="flex items-center space-x-2">
                  <RadioGroupItem value={option} id={`serviu-${option}`} />
                  <Label htmlFor={`serviu-${option}`} className="text-sm">{option}</Label>
                </div>
              )
            )}
          </RadioGroup>

          {praticas.serviuMenos === "Não" && (
            <Input
              placeholder="Por quê?"
              value={praticas.serviuMenosObs || ""}
              onChange={(e) =>
                onChange({ ...praticas, serviuMenosObs: e.target.value })
              }
              className="text-sm h-8"
            />
          )}
        </div>

        {/* Comeu sem compensar */}
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="comeu-sem-compensar"
              checked={praticas.comeuSemCompensar}
              onCheckedChange={(checked) =>
                onChange({
                  ...praticas,
                  comeuSemCompensar: checked as boolean,
                })
              }
              className="h-4 w-4"
            />
            <Label htmlFor="comeu-sem-compensar" className="text-sm font-medium">
              Comi algo que queria sem compensar?
            </Label>
          </div>

          {praticas.comeuSemCompensar ? (
            <>
              <Input
                placeholder="O que comeu?"
                value={praticas.comeuSemCompensarOque || ""}
                onChange={(e) =>
                  onChange({
                    ...praticas,
                    comeuSemCompensarOque: e.target.value,
                  })
                }
                className="text-sm h-8"
              />
              <Input
                placeholder="Como se sentiu?"
                value={praticas.comeuSemCompensarSentimento || ""}
                onChange={(e) =>
                  onChange({
                    ...praticas,
                    comeuSemCompensarSentimento: e.target.value,
                  })
                }
                className="text-sm h-8"
              />
            </>
          ) : (
            <Input
              placeholder="O que impediu?"
              value={praticas.comeuSemCompensarImpediu || ""}
              onChange={(e) =>
                onChange({
                  ...praticas,
                  comeuSemCompensarImpediu: e.target.value,
                })
              }
              className="text-sm h-8"
            />
          )}

          <div className="flex items-center space-x-2">
            <Checkbox
              id="nao-sentiu-vontade"
              checked={praticas.comeuSemCompensarNaoSentiu}
              onCheckedChange={(checked) =>
                onChange({
                  ...praticas,
                  comeuSemCompensarNaoSentiu: checked as boolean,
                })
              }
              className="h-4 w-4"
            />
            <Label htmlFor="nao-sentiu-vontade" className="text-sm">
              Não senti vontade de nada específico
            </Label>
          </div>
        </div>
      </div>
    </SectionCard>
  )
}
