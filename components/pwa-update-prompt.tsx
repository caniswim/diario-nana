"use client"

import { useEffect, useState } from "react"
import { toast } from "sonner"

export function PWAUpdatePrompt() {
  const [registration, setRegistration] = useState<ServiceWorkerRegistration | null>(null)

  useEffect(() => {
    if (
      typeof window !== "undefined" &&
      "serviceWorker" in navigator &&
      process.env.NODE_ENV === "production"
    ) {
      // Detectar atualização do Service Worker
      navigator.serviceWorker.ready.then((reg) => {
        setRegistration(reg)

        // Verificar atualizações a cada 60 segundos
        setInterval(() => {
          reg.update()
        }, 60000)

        // Listener para quando encontrar nova versão
        reg.addEventListener("updatefound", () => {
          const newWorker = reg.installing

          if (newWorker) {
            newWorker.addEventListener("statechange", () => {
              if (
                newWorker.state === "installed" &&
                navigator.serviceWorker.controller
              ) {
                // Nova versão disponível!
                showUpdateToast()
              }
            })
          }
        })
      })

      // Listener para quando o SW tomar controle (após atualização)
      let refreshing = false
      navigator.serviceWorker.addEventListener("controllerchange", () => {
        if (refreshing) return
        refreshing = true
        window.location.reload()
      })
    }
  }, [])

  const showUpdateToast = () => {
    toast.success("🎉 Nova versão disponível!", {
      description: "Clique para atualizar o aplicativo",
      duration: Infinity, // Não desaparece automaticamente
      action: {
        label: "Atualizar",
        onClick: () => {
          if (registration?.waiting) {
            // Diz ao SW para pular a espera e ativar imediatamente
            registration.waiting.postMessage({ type: "SKIP_WAITING" })
          }
        },
      },
    })
  }

  return null
}
