# Protocolo de Agentes Typera
> **OBRIGATÓRIO:** Todo agente ou desenvolvedor deve executar este protocolo antes de iniciar qualquer tarefa.
> Consulte `CODEBASE_MAP.md` para localizar arquivos sem ler código.

---

## 1. Pré-Tarefa (SEMPRE executar)

```
[ ] Leia CODEBASE_MAP.md e identifique o(s) módulo(s) afetado(s)
[ ] Leia o agente correspondente em docs/agents/ para a área de trabalho
[ ] Verifique git status – nunca trabalhe com mudanças não commitadas de outra tarefa
[ ] Confirme que o servidor dev está rodando: npm run dev → localhost:3000
```

---

## 2. Mapa de Responsabilidade dos Agentes

### 🏗️ [`tech_lead.md`](agents/tech_lead.md)
**Acionar quando:** decisão de arquitetura, novo módulo, refactor estrutural.
**Checklist mínimo:**
- A mudança respeita SRP (Single Responsibility)?
- Cria algum acoplamento desnecessário?
- Há um módulo existente que já faz isso?

### 🔤 [`font_engineer.md`](agents/font_engineer.md)
**Acionar quando:** qualquer mudança em `fontTransforms.ts`, `useFontEngine.ts`, `fontEngine.ts`.
**Checklist mínimo:**
- A transformação é aplicada ao `path.commands` correto?
- O `baseBuffer` não está sendo mutado diretamente (use `.slice(0)`)?
- URLs de blob antigas estão sendo revogadas (`URL.revokeObjectURL`)?

### 🎨 [`product_designer.md`](agents/product_designer.md)
**Acionar quando:** mudança em layout, cores, espaçamento, animações.
**Checklist mínimo:**
- A mudança segue o sistema de tokens M3 (`m3-primary`, `m3-surface`, etc.)?
- O preview canvas permanece fixo (não scroll junto com sidebar)?
- Testou em tema claro E escuro?

### ✅ [`qa_performance.md`](agents/qa_performance.md)
**Acionar quando:** antes de qualquer commit em `main`.
**Checklist mínimo:**
- O app carrega sem erros no console?
- Os sliders de parâmetros atualizam a fonte visualmente?
- O tema claro/escuro alterna corretamente?
- A exportação gera um ZIP válido?
- O `removeChild` error NÃO aparece?

### 📋 [`governance.md`](agents/governance.md)
**Acionar quando:** criar novo arquivo, pasta, ou dependência.
**Checklist mínimo:**
- O arquivo está na pasta correta conforme `CODEBASE_MAP.md`?
- O nome segue o padrão (camelCase para hooks/utils, PascalCase para componentes)?
- Foi adicionado ao `CODEBASE_MAP.md`?

### 📝 [`documentation.md`](agents/documentation.md)
**Acionar quando:** modificar qualquer módulo público.
**Checklist mínimo:**
- O JSDoc do módulo foi atualizado?
- `CODEBASE_MAP.md` foi atualizado se a responsabilidade mudou?
- O status da feature na tabela de `CODEBASE_MAP.md` está correto?

---

## 3. Fluxo de Execução de Tarefa

```
1. [PRÉ]  Ler CODEBASE_MAP.md
2. [PRÉ]  Ler agente(s) relevante(s)
3. [EXEC] Fazer a mudança no menor escopo possível
4. [EXEC] Testar: npm run dev → verificar no browser
5. [PÓS]  Rodar checklist do qa_performance
6. [PÓS]  Atualizar CODEBASE_MAP.md se necessário
7. [PÓS]  git add -A && git commit -m "tipo(escopo): descrição"
```

### Convenção de commits
```
feat(studio): adiciona slider de roundness
fix(engine): corrige stale closure em useFontEngine
chore(docs): atualiza CODEBASE_MAP com novo módulo
refactor(export): separa lógica de compressão WOFF2
```

---

## 4. Erros Conhecidos e Como Evitar

| Erro | Causa | Solução |
|---|---|---|
| `NotFoundError: removeChild` | Nó criado fora do React sendo removido pelo reconciliador | Sempre criar/remover `<style>` tags via `useEffect` com cleanup function |
| Fonte não muda ao mover slider | `activeProject` não é dependência do `useCallback` | Garantir que `mutateFont` é recriado quando `activeProject` muda |
| Fonte corrompida (`Unsupported OpenType`) | Mutar o `baseBuffer` diretamente | Sempre usar `buffer.slice(0)` antes de `opentype.parse()` |
| Tema não aplica | Classe em `<body>` em vez de `<html>` | CSS usa `html.dark` – classe deve estar no `<html>` |
| HTTP 200 com HTML no fetch de fonte | Vite servindo SPA index.html no lugar do `.ttf` | Usar `import font from 'path?url'` em vez de fetch público |
