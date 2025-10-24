"use client"

import { SectionCard } from "./section-card"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import type { Praticas } from "@/types/diary"

interface PracticesSectionProps {
  praticas: Praticas
  onChange: (praticas: Praticas) => void
}

export function PracticesSection({ praticas, onChange }: PracticesSectionProps) {
  return (
    <SectionCard title="Práticas do Dia" icon="🎯">
      <div className="space-y-6">
        {/* Parou no nível 5-6 */}
        <div className="space-y-3">
          <Label className="text-base font-semibold">
            Consegui parar no nível 5-6 em alguma refeição?
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
                <Label htmlFor={`parou-${option}`}>{option}</Label>
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
            />
          )}

          {praticas.parouNivel56 === "Não consegui" && (
            <Input
              placeholder="O que aconteceu?"
              value={praticas.parouNivel56Obs || ""}
              onChange={(e) =>
                onChange({ ...praticas, parouNivel56Obs: e.target.value })
              }
            />
          )}
        </div>

        {/* Serviu menos */}
        <div className="space-y-3">
          <Label className="text-base font-semibold">
            Me servi menos e avaliei se queria repetir?
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
                  <Label htmlFor={`serviu-${option}`}>{option}</Label>
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
            />
          )}
        </div>

        {/* Comeu sem compensar */}
        <div className="space-y-3">
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
            />
            <Label htmlFor="comeu-sem-compensar" className="text-base font-semibold">
              Comi algo que realmente queria sem compensar?
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
            />
            <Label htmlFor="nao-sentiu-vontade">
              Não senti vontade de nada específico
            </Label>
          </div>
        </div>
      </div>
    </SectionCard>
  )
}
