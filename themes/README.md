# Temas da Aplicação

Este diretório contém os temas disponíveis para a aplicação. Cada tema é definido em um arquivo JSON separado.

## Como Adicionar um Novo Tema

1. Crie um novo arquivo JSON neste diretório com o nome do tema (ex: `meu-tema.json`)
2. Use a seguinte estrutura:

```json
{
  "name": "Nome do Tema",
  "id": "nome-do-tema",
  "light": {
    "background": "210 40% 96%",
    "foreground": "210 20% 10%",
    "card": "210 40% 98%",
    "card-foreground": "210 20% 10%",
    "popover": "210 40% 98%",
    "popover-foreground": "210 20% 10%",
    "primary": "210 80% 60%",
    "primary-foreground": "0 0% 100%",
    "secondary": "210 40% 85%",
    "secondary-foreground": "210 20% 20%",
    "muted": "210 30% 90%",
    "muted-foreground": "210 15% 40%",
    "accent": "195 70% 70%",
    "accent-foreground": "210 20% 10%",
    "destructive": "0 70% 50%",
    "destructive-foreground": "0 0% 100%",
    "border": "210 30% 85%",
    "input": "210 30% 85%",
    "ring": "210 80% 60%"
  },
  "dark": {
    "background": "210 30% 8%",
    "foreground": "210 30% 95%",
    "card": "210 25% 12%",
    "card-foreground": "210 30% 95%",
    "popover": "210 25% 12%",
    "popover-foreground": "210 30% 95%",
    "primary": "210 70% 55%",
    "primary-foreground": "210 30% 8%",
    "secondary": "210 20% 18%",
    "secondary-foreground": "210 30% 95%",
    "muted": "210 20% 15%",
    "muted-foreground": "210 20% 70%",
    "accent": "195 60% 35%",
    "accent-foreground": "210 30% 95%",
    "destructive": "0 70% 50%",
    "destructive-foreground": "0 0% 100%",
    "border": "210 20% 18%",
    "input": "210 20% 18%",
    "ring": "210 70% 55%"
  }
}
```

3. Importe o tema em `/lib/themes.ts`:

```typescript
import meuTema from "@/themes/meu-tema.json"

const allThemes: Theme[] = [warmBeige, oceanBlue, forestGreen, meuTema] as Theme[]
```

4. O tema aparecerá automaticamente no seletor de temas da aplicação!

## Formato das Cores

As cores usam o formato HSL do Tailwind CSS: `hue saturation% lightness%`

- **Hue (Matiz)**: 0-360 (0 = vermelho, 120 = verde, 240 = azul)
- **Saturation (Saturação)**: 0-100% (0% = cinza, 100% = cor vibrante)
- **Lightness (Luminosidade)**: 0-100% (0% = preto, 50% = cor normal, 100% = branco)

## Temas Disponíveis

### Warm Beige (Padrão)
Tom bege acolhedor com tons terrosos

### Ocean Blue
Tons de azul inspirados no oceano

### Forest Green
Tons de verde inspirados na floresta
