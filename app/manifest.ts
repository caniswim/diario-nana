import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Diário de Reconexão - Nana',
    short_name: 'Nana',
    description: 'Seu diário de alimentação consciente e reconexão',
    start_url: '/',
    display: 'standalone',
    background_color: '#F2EDE4', // Warm beige light background
    theme_color: '#F2EDE4', // Será sobrescrito dinamicamente pelo ThemeColorMeta
    icons: [
      {
        src: '/icon-192x192.svg',
        sizes: '192x192',
        type: 'image/svg+xml',
      },
      {
        src: '/icon-512x512.svg',
        sizes: '512x512',
        type: 'image/svg+xml',
      },
      {
        src: '/icon.svg',
        sizes: 'any',
        type: 'image/svg+xml',
        purpose: 'any',
      },
      {
        src: '/icon.svg',
        sizes: 'any',
        type: 'image/svg+xml',
        purpose: 'maskable',
      },
    ],
  }
}
