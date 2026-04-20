/**
 * Configuração do Firebase
 * Substitua os valores pelos do seu projeto no Console do Firebase
 */

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";


const firebaseConfig = {
  apiKey: "AIzaSyDmSm0KD6bDL1sDFil5_nVhendJxYDiVF4",
  authDomain: "biblioteca-pij2.firebaseapp.com",
  projectId: "biblioteca-pij2",
  storageBucket: "biblioteca-pij2.firebasestorage.app",
  messagingSenderId: "870725844227",
  appId: "1:870725844227:web:d34c86f5759cedeafdfd36"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

console.log('✅ Firebase conectado!');