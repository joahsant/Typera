# Typera — Projeto de Mutação de Fontes em Tempo Real

Este projeto é uma ferramenta experimental para transformação dinâmica de glifos utilizando `opentype.js` e React.

## 🚀 Como Iniciar

### 1. Pré-requisitos
- Node.js (v18 ou superior)
- npm, yarn ou pnpm

### 2. Instalação
```bash
npm install
```

### 3. Fontes Necessárias (Crítico)
Para que o motor de fontes funcione, você deve fornecer a fonte base:
1. Baixe a fonte **Inter-Regular.ttf** (disponível no [Google Fonts](https://fonts.google.com/specimen/Inter) ou [GitHub da Inter](https://github.com/rsms/inter)).
2. Coloque o arquivo em: `public/fonts/Inter-Regular.ttf`

*Nota: Se desejar usar outra fonte, altere o caminho em `src/hooks/useFontEngine.ts`.*

### 4. Execução
```bash
npm run dev
```
Acesse `http://localhost:3000` no seu navegador.

## 🛠 Tecnologias
- **React 18** + **Vite**
- **Tailwind CSS** + **Radix UI**
- **Zustand** (Estado Global)
- **opentype.js** (Manipulação Binária de Fontes)
- **Biome** (Linting e Formatação)

## 📁 Estrutura do Projeto
- `src/`: Código fonte da aplicação React.
- `docs/`: Central de documentação, incluindo os Agentes de IA ([veja mais aqui](./docs/README.md)).

---
Desenvolvido com o suporte de Agentes de IA (Tech Lead, Font Engineer, System Integrity, etc).
