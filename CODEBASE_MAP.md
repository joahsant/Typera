# Typera — Mapa de Código
> **Leia isso antes de qualquer arquivo `.tsx` ou `.ts`.**
> Atualizado: 2026-05-03 | Versão do produto: 1.0.0-beta

---

## Índice Rápido

| Preciso… | Vá para |
|---|---|
| Entender o layout da tela principal | [`src/modes/Studio.tsx`](#studiots) |
| Mudar como a fonte é mutada em tempo real | [`src/hooks/useFontEngine.ts`](#usefontengine) |
| Mudar peso, largura, slant, contraste | [`src/lib/fontTransforms.ts`](#fonttransforms) |
| Adicionar/remover slider de parâmetro | [`src/components/studio/ControlPanel/ControlPanel.tsx`](#controlpanel) |
| Mudar cores / tema claro-escuro | [`src/index.css`](#indexcss) + [`tailwind.config.js`](#tailwindconfig) |
| Adicionar formato de exportação | [`src/lib/exportUtils.ts`](#exportutils) |
| Mudar o modal de exportação | [`src/components/export/ExportModal.tsx`](#exportmodal) |
| Gerenciar projetos (criar/deletar/duplicar) | [`src/stores/projectStore.ts`](#projectstore) |
| Mudar estado global (tema, parâmetros, undo) | [`src/stores/fontStore.ts`](#fontstore) |
| Mudar tipos TypeScript | [`src/types/font.ts`](#fonttypes) |
| Ver rotas | [`src/App.tsx`](#apptsx) |
| Rodar os agentes de qualidade | [`docs/agents/`](#agents) |

---

## Arquitetura em Diagrama

```
src/
├── main.tsx              ← Entry point React (sem StrictMode)
├── App.tsx               ← Router: / → Studio, /preview → Preview
├── index.css             ← Variáveis CSS do M3, tema dark/light, scrollbar
│
├── modes/
│   ├── Studio.tsx        ← ★ Página principal (layout h-screen, sem scroll global)
│   └── Preview.tsx       ← Modo fullscreen para compartilhamento/embed
│
├── hooks/
│   ├── useFontEngine.ts  ← ★ Motor: fetch base TTF → parse → mutate → blob URL
│   └── useAutosave.ts    ← Debounce 300ms → salva no localStorage
│
├── stores/
│   ├── fontStore.ts      ← Estado global: activeProject, theme, undo/redo
│   └── projectStore.ts   ← Lista de projetos: CRUD + localStorage
│
├── lib/
│   ├── fontTransforms.ts ← ★ Algoritmos paramétricos (weight, width, slant…)
│   ├── fontEngine.ts     ← I/O de fonte (fetch + parse, usado pelo ExportModal)
│   ├── exportUtils.ts    ← Gera ZIP (TTF + WOFF2 + README)
│   ├── shareUtils.ts     ← Serializa projeto em URL query param
│   ├── storage.ts        ← Abstração do localStorage
│   └── validation.ts     ← Sanitização de strings (nome da fonte)
│
├── components/
│   ├── studio/
│   │   ├── ControlPanel/
│   │   │   ├── ControlPanel.tsx      ← Sidebar scrollável com todos os sliders
│   │   │   └── CategorySelector.tsx  ← Dropdown de categoria da fonte
│   │   └── ParameterSlider.tsx       ← Slider reutilizável (Radix UI)
│   ├── export/
│   │   └── ExportModal.tsx           ← Modal de exportação (TTF/WOFF2)
│   └── library/
│       └── LibraryModal.tsx          ← Grid de projetos salvos
│
├── types/
│   └── font.ts           ← FontProject, FontParameters, SystemState
│
├── assets/
│   └── fonts/
│       └── Inter-Regular.ttf         ← Fonte base (importada via Vite ?url)
│
└── i18n/                 ← Traduções pt-BR / en-US
```

---

## Detalhes por Módulo

### `Studio.tsx`
**Responsabilidade:** Layout principal. Não tem lógica de negócio.

**Fluxo de renderização:**
1. `useFontEngine()` retorna `fontUrl` (blob URL)
2. `useEffect([fontUrl])` → cria `<style>` com `@font-face` no `document.head`
3. `<p style={{ fontFamily: appliedFontName }}>` renderiza o texto com a fonte mutada
4. Ao desmontar/trocar de fonte, o `<style>` antigo é removido do `document.head`

**Por que não usar `dangerouslySetInnerHTML` para o `<style>`?**
Causa `NotFoundError: removeChild` — o React tenta reconciliar um nó que já foi movido pelo DOM.

---

### `useFontEngine`
**Responsabilidade:** Único lugar que conhece o binário da fonte.

**Fluxo:**
```
mount → fetch(interFontUrl) → ArrayBuffer (armazenado em ref)
     → opentype.parse(buffer.slice(0))   ← slice para não mutar o original
     → applyTransforms por glifo
     → toArrayBuffer() → Blob → URL.createObjectURL()
     → setFontUrl(newUrl)
     → cleanup: URL.revokeObjectURL(oldUrl)
```

**Throttle:** `isProcessingRef` + `pendingRef` garantem que só uma mutação rode por vez. Se uma nova chegou enquanto a anterior ainda rodava, ela é enfileirada e executa ao final.

---

### `fontTransforms`
**Responsabilidade:** Algoritmos de mutação paramétrica.

| Função | O que faz | Parâmetro de entrada |
|---|---|---|
| `applyWeight` | Expande/contrai pontos horizontalmente | `weight` (100–900) |
| `applyWidth` | Escala X de todos os pontos | `width` (-100 a 100) |
| `applySlant` | Cisalhamento (shear) no eixo X | `slant` (-30° a 30°) |
| `applyContrast` | Escala Y (reduz hastes horizontais) | `contrast` (0–100) |
| `applyXHeight` | Escala Y apenas em minúsculas | `xHeight` (-50 a 50) |

> ⚠️ Estas são aproximações visuais, não operações tipográficas exatas (Bézier splitting etc.). São suficientes para protótipos.

---

### `fontStore`
**Responsabilidade:** Source of truth do estado da sessão.

- `activeProject` — projeto sendo editado
- `setParameter(key, value)` — atualiza um parâmetro (dispara re-mutação via `useFontEngine`)
- `setTheme('dark'|'light')` — atualiza store + classes no `<html>`
- `undo() / redo()` — navega no histórico (máximo 50 snapshots)
- `pushToHistory(project)` — chamado no `onBlur` dos sliders

---

### `projectStore`
**Responsabilidade:** CRUD de projetos persistidos no `localStorage`.

Separado do `fontStore` para SRP (Single Responsibility). O `fontStore` cuida do estado da sessão ativa; o `projectStore` cuida da persistência.

---

### `index.css` + `tailwind.config.js`
**Responsabilidade:** Sistema de design M3 Expressive.

Tokens de cor são variáveis CSS RGB:
```css
html, html.dark { --m3-primary-rgb: 200, 255, 0; }
html.light      { --m3-primary-rgb: 85,  51, 255; }
```

No Tailwind:
```js
'm3-primary': 'rgb(var(--m3-primary-rgb) / <alpha-value>)'
```
Isso permite usar `bg-m3-primary/20` (com opacidade) em qualquer componente.

---

## Agentes de Qualidade

Os agentes em `docs/agents/` definem protocolos obrigatórios para cada tipo de tarefa. **Todo agente deve ser consultado antes de iniciar trabalho na sua área.**

| Agente | Quando usar |
|---|---|
| `tech_lead.md` | Antes de qualquer refactor ou decisão de arquitetura |
| `font_engineer.md` | Antes de modificar `fontTransforms`, `useFontEngine` |
| `product_designer.md` | Antes de alterar layout, cores ou UX |
| `qa_performance.md` | Antes de fazer merge de qualquer feature |
| `governance.md` | Antes de criar novo arquivo ou pasta |
| `documentation.md` | Antes de commitar (garante que docs foram atualizados) |
| `observability.md` | Ao adicionar novos console.log ou monitoramento |
| `security.md` | Ao lidar com dados do usuário ou exportação |

---

## Status de Funcionalidades

| Feature | Status | Notas |
|---|---|---|
| Preview em tempo real | ✅ Funcional | Via `useFontEngine` + blob URL |
| Tema claro/escuro | ✅ Funcional | Classe em `<html>`, sincronizada no mount |
| Sliders de parâmetros | ✅ Funcional | ControlPanel → fontStore → useFontEngine |
| Exportação TTF | ✅ Funcional | ExportModal → exportUtils → JSZip |
| Exportação WOFF2 | ✅ Funcional | Via wawoff2 WASM |
| Biblioteca de projetos | ✅ Funcional | projectStore → localStorage |
| Autosave | ✅ Funcional | useAutosave debounce 300ms |
| Undo/Redo | ✅ Funcional | Máximo 50 estados |
| Preview compartilhável | ✅ Funcional | shareUtils → /preview?s=... |
| Modo Forge | 🔜 V2 | Rota desabilitada |
| Modo Academy | 🔜 V2 | Rota desabilitada |

---

## Arquivos Legado / Removidos

| Arquivo | Status | Motivo |
|---|---|---|
| `tailwind.config.ts` | ❌ Removido | Substituído por `tailwind.config.js` |
| `bundle-check.txt` | ❌ Removido | Arquivo de debug temporário |
| `test-output.html` | ❌ Removido | Arquivo de debug temporário |
| `vite-log.txt` | ❌ Removido | Arquivo de debug temporário |
| `public/test-out.css` | ❌ Removido | CSS de debug gerado manualmente |
| `src/lib/__tests__/` | ⚠️ Vazio | Aguarda implementação de testes unitários |
