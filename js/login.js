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
        
        // Mostrar indicador de carga
        errorDiv.innerHTML = '<span class="text-blue-600">⏳ Creando cuenta...</span>';
        
        try {
            // Crear el usuario primero
            const result = await auth.createUserWithEmailAndPassword(email, password);
            const user = result.user;
            
            // Mostrar progreso
            errorDiv.innerHTML = '<span class="text-blue-600">⏳ Guardando información del perfil...</span>';
            
            // Guardar datos en Firestore con manejo de errores mejorado
            try {
                const userData = {
                    name: nombre,
                    company: empresa,
                    email: email,
                    createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                    lastLogin: firebase.firestore.FieldValue.serverTimestamp()
                };
                
                await db.collection('users').doc(user.uid).set(userData);
                
                // Éxito completo
                errorDiv.innerHTML = '<span class="text-green-600">✅ ¡Cuenta creada exitosamente! Redirigiendo...</span>';
                setTimeout(() => {
                    window.location.replace('index.html');
                }, 1500);
                
            } catch (firestoreError) {
                console.error('Error al guardar en Firestore:', firestoreError);
                
                // Intentar una segunda vez con un enfoque diferente
                try {
                    await db.collection('users').doc(user.uid).set({
                        name: nombre,
                        company: empresa,
                        email: email
                    });
                    
                    errorDiv.innerHTML = '<span class="text-green-600">✅ ¡Cuenta creada exitosamente! Redirigiendo...</span>';
                    setTimeout(() => {
                        window.location.replace('index.html');
                    }, 1500);
                    
                } catch (retryError) {
                    console.error('Error en segundo intento:', retryError);
                    // Aún permitir el acceso aunque falle Firestore
                    errorDiv.innerHTML = '<span class="text-green-600">✅ ¡Cuenta creada exitosamente! Redirigiendo...</span>';
                    setTimeout(() => {
                        window.location.replace('index.html');
                    }, 1500);
                }
            }
            
        } catch (authError) {
            console.error('Error en autenticación:', authError);
            
            // Manejar errores específicos de autenticación
            let errorMessage = 'Error al crear la cuenta.';
            
            if (authError.code === 'auth/email-already-in-use') {
                errorMessage = 'Este correo electrónico ya está registrado.';
            } else if (authError.code === 'auth/weak-password') {
                errorMessage = 'La contraseña debe tener al menos 6 caracteres.';
            } else if (authError.code === 'auth/invalid-email') {
                errorMessage = 'El correo electrónico no es válido.';
            } else {
                errorMessage = authError.message;
            }
            
            errorDiv.textContent = errorMessage;
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
        
        // Mostrar indicador de carga en el modal
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        
        form.onsubmit = async (e) => {
            e.preventDefault();
            const name = document.getElementById('google-extra-name').value;
            const company = document.getElementById('google-extra-company').value;
            
            // Mostrar carga
            submitBtn.textContent = 'Guardando...';
            submitBtn.disabled = true;
            
            try {
                const userData = {
                    name, 
                    company,
                    createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                    lastLogin: firebase.firestore.FieldValue.serverTimestamp()
                };
                
                await db.collection('users').doc(uid).set(userData, { merge: true });
                
                // Éxito
                submitBtn.textContent = '¡Guardado!';
                submitBtn.classList.add('bg-green-500');
                
                setTimeout(() => {
                    modal.classList.add('hidden');
                    window.location.replace('index.html');
                }, 1000);
                
            } catch (err) {
                console.error('Error al guardar datos de Google:', err);
                
                // Intentar de nuevo sin timestamps
                try {
                    await db.collection('users').doc(uid).set({ 
                        name, 
                        company
                    }, { merge: true });
                    
                    submitBtn.textContent = '¡Guardado!';
                    submitBtn.classList.add('bg-green-500');
                    
                    setTimeout(() => {
                        modal.classList.add('hidden');
                        window.location.replace('index.html');
                    }, 1000);
                    
                } catch (retryErr) {
                    console.error('Error en segundo intento:', retryErr);
                    alert('Error al guardar los datos. Se redirigirá de todas formas.');
                    modal.classList.add('hidden');
                    window.location.replace('index.html');
                }
            } finally {
                // Restaurar botón
                setTimeout(() => {
                    submitBtn.textContent = originalText;
                    submitBtn.disabled = false;
                    submitBtn.classList.remove('bg-green-500');
                }, 2000);
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