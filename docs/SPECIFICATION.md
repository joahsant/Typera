# TYPERA — Prompt de Criação Completo
### Para uso em IDEs de vibe coding: Codex, Cursor, Lovable, V0

---

## 🎯 Visão do Produto

Construa o **Typera**, um estúdio de tipografia criativa baseado em browser. O Typera permite que qualquer pessoa — designer, desenvolvedor, criador de conteúdo ou dono de marca — crie uma fonte tipográfica personalizada e tecnicamente correta, sem precisar saber nada de engenharia de fontes.

**Slogan:** *"To type, for type, you type."*

O diferencial do Typera não é liberdade total de desenho — é **liberdade dentro da excelência tipográfica**. O app guia o usuário através de decisões tipográficas fundamentadas em padrões internacionais (especificação OpenType), impedindo escolhas tecnicamente inválidas enquanto maximiza a expressividade criativa.

As fontes criadas no Typera são projetadas para uso em qualquer mídia: web, branding, Instagram, comerciais, impressos, UI de produtos digitais — sem limitações de contexto.

---

## 🏗️ Arquitetura do Produto — Três Modos

O app possui **três modos** acessíveis via abas no header. Ao trocar de modo, a página inteira muda com uma animação de **fade suave (300ms ease-in-out)**. O header permanece fixo durante a transição. O estado da fonte é preservado entre todos os modos.

### Modo 1: Studio *(MVP — implementar agora)*
O criador. Interface de configuração tipográfica visual em tempo real. O usuário ajusta parâmetros e a fonte inteira se transforma instantaneamente. Não há edição manual de bezier — a criação acontece em escala via parâmetros globais.

### Modo 2: Forge *(V2 — documentar, não implementar)*
O ateliê. Editor fino de glifos individuais com controle de bezier, similar ao Figma/Glyphs. Permitirá edição glifo a glifo com suporte a fontes importadas do Google Fonts (OFL — modificações permitidas com novo nome de família).

### Modo 3: Academy *(V2 — documentar, não implementar)*
O conhecimento. Conteúdo educacional sobre tipografia: teoria, história, anatomia de fontes, melhores práticas para cada mídia, tutoriais interativos.

> **Nota para V2 — Forge:** A licença OFL (Open Font License) utilizada pela maioria das fontes do Google Fonts permite modificação e redistribuição, desde que a fonte derivada não utilize o nome original. Implementar aviso legal no UI ao importar uma fonte Google para edição no Forge.

---

## 🛠️ Stack Técnica

| Camada | Tecnologia | Justificativa |
|---|---|---|
| Framework | React 18 + TypeScript + Vite 5 | Base moderna, tipagem forte, build rápido |
| Estilo | Tailwind CSS v3 + CSS Variables | Utilitário + tokens de design consistentes |
| Componentes | Radix UI Primitives | Acessível, sem opinião visual, headless |
| Canvas / Editor | Fabric.js v5 | Controle fino de canvas com suporte a touch |
| Engine de Fontes | opentype.js v1.3+ | Parse, manipulação e geração de fontes no browser |
| Estado Global | Zustand v4 | Simples, performático, sem boilerplate |
| Persistência MVP | localStorage via wrapper customizado | Zero dependência externa no MVP |
| Persistência V2 | Supabase (PostgreSQL + Auth + Storage) | Entra junto com sistema de autenticação |
| Export | JSZip v3 + wawoff2 (WASM) | Empacotamento multi-formato no browser |
| i18n | i18next + react-i18next | PT-BR e EN-US desde o início |
| Qualidade | Biome (lint + format) | Substitui ESLint + Prettier, mais rápido |
| Monitoramento | Sentry (free tier) | Captura de erros em produção com contexto |
| Deploy | Vercel | Deploy manual via CLI ou painel |
| Testes | Estrutura preparada para agentes de teste | Vitest configurado, suítes implementadas por agentes dedicados |

---

## 📦 Dependências Principais

```json
{
  "dependencies": {
    "react": "^18.3.0",
    "react-dom": "^18.3.0",
    "react-router-dom": "^6.23.0",
    "typescript": "^5.4.0",
    "vite": "^5.2.0",
    "zustand": "^4.5.0",
    "opentype.js": "^1.3.4",
    "fabric": "^5.3.0",
    "jszip": "^3.10.1",
    "wawoff2": "^2.0.1",
    "i18next": "^23.11.0",
    "react-i18next": "^14.1.0",
    "@radix-ui/react-dialog": "latest",
    "@radix-ui/react-slider": "latest",
    "@radix-ui/react-tabs": "latest",
    "@radix-ui/react-tooltip": "latest",
    "@radix-ui/react-checkbox": "latest",
    "@radix-ui/react-popover": "latest",
    "@radix-ui/react-label": "latest",
    "tailwindcss": "^3.4.0",
    "clsx": "^2.1.0",
    "uuid": "^9.0.0",
    "@sentry/react": "^7.114.0"
  },
  "devDependencies": {
    "@biomejs/biome": "^1.7.0",
    "vitest": "^1.6.0",
    "@testing-library/react": "^15.0.0"
  }
}
```

---

## 🗂️ Estrutura de Arquivos

```
typera/
├── public/
│   ├── favicon.svg
│   └── fonts/
│       └── TyperaBase-Neutral.ttf       ← Fonte proprietária base do app
├── src/
│   ├── components/
│   │   ├── layout/
│   │   │   ├── AppHeader.tsx            ← Header fixo com modos + usuário + projeto
│   │   │   └── ModeTransition.tsx       ← Wrapper de fade entre modos
│   │   ├── studio/
│   │   │   ├── StudioLayout.tsx         ← Layout 75/25 do modo Studio
│   │   │   ├── PreviewCard.tsx          ← Card branco com Aa + alfabeto
│   │   │   ├── PreviewText.tsx          ← Input editável sobre o Aa
│   │   │   ├── ActionBar.tsx            ← Barra: Visualizar | Exportar | Editar
│   │   │   └── ControlPanel/
│   │   │       ├── ControlPanel.tsx     ← Painel lateral scrollável
│   │   │       ├── FontNameInput.tsx    ← Primeiro input: nome da fonte
│   │   │       ├── CategorySelector.tsx ← Seleção visual de categoria
│   │   │       ├── BaseSelector.tsx     ← Seleção da fonte base
│   │   │       └── ParameterSlider.tsx  ← Slider com label + valor + preview
│   │   ├── library/
│   │   │   ├── LibraryModal.tsx         ← Modal da biblioteca de projetos
│   │   │   └── ProjectCard.tsx          ← Card Aa + nome do projeto
│   │   ├── export/
│   │   │   └── ExportModal.tsx          ← Modal de seleção de formatos
│   │   ├── share/
│   │   │   └── ShareHandler.tsx         ← Geração de link de compartilhamento
│   │   └── ui/
│   │       ├── Button.tsx
│   │       ├── Input.tsx
│   │       ├── Modal.tsx
│   │       ├── Tooltip.tsx
│   │       └── Badge.tsx
│   ├── modes/
│   │   ├── Studio.tsx                   ← Modo Studio (MVP)
│   │   ├── Forge.tsx                    ← Modo Forge (V2 — placeholder)
│   │   └── Academy.tsx                  ← Modo Academy (V2 — placeholder)
│   ├── stores/
│   │   ├── fontStore.ts                 ← Estado da fonte ativa e parâmetros
│   │   ├── projectStore.ts              ← Projetos salvos + autosave
│   │   └── uiStore.ts                   ← Modo ativo, tema, idioma
│   ├── lib/
│   │   ├── fontEngine.ts                ← opentype.js: parse + geração
│   │   ├── fontTransforms.ts            ← Algoritmos de transformação tipográfica
│   │   ├── exportUtils.ts               ← Multi-formato + JSZip
│   │   ├── shareUtils.ts                ← Serialização de estado para URL
│   │   ├── validation.ts                ← Engine de regras tipográficas
│   │   └── storage.ts                   ← Wrapper de localStorage
│   ├── i18n/
│   │   ├── index.ts                     ← Configuração i18next + detecção de idioma
│   │   ├── pt-BR.json                   ← Traduções em português
│   │   └── en-US.json                   ← Traduções em inglês
│   ├── types/
│   │   └── font.ts                      ← Todas as interfaces TypeScript
│   ├── hooks/
│   │   ├── useFont.ts                   ← Hook principal de manipulação de fonte
│   │   ├── useAutosave.ts               ← Autosave com debounce
│   │   └── useTheme.ts                  ← Toggle dark/light
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── biome.json
├── vite.config.ts
├── tailwind.config.ts
└── tsconfig.json
```

---

## 🎨 Design System

### Filosofia Visual
> **A fonte é o protagonista. A interface é o palco.**

O elemento central da tela é sempre o **PreviewCard** — um card branco, levemente arredondado, flutuando sobre o fundo sólido do tema. Todo o resto é infraestrutura visual subordinada a ele. Nenhum elemento de UI deve competir visualmente com a fonte em exibição.

### Tokens de Cor (CSS Variables em `tailwind.config.ts`)

```css
/* Dark Mode */
--bg-base:         #0D0D0D   /* fundo geral da página */
--bg-surface:      #161616   /* header, painéis */
--bg-elevated:     #1F1F1F   /* dropdowns, modais */
--bg-hover:        #272727   /* hover states */
--border:          #2A2A2A
--border-strong:   #3A3A3A

--text-primary:    #F2F2F2
--text-secondary:  #888888
--text-muted:      #4A4A4A

--accent:          #C8FF00   /* lima elétrico — cor de marca */
--accent-hover:    #AADD00
--accent-dim:      #4A5E00

--preview-bg:      #FFFFFF   /* card de preview sempre branco */
--preview-text:    #111111   /* texto da fonte no preview */
--preview-radius:  12px      /* arredondamento do card */
--preview-shadow:  0 8px 40px rgba(0,0,0,0.4)

/* Light Mode */
--bg-base:         #F5F5F5
--bg-surface:      #FFFFFF
--bg-elevated:     #ECECEC
--bg-hover:        #E0E0E0
--border:          #D0D0D0
--border-strong:   #BABABA
--text-primary:    #111111
--text-secondary:  #666666
--text-muted:      #AAAAAA
--accent:          #5533FF   /* roxo no light mode */
--preview-bg:      #FFFFFF
--preview-shadow:  0 8px 40px rgba(0,0,0,0.12)
```

### Tipografia da Interface
- **Display / Logo:** `DM Mono` — monospace técnico, referência ao mundo de type design
- **UI:** `Geist` — neutro, moderno, excelente legibilidade em tamanhos pequenos
- Carregar ambas via Google Fonts no `index.html`

### Animações
- Troca de modo: `opacity 0→1, 300ms ease-in-out`
- Abertura de modal: `opacity + scale 0.96→1, 200ms ease-out`
- Preview da fonte ao mover slider: atualização em tempo real, debounce de 16ms (um frame)
- Hover em cards: `transform: translateY(-2px), 120ms ease`
- Botão Export desabilitado → ativo: transição de cor `200ms`

---

## 📐 Layout do Modo Studio

### Header (fixo, altura 56px)
```
┌─────────────────────────────────────────────────────────────────┐
│  [📷 Nome Usuário ▾]    [Studio | Forge | Academy]   [📁 Projeto] │
└─────────────────────────────────────────────────────────────────┘
```
- **Esquerda:** Avatar circular (32px) + nome do usuário + chevron → abre menu de conta. No MVP: exibe "Visitante" com opção de criar conta (V2).
- **Centro:** Abas dos três modos. Aba ativa com sublinhado na cor `--accent`. Forge e Academy mostram badge "Em breve" com tooltip explicativo.
- **Direita:** Nome do projeto (clicável para renomear inline). Ícone de pasta → abre Biblioteca.

### Body (calc(100vh - 56px - 48px), sem scroll na página)
```
┌──────────────────────────────────────────┬──────────────────────┐
│                                          │                      │
│         PREVIEW CARD (branco)            │   PAINEL DE          │
│                                          │   CONTROLES          │
│   [campo de texto — "Digite aqui..."]    │   (scrollável)       │
│                                          │                      │
│              Aa                          │   [Nome da fonte]    │
│    (fonte em criação, ~60% da altura)    │   [Categoria]        │
│                                          │   [Fonte base]       │
│   a b c d e f g h i j k l m n o p q r  │   ──────────────     │
│   s t u v w x y z  0 1 2 3 4 5 6 7 8 9 │   [Sliders...]       │
│   A B C D E F G H I J K L M N O P Q R  │                      │
│   S T U V W X Y Z  ! @ # $ % & * ( )   │                      │
│                                          │                      │
│         ← 75% da largura total →        │  ← 25% da largura → │
└──────────────────────────────────────────┴──────────────────────┘
```

**PreviewCard:**
- Background sempre `--preview-bg` (#FFFFFF) independente do tema
- Border-radius: `--preview-radius` (12px)
- Box-shadow: `--preview-shadow`
- Padding interno: 40px lateral, 32px vertical
- Margem do card ao fundo: 16px em todos os lados (o fundo `--bg-base` aparece como moldura)
- O `Aa` ocupa aproximadamente 55–60% da altura do card
- O campo de texto acima do `Aa` é um `<input>` transparente, centralizado, placeholder "Digite uma palavra..."
- Abaixo do `Aa`: alfabeto completo + numerais + símbolos em fonte menor (~16px), em duas ou três linhas, centralizado

**Painel de Controles:**
- Background: `--bg-surface`
- Border-left: 1px solid `--border`
- Overflow-y: scroll, scrollbar customizada fina
- Padding: 20px
- Sem header próprio — faz parte do layout geral

### Footer de Ações (fixo, altura 48px, largura 75%)
```
┌──────────────────────────────────────────┐
│  [👁 Visualizar]  [↗ Compartilhar]  [⬇ Exportar]  │
└──────────────────────────────────────────┘
```
- Exatamente a mesma largura do PreviewCard (75%)
- Background: `--bg-surface`
- Border-top: 1px solid `--border`
- Os três botões com ícone + label, espaçados igualmente
- O painel lateral de controles desce até o rodapé da tela, tocando o footer lateralmente

---

## 🔤 Fonte Base: Typera Neutral

Criar (ou embutir) uma fonte base chamada **"Typera Neutral"** com as seguintes características:

- **Propósito:** Ser o ponto zero das transformações. Uma fonte propositalmente sem personalidade, otimizada para receber qualquer parâmetro tipográfico.
- **Características:** Sans-serif geométrica, peso regular (400), proporcional, sem serifa, sem contraste de hastes, sem inclinação, terminais retos. O equivalente tipográfico de uma tela em branco.
- **Glifos mínimos para o MVP:** Basic Latin completo (U+0020–U+007E) + Latin-1 Supplement (U+00C0–U+00FF)
- **Licença:** Proprietária do Typera
- **Implementação técnica:** Arquivo `.ttf` embutido em `/public/fonts/TyperaBase-Neutral.ttf`, carregado via `@font-face` no CSS e parseado pelo `opentype.js` na inicialização do app.

> Se a criação de uma fonte proprietária do zero estiver fora do escopo da implementação inicial, utilizar **Inter** (SIL OFL) como fonte base temporária, documentando claramente que será substituída pela Typera Neutral na V1.1.

---

## ⚙️ Painel de Controles — Especificação Detalhada

### Estrutura do Painel (de cima para baixo, todos visíveis, scroll vertical)

---

**1. Nome da Fonte**
```
Nome da fonte
[________________________] ← input text editável
Sugestão: "Minha Fonte" + número aleatório
```
- Campo editável, fonte aplicada no próprio input como preview inline
- Sugestão automática gerada ao criar novo projeto
- Tooltip: "Este será o nome da família tipográfica nos arquivos exportados"

---

**2. Categoria Tipográfica**

Seleção visual com cards clicáveis (não dropdown):
```
[Serif] [Sans-serif] [Monospace] [Display] [Slab] [Geométrica]
```
Cada card mostra a letra "A" renderizada em um exemplo representativo daquela categoria. Card selecionado: borda `--accent`, background `--accent-dim`.

Tooltip por categoria:
- **Serif:** Terminais decorativos. Clássica, editorial, confiável.
- **Sans-serif:** Sem terminais. Moderna, limpa, versátil.
- **Monospace:** Largura igual entre caracteres. Técnica, código, retrô.
- **Display:** Expressiva, para títulos grandes. Alta personalidade.
- **Slab:** Serifa grossa e retangular. Impacto, robustez.
- **Geométrica:** Baseada em formas puras (círculo, quadrado). Contemporânea.

---

**3. Fonte Base**
```
Fonte base
[Typera Neutral ▾]   ← dropdown (apenas Typera Neutral no MVP)
                      ← Google Fonts aparece aqui na versão Pro
```
Tooltip: "A fonte base é o esqueleto sobre o qual suas modificações serão aplicadas."

---

**Divisor visual**
```
─── Personalização ───
```

---

**4–9. Sliders de Parâmetros Tipográficos**

Cada slider segue este padrão visual:
```
Espessura                    420
[━━━━━━●━━━━━━━━━━━━━━━━]
Thin                        Black
```
- Label à esquerda, valor numérico à direita (atualiza em tempo real)
- Slider de largura total do painel
- Legenda nos extremos (mín e máx)
- Tooltip no label com explicação tipográfica
- Atualiza o preview instantaneamente ao arrastar (debounce 16ms)

**Sliders obrigatórios no MVP:**

| # | Parâmetro | Mín | Máx | Padrão | Tooltip |
|---|---|---|---|---|---|
| 4 | **Espessura** (Weight) | 100 (Thin) | 900 (Black) | 400 | "Controla a espessura das hastes. Valores baixos criam fontes delicadas; altos criam fontes de impacto." |
| 5 | **Largura** (Width) | -100 (Condensed) | 100 (Expanded) | 0 | "Comprime ou expande horizontalmente todos os glifos. Condensed economiza espaço; Expanded cria presença." |
| 6 | **Contraste de Hastes** (Contrast) | 0 (Monoline) | 100 (High) | 0 | "Diferença entre hastes finas e grossas. Zero = todas iguais (sans modernas). Alto = caligrafia, serifa clássica." |
| 7 | **Arredondamento** (Roundness) | 0 (Sharp) | 100 (Round) | 0 | "Suaviza os terminais e junções dos glifos. Mais alto = sensação amigável e orgânica." |
| 8 | **Inclinação** (Slant) | -30° | 30° | 0° | "Inclina todos os glifos. Negativo = oblíquo reverso. Positivo = itálico. Diferente de itálico verdadeiro." |
| 9 | **Altura-x** (x-Height) | -50 | 50 | 0 | "Altura das letras minúsculas em relação às maiúsculas. Alta = mais legível em pequenos tamanhos." |
| 10 | **Espaçamento** (Tracking) | -100 | 200 | 0 | "Espaço entre todos os caracteres. Negativo = mais compacto. Positivo = mais arejado. Afeta ritmo e tom." |
| 11 | **Espaçamento entre linhas** (Leading) | 80 | 200 | 120 | "Distância entre linhas de texto. Valor em % da altura da fonte. Impacta legibilidade em textos corridos." |

---

**Divisor visual**
```
─── Avançado ───
```

---

**12. Terminais** (Terminal Style)
Seleção visual com ícones SVG ilustrativos:
```
[Reto] [Oblíquo] [Redondo] [Flared] [Serifado]
```
Tooltip: "Define como terminam as hastes abertas (ex: ponta do 'a', 'c', 'f')."

**13. Junções** (Junction Style)
```
[Angular] [Suave] [Arredondada]
```
Tooltip: "Define o comportamento onde duas hastes se encontram."

---

### Validação Tipográfica (não-bloqueante)

Implementar `lib/validation.ts` que roda a cada modificação. Exibir warnings como banners sutis no **topo do painel de controles**, cor amarela suave, com ícone `⚠` e botão de fechar:

| Regra | Mensagem |
|---|---|
| Espessura > 800 + Arredondamento > 80 | "Combinação extrema pode causar colisão de hastes em alguns glifos." |
| Inclinação > 25° ou < -25° | "Inclinações acima de 25° podem comprometer a legibilidade." |
| Contraste > 80 + Categoria Monospace | "Alto contraste em fontes monospace é incomum e pode causar inconsistências." |
| Espaçamento < -50 | "Tracking muito negativo pode causar sobreposição entre caracteres." |

Cada warning tem um `(?)` que abre tooltip com explicação técnica detalhada do motivo.

---

## 📚 Biblioteca de Projetos

Acessível via ícone de pasta no header (direita).

Abre como **modal full-screen** com animação de fade.

```
┌────────────────────────────────────────────────────────┐
│  Minha Biblioteca                              [✕]     │
├────────────────────────────────────────────────────────┤
│  [+ Novo Projeto]                                      │
│                                                        │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐             │
│  │    Aa    │  │    Aa    │  │    Aa    │             │
│  │          │  │          │  │          │             │
│  │ Fonte 1  │  │ Fonte 2  │  │ Fonte 3  │             │
│  └──────────┘  └──────────┘  └──────────┘             │
│                                                        │
└────────────────────────────────────────────────────────┘
```

- Grid responsivo de cards (3 colunas em desktop, 2 em tablet)
- Cada card: fundo branco, `Aa` grande renderizado na fonte do projeto, nome abaixo
- Hover: sombra elevada + ícones de ação aparecem (Abrir, Duplicar, Excluir)
- Excluir: requer confirmação via `AlertDialog` do Radix UI
- "Novo Projeto": abre dialog com campo de nome + seleção de categoria inicial
- Estado salvo em localStorage com autosave debounced (300ms após última modificação)

---

## 🔗 Ações — Barra Inferior

### Visualizar
- Serializa o estado completo da fonte em JSON
- Comprime com LZ-string (biblioteca leve)
- Codifica em Base64 e appenda à URL: `typera.app/preview?s=[base64]`
- Copia o link para o clipboard com feedback visual ("Link copiado!")
- **Página `/preview`:** Rota separada. Carrega o estado da URL, renderiza a fonte em modo somente leitura. Layout limpo sem header de modos nem painel de controles. Mostra: nome da fonte, `Aa` grande, alfabeto completo, frase de exemplo. Botão "Abrir no Typera" que redireciona para o editor com o estado carregado.

### Compartilhar
- Mesmo mecanismo que Visualizar (link com estado na URL)
- Diferença: o link abre o app completo mas em modo **read-only** (painel de controles visível mas desabilitado)
- Banner no topo: "Você está visualizando uma fonte compartilhada. [Criar minha versão]"
- "Criar minha versão" faz um fork local do estado e habilita a edição

> **V2:** Compartilhar com permissão de edição via convite por e-mail (modelo Figma). Links curtos via Supabase (`typera.app/s/[id]`).

### Exportar
Abre modal centralizado:

```
┌──────────────────────────────────────────┐
│  Exportar fonte                    [✕]   │
├──────────────────────────────────────────┤
│  Selecione o formato para fazer          │
│  o download                             │
│                                          │
│  ☐ TTF — Universal, funciona em         │
│          qualquer sistema operacional    │
│                                          │
│  ☐ OTF — Preferido para impressão       │
│          e aplicativos Adobe            │
│                                          │
│  ☐ WOFF — Web, suporte a               │
│           navegadores legados           │
│                                          │
│  ☐ WOFF2 — Web moderno, 30% menor      │
│            que WOFF. Recomendado        │
│                                          │
│  ☐ Variable TTF — Um arquivo com        │
│                   múltiplos pesos       │
│                                          │
│  ☐ SVG Font — Compatibilidade com      │
│               ferramentas legadas       │
│                                          │
│  O ZIP incluirá um README.txt com       │
│  instruções de uso e atribuição.        │
│                                          │
│  [    Download    ] ← desabilitado      │
│    até selecionar                        │
└──────────────────────────────────────────┘
```

- Checkboxes Radix UI com estilo visual customizado (cor `--accent` quando marcado)
- Botão "Download" muda de estado visualmente quando pelo menos um formato é selecionado
- Ao clicar: gera todos os formatos selecionados via `opentype.js` + `wawoff2`, empacota em ZIP com `JSZip`, inicia download automático
- Nome do arquivo: `[NomeDaFonte]-Typera.zip`
- README.txt incluído no ZIP com: nome da fonte, parâmetros usados, data de criação, créditos do Typera, instruções de instalação por OS

---

## 🌍 Internacionalização (i18n)

- Configurar `i18next` com detecção automática do idioma do browser (`navigator.language`)
- Fallback: `pt-BR`
- Idiomas suportados no MVP: `pt-BR` e `en-US`
- Todas as strings do UI devem usar chaves de tradução — nenhum texto hardcoded em componentes
- Seletor de idioma: ícone de globo no header (canto esquerdo, próximo ao avatar)
- Tooltips dos parâmetros tipográficos: traduzidos em ambos os idiomas

---

## 💾 Persistência e Estado

### Modelos de Dados

```typescript
// types/font.ts

interface FontProject {
  id: string;                      // uuid v4
  name: string;                    // nome da família tipográfica
  createdAt: string;               // ISO 8601
  updatedAt: string;
  category: FontCategory;
  baseFont: 'typera-neutral';      // expandir na V2
  parameters: FontParameters;
  metadata: FontMetadata;
}

type FontCategory =
  | 'serif'
  | 'sans-serif'
  | 'monospace'
  | 'display'
  | 'slab'
  | 'geometric';

interface FontParameters {
  weight: number;          // 100–900, padrão 400
  width: number;           // -100–100, padrão 0
  contrast: number;        // 0–100, padrão 0
  roundness: number;       // 0–100, padrão 0
  slant: number;           // -30–30, padrão 0
  xHeight: number;         // -50–50, padrão 0
  tracking: number;        // -100–200, padrão 0
  leading: number;         // 80–200, padrão 120
  terminalStyle: TerminalStyle;
  junctionStyle: JunctionStyle;
}

type TerminalStyle = 'straight' | 'oblique' | 'round' | 'flared' | 'serif';
type JunctionStyle = 'angular' | 'smooth' | 'rounded';

interface FontMetadata {
  designer: string;
  description: string;
  version: string;         // "1.0"
  license: 'proprietary';
}

// Estado global — Zustand
interface FontStore {
  activeProject: FontProject | null;
  previewText: string;
  isDirty: boolean;
  setParameter: (key: keyof FontParameters, value: number | string) => void;
  setPreviewText: (text: string) => void;
  generateFont: () => Promise<opentype.Font>;
}

interface ProjectStore {
  projects: FontProject[];
  loadProjects: () => void;
  saveProject: (project: FontProject) => void;
  deleteProject: (id: string) => void;
  duplicateProject: (id: string) => FontProject;
  createProject: (name: string, category: FontCategory) => FontProject;
}

interface UIStore {
  activeMode: 'studio' | 'forge' | 'academy';
  theme: 'dark' | 'light';
  locale: 'pt-BR' | 'en-US';
  isLibraryOpen: boolean;
  isExportOpen: boolean;
  setMode: (mode: UIStore['activeMode']) => void;
  toggleTheme: () => void;
  setLocale: (locale: UIStore['locale']) => void;
}
```

### Autosave
- Implementar hook `useAutosave` que observa `activeProject` via Zustand
- Debounce de 300ms após cada modificação
- Salva no localStorage via `lib/storage.ts`
- Indicador visual sutil no header: "Salvo" com timestamp, ou "Salvando..." durante debounce

---

## 🔧 Engine de Transformação Tipográfica

Implementar em `lib/fontTransforms.ts`. Todos os algoritmos operam sobre os paths bezier dos glifos da fonte base.

### Algoritmos

**Weight (Espessura):**
Offset path algorithm — expande ou contrai o path de cada glifo perpendicularmente à direção da haste. Usar o valor de `weight` (100–900) mapeado para unidades UPM: `offsetAmount = (weight - 400) * 0.3`.

**Width (Largura):**
Escalar todas as coordenadas X dos pontos de controle bezier por um fator: `scaleX = 1 + (width / 100) * 0.5`. Coordenadas Y permanecem intactas.

**Contrast (Contraste):**
Identificar hastes verticais vs horizontais pela análise do ângulo dos handles bezier. Escalar seletivamente: hastes verticais permanecem; hastes horizontais são reduzidas por `contrastFactor = contrast / 100`.

**Slant (Inclinação):**
Aplicar transformação de shear horizontal em todos os pontos: `x' = x + y * tan(slant * π / 180)`. Valor Y permanece inalterado.

**Roundness (Arredondamento):**
Detectar junções com ângulo inferior a 120°. Inserir handles bezier suaves nessas junções com raio proporcional ao valor de roundness: `radius = roundness * 0.5` UPM.

**x-Height:**
Escalar verticalmente apenas os glifos minúsculos (U+0061–U+007A): `scaleY = 1 + (xHeight / 100) * 0.2`.

**Tracking e Leading:**
Estes são parâmetros de métricas de fonte, não de path. Aplicar via `advanceWidth` e `lineGap` nas tabelas `hhea` e `OS/2` do arquivo de fonte gerado pelo opentype.js.

---

## 🔒 Segurança e Qualidade

- **Sanitização:** Todo texto inserido pelo usuário (nome da fonte, preview text) deve ser sanitizado antes de ser inserido no DOM ou em nomes de arquivo
- **CSP:** Configurar Content Security Policy no `vercel.json` para prevenir XSS
- **Biome:** Configurar regras rígidas — `recommended` + regras de segurança ativas
- **TypeScript strict:** `"strict": true` no `tsconfig.json` — sem `any` implícito
- **Sentry:** Inicializar no `main.tsx` com DSN do projeto. Capturar erros de boundary com `Sentry.ErrorBoundary` envolvendo toda a app
- **localStorage:** Sempre usar o wrapper `lib/storage.ts` — nunca acessar `localStorage` diretamente nos componentes. O wrapper trata exceções (modo privado, storage cheio) graciosamente
- **Limites de dados:** Máximo de 50 projetos no localStorage. Ao atingir o limite, exibir aviso com opção de excluir projetos antigos

---

## 📋 Roadmap Documentado (não implementar no MVP)

### V2 — Forge Mode
- Editor fino de glifos com Fabric.js (bezier, nós, handles)
- Edição glifo a glifo, independente
- Importação de Google Fonts via API (requer API key do usuário)
- Nota legal: fontes importadas são OFL — derivados permitidos com novo nome

### V2 — Autenticação e Nuvem
- Supabase Auth (email/senha + OAuth Google/GitHub)
- Projetos sincronizados na nuvem por usuário
- Links curtos de compartilhamento (`typera.app/s/[id]`)
- Compartilhamento com edição via convite por e-mail (modelo Figma)

### V2 — Academy Mode
- Biblioteca de conteúdo tipográfico
- Teoria: anatomia da fonte, classificações, história
- Tutoriais: como criar fonte para branding, para web, para redes sociais
- Glossário tipográfico interativo

### V2 — Compartilhamento Avançado
- Preview contextual: fonte aplicada em mockups reais (post Instagram, logotipo, cartaz, website)
- Galeria pública de fontes criadas pela comunidade Typera

### V2 — Plano Pro
- Google Fonts como fonte base (requer API key)
- IA por chat para modificações tipográficas (requer API de LLM)
- Export de Variable Font completo com múltiplos eixos

### Fase 3 — Mobile
- Responsividade completa do app web primeiro
- Port para React Native via Capacitor após responsividade concluída

---

## 🚀 Instruções de Inicialização

```bash
# 1. Criar projeto
npm create vite@latest typera -- --template react-ts
cd typera

# 2. Instalar dependências
npm install

# 3. Configurar Biome
npx @biomejs/biome init

# 4. Configurar Tailwind
npx tailwindcss init -p

# 5. Configurar i18next
# Criar src/i18n/index.ts, pt-BR.json, en-US.json

# 6. Inicializar Sentry
# Adicionar DSN no .env: VITE_SENTRY_DSN=...

# 7. Desenvolver
npm run dev

# 8. Deploy
vercel deploy
```

---

## ✅ Checklist de Qualidade do MVP

Antes de considerar o MVP completo, verificar:

- [ ] Fonte base Typera Neutral carrega e renderiza corretamente
- [ ] Todos os 8 sliders atualizam o preview em tempo real (< 50ms)
- [ ] Autosave funciona e recupera estado ao recarregar a página
- [ ] Biblioteca abre com projetos salvos renderizando na fonte correta
- [ ] Export gera ZIP com todos os formatos selecionados e README
- [ ] Link de Compartilhar carrega a fonte corretamente em nova aba
- [ ] Toggle dark/light funciona sem flash de conteúdo (FOUC)
- [ ] i18n troca entre PT-BR e EN-US corretamente
- [ ] Forge e Academy mostram placeholder "Em breve" sem crashar
- [ ] Biome não reporta erros (`npx biome check .`)
- [ ] TypeScript compila sem erros (`npx tsc --noEmit`)
- [ ] Sentry captura erros de teste corretamente

---

*Typera — "To type, for type, you type."*
*Prompt gerado para uso em Codex (principal), Cursor e Lovable.*
