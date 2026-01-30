import { auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut } from './firebase.js';

// Elementos del DOM
const loginBtn = document.getElementById('login-btn');
const authModal = document.getElementById('auth-modal');
const closeAuth = document.querySelector('.close-auth');
const toggleText = document.querySelector('#toggle-auth span');
const authTitle = document.getElementById('auth-title');
const authSubmit = document.getElementById('auth-submit');
const authForm = document.getElementById('auth-form');

// Estado: ¿Estamos en Login o Registro?
let isLoginMode = true;

export function setupAuthListeners() {
    
    // --- 1. ABRIR Y CERRAR MODAL ---
    loginBtn.addEventListener('click', () => {
        // Si ya hay usuario, este botón sirve para CERRAR sesión
        if (auth.currentUser) {
            signOut(auth).then(() => {
                alert("Has cerrado sesión 👋");
            });
        } else {
            authModal.classList.remove('hidden');
        }
    });

    closeAuth.addEventListener('click', () => {
        authModal.classList.add('hidden');
    });

    // --- 2. CAMBIAR ENTRE LOGIN Y REGISTRO ---
    toggleText.addEventListener('click', () => {
        isLoginMode = !isLoginMode;
        if (isLoginMode) {
            authTitle.innerText = "Iniciar Sesión";
            authSubmit.innerText = "Entrar";
            toggleText.parentElement.innerHTML = "¿No tienes cuenta? <span id='new-toggle'>Regístrate aquí</span>";
        } else {
            authTitle.innerText = "Crear Cuenta";
            authSubmit.innerText = "Registrarse";
            toggleText.parentElement.innerHTML = "¿Ya tienes cuenta? <span id='new-toggle'>Inicia sesión</span>";
        }
        // Re-asignar el evento al nuevo span generado
        document.getElementById('new-toggle').addEventListener('click', () => toggleText.click());
    });

    // --- 3. ENVIAR EL FORMULARIO (La Magia) ---
    authForm.addEventListener('submit', async (e) => {
        e.preventDefault(); // Evita que la página se recargue

        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        try {
            if (isLoginMode) {
                // INICIAR SESIÓN
                await signInWithEmailAndPassword(auth, email, password);
                alert("¡Bienvenido de nuevo! 🎮");
            } else {
                // REGISTRARSE
                await createUserWithEmailAndPassword(auth, email, password);
                alert("¡Cuenta creada con éxito! 🚀");
            }
            // Si todo va bien, cerramos la ventana
            authModal.classList.add('hidden');
            authForm.reset(); // Limpiamos los campos

        } catch (error) {
            // Si algo falla (contraseña corta, email repetido...)
            console.error(error);
            alert("Error: " + error.message);
        }
    });

    // --- 4. OBSERVADOR (Vigilante del Estado) ---
    // Esta función se ejecuta sola cada vez que alguien entra o sale
    onAuthStateChanged(auth, (user) => {
        if (user) {
            // SI HAY USUARIO:
            loginBtn.innerText = "Cerrar Sesión";
            loginBtn.style.backgroundColor = "red"; // Visualmente distinto
            console.log("Usuario conectado:", user.email);
        } else {
            // SI NO HAY USUARIO:
            loginBtn.innerText = "👤 Login";
            loginBtn.style.backgroundColor = "#333";
            console.log("Nadie conectado");
        }
    });
}