# 🍕 Pizzaria — Frontend Web

Aplicação web moderna para gestão operacional e atendimento de pizzaria, desenvolvida em **Next.js**, **React** e **TypeScript**. O sistema permite abertura de mesas, lançamento e gerenciamento de pedidos em tempo real, controle de cardápio e fluxo de produção na cozinha.

---

## 🚀 Funcionalidades

- 🔐 **Autenticação & Controle de Acesso:** Login seguro via JWT com permissões de colaboradores e administradores.
- 🪑 **Abertura e Gestão de Mesas:** Abertura rápida de mesas e controle de status de ocupação.
- 📝 **Lançamento de Pedidos:** Adição/remoção de itens em tempo real, visualização de pedidos em rascunho (`draft`) e envio para cozinha.
- 👨‍🍳 **Fluxo de Cozinha & Finalização:** Acompanhamento do preparo de pedidos e encerramento com liberação de mesa.
- 📋 **Gestão de Cardápio:** Visualização e cadastro de categorias e produtos.

---

## 🛠️ Tecnologias Utilizadas

- **Framework:** [Next.js](https://nextjs.org/) (App Router)
- **UI & Reatividade:** [React](https://react.dev/)
- **Linguagem:** [TypeScript](https://www.typescriptlang.org/)
- **Estilização:** [Tailwind CSS](https://tailwindcss.com/)
- **Padronização & Qualidade de Código:**
  - [Husky](https://typicode.github.io/husky/) — Git hooks automatizados
  - [lint-staged](https://github.com/lint-staged/lint-staged) — Execução de linters e formatação em arquivos staged
  - [Prettier](https://prettier.io/) — Formatação consistente de código
  - [Commitlint](https://commitlint.js.org/) — Validação estrita do padrão **Conventional Commits**

---

## 📦 Como Executar o Projeto

### Pré-requisitos

- Node.js (versão 20 ou superior recomendada)
- Gerenciador de pacotes `npm`
- Backend da API em execução (porta padrão `3333`)

### Instalação

```bash
# Clone o repositório
git clone https://github.com/Valdeilson-lima/pizzaria-frontend.git

# Acesse o diretório
cd pizzaria-frontend

# Instale as dependências
npm install
```

### Executando em desenvolvimento

```bash
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000) no seu navegador para ver a aplicação.

### Scripts Disponíveis

| Script              | Descrição                                                                 |
| :------------------ | :------------------------------------------------------------------------ |
| `npm run dev`       | Inicia o servidor Next.js em modo de desenvolvimento                      |
| `npm run build`     | Compila o build de produção da aplicação                                  |
| `npm run start`     | Inicia a aplicação compilada em modo de produção                          |
| `npm run typecheck` | Executa a verificação estática de tipos com o TypeScript (`tsc --noEmit`) |

---

## 🤝 Padrão de Commits

Este repositório utiliza validação automática com **Commitlint** e **Husky**. Todos os commits devem seguir a convenção [Conventional Commits](https://www.conventionalcommits.org/):

```text
<tipo>(escopo opcional): <descrição concisa>
```

**Exemplos:**

- `feat: adicionar modal de detalhes do pedido`
- `fix: corrigir validação de número de mesa`
- `docs: atualizar documentação de endpoints`
- `style: ajustar espaçamento do cardápio`
- `refactor: modularizar chamadas à API de pedidos`
- `chore: atualizar dependências do projeto`

---

## 🔗 Repositórios Relacionados

- **Backend (API REST):** [Valdeilson-lima/pizzaria-backend](https://github.com/Valdeilson-lima/pizzaria-backend)
- **Guia de Endpoints:** Consulte o arquivo [`endpoints.md`](endpoints.md) para detalhes de todas as rotas e payloads da API.
