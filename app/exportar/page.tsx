"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Download, FileJson, FileText } from "lucide-react"
import Link from "next/link"
import { getAllEntries } from "@/lib/db"
import type { DiaryEntry } from "@/types/diary"
import { toast } from "sonner"
import { Toaster } from "@/components/ui/sonner"

export default function ExportarPage() {
  const [exporting, setExporting] = useState(false)

  const exportJSON = async () => {
    setExporting(true)
    try {
      const entries = await getAllEntries()

      if (entries.length === 0) {
        toast.error("Nenhuma entrada para exportar")
        return
      }

      const data = JSON.stringify(entries, null, 2)
      const blob = new Blob([data], { type: 'application/json' })
      const url = URL.createObjectURL(blob)

      const a = document.createElement('a')
      a.href = url
      a.download = `diario-reconexao-${new Date().toISOString().split('T')[0]}.json`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)

      toast.success("Dados exportados com sucesso!")
    } catch (error) {
      console.error("Erro ao exportar:", error)
      toast.error("Erro ao exportar dados")
    } finally {
      setExporting(false)
    }
  }

  const exportMarkdown = async () => {
    setExporting(true)
    try {
      const entries = await getAllEntries()

      if (entries.length === 0) {
        toast.error("Nenhuma entrada para exportar")
        return
      }

      let markdown = "# Diário de Reconexão\n\n"
      markdown += `Exportado em: ${new Date().toLocaleDateString('pt-BR')}\n\n`
      markdown += `Total de entradas: ${entries.length}\n\n`
      markdown += "---\n\n"

      // Ordenar por data
      const sortedEntries = [...entries].sort((a, b) =>
        b.date.localeCompare(a.date)
      )

      for (const entry of sortedEntries) {
        markdown += `# ${entry.date}\n\n`

        // Check-in
        if (entry.checkIn.emocional || entry.checkIn.fisico) {
          markdown += `## 🌅 Check-in do Dia\n\n`
          if (entry.checkIn.emocional) {
            markdown += `**Emocional:** ${entry.checkIn.emocional}\n\n`
          }
          if (entry.checkIn.fisico) {
            markdown += `**Físico:** ${entry.checkIn.fisico}\n\n`
          }
          if (entry.checkIn.qualidadeSono) {
            markdown += `**Qualidade do sono:** ${entry.checkIn.qualidadeSono}/5\n\n`
          }
          if (entry.checkIn.nivelEstresse) {
            markdown += `**Nível de estresse:** ${entry.checkIn.nivelEstresse}/10\n\n`
          }
        }

        // Refeições
        if (entry.refeicoes.length > 0) {
          markdown += `## 🍽️ Refeições\n\n`
          entry.refeicoes.forEach((refeicao, index) => {
            markdown += `### ${refeicao.nome} (${refeicao.horario})\n\n`
            if (refeicao.fomeAntes) {
              markdown += `- Fome antes: ${refeicao.fomeAntes}/5\n`
            }
            if (refeicao.saciedadeFinal) {
              markdown += `- Saciedade final: ${refeicao.saciedadeFinal}/5\n`
            }
            if (refeicao.observacao) {
              markdown += `- Observação: ${refeicao.observacao}\n`
            }
            markdown += `\n`
          })
        }

        // Reflexão
        if (entry.reflexao.aprendizado || entry.reflexao.notaParaSi) {
          markdown += `## 💭 Reflexão\n\n`
          if (entry.reflexao.aprendizado) {
            markdown += `**Aprendizado:** ${entry.reflexao.aprendizado}\n\n`
          }
          if (entry.reflexao.notaParaSi) {
            markdown += `**Nota para mim:** ${entry.reflexao.notaParaSi}\n\n`
          }
        }

        // Sinais de alerta
        if (entry.sinaisAlerta.length > 0) {
          markdown += `## ⚠️ Sinais de Alerta\n\n`
          entry.sinaisAlerta.forEach(sinal => {
            markdown += `- ${sinal}\n`
          })
          markdown += `\n`
        }

        markdown += `---\n\n`
      }

      const blob = new Blob([markdown], { type: 'text/markdown' })
      const url = URL.createObjectURL(blob)

      const a = document.createElement('a')
      a.href = url
      a.download = `diario-reconexao-${new Date().toISOString().split('T')[0]}.md`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)

      toast.success("Dados exportados em Markdown!")
    } catch (error) {
      console.error("Erro ao exportar:", error)
      toast.error("Erro ao exportar dados")
    } finally {
      setExporting(false)
    }
  }

  return (
    <>
      <main className="container mx-auto px-4 py-6 max-w-3xl pb-24">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Link href="/">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <h1 className="text-2xl font-bold">Exportar Dados</h1>
        </div>

        <div className="space-y-4">
          {/* JSON Export */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileJson className="h-5 w-5" />
                Exportar como JSON
              </CardTitle>
              <CardDescription>
                Formato estruturado, ideal para análise por IA ou importação em outras ferramentas
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                onClick={exportJSON}
                disabled={exporting}
                className="w-full gap-2"
              >
                <Download className="h-4 w-4" />
                Baixar JSON
              </Button>
            </CardContent>
          </Card>

          {/* Markdown Export */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Exportar como Markdown
              </CardTitle>
              <CardDescription>
                Formato legível e organizado, fácil de ler e compartilhar
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                onClick={exportMarkdown}
                disabled={exporting}
                variant="outline"
                className="w-full gap-2"
              >
                <Download className="h-4 w-4" />
                Baixar Markdown
              </Button>
            </CardContent>
          </Card>

          {/* Info */}
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="p-4">
              <p className="text-sm text-blue-900">
                💡 <strong>Dica:</strong> Use o formato JSON para alimentar IAs (como ChatGPT ou Claude)
                para análise de padrões e insights sobre seu progresso.
              </p>
            </CardContent>
          </Card>
        </div>
      </main>
      <Toaster />
    </>
  )
}
