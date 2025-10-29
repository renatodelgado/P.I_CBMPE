# Projeto CHAMA — Sistema de Gestão de Ocorrências (CBMPE)

Projeto integrador desenvolvido por alunos da Faculdade SENAC Pernambuco com o objetivo de criar um sistema de gestão de ocorrências para o Corpo de Bombeiros Militar de Pernambuco (CBMPE).

Demo (frontend deploy):
- Vercel: https://projetochama.vercel.app
- Netlify: https://projetochama.vercel.app

Backend (deploy):
- API: https://backend-chama.up.railway.app/

Equipe
- João Victor Rodrigues Basante  
- João Vitor Malveira da Silva  
- Maria Clara de Melo  
- Renato Trancoso Branco Delgado  
- Thayana Anália dos Santos Lira  
- Vinicius Henrique Silva Nascimento

Tecnologias
- Frontend: React com TypeScript, styled-components
- Backend: Node.js, Express, TypeORM (API separada)
- Banco e deploy: PostgreSQL / Railway (conforme backend)

Visão geral
O CHAMA é um sistema web para registro, listagem e gestão de ocorrências operacionais. Fornece filtros, dashboard analítico, auditoria e gestão de usuários.

Funcionalidades já implementadas
- Cadastro de ocorrência
- Lista de ocorrências (com filtros e paginação)
- Cadastro de usuários
- Gestão de usuários (listar, editar, remover)
- Dashboard operacional (gráficos e métricas)
- Tela de auditoria

Funcionalidades planejadas / em andamento
- Ajustes finos de interface e usabilidade
- Relatórios analíticos avançados
- Exportar relatórios (CSV / PDF / XLS)
- Entre outros

Estrutura do repositório (resumo)
- src/ — código fonte do frontend (React + TS)
  - pages/ — telas (ex.: ocorrencias, dashboard)
  - components/ — componentes reutilizáveis e estilos
  - services/ — chamadas à API (quando aplicável)
- public/ — assets públicos
- package.json — scripts e dependências

Como rodar localmente (frontend)
1. Clone o repositório:
   ```
   git clone <url-do-repo>
   cd P.I_CBMPE
   ```

2. Instale dependências:
   ```
   npm install
   ```

   ou, se usar yarn:
   ```
   yarn
   ```

3. Ajuste variáveis de ambiente (opcional)
   - Por padrão o frontend aponta para a API em https://backend-chama.up.railway.app/.
   - Caso queira usar outro backend, crie um `.env` na raiz com, por exemplo:
     ```
     REACT_APP_API_BASE_URL=https://seu-backend.local
     ```

4. Rode em modo de desenvolvimento:
   ```
   npm run dev
   ```
   ou
   ```
   npm start
   ```

5. Build de produção:
   ```
   npm run build
   ```

Observações sobre o backend
- O backend está deployado em https://backend-chama.up.railway.app/ e foi desenvolvido com Node.js, Express e TypeORM.
- Para rodar o backend localmente consulte o repositório do backend (separado) e configure as variáveis de ambiente do banco.

Contribuição
Pull requests são bem-vindos. Para mudanças maiores, abra uma issue primeiro descrevendo o que será implementado.

Licença
- Consulte o arquivo LICENSE (se presente) ou contacte a equipe para definições.

Contato
- Projeto desenvolvido como trabalho integrador da Faculdade SENAC PE — equipe acima.
