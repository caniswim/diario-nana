"use client"

import * as React from "react"
import { Moon, Sun, Palette } from "lucide-react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { getAvailableThemes, applyTheme, getThemeById } from "@/lib/themes"

export function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)
  const [currentThemeId, setCurrentThemeId] = React.useState("warm-beige")

  const themes = getAvailableThemes()

  React.useEffect(() => {
    setMounted(true)
    const savedTheme = localStorage.getItem("app-theme")
    if (savedTheme) {
      setCurrentThemeId(savedTheme)
    }
  }, [])

  React.useEffect(() => {
    if (mounted && resolvedTheme) {
      const themeData = getThemeById(currentThemeId)
      if (themeData) {
        applyTheme(themeData, resolvedTheme as "light" | "dark")
      }
    }
  }, [mounted, resolvedTheme, currentThemeId])

  const handleThemeChange = (themeId: string) => {
    setCurrentThemeId(themeId)
    localStorage.setItem("app-theme", themeId)
    const themeData = getThemeById(themeId)
    if (themeData && resolvedTheme) {
      applyTheme(themeData, resolvedTheme as "light" | "dark")
    }
  }

  if (!mounted) {
    return (
      <Button variant="ghost" size="icon" className="h-9 w-9">
        <Palette className="h-4 w-4" />
      </Button>
    )
  }

  return (
    <div className="flex items-center gap-1">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        className="h-9 w-9"
      >
        <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
        <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
        <span className="sr-only">Alternar modo claro/escuro</span>
      </Button>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="h-9 w-9">
            <Palette className="h-4 w-4" />
            <span className="sr-only">Selecionar tema</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuLabel>Temas</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {themes.map((themeItem) => (
            <DropdownMenuItem
              key={themeItem.id}
              onClick={() => handleThemeChange(themeItem.id)}
              className={currentThemeId === themeItem.id ? "bg-accent" : ""}
            >
              <div className="flex items-center gap-2">
                <div
                  className="h-4 w-4 rounded-full border"
                  style={{
                    backgroundColor: `hsl(${themeItem.light.primary})`,
                  }}
                />
                <span>{themeItem.name}</span>
              </div>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
