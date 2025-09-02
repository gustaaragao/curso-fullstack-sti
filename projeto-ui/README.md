# Todo App Frontend

Este é o frontend do aplicativo Todo, construído com Next.js, TypeScript e Tailwind CSS para consumir a API FastAPI.

## Tecnologias Utilizadas

- **Next.js 15** - Framework React com App Router
- **TypeScript** - Tipagem estática para JavaScript
- **Tailwind CSS** - Framework CSS utilitário
- **React Context** - Gerenciamento de estado para autenticação

## Funcionalidades

- 🔐 **Autenticação de usuários** (login/registro)
- ✅ **CRUD completo de todos** (criar, ler, atualizar, deletar)
- 🔍 **Filtros de todos** por título e estado
- 👥 **Visualização de usuários** cadastrados
- 🎨 **Interface responsiva** com Tailwind CSS
- 🔄 **Estados de todo** (draft, todo, doing, done, trash)

## Como executar

### Pré-requisitos

- Node.js 18+
- npm ou yarn
- API FastAPI rodando em `http://localhost:8000`

### Instalação

1. Instale as dependências:
```bash
npm install
```

2. Configure as variáveis de ambiente:
```bash
cp .env.local.example .env.local
```

3. Execute o servidor de desenvolvimento:
```bash
npm run dev
```

4. Acesse http://localhost:3000

## Estrutura do Projeto

```
src/
├── app/                    # App Router pages
│   ├── login/             # Página de login
│   ├── register/          # Página de registro
│   ├── todos/             # Página de gerenciamento de todos
│   ├── users/             # Página de visualização de usuários
│   ├── layout.tsx         # Layout global
│   └── page.tsx           # Página inicial
├── components/            # Componentes reutilizáveis
│   └── Navbar.tsx         # Barra de navegação
├── contexts/              # Contextos React
│   └── AuthContext.tsx    # Contexto de autenticação
├── lib/                   # Utilitários e configurações
│   └── api.ts             # Cliente API
└── types/                 # Definições de tipos TypeScript
    └── api.ts             # Tipos da API
```

## API Endpoints Consumidos

### Autenticação
- `POST /auth/token` - Login
- `POST /auth/refresh_token` - Refresh token

### Usuários
- `POST /users/` - Criar usuário
- `GET /users/all` - Listar todos os usuários
- `GET /users/` - Listar usuários (paginado)
- `PUT /users/{user_id}` - Atualizar usuário
- `DELETE /users/{user_id}` - Deletar usuário

### Todos
- `POST /todos/` - Criar todo
- `GET /todos/` - Listar todos (com filtros)
- `PATCH /todos/{todo_id}` - Atualizar todo
- `DELETE /todos/{todo_id}` - Deletar todo

## Scripts Disponíveis

- `npm run dev` - Executar em modo desenvolvimento
- `npm run build` - Build para produção
- `npm run start` - Executar build de produção
- `npm run lint` - Executar linter
- `npm run lint:fix` - Corrigir problemas de lint automaticamente

## Configuração da API

A URL base da API pode ser configurada através da variável de ambiente:

```
NEXT_PUBLIC_API_URL=http://localhost:8000
```

## Autenticação

O sistema utiliza JWT (JSON Web Tokens) para autenticação:

1. **Login**: O usuário fornece email e senha
2. **Token**: A API retorna um access token JWT
3. **Armazenamento**: O token é armazenado no localStorage
4. **Requisições**: O token é enviado no header Authorization
5. **Logout**: O token é removido do localStorage

## Estados dos Todos

Os todos podem ter os seguintes estados:

- **draft** - Rascunho
- **todo** - A fazer
- **doing** - Fazendo
- **done** - Concluído
- **trash** - Lixeira

## Próximas Funcionalidades

- [ ] Paginação de todos
- [ ] Busca avançada
- [ ] Notificações toast
- [ ] Modo escuro
- [ ] Testes unitários
- [ ] PWA (Progressive Web App)
