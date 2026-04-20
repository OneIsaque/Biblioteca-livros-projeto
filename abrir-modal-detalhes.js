import { buscarLivroPorId } from './database.js';

// ===== ABRIR MODAL DE DETALHES =====
window.abrirDetalhesLivro = async (id) => {
  try {
    const livro = await buscarLivroPorId(id);
    if (!livro) return;

    const modal = document.getElementById('modalDetalhes');
    const conteudo = document.getElementById('conteudoDetalhes');

    conteudo.innerHTML = `
      <div class="detalhes-livro">
        <div class="detalhes-capa">
          ${livro.capa 
            ? `<img src="${livro.capa}" alt="Capa de ${escapeHtml(livro.titulo)}">`
            : `<div style="width:200px;height:300px;background:#eee;border-radius:12px;display:flex;align-items:center;justify-content:center;color:#999;">Sem capa</div>`
          }
        </div>
        <div class="detalhes-info">
          <h2>${escapeHtml(livro.titulo)}</h2>
          <p class="detalhes-autor">${escapeHtml(livro.autor)}${livro.ano ? ` (${livro.ano})` : ''}</p>
          
          <div class="detalhes-meta">
            ${livro.paginas ? `<span class="meta-item">📄 ${livro.paginas} páginas</span>` : ''}
            ${livro.googleId ? `<span class="meta-item">🔍 Google Books</span>` : ''}
            ${livro.origem ? `<span class="meta-item">📥 ${livro.origem === 'google_books' ? 'Importado' : 'Cadastrado'}</span>` : ''}
            <span class="meta-item">📅 ${livro.criado_em ? new Date(livro.criado_em.seconds * 1000).toLocaleDateString('pt-BR') : 'N/A'}</span>
          </div>

          <div class="detalhes-status ${livro.disponivel ? 'disponivel' : 'emprestado'}">
            ${livro.disponivel ? '✓' : '✗'} ${livro.disponivel ? 'Disponível para empréstimo' : 'Emprestado'}
          </div>

          ${livro.descricao ? `
            <div class="detalhes-descricao">
              <h3>📖 Sinopse</h3>
              <p>${escapeHtml(livro.descricao)}</p>
            </div>
          ` : ''}

          <div class="detalhes-acoes">
            ${livro.disponivel 
              ? `<button class="btn-primary" onclick="window.fecharModalDetalhes(); window.abrirModalEmprestimo('${livro.id}', '${escapeHtml(livro.titulo)}')">📤 Emprestar</button>`
              : `<button class="btn-devolver" onclick="window.fecharModalDetalhes(); window.devolverLivro('${livro.id}')">↩️ Devolver</button>`
            }
            <button class="btn-secondary" onclick="window.fecharModalDetalhes(); window.editarLivro('${livro.id}')">✏️ Editar</button>
          </div>
        </div>
      </div>
    `;

    modal.showModal();
  } catch (error) {
    console.error('Erro ao carregar detalhes:', error);
    mostrarToast('❌ Erro ao carregar detalhes do livro', 'error');
  }
};

// ===== FECHAR MODAL DE DETALHES =====
window.fecharModalDetalhes = () => {
  document.getElementById('modalDetalhes').close();
};

// Funções utilitárias (precisam estar disponíveis)
function escapeHtml(text) {
  if (!text) return '';
  const map = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' };
  return text.replace(/[&<>"']/g, m => map[m]);
}

function mostrarToast(mensagem, tipo = 'info') {
  const toast = document.getElementById('toast');
  if (!toast) return;
  toast.textContent = mensagem;
  toast.className = `toast ${tipo}`;
  toast.classList.remove('hidden');
  setTimeout(() => toast.classList.add('hidden'), 3000);
}