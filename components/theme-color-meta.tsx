"use client"

import { useEffect } from "react"
import { useTheme } from "next-themes"
import { useAppTheme } from "@/hooks/use-app-theme"
import { getThemeById } from "@/lib/themes"

/**
 * Componente que atualiza dinamicamente a meta tag theme-color
 * para refletir a cor primary do tema ativo.
 * Isso afeta a cor da barra de status no Safari/iOS.
 */
export function ThemeColorMeta() {
  const { resolvedTheme } = useTheme()
  const { currentThemeId, mounted } = useAppTheme()

  useEffect(() => {
    if (!mounted || !resolvedTheme) return

    const theme = getThemeById(currentThemeId)
    if (!theme) return

    // Pega a cor primary do tema atual (light ou dark)
    const colors = resolvedTheme === "dark" ? theme.dark : theme.light
    const primaryColor = colors.primary

    // Converte HSL para formato que o Safari aceita
    // Formato: hsl(hue sat% light%) -> precisa converter para hex ou rgb
    const hslToRgb = (h: number, s: number, l: number) => {
      s /= 100
      l /= 100

      const k = (n: number) => (n + h / 30) % 12
      const a = s * Math.min(l, 1 - l)
      const f = (n: number) =>
        l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)))

      return [
        Math.round(255 * f(0)),
        Math.round(255 * f(8)),
        Math.round(255 * f(4)),
      ]
    }

    // Parse o formato "210 80% 60%" para valores numéricos
    const parseHSL = (hsl: string) => {
      const parts = hsl.trim().split(/\s+/)
      const h = parseFloat(parts[0])
      const s = parseFloat(parts[1])
      const l = parseFloat(parts[2])
      return { h, s, l }
    }

    try {
      const { h, s, l } = parseHSL(primaryColor)
      const [r, g, b] = hslToRgb(h, s, l)
      const hexColor = `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`

      // Atualiza ou cria a meta tag theme-color
      let metaThemeColor = document.querySelector('meta[name="theme-color"]')

      if (!metaThemeColor) {
        metaThemeColor = document.createElement("meta")
        metaThemeColor.setAttribute("name", "theme-color")
        document.head.appendChild(metaThemeColor)
      }

      metaThemeColor.setAttribute("content", hexColor)

      console.log(`[ThemeColorMeta] Cor do notch/status bar atualizada: ${hexColor}`)
    } catch (error) {
      console.error("[ThemeColorMeta] Erro ao converter cor:", error)
    }
  }, [mounted, resolvedTheme, currentThemeId])

  return null // Este componente não renderiza nada
}
