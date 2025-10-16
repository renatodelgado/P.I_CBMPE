# FilterCard Component Documentation

## Visão Geral
O `FilterComponent` é um componente React completo que implementa uma tela de **Lista de Ocorrências** baseada no design do Figma. Esta tela permite visualizar, filtrar e gerenciar ocorrências do sistema CBMPE com funcionalidades avançadas de filtragem e apresentação de dados.

---

## 📁 Estrutura de Arquivos

```
src/pages/pageListaOcorrencia/
├── ListaOcorrencias.tsx           # Página principal que renderiza o FilterComponent
├── filterComponets/
│   ├── filterCard.tsx             # Componente principal com toda a lógica
│   └── filterCard.styles.ts       # Todos os styled-components
```

---

## 🔧 Imports e Dependências

### filterCard.tsx
```typescript
import { useState } from "react";
```
- **`useState`**: Hook do React para gerenciar estado local dos filtros e inputs
- **Não importa React**: Otimização para projetos modernos que não precisam importar React explicitamente

### Styled Components (filterCard.styles.ts)
```typescript
import { 
  ContainerPrincipal,      # Container principal da tela
  CabecalhoTela,          # Header com título e botão
  TituloTela,             # Título principal da página
  DescricaoTela,          # Descrição/subtítulo
  BotaoNovaOcorrencia,    # Botão vermelho "Nova ocorrência"
  SecaoFiltros,           # Container dos filtros
  LinhaFiltros,           # Linha horizontal de filtros
  CampoFiltro,            # Container individual de cada filtro
  LabelCampo,             # Label dos campos
  InputData,              # Input para datas
  SelectCampo,            # Select/dropdown
  InputTexto,             # Input de texto
  BotaoFiltro,            # Botão "Filtro" vermelho
  BotaoLimpar,            # Botão "Limpar" transparente
  FiltersAplicados,       # Container das tags de filtros ativos
  TagFiltro,              # Tags vermelhas dos filtros aplicados
  SecaoResultados,        # Container da tabela de resultados
  CabecalhoResultados,    # Header da seção de resultados
  TituloResultados,       # "Resultados (247 ocorrências)"
  BotoesAcoes,            # Container dos botões Exportar/Atribuir
  BotaoExportar,          # Botão "Exportar"
  BotaoAtribuir,          # Botão "Atribuir"
  TabelaOcorrencias,      # Container da tabela
  CabecalhoTabela,        # Header da tabela (colunas)
  ColunaTabela,           # Célula do cabeçalho
  LinhaTabela,            # Linha de dados da tabela
  CelulaTabela,           # Célula de dados
  StatusBadge,            # Badge colorida do status
  PaginacaoContainer,     # Container da paginação
  InfoPaginacao,          # "Mostrando 1-20 de 247"
  BotoesPaginacao,        # Container dos botões de página
  BotaoPaginacao,         # Botão individual de página
  PainelLateral,          # Sidebar direita
  TituloSecao,            # Títulos das seções do painel
  CardEstatistica,        # Card individual de estatística
  NumeroEstatistica,      # Número grande da estatística
  LabelEstatistica        # Label da estatística
} from "./filterCard.styles";
```

---

## 🎯 Estados Gerenciados (useState)

```typescript
const [periodoInicio, setPeriodoInicio] = useState("");     // Data inicial do filtro
const [periodoFim, setPeriodoFim] = useState("");           // Data final do filtro
const [tipoOcorrencia, setTipoOcorrencia] = useState("todos"); // Tipo selecionado
const [regiao, setRegiao] = useState("todas");              // Região selecionada
const [viatura, setViatura] = useState("");                 // Busca por viatura
const [buscaLivre, setBuscaLivre] = useState("");           // Busca livre
const [statusPendente, setStatusPendente] = useState(false); // Checkbox Pendente
const [statusConcluido, setStatusConcluido] = useState(false); // Checkbox Concluído
const [statusAndamento, setStatusAndamento] = useState(false); // Checkbox Em andamento
```

### Dados Simulados
```typescript
const ocorrencias = [
  {
    id: "#OCR-2024-001",
    data: "25/09/2024",
    hora: "14:32",
    tipo: "Incêndio",
    localizacao: "Boa Viagem, Recife",
    viatura: "ABT-01",
    status: "Em andamento",
    responsavel: "Sgt. Carlos Silva"
  },
  // ... mais ocorrências
];
```

---

## 🏗️ Estrutura do Componente

### 1. **Container Principal**
```jsx
<ContainerPrincipal>
  {/* Todo o conteúdo da página */}
</ContainerPrincipal>
```
- **Função**: Container principal da tela
- **Estilos**: Background `#F9FAFB`, border `#000000`, padding, max-width 1440px

### 2. **Cabeçalho da Tela**
```jsx
<CabecalhoTela>
  <div>
    <TituloTela>Lista de Ocorrências</TituloTela>
    <DescricaoTela>Visualize e gerencie todas as ocorrências...</DescricaoTela>
  </div>
  <BotaoNovaOcorrencia>+ Nova ocorrência</BotaoNovaOcorrencia>
</CabecalhoTela>
```
- **Função**: Header com título, descrição e botão de ação
- **Layout**: Flexbox space-between

### 3. **Layout Principal (Flex)**
```jsx
<div style={{ display: 'flex', gap: '24px' }}>
  <div style={{ flex: 1 }}>
    {/* Área principal com filtros e tabela */}
  </div>
  <PainelLateral>
    {/* Sidebar com filtros salvos e estatísticas */}
  </PainelLateral>
</div>
```

### 4. **Seção de Filtros**
```jsx
<SecaoFiltros>
  <LinhaFiltros>
    <CampoFiltro>
      <LabelCampo>Período</LabelCampo>
      <InputData type="date" />
    </CampoFiltro>
    {/* Mais filtros... */}
  </LinhaFiltros>
</SecaoFiltros>
```
- **Filtros Implementados**:
  - ✅ Período (data início/fim)
  - ✅ Tipo de Ocorrência (select)
  - ✅ Região/Setor (select)
  - ✅ Status (checkboxes múltiplos)
  - ✅ Viatura/Equipe (input texto)
  - ✅ Busca Livre (input texto)

### 5. **Tabela de Resultados**
```jsx
<TabelaOcorrencias>
  <CabecalhoTabela>
    <ColunaTabela>ID</ColunaTabela>
    <ColunaTabela>DATA/HORA</ColunaTabela>
    {/* Mais colunas... */}
  </CabecalhoTabela>
  
  {ocorrencias.map(ocorrencia => (
    <LinhaTabela key={ocorrencia.id}>
      <CelulaTabela>{ocorrencia.id}</CelulaTabela>
      {/* Mais células... */}
    </LinhaTabela>
  ))}
</TabelaOcorrencias>
```
- **Grid Layout**: 9 colunas responsivas
- **Funcionalidades**: Hover, status coloridos, ações

### 6. **Painel Lateral (Sidebar)**
```jsx
<PainelLateral>
  <TituloSecao>Filtros Salvos</TituloSecao>
  {/* Cards de filtros salvos */}
  
  <TituloSecao>Estatísticas Rápidas</TituloSecao>
  <CardEstatistica>
    <NumeroEstatistica>247</NumeroEstatistica>
    <LabelEstatistica>Total de Ocorrências</LabelEstatistica>
  </CardEstatistica>
</PainelLateral>
```

---

## 🎨 Sistema de Cores e Estilos

### Paleta de Cores
```css
/* Cores Principais */
--background: #F9FAFB;          /* Fundo principal */
--border: #000000;              /* Bordas principais */
--primary: #EF4444;             /* Botões principais */
--primary-hover: #DC2626;       /* Hover dos botões */

/* Cores de Status */
--status-andamento: #3B82F6;    /* Azul - Em andamento */
--status-concluido: #10B981;    /* Verde - Concluído */
--status-pendente: #EF4444;     /* Vermelho - Pendente */

/* Tons de Cinza */
--text-primary: #111827;        /* Texto principal */
--text-secondary: #374151;      /* Texto secundário */
--text-muted: #6B7280;         /* Texto esmaecido */
--border-light: #E5E7EB;       /* Bordas claras */
--background-light: #F9FAFB;   /* Fundo claro */
```

### Responsividade
- **Container**: Max-width 1440px, responsivo
- **Grid da Tabela**: 9 colunas adaptáveis
- **Flex Layout**: Principais seções usando flexbox
- **Sidebar**: Width fixo 300px

---

## 🔗 Integração com App.tsx

### Como foi implementado:

1. **Rota Existente**: A rota `/listaocorrencias` já existia no App.tsx
2. **Página ListaOcorrencias.tsx**: Foi modificada para importar o FilterComponent
3. **Integração**:

```typescript
// Em ListaOcorrencias.tsx
import { FilterComponent } from "./filterComponets/filterCard";

export function Ocorrencias() {
  return (
    <div>
      <FilterComponent />
    </div>
  );
}
```

```typescript
// Em App.tsx (rota já existente)
<Route path="/listaocorrencias" element={<Ocorrencias />} />
```

### Fluxo de Navegação:
```
App.tsx → Route → ListaOcorrencias.tsx → FilterComponent
```

---

## 🚀 Funcionalidades Implementadas

### ✅ **Filtros Avançados**
- Período com data início/fim
- Seleção de tipo de ocorrência
- Filtro por região/setor
- Status múltiplos (checkboxes)
- Busca por viatura/equipe
- Busca livre por texto

### ✅ **Tabela Interativa**
- Grid responsivo com 9 colunas
- Status badges coloridos
- Hover effects nas linhas
- Checkboxes para seleção múltipla
- Ações por linha (visualizar, atribuir, info)

### ✅ **Paginação**
- Informações de resultados
- Botões de navegação
- Indicador de página ativa

### ✅ **Painel Lateral**
- Filtros salvos
- Botão "Salvar Filtro Atual"
- Estatísticas rápidas em cards
- Layout vertical organizado

### ✅ **Estados Interativos**
- Todos os inputs têm estado gerenciado
- Formulário completamente funcional
- Tags de filtros aplicados
- Botões de ação responsivos

---

## 🛠️ Tecnologias Utilizadas

- **React 18+** com hooks (useState)
- **TypeScript** para tipagem
- **Styled Components** para estilização
- **CSS Grid** para layout da tabela
- **Flexbox** para layouts responsivos
- **Controlled Components** para formulários

---

## 📝 Próximos Passos

1. **Integração com API**: Substituir dados simulados por API real
2. **Validação de Formulário**: Adicionar validações nos campos
3. **Persistência**: Salvar filtros no localStorage
4. **Exportação**: Implementar funcionalidade de export
5. **Responsividade Mobile**: Otimizar para dispositivos móveis

---

## 🔍 Como Testar

1. Execute `npm run dev`
2. Acesse `/listaocorrencias` no navegador
3. Teste todos os filtros e interações
4. Verifique a responsividade
5. Confirme que todos os botões são clicáveis

---

**Documentação criada em**: October 11, 2025  
**Versão**: 1.0.0  
**Status**: ✅ Funcional e testado