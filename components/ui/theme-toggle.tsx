"use client"

import * as React from "react"
import { Moon, Sun, Palette, Check } from "lucide-react"
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
import { getAvailableThemes } from "@/lib/themes"
import { useAppTheme } from "@/hooks/use-app-theme"

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const { currentThemeId, changeTheme, mounted } = useAppTheme()
  const themes = getAvailableThemes()

  if (!mounted) {
    return (
      <div className="flex items-center gap-1">
        <Button variant="ghost" size="icon" className="h-9 w-9">
          <Sun className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" className="h-9 w-9">
          <Palette className="h-4 w-4" />
        </Button>
      </div>
    )
  }

  return (
    <div className="flex items-center gap-1">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        className="h-9 w-9"
        title="Alternar modo claro/escuro"
      >
        <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
        <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
        <span className="sr-only">Alternar modo claro/escuro</span>
      </Button>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9"
            title="Selecionar tema de cores"
          >
            <Palette className="h-4 w-4" />
            <span className="sr-only">Selecionar tema</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-52">
          <DropdownMenuLabel>Paleta de Cores</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {themes.map((themeItem) => (
            <DropdownMenuItem
              key={themeItem.id}
              onClick={() => changeTheme(themeItem.id)}
              className="cursor-pointer"
            >
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-2">
                  <div
                    className="h-4 w-4 rounded-full border-2 border-border"
                    style={{
                      backgroundColor: `hsl(${themeItem.light.primary})`,
                    }}
                  />
                  <span>{themeItem.name}</span>
                </div>
                {currentThemeId === themeItem.id && (
                  <Check className="h-4 w-4" />
                )}
              </div>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
