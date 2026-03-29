
# 📚 Biblioteca 3Lhivros - Sistema de Gerenciamento NoSQL

[![Firebase](https://img.shields.io/badge/Firebase-10.8.0-FFCA28?style=flat&logo=firebase)](https://firebase.google.com/)
[![Firestore](https://img.shields.io/badge/Firestore-NoSQL-4285F4?style=flat)](https://firebase.google.com/products/firestore)
[![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-F7DF1E?style=flat&logo=javascript)](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript)

Sistema de gerenciamento de biblioteca desenvolvido com **Firebase Firestore** (banco de dados NoSQL) e **JavaScript**.  Além de que esse é um trabalho acadêmico efetuado em parceria com estudantes.

---

## 🎯 Funcionalidades

| Funcionalidade | Descrição |
|----------------|-----------|
| ➕ **Cadastrar** | Adicionar livros manualmente ao acervo |
| ✏️ **Editar** | Alterar dados de livros existentes |
| 🗑️ **Excluir** | Remover livros do banco de dados |
| 👁️ **Visualizar** | Listar todos os livros com filtros e busca |
| 🔍 **Buscar Externo** | Integrar com Google Books API para importar metadados |
| 📤 **Emprestar** | Registrar empréstimos com nome do usuário |
| ↩️ **Devolver** | Registrar devolução e liberar o livro |
| 🎨 **Responsivo** | Interface adaptada para mobile e desktop |

---

## 🛠️ Tecnologias Utilizadas

```
Frontend:
├── HTML5
├── CSS3 (Flexbox/Grid)
├── JavaScript ES6+ (Módulos)
└── Firebase SDK v10.8.0

Backend:
├── Firebase Firestore (NoSQL)
├── Firebase Authentication (opcional)
└── Google Books API (integração externa)

Ferramentas:
├── VS Code
├── Live Server (extensão)
└── Git/GitHub
```

---

## 📁 Estrutura do Projeto

```
biblioteca-firebase/
├── index.html           # Interface principal
├── main33.js            # Lógica da aplicação
├── database.js          # Funções CRUD do Firestore
├── firebase-config.js   # Configuração do Firebase
├── style.css            # Estilização
└── README.md            # Esta documentação
```

---

## 🚀 Como Rodar o Projeto

### Pré-requisitos

- [Node.js](https://nodejs.org/) (v18+)
- [VS Code](https://code.visualstudio.com/)
- Extensão **Live Server** no VS Code
- Conta Google com acesso ao [Firebase Console](https://console.firebase.google.com/) (não o brigatório)

### Passo a Passo

#### 1️⃣ Clonar o Repositório

```bash
git clone https://github.com/SEU_USUARIO/biblioteca-firebase.git
cd biblioteca-firebase
```

#### 2️⃣ Configurar o Firebase

1. Acesse [Firebase Console](https://console.firebase.google.com/)
2. Clique em **"Adicionar projeto"** → Dê um nome (ex: `biblioteca-pij2`)
3. Em **"Criação"** → **Firestore Database** → **Criar banco de dados**
4. Escolha **modo de teste** (para desenvolvimento)
5. Selecione localização: `southamerica-east1` (São Paulo)
6. Em **"Visão Geral"** → Ícone **Web (</>)** → Registre o app
7. Copie as credenciais do `firebaseConfig`

#### 3️⃣ Atualizar Configuração

Abra o arquivo `firebase-config.js` e substitua:

```javascript
const firebaseConfig = {
  apiKey: "SUA_API_KEY_AQUI",
  authDomain: "SEU_PROJETO.firebaseapp.com",
  projectId: "SEU_PROJECT_ID",
  storageBucket: "SEU_PROJETO.appspot.com",
  messagingSenderId: "SEU_SENDER_ID",
  appId: "SEU_APP_ID"
};
```

#### 4️⃣ Configurar Regras do Firestore

No Console Firebase → Firestore → **Regras**:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true;  // ⚠️ Apenas para desenvolvimento!
    }
  }
}
```

Clique em **Publicar**.

#### 5️⃣ Rodar Localmente

1. Abra o projeto no **VS Code**
2. Instale a extensão **Live Server** (se ainda não tiver)
3. Clique com botão direito em `index.html`
4. Selecione **"Open with Live Server"**
5. Acesse: `http://127.0.0.1:5500`

---

## 📖 Como Usar

### Cadastro de Livro

1. Preencha o formulário com **Título** e **Autor** (obrigatórios)
2. Opcional: Ano, Páginas, Descrição, URL da Capa
3. Clique em **💾 Salvar**

### Busca Externa (Google Books)

1. Digite o nome do livro na busca externa
2. Clique em **Buscar**
3. Visualize os resultados com capa, descrição e metadados
4. Clique em **💾** para salvar na sua biblioteca

### Empréstimo

1. Na lista de livros, clique em **📤** no livro disponível
2. Preencha o **Nome do Usuário**
3. Opcional: Data de devolução prevista
4. Clique em **Confirmar**

### Devolução

1. No livro emprestado, clique em **↩️**
2. Confirme a devolução
3. O livro volta a ficar disponível

### Filtros e Busca

- Use o campo **Filtrar** para buscar por título ou autor
- Use o dropdown para filtrar por **Disponíveis** ou **Emprestados**

---

## 🗄️ Modelagem do Banco de Dados

### Coleção: `livros`

```javascript
{
  titulo: string,           // "Os Miseráveis"
  autor: string,            // "Victor Hugo"
  ano: number | null,       // 1862
  paginas: number | null,   // 1232
  descricao: string | null, // Descrição do livro
  capa: string | null,      // URL da imagem
  googleId: string | null,  // ID da Google Books
  origem: string,           // "manual" | "google_books"
  disponivel: boolean,      // true/false
  criado_em: timestamp,
  atualizado_em: timestamp
}
```

### Coleção: `emprestimos`

```javascript
{
  livro_id: string,         // ID do livro
  livro_titulo: string,     // Cópia do título (desnormalização)
  usuario: string,          // Nome do usuário
  data_retirada: timestamp,
  data_devolucao_prevista: timestamp | null,
  data_devolucao_real: timestamp | null,
  status: string            // "ativo" | "devolvido"
}
```

> 💡 **Nota NoSQL**: Usamos **desnormalização** copiando `livro_titulo` em `emprestimos` para evitar consultas múltiplas (JOINs não existem em NoSQL).

---


## 📝 Principais Funções

### `database.js`

| Função | Descrição | Parâmetros |
|--------|-----------|------------|
| `criarLivro(dados)` | Adiciona novo livro | `dados: Object` |
| `listarLivros(limite)` | Lista todos os livros | `limite: Number` |
| `buscarLivroPorId(id)` | Busca livro por ID | `id: String` |
| `atualizarLivro(id, dados)` | Atualiza livro | `id: String, dados: Object` |
| `excluirLivro(id)` | Exclui livro | `id: String` |
| `registrarEmprestimo(id, usuario, data)` | Registra empréstimo | `id, usuario, data` |
| `registrarDevolucao(id)` | Registra devolução | `id: String` |

### `main33.js`

| Função | Descrição |
|--------|-----------|
| `carregarPagina()` | Inicializa a aplicação |
| `salvarLivro()` | Cria ou edita livro |
| `buscarLivroExterno()` | Busca na Google Books API |
| `renderizarLista(livros)` | Renderiza lista na tela |
| `filtrarLivros()` | Aplica filtros de busca |
| `abrirModalEmprestimo(id, titulo)` | Abre modal de empréstimo |
| `mostrarToast(mensagem, tipo)` | Exibe notificação |

---

## 🔒 Segurança

### ⚠️ Modo Desenvolvimento

As regras atuais permitem **leitura e escrita pública**:

```javascript
allow read, write: if true;
```

### ✅ Modo Produção (Recomendado)

Para produção, implemente autenticação:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /livros/{documento=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    match /emprestimos/{documento=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```
---
### 🆙Possíveis atualizações futuras
- 🔌 **Integração com Google Books API** - para buscar e armazenar dados externos no Banco.


---

## 🐛 Solução de Problemas

| Erro | Causa | Solução |
|------|-------|---------|
| `Erro ao salvar livro` | Regras do Firestore | Publique regras com `allow read, write: if true` |
| `Invalid glob match expression` | Erro nas regras | Use apenas `{document=**}` (um glob por vez) |
| `Firebase not initialized` | Config incorreta | Verifique `firebase-config.js` com dados reais |
| `Failed to fetch` | CORS/Internet | Use Live Server, verifique conexão |
| `Query requires an index` | Falta índice | Clique no link do erro para criar índice |

---

## 🤝 Contribuindo

1. Faça um **Fork** do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/MinhaFeature`)
3. Commit suas mudanças (`git commit -m 'feat: adiciona minha feature'`)
4. Push para a branch (`git push origin feature/MinhaFeature`)
5. Abra um **Pull Request**

### Convenção de Commits

```
feat: Nova funcionalidade
fix: Correção de bug
docs: Alteração em documentação
style: Formatação de código
refactor: Refatoração
test: Adição de testes
chore: Tarefas de manutenção
```

---

## 📄 Licença

Este projeto está sob a licença **MIT**. Sinta-se livre para usar, modificar e distribuir.

```
MIT License

Copyright (c) 2024

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.
```

---

## 👨‍ Autores

- Jardel Xavier -> ([@Jardel187](https://github.com/Jardel187))
- Isaque João  -> ([@OneIsaque](https://github.com/OneIsaque))
- Jonas Thiago -> ([@jonas-thiago](https://github.com/jonas-thiago))
- Elias Pierry -> ([@eliaspierry21](https://github.com/eliaspierry21))

---

Desenvolvido como projeto de aprendizado em **Bancos de Dados NoSQL** com Firebase.

- **Tecnologia**: Firebase Firestore
- **Linguagem**: JavaScript ES6+
- **Ano**: 2026

---

## 📚 Recursos Adicionais

- [Documentação do Firebase](https://firebase.google.com/docs)
- [Firestore Data Modeling](https://firebase.google.com/docs/firestore/manage-data/structure-data)
- [Google Books API](https://developers.google.com/books/docs/v1/using)
- [MDN Web Docs](https://developer.mozilla.org/pt-BR/)

---

<div align="center">


[⬆ Voltar ao topo](#-biblioteca-firebase---sistema-de-gerenciamento-nosql)

</div>
