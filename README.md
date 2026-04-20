#  Biblioteca Firebase - Sistema de Gerenciamento NoSQL

![Versão](https://img.shields.io/badge/Versão-1.1.0-green?style=flat)
![Firebase](https://img.shields.io/badge/Firebase-10.8.0-FFCA28?style=flat&logo=firebase)
![Firestore](https://img.shields.io/badge/Firestore-NoSQL-4285F4?style=flat)
![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-F7DF1E?style=flat&logo=javascript)
![Google Books](https://img.shields.io/badge/Google_Books_API-External-4285F4?style=flat)

Sistema completo de gerenciamento de biblioteca desenvolvido com **Firebase Firestore** (banco de dados NoSQL) e **JavaScript ES6+**. Projetado como trabalho acadêmico em parceria com estudantes, foca em boas práticas de segurança, integração com APIs externas, modularização e interface responsiva.

---

## 🎯 Funcionalidades

| Ícone | Funcionalidade | Descrição |
|:---:|---|---|
|  | Cadastrar | Adicionar livros manualmente ao acervo |
| ✏️ | Editar | Alterar dados de livros existentes |
| 🗑️ | Excluir | Remover livros do banco de dados |
| 👁️ | Visualizar Detalhes | Modal interativo com sinopse, metadados e status |
| 🔍 | Busca Externa | Integração segura com Google Books API |
|  | Importar | Salvar livros encontrados diretamente no Firestore |
| 📤 | Emprestar | Registrar empréstimos com nome do usuário e previsão |
| ↩️ | Devolver | Liberar livro e atualizar status automaticamente |
| 🔎 | Filtros & Busca | Pesquisa por título/autor e filtro por disponibilidade |
| 📱 | Responsivo | Interface adaptada para desktop, tablet e mobile |
| 🔒 | Configuração Segura | Variáveis sensíveis isoladas via `.env` e `.gitignore` |

---

## 🛠️ Tecnologias Utilizadas

**Frontend:**
- HTML5 Semântico
- CSS3 (Flexbox, Grid, Variáveis, Media Queries)
- JavaScript ES6+ (Módulos, Async/Await, DOM Manipulation)
- Firebase SDK v10.8.0

**Backend & Serviços:**
- Firebase Firestore (NoSQL)
- Google Books API (Integração externa)
- Local Storage (Fallback/Estado temporário)

**Ferramentas:**
- VS Code + Live Server
- Git & GitHub
- Google Cloud Console (API Keys & Restrições)

---

##  Estrutura do Projeto

```
biblioteca-firebase/
├── 📄 index.html              # Interface principal
├──  style.css               # Estilização base e responsiva
├──  modal-detalhes.css      # Estilos do modal de detalhes
├──  main33.js               # Lógica principal e controle de UI
├── ️ database.js             # Funções CRUD do Firestore
├── 🔥 firebase-config.js      # Inicialização do Firebase (gitignored)
├── 🔑 google-config.js        # Chave da Google Books API (gitignored)
├── 📜 .env.example            # Template de variáveis de ambiente
├── 📜 .gitignore              # Arquivos sensíveis e temporários
└── 📖 README.md               # Documentação do projeto
```

---

## 🚀 Como Rodar o Projeto

### ✅ Pré-requisitos
- [Node.js](https://nodejs.org/) (v18+) ou extensão **Live Server** no VS Code
- Conta Google com acesso ao [Firebase Console](https://console.firebase.google.com/)
- Projeto ativo no [Google Cloud Console](https://console.cloud.google.com/)

### 📦 Passo a Passo

1. **Clone o repositório**
   ```bash
   git clone https://github.com/SEU_USUARIO/biblioteca-firebase.git
   cd biblioteca-firebase
   ```

2. **Configure as variáveis de ambiente**
   ```bash
   cp .env.example .env
   ```
   Preencha o `.env` com suas credenciais reais.

3. **Prepare os arquivos de configuração**
   Crie `firebase-config.js` e `google-config.js` na raiz com suas chaves.  
   ⚠️ **Importante:** Estes arquivos já estão no `.gitignore` e **nunca devem ser commitados**.

4. **Configurar o Firebase**
   - Acesse [Firebase Console](https://console.firebase.google.com/) → Criar projeto
   - Ative **Firestore Database** (modo teste para desenvolvimento)
   - Registre um app Web (`</>`) e copie o `firebaseConfig`
   - Cole as credenciais em `firebase-config.js`

5. **Configurar Google Books API**
   - Acesse [Google Cloud Console](https://console.cloud.google.com/)
   - Ative a **Google Books API**
   - Crie uma **API Key** e restrinja por:
     - `HTTP Referrers`: `http://localhost:*`, `http://127.0.0.1:*`, `https://seu-dominio.com/*`
     - `API Restrictions`: Apenas `Google Books API`
   - Cole a chave em `google-config.js`

6. **Publicar Regras do Firestore**
   No Console Firebase → Firestore → Regras:
   ```javascript
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       match /{document=**} {
         allow read, write: if true;  // 🔒 Alterar para autenticação em produção
       }
     }
   }
   ```

7. **Rodar Localmente**
   - Abra no VS Code
   - Clique com botão direito em `index.html` → `Open with Live Server`
   - Acesse: `http://127.0.0.1:5500`

---

## 📖 Como Usar

| Ação | Instruções |
|:---|:---|
| 📚 **Cadastrar** | Preencha título e autor. Campos opcionais: ano, páginas, descrição, capa. Clique em `💾 Salvar`. |
| 🔍 **Buscar Externo** | Digite o nome no campo superior → `Buscar`. Clique em `💾` para importar. |
| 👁️ **Ver Detalhes** | Clique no **título** de qualquer livro na lista. O modal abre com sinopse, metadados e ações. |
| 📤 **Emprestar** | No modal ou na lista, clique em `📤`. Preencha o nome do usuário e confirme. |
| ↩️ **Devolver** | Clique em `↩️` no livro emprestado. O status volta para disponível automaticamente. |
| 🔎 **Filtrar** | Use o campo de busca ou o dropdown `Todos / Disponíveis / Emprestados`. |

---

## 🗄️ Modelagem do Banco de Dados (NoSQL)

### Coleção: `livros`
```json
{
  "titulo": "string",
  "autor": "string",
  "ano": "number | null",
  "paginas": "number | null",
  "descricao": "string | null",
  "capa": "string | null",
  "googleId": "string | null",
  "origem": "string ('manual' | 'google_books')",
  "disponivel": "boolean",
  "criado_em": "timestamp",
  "atualizado_em": "timestamp"
}
```

### Coleção: `emprestimos`
```json
{
  "livro_id": "string",
  "livro_titulo": "string", // Desnormalização para evitar JOINs
  "usuario": "string",
  "data_retirada": "timestamp",
  "data_devolucao_prevista": "timestamp | null",
  "data_devolucao_real": "timestamp | null",
  "status": "string ('ativo' | 'devolvido')"
}
```
💡 **Nota NoSQL:** A desnormalização de `livro_titulo` em `emprestimos` otimiza consultas, já que o Firestore não suporta JOINs relacionais.

---

## 🔒 Segurança & Boas Práticas

| Prática | Descrição |
|:---|:---|
| 🔑 **API Keys Isoladas** | Chaves Firebase e Google Books armazenadas em arquivos `.gitignore` |
|  **Restrições no Cloud** | API Key limitada por HTTP Referrer e apenas para Books API |
| 📜 **Firestore Rules** | Modo teste para dev; regras com `request.auth` para produção |
| 🧹 **Sanitização** | `escapeHtml()` em todas as renderizações para prevenir XSS |
| 📦 **ES Modules** | Importação explícita evita vazamento de escopo global |

️ **Para Produção:**  
- Ative Firebase Authentication
- Substitua `allow read, write: if true` por regras baseadas em `request.auth`
- Use um backend proxy ou Vite/Webpack para esconder chaves em variáveis de ambiente compiladas

---

## 🐛 Solução de Problemas

| Erro | Causa Provável | Solução |
|:---|:---|:---|
| `Failed to fetch` / CORS | Executando direto do arquivo | Use Live Server ou `npx serve` |
| `API_KEY_INVALID` ou `403` | Chave não configurada ou sem restrições | Verifique `google-config.js` e restrições no Cloud Console |
| `Firebase not initialized` | Config incorreta ou arquivo gitignored | Confirme se `firebase-config.js` existe localmente |
| Modal não abre | CSS não importado ou JS com erro | Verifique `modal-detalhes.css` e console (F12) |
| Query requires an index | Falta índice composto no Firestore | Clique no link do erro no console para criar automaticamente |

---

## 🤝 Contribuindo

1. Faça um **Fork** do projeto
2. Crie uma branch para sua feature:  
   `git checkout -b feature/MinhaFeature`
3. Commit suas mudanças:  
   `git commit -m 'feat: adiciona minha feature'`
4. Push para a branch:  
   `git push origin feature/MinhaFeature`
5. Abra um **Pull Request**

### 📝 Convenção de Commits
| Tipo | Descrição |
|:---|:---|
| `feat:` | Nova funcionalidade |
| `fix:` | Correção de bug |
| `docs:` | Alteração em documentação |
| `style:` | Formatação de código (sem lógica) |
| `refactor:` | Refatoração sem alteração de comportamento |
| `test:` | Adição ou correção de testes |
| `chore:` | Tarefas de manutenção (deps, config) |

---

## 📄 Licença

Este projeto está sob a licença **MIT**. Sinta-se livre para usar, modificar e distribuir.

```text
MIT License
Copyright (c) 2024-2026
Permission is hereby granted, free of charge, to any person obtaining a copy...
```

---

## 👨‍💻 Autores

| Nome | GitHub |
|:---|:---|
| Jardel Xavier | [@Jardel187](https://github.com/Jardel187) |
| Isaque João | [@OneIsaque](https://github.com/OneIsaque) |
| Jonas Thiago | [@jonas-thiago](https://github.com/jonas-thiago) |
| Elias Pierry | [@eliaspierry21](https://github.com/eliaspierry21) |
| Heloysa Renata | [@Heloysasz](https://github.com/Heloysasz) |

 *Desenvolvido como projeto de aprendizado em Bancos de Dados NoSQL com Firebase.*  
📅 **Tecnologia:** Firebase Firestore | **Linguagem:** JavaScript ES6+ | **Ano:** 2026

---

## 📚 Recursos Adicionais
- [Documentação do Firebase](https://firebase.google.com/docs)
- [Firestore Data Modeling](https://firebase.google.com/docs/firestore/manage-data/structure-data)
- [Google Books API Reference](https://developers.google.com/books/docs/v1/using)
- [MDN Web Docs - ES6 Modules](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Guide/Modules)

---

## 📦 Changelog (Histórico de Versões)

### v1.1.0 (Atual)
> 🚀 **Melhorias de UX, Integração com API Externa e Segurança**

**✨ Novas Funcionalidades:**
*   **Modal de Detalhes:** Visualização completa do livro ao clicar no título (sinopse, metadados e status).
*   **Google Books API:** Busca externa de livros com opção de importação rápida para o acervo.

**🎨 UX/UI:**
*   Interface do modal responsiva para mobile e desktop.
*   Indicadores visuais de hover nos títulos da lista de livros.

**🛡️ Segurança e DevEx:**
*   Implementação de `.gitignore` para proteger chaves de API e credenciais do Firebase.
*   Estrutura de variáveis de ambiente (`.env.example`) para fácil configuração em novas máquinas.
*   Documentação atualizada com instruções de segurança e RESTRIÇÕES de API Key.

---

### v1.0.0 (Lançamento Inicial)
*   CRUD completo de Livros e Empréstimos.
*   Integração com Firebase Firestore.
*   Filtros e busca básica.


[⬆ Voltar ao topo](#-biblioteca-firebase---sistema-de-gerenciamento-nosql)

