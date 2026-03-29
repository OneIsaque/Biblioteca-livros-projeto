/**
 * Funções de Banco de Dados (CRUD)
 * Todas as operações com Firestore
 */

import { db } from './firebase-config.js';
import { 
  collection, addDoc, getDocs, getDoc, doc, 
  updateDoc, deleteDoc, query, orderBy, limit 
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

const COLECAO = 'livros';
const COLECAO_EMPRESTIMOS = 'emprestimos';

// ===== CREATE =====
export async function criarLivro(dados) {
  const livro = {
    ...dados,
    disponivel: true,
    criado_em: new Date(),
    atualizado_em: new Date()
  };
  
  const docRef = await addDoc(collection(db, COLECAO), livro);
  return docRef.id;
}

// ===== READ =====
export async function listarLivros(limite = 50) {
  const q = query(
    collection(db, COLECAO),
    orderBy('criado_em', 'desc'),
    limit(limite)
  );
  
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));
}

export async function buscarLivroPorId(id) {
  const docRef = doc(db, COLECAO, id);
  const docSnap = await getDoc(docRef);
  
  if (!docSnap.exists()) return null;
  return { id: docSnap.id, ...docSnap.data() };
}

// ===== UPDATE =====
export async function atualizarLivro(id, dados) {
  const docRef = doc(db, COLECAO, id);
  await updateDoc(docRef, {
    ...dados,
    atualizado_em: new Date()
  });
}

// ===== DELETE =====
export async function excluirLivro(id) {
  const docRef = doc(db, COLECAO, id);
  await deleteDoc(docRef);
}

// ===== EMPRÉSTIMOS =====
export async function registrarEmprestimo(livroId, usuario, dataDevolucao) {
  // 1. Verificar se livro está disponível
  const livro = await buscarLivroPorId(livroId);
  if (!livro) throw new Error('Livro não encontrado');
  if (!livro.disponivel) throw new Error('Livro já está emprestado');

  // 2. Criar registro de empréstimo
  await addDoc(collection(db, COLECAO_EMPRESTIMOS), {
    livro_id: livroId,
    livro_titulo: livro.titulo,
    usuario: usuario,
    data_retirada: new Date(),
    data_devolucao_prevista: dataDevolucao ? new Date(dataDevolucao) : null,
    data_devolucao_real: null,
    status: 'ativo'
  });

  // 3. Atualizar livro para indisponível
  await atualizarLivro(livroId, { disponivel: false });
}

export async function registrarDevolucao(livroId) {
  // 1. Buscar empréstimo ativo deste livro
  const q = query(
    collection(db, COLECAO_EMPRESTIMOS),
    orderBy('data_retirada', 'desc'),
    limit(1)
  );
  
  const snapshot = await getDocs(q);
  if (snapshot.empty) throw new Error('Nenhum empréstimo encontrado');

  // 2. Atualizar empréstimo mais recente
  const emprestimoDoc = snapshot.docs[0];
  await updateDoc(doc(db, COLECAO_EMPRESTIMOS, emprestimoDoc.id), {
    data_devolucao_real: new Date(),
    status: 'devolvido'
  });

  // 3. Liberar livro
  await atualizarLivro(livroId, { disponivel: true });
}