// 1. Importaciones especiales para que funcione en el navegador (sin instalar nada)
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
// 2. AQUÍ PEGAS TUS LLAVES (Lo que ves en la pantalla de Firebase)
// Copia de la web SOLO lo que está dentro de las llaves { }
const firebaseConfig = {
  apiKey: "AIzaSyBeAi6n4gcZ0CN6TnJn81v43oguO4AoMFU",
  authDomain: "flor-gaming-store-92aae.firebaseapp.com",
  projectId: "flor-gaming-store-92aae",
  storageBucket: "flor-gaming-store-92aae.firebasestorage.app",
  messagingSenderId: "716963835999",
  appId: "1:716963835999:web:4a6ea599acbcb1ddb3abea"
};


// 3. Iniciamos la conexión
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
// 4. Exportamos para usarlo en el resto de la app

export { auth, db, collection, addDoc, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut };