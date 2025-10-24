"use client"

import { useEffect, useState } from "react"
import { useTheme } from "next-themes"
import { getThemeById, applyTheme } from "@/lib/themes"

const THEME_STORAGE_KEY = "app-theme"
const DEFAULT_THEME_ID = "warm-beige"

export function useAppTheme() {
  const { resolvedTheme } = useTheme()
  const [currentThemeId, setCurrentThemeId] = useState(DEFAULT_THEME_ID)
  const [mounted, setMounted] = useState(false)

  // Carrega o tema salvo
  useEffect(() => {
    setMounted(true)
    const savedTheme = localStorage.getItem(THEME_STORAGE_KEY)
    console.log(`[useAppTheme] Tema salvo no localStorage: ${savedTheme}`)
    if (savedTheme) {
      setCurrentThemeId(savedTheme)
    }
  }, [])

  // Aplica o tema quando muda o themeId ou o modo (light/dark)
  useEffect(() => {
    if (!mounted || !resolvedTheme) {
      console.log(`[useAppTheme] Aguardando mount (${mounted}) ou resolvedTheme (${resolvedTheme})`)
      return
    }

    console.log(`[useAppTheme] Carregando tema: ${currentThemeId}, modo: ${resolvedTheme}`)
    const themeData = getThemeById(currentThemeId)

    if (themeData) {
      console.log(`[useAppTheme] Tema encontrado:`, themeData)
      applyTheme(themeData, resolvedTheme as "light" | "dark")
    } else {
      console.error(`[useAppTheme] Tema não encontrado: ${currentThemeId}`)
    }
  }, [mounted, resolvedTheme, currentThemeId])

  const changeTheme = (themeId: string) => {
    console.log(`[useAppTheme] Mudando tema para: ${themeId}`)
    setCurrentThemeId(themeId)
    localStorage.setItem(THEME_STORAGE_KEY, themeId)
  }

  return {
    currentThemeId,
    changeTheme,
    mounted,
  }
}
