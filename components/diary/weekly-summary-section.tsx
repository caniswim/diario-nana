'use client'

import { ResumoSemanal } from '@/types/diary'
import { SectionCard } from './section-card'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'

interface WeeklySummarySectionProps {
  resumo: ResumoSemanal
  onChange: (resumo: ResumoSemanal) => void
}

export function WeeklySummarySection({ resumo, onChange }: WeeklySummarySectionProps) {
  return (
    <SectionCard
      title="📊 Resumo Semanal"
      description="Reflexão sobre a semana (preencha aos domingos)"
      icon="📝"
    >
      <div className="space-y-6">
        {/* Padrões da Semana */}
        <div className="space-y-2">
          <Label htmlFor="padroes" className="text-sm font-medium">
            Padrões que observei nesta semana
          </Label>
          <Textarea
            id="padroes"
            value={resumo.padroes_observados || ''}
            onChange={(e) =>
              onChange({ ...resumo, padroes_observados: e.target.value })
            }
            placeholder="Ex: Percebi que como mais quando estou estressada, ou que às segundas-feiras tenho mais fome..."
            rows={4}
            className="resize-none"
          />
        </div>

        {/* O que funcionou */}
        <div className="space-y-2">
          <Label htmlFor="funcionou" className="text-sm font-medium">
            O que funcionou bem
          </Label>
          <Textarea
            id="funcionou"
            value={resumo.o_que_funcionou || ''}
            onChange={(e) =>
              onChange({ ...resumo, o_que_funcionou: e.target.value })
            }
            placeholder="Ex: Consegui pausar antes das refeições, me senti mais conectada com a fome..."
            rows={3}
            className="resize-none"
          />
        </div>

        {/* Desafios */}
        <div className="space-y-2">
          <Label htmlFor="desafios" className="text-sm font-medium">
            Desafios enfrentados
          </Label>
          <Textarea
            id="desafios"
            value={resumo.desafios || ''}
            onChange={(e) =>
              onChange({ ...resumo, desafios: e.target.value })
            }
            placeholder="Ex: Difícil identificar saciedade, comi muito rápido algumas vezes..."
            rows={3}
            className="resize-none"
          />
        </div>

        {/* Foco para próxima semana */}
        <div className="space-y-2">
          <Label htmlFor="foco" className="text-sm font-medium">
            Foco para a próxima semana
          </Label>
          <Textarea
            id="foco"
            value={resumo.foco_proxima_semana || ''}
            onChange={(e) =>
              onChange({ ...resumo, foco_proxima_semana: e.target.value })
            }
            placeholder="Ex: Vou tentar comer mais devagar, prestar atenção nos sinais de fome..."
            rows={3}
            className="resize-none"
          />
        </div>

        {/* Nível de sofrimento semanal */}
        <div className="space-y-3">
          <Label className="text-sm font-medium">
            Como foi meu nível de sofrimento com alimentação esta semana?
          </Label>
          <RadioGroup
            value={resumo.nivel_sofrimento?.toString() || ''}
            onValueChange={(value) =>
              onChange({ ...resumo, nivel_sofrimento: parseInt(value) })
            }
          >
            <div className="grid grid-cols-1 gap-3">
              <div className="flex items-center space-x-2 p-3 rounded-lg border hover:bg-accent">
                <RadioGroupItem value="1" id="sof-1" />
                <Label htmlFor="sof-1" className="flex-1 cursor-pointer font-normal">
                  <span className="font-medium">1 - Muito tranquila</span>
                  <p className="text-xs text-muted-foreground">
                    Me senti em paz com a alimentação
                  </p>
                </Label>
              </div>

              <div className="flex items-center space-x-2 p-3 rounded-lg border hover:bg-accent">
                <RadioGroupItem value="2" id="sof-2" />
                <Label htmlFor="sof-2" className="flex-1 cursor-pointer font-normal">
                  <span className="font-medium">2 - Tranquila</span>
                  <p className="text-xs text-muted-foreground">
                    Poucos momentos de preocupação
                  </p>
                </Label>
              </div>

              <div className="flex items-center space-x-2 p-3 rounded-lg border hover:bg-accent">
                <RadioGroupItem value="3" id="sof-3" />
                <Label htmlFor="sof-3" className="flex-1 cursor-pointer font-normal">
                  <span className="font-medium">3 - Neutra</span>
                  <p className="text-xs text-muted-foreground">
                    Alguns altos e baixos
                  </p>
                </Label>
              </div>

              <div className="flex items-center space-x-2 p-3 rounded-lg border hover:bg-accent">
                <RadioGroupItem value="4" id="sof-4" />
                <Label htmlFor="sof-4" className="flex-1 cursor-pointer font-normal">
                  <span className="font-medium">4 - Desafiadora</span>
                  <p className="text-xs text-muted-foreground">
                    Vários momentos difíceis
                  </p>
                </Label>
              </div>

              <div className="flex items-center space-x-2 p-3 rounded-lg border hover:bg-accent border-destructive/50">
                <RadioGroupItem value="5" id="sof-5" />
                <Label htmlFor="sof-5" className="flex-1 cursor-pointer font-normal">
                  <span className="font-medium text-destructive">5 - Muito difícil</span>
                  <p className="text-xs text-muted-foreground">
                    Muita angústia e preocupação
                  </p>
                </Label>
              </div>
            </div>
          </RadioGroup>
        </div>

        {/* Nota adicional */}
        <div className="p-4 bg-muted/50 rounded-lg">
          <p className="text-sm text-muted-foreground">
            💡 <strong>Dica:</strong> Este resumo semanal ajuda a identificar padrões ao longo
            do tempo. Não há respostas certas ou erradas - apenas sua experiência genuína.
          </p>
        </div>
      </div>
    </SectionCard>
  )
}
