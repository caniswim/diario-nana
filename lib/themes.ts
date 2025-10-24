import warmBeige from "@/themes/warm-beige.json"
import oceanBlue from "@/themes/ocean-blue.json"
import forestGreen from "@/themes/forest-green.json"

export interface ThemeColors {
  background: string
  foreground: string
  card: string
  "card-foreground": string
  popover: string
  "popover-foreground": string
  primary: string
  "primary-foreground": string
  secondary: string
  "secondary-foreground": string
  muted: string
  "muted-foreground": string
  accent: string
  "accent-foreground": string
  destructive: string
  "destructive-foreground": string
  border: string
  input: string
  ring: string
}

export interface Theme {
  name: string
  id: string
  light: ThemeColors
  dark: ThemeColors
}

// Carrega todos os temas automaticamente
const allThemes: Theme[] = [warmBeige, oceanBlue, forestGreen] as Theme[]

export function getAvailableThemes(): Theme[] {
  return allThemes
}

export function getThemeById(id: string): Theme | undefined {
  return allThemes.find((theme) => theme.id === id)
}

export function applyTheme(theme: Theme, mode: "light" | "dark") {
  const colors = mode === "dark" ? theme.dark : theme.light
  const root = document.documentElement

  Object.entries(colors).forEach(([key, value]) => {
    root.style.setProperty(`--${key}`, value)
  })
}
