import { initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';

// Import Firebase configuration from config.js
import { firebaseConfig } from './config.js';

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Get form and input elements
const loginForm = document.getElementById('loginForm');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const errorMessage = document.getElementById('errorMessage'); // Assuming you have an element with id 'errorMessage' in your HTML to display errors

// Add event listener for form submission
loginForm.addEventListener('submit', (e) => {
    e.preventDefault(); // Prevent default form submission

    const email = emailInput.value;
    const password = passwordInput.value;

    signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            // Signed in
            const user = userCredential.user;
            console.log('User signed in:', user);
            // Redirect or update UI as needed
            // window.location.href = '/dashboard.html'; // Example redirect
        })
        .catch((error) => {
            const errorCode = error.code;
            const message = error.message;
            console.error('Login error:', errorCode, message);
            // Display error message to the user
            if (errorMessage) {
                switch (errorCode) {
                    case 'auth/invalid-email':
                        errorMessage.textContent = 'El formato del correo electrónico no es válido.';
                        break;
                    case 'auth/user-disabled':
                        errorMessage.textContent = 'Este usuario ha sido deshabilitado.';
                        break;
                    case 'auth/user-not-found':
                    case 'auth/wrong-password':
                        errorMessage.textContent = 'Correo electrónico o contraseña incorrectos.';
                        break;
                    case 'auth/invalid-credential':
                         errorMessage.textContent = 'Credenciales inválidas. Verifica tu correo y contraseña.';
                         break;
                    default:
                        errorMessage.textContent = 'Error al iniciar sesión. Por favor, inténtalo de nuevo.';
                        break;
                }
                errorMessage.style.display = 'block'; // Show the error message element
            }
        });
});

// Optional: Hide error message when user starts typing
emailInput.addEventListener('input', () => {
    if (errorMessage) {
        errorMessage.style.display = 'none';
    }
});

passwordInput.addEventListener('input', () => {
    if (errorMessage) {
        errorMessage.style.display = 'none';
    }
});