// Configuración de Firebase
const firebaseConfig = {
    apiKey: "AIzaSyCgT1jWF9JzLrfj15ed4_wZrJOKLmL3vJ8",
    authDomain: "empresa-ai.firebaseapp.com",
    projectId: "empresa-ai",
    storageBucket: "empresa-ai.appspot.com",
    messagingSenderId: "525047010078",
    appId: "1:525047010078:web:f8f5414def9b0701e26f0f",
    measurementId: "G-TKKJK5MBYL"
};

// Inicializa Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

document.addEventListener('DOMContentLoaded', function() {
    // Tabs
    const tabLogin = document.getElementById('tab-login');
    const tabRegister = document.getElementById('tab-register');
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    const errorDiv = document.getElementById('login-error');

    // Animación de transición entre formularios
    function animateFormSwitch(showForm, hideForm) {
        hideForm.classList.add('opacity-0');
        setTimeout(() => {
            hideForm.classList.add('hidden');
            showForm.classList.remove('hidden');
            showForm.classList.add('opacity-0');
            setTimeout(() => {
                showForm.classList.remove('opacity-0');
            }, 10);
        }, 200);
    }

    function showLogin() {
        tabLogin.classList.add('bg-indigo-600', 'text-white');
        tabLogin.classList.remove('bg-gray-200', 'text-indigo-700');
        tabRegister.classList.remove('bg-indigo-600', 'text-white');
        tabRegister.classList.add('bg-gray-200', 'text-indigo-700');
        animateFormSwitch(loginForm, registerForm);
        errorDiv.textContent = '';
    }
    function showRegister() {
        tabRegister.classList.add('bg-indigo-600', 'text-white');
        tabRegister.classList.remove('bg-gray-200', 'text-indigo-700');
        tabLogin.classList.remove('bg-indigo-600', 'text-white');
        tabLogin.classList.add('bg-gray-200', 'text-indigo-700');
        animateFormSwitch(registerForm, loginForm);
        errorDiv.textContent = '';
    }

    tabLogin.onclick = showLogin;
    tabRegister.onclick = showRegister;

    // Login
    loginForm.onsubmit = async (e) => {
        e.preventDefault();
        errorDiv.textContent = '';
        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;
        try {
            const result = await auth.signInWithEmailAndPassword(email, password);
            const user = result.user;
            // Verificar si el usuario ya tiene datos adicionales en Firestore
            const userDoc = await db.collection('users').doc(user.uid).get();
            if (!userDoc.exists || !userDoc.data().name || !userDoc.data().company) {
                mostrarModalGoogleExtra(user.uid);
            } else {
                window.location.replace('index.html');
            }
        } catch (err) {
            errorDiv.textContent = err.message;
        }
    };

    // Registro
    registerForm.onsubmit = async (e) => {
        e.preventDefault();
        errorDiv.textContent = '';
        const email = document.getElementById('register-email').value;
        const password = document.getElementById('register-password').value;
        const password2 = document.getElementById('register-password2').value;
        const nombre = document.getElementById('register-name').value;
        const empresa = document.getElementById('register-company').value;
        if (password !== password2) {
            errorDiv.textContent = 'Las contraseñas no coinciden.';
            return;
        }
        try {
            const result = await auth.createUserWithEmailAndPassword(email, password);
            const user = result.user;
            // Guardar nombre y empresa en Firestore
            await db.collection('users').doc(user.uid).set({ name: nombre, company: empresa }, { merge: true });
            errorDiv.innerHTML = '<span class="text-green-600">✅ Registro exitoso, redirigiendo...</span>';
            setTimeout(() => {
                window.location.replace('index.html');
            }, 1200);
        } catch (err) {
            errorDiv.textContent = err.message;
        }
    };

    // Google
    document.getElementById('google-btn').onclick = async () => {
        errorDiv.textContent = '';
        const provider = new firebase.auth.GoogleAuthProvider();
        try {
            const result = await auth.signInWithPopup(provider);
            const user = result.user;
            // Verificar si el usuario ya tiene datos adicionales en Firestore
            const userDoc = await db.collection('users').doc(user.uid).get();
            if (!userDoc.exists || !userDoc.data().name || !userDoc.data().company) {
                // Mostrar modal para pedir datos adicionales
                mostrarModalGoogleExtra(user.uid);
            } else {
                window.location.replace('index.html');
            }
        } catch (err) {
            errorDiv.textContent = err.message;
        }
    };

    // Función para mostrar el modal y guardar datos adicionales
    function mostrarModalGoogleExtra(uid) {
        const modal = document.getElementById('google-extra-modal');
        modal.classList.remove('hidden');
        const form = document.getElementById('google-extra-form');
        form.onsubmit = async (e) => {
            e.preventDefault();
            const name = document.getElementById('google-extra-name').value;
            const company = document.getElementById('google-extra-company').value;
            try {
                await db.collection('users').doc(uid).set({ name, company }, { merge: true });
                modal.classList.add('hidden');
                window.location.replace('index.html');
            } catch (err) {
                alert('Error al guardar los datos: ' + err.message);
            }
        };
    }

    // Mostrar el formulario correcto según el hash
    function updateFormByHash() {
        if (window.location.hash === '#register') {
            showRegister();
        } else {
            showLogin();
        }
    }
    window.addEventListener('hashchange', updateFormByHash);
    updateFormByHash();

    // Enlaces para alternar entre login y registro
    document.getElementById('link-to-register').onclick = (e) => {
        e.preventDefault();
        window.location.hash = '#register';
    };
    document.getElementById('link-to-login').onclick = (e) => {
        e.preventDefault();
        window.location.hash = '';
    };
});