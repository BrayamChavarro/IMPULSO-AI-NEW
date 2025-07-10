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
                errorDiv.innerHTML = '<span class="text-green-600">✅ ¡Inicio de sesión exitoso! Redirigiendo...</span>';
                setTimeout(() => {
                    window.location.replace('perfil.html');
                }, 1200);
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
        const password2 = document.getElementById('register-confirm-password').value;
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
                    window.location.replace('perfil.html');
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
                        window.location.replace('perfil.html');
                    }, 1500);
                    
                } catch (retryError) {
                    console.error('Error en segundo intento:', retryError);
                    // Aún permitir el acceso aunque falle Firestore
                    errorDiv.innerHTML = '<span class="text-green-600">✅ ¡Cuenta creada exitosamente! Redirigiendo...</span>';
                    setTimeout(() => {
                        window.location.replace('perfil.html');
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
    const googleBtn = document.getElementById('google-btn');
    if (googleBtn) {
        console.log('Google login button found');
        googleBtn.onclick = async () => {
            errorDiv.textContent = '';
            const provider = new firebase.auth.GoogleAuthProvider();
            try {
                const result = await auth.signInWithPopup(provider);
                const user = result.user;
                mostrarModalGoogleExtra(user.uid, user.displayName, user.email);
            } catch (err) {
                console.error('Error en Google Sign-In:', err);
                errorDiv.textContent = err.message;
            }
        };
    } else {
        console.warn('Google login button NOT found');
    }

    // Google Register (si existe)
    const googleRegisterBtn = document.getElementById('google-register-btn');
    if (googleRegisterBtn) {
        console.log('Google register button found');
        googleRegisterBtn.onclick = async () => {
            errorDiv.textContent = '';
            const provider = new firebase.auth.GoogleAuthProvider();
            try {
                const result = await auth.signInWithPopup(provider);
                const user = result.user;
                mostrarModalGoogleExtra(user.uid, user.displayName, user.email);
            } catch (err) {
                console.error('Error en Google Register:', err);
                errorDiv.textContent = err.message;
            }
        };
    } else {
        console.warn('Google register button NOT found');
    }

    // Función para mostrar el modal y guardar datos adicionales
    function mostrarModalGoogleExtra(uid, googleName = '', googleEmail = '') {
        const modal = document.getElementById('google-extra-modal');
        const form = document.getElementById('google-extra-form');
        const nameInput = document.getElementById('google-extra-name');
        const companyInput = document.getElementById('google-extra-company');
        
        // Limpiar ambos campos para que el usuario los llene manualmente
        nameInput.value = '';
        companyInput.value = '';
        
        // Mostrar el modal
        modal.classList.remove('hidden');
        
        // Enfocar el primer campo (nombre)
        nameInput.focus();
        
        // Mostrar indicador de carga en el modal
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        
        form.onsubmit = async (e) => {
            e.preventDefault();
            const name = nameInput.value.trim();
            const company = companyInput.value.trim();
            
            // Validar que ambos campos estén llenos
            if (!name || !company) {
                alert('Por favor, complete tanto el nombre como el nombre de la empresa.');
                return;
            }
            
            // Mostrar carga
            submitBtn.textContent = 'Guardando...';
            submitBtn.disabled = true;
            
            try {
                const userData = {
                    name, 
                    company,
                    email: googleEmail || '',
                    createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                    lastLogin: firebase.firestore.FieldValue.serverTimestamp(),
                    loginMethod: 'google'
                };
                
                await db.collection('users').doc(uid).set(userData, { merge: true });
                
                // Éxito
                submitBtn.textContent = '¡Guardado!';
                submitBtn.classList.add('bg-green-500');
                
                setTimeout(() => {
                    modal.classList.add('hidden');
                    errorDiv.innerHTML = '<span class="text-green-600">✅ ¡Inicio de sesión exitoso! Redirigiendo...</span>';
                    setTimeout(() => {
                        window.location.replace('perfil.html');
                    }, 1200);
                }, 1000);
                
            } catch (err) {
                console.error('Error al guardar datos de Google:', err);
                
                // Intentar de nuevo sin timestamps
                try {
                    await db.collection('users').doc(uid).set({ 
                        name, 
                        company,
                        email: googleEmail || '',
                        loginMethod: 'google'
                    }, { merge: true });
                    
                    submitBtn.textContent = '¡Guardado!';
                    submitBtn.classList.add('bg-green-500');
                    
                    setTimeout(() => {
                        modal.classList.add('hidden');
                        errorDiv.innerHTML = '<span class="text-green-600">✅ ¡Inicio de sesión exitoso! Redirigiendo...</span>';
                        setTimeout(() => {
                            window.location.replace('perfil.html');
                        }, 1200);
                    }, 1000);
                    
                } catch (retryErr) {
                    console.error('Error en segundo intento:', retryErr);
                    alert('Error al guardar los datos. Se redirigirá de todas formas.');
                    modal.classList.add('hidden');
                    window.location.replace('perfil.html');
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
        
        // Agregar botón para cerrar modal
        const closeBtn = modal.querySelector('.close-modal-btn');
        if (closeBtn) {
            closeBtn.onclick = () => {
                modal.classList.add('hidden');
                // Cerrar sesión si el usuario cancela
                auth.signOut().then(() => {
                    console.log('Usuario canceló el registro');
                }).catch(err => {
                    console.error('Error al cerrar sesión:', err);
                });
            };
        }
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
    
    // === TOGGLE VER CONTRASEÑA LOGIN (final, robusto y fuera de wrappers) ===
    var password = document.getElementById('login-password');
    var viewPassword = document.getElementById('toggle-login-password');
    if (viewPassword && password) {
        let click = false;
        viewPassword.onclick = function(e) {
            e.preventDefault();
            if (!click) {
                password.type = 'text';
                click = true;
                // Ojo abierto
                this.querySelector('svg').innerHTML = '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>';
            } else {
                password.type = 'password';
                click = false;
                // Ojo cerrado
                this.querySelector('svg').innerHTML = '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"></path>';
            }
        }
    }
});