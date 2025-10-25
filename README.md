# 📔 Diário de Reconexão

Um aplicativo PWA (Progressive Web App) para diário de alimentação consciente, focado em ajudar no processo de reconexão com sinais de fome e saciedade.

## ✨ Características

- 📱 **Mobile-First**: Interface otimizada para uso em smartphones
- 💾 **Offline-First**: Funciona sem internet, sincroniza automaticamente quando online
- 🔄 **Auto-save**: Salvamento automático a cada alteração (debounced)
- 🍽️ **Refeições Dinâmicas**: Adicione quantas refeições quiser por dia
- 📊 **Histórico Visual**: Calendário com visualização de dias preenchidos
- 📤 **Exportação**: Baixe seus dados em JSON ou Markdown
- 🎯 **Sem Autenticação**: Uso pessoal direto, sem fricção de login

## 🚀 Stack Tecnológica

- **Framework**: Next.js 15 (App Router) + TypeScript
- **UI**: Tailwind CSS + Shadcn/ui
- **Backend**: Supabase (PostgreSQL)
- **Storage Local**: IndexedDB (via idb)
- **PWA**: Service Worker + Web App Manifest
- **Deploy**: Vercel (gratuito)

## 📋 Pré-requisitos

- Node.js 18+ instalado
- Conta no Supabase (gratuita)
- Conta no Vercel (gratuita, opcional para deploy)

## 🛠️ Instalação

### 1. Clone o repositório

```bash
git clone <repo-url>
cd diario-nana
```

### 2. Instale as dependências

```bash
npm install
```

### 3. Configure o Supabase

#### 3.1. Crie um projeto no Supabase

1. Acesse [supabase.com](https://supabase.com)
2. Crie uma conta (se não tiver)
3. Clique em "New Project"
4. Escolha:
   - **Organization**: Sua organização
   - **Name**: diario-nana (ou o nome que preferir)
   - **Database Password**: Escolha uma senha forte
   - **Region**: Escolha a região mais próxima
   - **Pricing Plan**: Free

#### 3.2. Execute o SQL Schema

1. No painel do Supabase, vá em **SQL Editor**
2. Clique em **New Query**
3. Cole o SQL que está em `lib/supabase.ts` (constante `DATABASE_SCHEMA`)
4. Clique em **Run** para executar

#### 3.3. Obtenha as credenciais

1. No painel do Supabase, vá em **Settings** → **API**
2. Copie:
   - **Project URL** (algo como `https://xxxxx.supabase.co`)
   - **anon public key** (começa com `eyJ...`)

### 4. Configure as variáveis de ambiente

1. Crie um arquivo `.env.local` na raiz do projeto:

```bash
cp .env.local.example .env.local
```

2. Edite o `.env.local` e cole suas credenciais:

```env
NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua-chave-anon-aqui
```

### 5. Execute o projeto

```bash
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000) no navegador.

## 📱 Como Usar

### Primeira Vez

1. Abra o app no navegador
2. Você verá a entrada do dia atual automaticamente
3. Comece preenchendo o **Check-in do Dia**
4. Clique em **"+ Adicionar Refeição"** para registrar suas refeições
5. Tudo é salvo automaticamente conforme você digita

### Refeições Dinâmicas

- Clique em **"+ Adicionar Refeição"** quantas vezes precisar
- O nome da refeição é sugerido automaticamente baseado no horário
- Você pode editar o nome e horário livremente
- Para remover uma refeição, clique no ícone de lixeira

### Funcionamento Offline

- O app funciona 100% offline
- Todos os dados são salvos localmente no seu dispositivo
- Quando você ficar online novamente, os dados são sincronizados automaticamente
- Um ícone de WiFi no canto superior direito mostra o status da conexão

### Histórico

1. Clique em **"Histórico"** no menu inferior
2. Navegue pelos meses usando as setas
3. Dias com entradas aparecem em **verde**
4. Dias com 3+ sinais de alerta aparecem em **vermelho**
5. Clique em qualquer dia para ver/editar a entrada

### Exportação

1. Clique em **"Exportar"** no menu inferior
2. Escolha o formato:
   - **JSON**: Para análise por IA ou ferramentas
   - **Markdown**: Para leitura humana
3. O arquivo é baixado automaticamente no seu dispositivo

## 🚀 Deploy na Vercel

### 1. Prepare o repositório

```bash
git add .
git commit -m "Initial commit: Diário de Reconexão"
git branch -M main
git push
```

### 2. Deploy na Vercel

1. Acesse [vercel.com](https://vercel.com)
2. Faça login com GitHub
3. Clique em **"Add New"** → **"Project"**
4. Selecione seu repositório
5. Configure as variáveis de ambiente:
   - Clique em **"Environment Variables"**
   - Adicione `NEXT_PUBLIC_SUPABASE_URL` e `NEXT_PUBLIC_SUPABASE_ANON_KEY`
6. Clique em **"Deploy"**

O deploy leva ~2 minutos. Você receberá uma URL como `https://seu-app.vercel.app`.

### 3. Instale como PWA

#### No Android (Chrome):
1. Abra a URL do app
2. Toque no menu (três pontos) → **"Instalar app"**
3. O app será adicionado à sua tela inicial

#### No iOS (Safari):
1. Abra a URL do app
2. Toque no ícone de compartilhar
3. Role e toque em **"Adicionar à Tela Inicial"**

## 🎯 Estrutura do Projeto

```
diario-nana/
├── app/                    # Rotas Next.js (App Router)
│   ├── page.tsx           # Página principal (entrada do dia)
│   ├── historico/         # Página de histórico
│   ├── exportar/          # Página de exportação
│   └── layout.tsx         # Layout raiz
├── components/
│   ├── ui/                # Componentes Shadcn/ui
│   └── diary/             # Componentes específicos do diário
├── lib/
│   ├── db.ts              # Funções IndexedDB
│   ├── supabase.ts        # Cliente Supabase
│   ├── sync.ts            # Lógica de sincronização
│   └── utils.ts           # Utilidades
├── types/
│   └── diary.ts           # Tipos TypeScript
└── hooks/
    └── use-diary-entry.ts # Hook para gerenciar entradas
```

## 🔧 Funcionalidades Técnicas

### Auto-save com Debounce
- Salvamento automático 1 segundo após última alteração
- Previne múltiplas escritas desnecessárias
- Feedback visual ao usuário

### Sincronização Offline-First
- Todas as operações salvam primeiro localmente (IndexedDB)
- Sincronização automática em background a cada 30 segundos
- Resolução de conflitos: prioridade para dados locais mais recentes
- Indicador visual de status (online/offline/salvando)

## 📝 Template do Diário

O diário segue um template estruturado baseado nos princípios de alimentação consciente:

- **Check-in do Dia**: Estado emocional, físico, sono, estresse
- **Refeições** (dinâmico): Fome, saciedade, sentimentos, observações
- **Práticas**: Parar no ponto ideal, servir menos, comer sem compensar
- **Reflexão**: Pensamentos sobre comida, aprendizados
- **Sinais de Alerta**: Identificação de comportamentos preocupantes

## 🐛 Troubleshooting

### Os dados não estão sincronizando com o Supabase

Se você vê a mensagem "Salvo automaticamente" mas os dados não aparecem no Supabase:

1. **Verifique se o arquivo `.env.local` existe e está configurado**:
   ```bash
   cat .env.local
   ```

2. **Verifique no console do navegador** (F12 → Console):
   - ⚠️ Se ver "Supabase não configurado", as variáveis de ambiente não foram carregadas
   - Certifique-se de que o arquivo `.env.local` está na raiz do projeto
   - Reinicie o servidor de desenvolvimento (`npm run dev`)

3. **Teste a conexão com o Supabase**:
   - Abra o console do navegador (F12)
   - Verifique se há erros relacionados ao Supabase
   - Confirme que as credenciais estão corretas no `.env.local`

4. **Modo offline funciona sempre**:
   - Mesmo sem Supabase configurado, todos os dados são salvos localmente no IndexedDB
   - Você pode configurar o Supabase depois sem perder dados

---

**Nota**: Este app foi desenvolvido com foco em uso pessoal único. Para uso multi-usuário, seria necessário implementar autenticação e RLS policies apropriadas no Supabase
