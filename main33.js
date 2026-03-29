import { db } from './firebase-config.js';
    import { 
      listarLivros, criarLivro, atualizarLivro, excluirLivro,
      buscarLivroPorId, registrarEmprestimo, registrarDevolucao 
    } from './database.js';

    // ===== ESTADO GLOBAL =====
    let todosLivros = [];
    let modoEdicao = false;

    // ===== INICIALIZAÇÃO =====
    window.carregarPagina = async () => {
      await carregarLivros();
      setupEventos();
    };

    // ===== EVENTOS =====
    function setupEventos() {
      // Formuário de livro
      document.getElementById('formLivro').addEventListener('submit', async (e) => {
        e.preventDefault();
        await salvarLivro();
      });

      // Empréstimo
      document.getElementById('formEmprestimo').addEventListener('submit', async (e) => {
        e.preventDefault();
        await confirmarEmprestimo();
      });

      // Busca externa (Enter)
      document.getElementById('buscaExterna').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') buscarLivroExterno();
      });
    }

    // ===== CARREGAR LIVROS =====
    async function carregarLivros() {
      const listaDiv = document.getElementById('listaLivros');
      listaDiv.innerHTML = '<div class="loading">Carregando...</div>';
      
      try {
        todosLivros = await listarLivros();
        renderizarLista(todosLivros);
      } catch (error) {
        listaDiv.innerHTML = '<p class="erro">Erro ao carregar livros.</p>';
        console.error(error);
      }
    }

    // ===== RENDERIZAR LISTA =====
    function renderizarLista(livros) {
      const listaDiv = document.getElementById('listaLivros');
      
      if (livros.length === 0) {
        listaDiv.innerHTML = '<p class="aviso">Nenhum livro cadastrado.</p>';
        return;
      }

      listaDiv.innerHTML = livros.map(livro => `
        <div class="livro-item" data-id="${livro.id}">
          ${livro.capa ? `<img src="${livro.capa}" alt="Capa" class="capa" onerror="this.style.display='none'">` : ''}
          <div class="livro-info">
            <h3>${escapeHtml(livro.titulo)}</h3>
            <p class="autor">${escapeHtml(livro.autor)} ${livro.ano ? `(${livro.ano})` : ''}</p>
            ${livro.descricao ? `<p class="descricao">${escapeHtml(livro.descricao)}</p>` : ''}
            <span class="status ${livro.disponivel ? 'disponivel' : 'emprestado'}">
              ${livro.disponivel ? '✓ Disponível' : '✗ Emprestado'}
            </span>
          </div>
          <div class="livro-acoes">
            ${livro.disponivel 
              ? `<button class="btn-acao btn-emprestar" onclick="window.abrirModalEmprestimo('${livro.id}', '${escapeHtml(livro.titulo)}')">📤</button>` 
              : `<button class="btn-acao btn-devolver" onclick="window.devolverLivro('${livro.id}')">↩️</button>`
            }
            <button class="btn-acao btn-editar" onclick="window.editarLivro('${livro.id}')">✏️</button>
            <button class="btn-acao btn-excluir" onclick="window.excluirLivro('${livro.id}')">🗑️</button>
          </div>
        </div>
      `).join('');
    }

    // ===== FILTRAR LIVROS =====
    window.filtrarLivros = () => {
      const texto = document.getElementById('filtroLista').value.toLowerCase();
      const status = document.getElementById('filtroStatus').value;
      
      const filtrados = todosLivros.filter(livro => {
        const matchTexto = livro.titulo.toLowerCase().includes(texto) || 
                          livro.autor.toLowerCase().includes(texto);
        const matchStatus = status === 'todos' || 
                          (status === 'disponivel' && livro.disponivel) ||
                          (status === 'emprestado' && !livro.disponivel);
        return matchTexto && matchStatus;
      });
      
      renderizarLista(filtrados);
    };

    // ===== SALVAR LIVRO (CRIAR/EDITAR) =====
    async function salvarLivro() {
      const id = document.getElementById('livroId').value;
      const dados = {
        titulo: document.getElementById('titulo').value.trim(),
        autor: document.getElementById('autor').value.trim(),
        ano: document.getElementById('ano').value ? Number(document.getElementById('ano').value) : null,
        paginas: document.getElementById('paginas').value ? Number(document.getElementById('paginas').value) : null,
        descricao: document.getElementById('descricao').value.trim() || null,
        capa: document.getElementById('capa').value.trim() || null
      };

      try {
        if (modoEdicao && id) {
          await atualizarLivro(id, dados);
          mostrarToast('✅ Livro atualizado!', 'success');
        } else {
          await criarLivro(dados);
          mostrarToast('✅ Livro cadastrado!', 'success');
        }
        
        limparFormulario();
        await carregarLivros();
      } catch (error) {
        console.error(error);
        mostrarToast('❌ Erro ao salvar livro', 'error');
      }
    }

    // ===== EDITAR LIVRO =====
    window.editarLivro = async (id) => {
      try {
        const livro = await buscarLivroPorId(id);
        if (!livro) return;

        modoEdicao = true;
        document.getElementById('formTitulo').textContent = '✏️ Editar Livro';
        document.getElementById('livroId').value = livro.id;
        document.getElementById('titulo').value = livro.titulo;
        document.getElementById('autor').value = livro.autor;
        document.getElementById('ano').value = livro.ano || '';
        document.getElementById('paginas').value = livro.paginas || '';
        document.getElementById('descricao').value = livro.descricao || '';
        document.getElementById('capa').value = livro.capa || '';

        window.scrollTo({ top: 0, behavior: 'smooth' });
        mostrarToast('📝 Modo edição ativado', 'info');
      } catch (error) {
        console.error(error);
        mostrarToast('❌ Erro ao carregar livro', 'error');
      }
    };

    // ===== EXCLUIR LIVRO =====
    window.excluirLivro = async (id) => {
      if (!confirm('Tem certeza que deseja excluir este livro?')) return;

      try {
        await excluirLivro(id);
        mostrarToast('🗑️ Livro excluído!', 'success');
        await carregarLivros();
      } catch (error) {
        console.error(error);
        mostrarToast('❌ Erro ao excluir livro', 'error');
      }
    };

    // ===== LIMPAR FORMULÁRIO =====
    window.limparFormulario = () => {
      modoEdicao = false;
      document.getElementById('formTitulo').textContent = '✏️ Cadastrar Livro';
      document.getElementById('formLivro').reset();
      document.getElementById('livroId').value = '';
    };

    // ===== BUSCAR LIVRO EXTERNO (Google Books API) =====
    window.buscarLivroExterno = async () => {
      const termo = document.getElementById('buscaExterna').value.trim();
      if (!termo) {
        mostrarToast('⚠️ Digite um termo para buscar', 'error');
        return;
      }

      const btn = event.target;
      btn.disabled = true;
      btn.textContent = 'Buscando...';

      try {
        const response = await fetch(
          `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(termo)}&maxResults=5&langRestrict=pt`
        );
        const data = await response.json();
        const resultados = data.items || [];

        if (resultados.length === 0) {
          document.getElementById('resultadosExternos').innerHTML = '<p>Nenhum livro encontrado.</p>';
          return;
        }

        document.getElementById('resultadosExternos').innerHTML = resultados.map(item => {
          const info = item.volumeInfo || {};
          const livro = {
            googleId: item.id,
            titulo: info.title || 'Sem título',
            autor: info.authors?.[0] || 'Autor desconhecido',
            descricao: info.description?.replace(/<[^>]*>/g, '').substring(0, 200) || 'Sem descrição',
            capa: info.imageLinks?.thumbnail || null,
            ano: info.publishedDate?.substring(0, 4) || null,
            paginas: info.pageCount || null
          };

          return `
            <div class="livro-item externo">
              ${livro.capa ? `<img src="${livro.capa}" alt="Capa" class="capa">` : ''}
              <div class="livro-info">
                <h3>${escapeHtml(livro.titulo)}</h3>
                <p class="autor">${escapeHtml(livro.autor)} ${livro.ano ? `(${livro.ano})` : ''}</p>
                <p class="descricao">${escapeHtml(livro.descricao)}...</p>
                ${livro.paginas ? `<small>📄 ${livro.paginas} páginas</small>` : ''}
              </div>
              <button class="btn-acao btn-salvar" onclick="window.salvarLivroExterno(${JSON.stringify(livro).replace(/"/g, '&quot;')})">💾</button>
            </div>
          `;
        }).join('');

      } catch (error) {
        console.error(error);
        document.getElementById('resultadosExternos').innerHTML = '<p class="erro">Erro na busca.</p>';
      } finally {
        btn.disabled = false;
        btn.textContent = 'Buscar';
      }
    };

    // ===== SALVAR LIVRO EXTERNO NO FIREBASE =====
    window.salvarLivroExterno = async (livro) => {
      if (!confirm(`Salvar "${livro.titulo}" na sua biblioteca?`)) return;

      try {
        await criarLivro({
          titulo: livro.titulo,
          autor: livro.autor,
          descricao: livro.descricao,
          ano: livro.ano ? Number(livro.ano) : null,
          paginas: livro.paginas || null,
          capa: livro.capa || null,
          googleId: livro.googleId || null,
          origem: 'google_books',
          disponivel: true
        });

        mostrarToast('✅ Livro salvo com sucesso!', 'success');
        document.getElementById('resultadosExternos').innerHTML = '';
        document.getElementById('buscaExterna').value = '';
        await carregarLivros();
      } catch (error) {
        console.error(error);
        mostrarToast('❌ Erro ao salvar livro', 'error');
      }
    };

    // ===== MODAL DE EMPRÉSTIMO =====
    window.abrirModalEmprestimo = (id, titulo) => {
      document.getElementById('modalLivroId').value = id;
      document.getElementById('modalLivroTitulo').textContent = titulo;
      document.getElementById('usuarioNome').value = '';
      document.getElementById('dataDevolucao').value = '';
      document.getElementById('modalEmprestimo').showModal();
    };

    window.fecharModal = () => {
      document.getElementById('modalEmprestimo').close();
    };

    async function confirmarEmprestimo() {
      const livroId = document.getElementById('modalLivroId').value;
      const usuario = document.getElementById('usuarioNome').value.trim();
      const dataDevolucao = document.getElementById('dataDevolucao').value || null;

      if (!usuario) {
        mostrarToast('⚠️ Nome do usuário é obrigatório', 'error');
        return;
      }

      try {
        await registrarEmprestimo(livroId, usuario, dataDevolucao);
        mostrarToast('✅ Empréstimo registrado!', 'success');
        fecharModal();
        await carregarLivros();
      } catch (error) {
        console.error(error);
        mostrarToast('❌ Erro ao registrar empréstimo', 'error');
      }
    }

    // ===== DEVOLVER LIVRO =====
    window.devolverLivro = async (livroId) => {
      if (!confirm('Confirmar devolução deste livro?')) return;

      try {
        await registrarDevolucao(livroId);
        mostrarToast('✅ Livro devolvido!', 'success');
        await carregarLivros();
      } catch (error) {
        console.error(error);
        mostrarToast('❌ Erro ao devolver livro', 'error');
      }
    };

    // ===== UTILITÁRIOS =====
    function escapeHtml(text) {
      if (!text) return '';
      const map = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' };
      return text.replace(/[&<>"']/g, m => map[m]);
    }

    function mostrarToast(mensagem, tipo = 'info') {
      const toast = document.getElementById('toast');
      toast.textContent = mensagem;
      toast.className = `toast ${tipo}`;
      toast.classList.remove('hidden');
      setTimeout(() => toast.classList.add('hidden'), 3000);
    }

    // Inicializar quando a página carregar
    document.addEventListener('DOMContentLoaded', window.carregarPagina);
