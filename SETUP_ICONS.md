# Gerar Ícones PWA

Para ter ícones apropriados para o PWA, você precisa gerar as imagens nos tamanhos corretos.

## Opção 1: Usar uma ferramenta online (Recomendado)

1. Acesse: https://realfavicongenerator.net/
2. Faça upload de uma imagem 512x512 (pode ser um logo ou emoji)
3. Configure as opções:
   - **iOS**: Habilite "Add a solid, plain background"
   - **Android**: Escolha "Use a distinct picture for Android Chrome"
   - **Windows**: Configure como preferir
4. Clique em "Generate your Favicons and HTML code"
5. Baixe o pacote gerado
6. Extraia os arquivos para a pasta `public/` do projeto

## Opção 2: Usar uma ferramenta CLI

```bash
npm install -g pwa-asset-generator

# Gerar a partir de uma imagem
pwa-asset-generator public/icon.svg public/ --icon-only
```

## Arquivos necessários

Certifique-se de ter estes arquivos em `public/`:

- `favicon.ico` (16x16, 32x32, 48x48)
- `icon-192x192.png` (192x192)
- `icon-512x512.png` (512x512)
- `apple-touch-icon.png` (180x180)

## Ícone atual

Atualmente, o projeto usa um placeholder SVG em `public/icon.svg` com um emoji de livro.
Para produção, substitua por ícones PNG apropriados.

## Teste o PWA

Após gerar os ícones:

1. Faça build do projeto: `npm run build`
2. Execute: `npm start`
3. Abra no navegador em modo incógnito
4. Teste a instalação do PWA no dispositivo móvel
