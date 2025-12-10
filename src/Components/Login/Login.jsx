import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';
import usersData from '../../data/users.json';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '../../config/firebase';
import { collection, addDoc, query, where, getDocs } from 'firebase/firestore';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nombre, setNombre] = useState('');
  const [userType, setUserType] = useState('user');
  const [error, setError] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    try {
      // Intentar con Firebase
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      
      // Buscar el nombre y tipo en Firestore
      const usuariosRef = collection(db, 'usuarios');
      const q = query(usuariosRef, where('uid', '==', userCredential.user.uid));
      const querySnapshot = await getDocs(q);
      
      let nombreUsuario = email.split('@')[0];
      let tipoUsuario = 'user';
      
      if (!querySnapshot.empty) {
        const userData = querySnapshot.docs[0].data();
        nombreUsuario = userData.nombre || nombreUsuario;
        tipoUsuario = userData.tipo || 'user';
      }
      
      localStorage.setItem('authUser', JSON.stringify({
        email: userCredential.user.email,
        type: tipoUsuario,
        nombre: nombreUsuario,
        uid: userCredential.user.uid,
        token: 'firebase_' + Date.now()
      }));
      
      // Redirigir según el tipo de usuario
      if (tipoUsuario === 'admin') {
        navigate('/admin/dashboard');
      } else {
        navigate('/');
      }
    } catch (firebaseErr) {
      console.log('Firebase error:', firebaseErr.code);
      
      // Fallback a usuarios predefinidos
      const usuario = usersData.usuarios.find(u => u.correo === email && u.contraseña === password);
      
      if (usuario) {
        localStorage.setItem('authUser', JSON.stringify({
          email: usuario.correo,
          type: usuario.tipo,
          nombre: usuario.nombre,  // Guardar el nombre del usuario predefinido
          token: usuario.tipo + '_token_' + Date.now()
        }));
        
        if (usuario.tipo === 'admin') {
          navigate('/admin/dashboard');
        } else {
          navigate('/');
        }
      } else {
        setError('Credenciales inválidas');
      }
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');

    if (!nombre || !email || !password) {
      setError('Por favor completa todos los campos');
      return;
    }

    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Por favor ingresa un email válido');
      return;
    }

    const existeEnPredefinidos = usersData.usuarios.find(u => u.correo === email);
    if (existeEnPredefinidos) {
      setError('Este email ya está registrado');
      return;
    }

    try {
      console.log('Intentando registrar con Firebase Auth...');
      
      // Registrar en Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      console.log('Usuario registrado en Firebase Auth:', userCredential.user.email);
      
      // Guardar datos del usuario en Firestore
      const usuariosRef = collection(db, 'usuarios');
      await addDoc(usuariosRef, {
        uid: userCredential.user.uid,
        nombre: nombre,
        email: userCredential.user.email,
        tipo: 'user',  // Siempre registra como usuario regular
        fechaRegistro: new Date(),
        activo: true
      });
      
      console.log('Usuario guardado en Firestore como user');
      
      // Auto-loguear
      localStorage.setItem('authUser', JSON.stringify({
        email: userCredential.user.email,
        type: 'user',
        nombre: nombre,
        uid: userCredential.user.uid,
        token: 'user_' + Date.now()
      }));

      setIsRegistering(false);
      setNombre('');
      setEmail('');
      setPassword('');
      navigate('/');
    } catch (firebaseErr) {
      console.error('Firebase Error Code:', firebaseErr.code);
      console.error('Firebase Error Message:', firebaseErr.message);
      console.error('Full Error:', firebaseErr);
      
      // Fallback: registrar localmente si Firebase falla
      console.log('Firebase falló, registrando localmente...');
      
      localStorage.setItem('authUser', JSON.stringify({
        email: email,
        type: 'user',
        token: 'user_' + Date.now()
      }));

      setIsRegistering(false);
      setNombre('');
      setEmail('');
      setPassword('');
      
      alert('Registro completado (modo local). Funciona pero sin almacenamiento en la nube.');
      navigate('/');
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2>{isRegistering ? 'Crear Cuenta' : '404-ERROR - Login'}</h2>
        
        {!isRegistering && (
          <div className="user-type-selector">
            <button 
              className={userType === 'user' ? 'active' : ''}
              onClick={() => setUserType('user')}
            >
              Usuario
            </button>
            <button 
              className={userType === 'admin' ? 'active' : ''}
              onClick={() => setUserType('admin')}
            >
              Administrador
            </button>
          </div>
        )}

        {!isRegistering && userType === 'admin' && (
          <p className="admin-hint">
            Demo: tellezjorgeariel@gmail.com / admin123
          </p>
        )}

        <form onSubmit={isRegistering ? handleRegister : handleLogin}>
          {isRegistering && (
            <div className="form-group">
              <label>Nombre</label>
              <input
                type="text"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                placeholder="Tu nombre"
                required
              />
            </div>
          )}

          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tu@email.com"
              required
            />
          </div>

          <div className="form-group">
            <label>Contraseña</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder=""
              required
            />
          </div>

          {error && <p className="error-message">{error}</p>}

          <button type="submit" className="login-btn">
            {isRegistering ? 'Registrarse' : 'Ingresar'}
          </button>
        </form>

        <p className="footer-text">
          {isRegistering ? (
            <>
              ¿Ya tienes cuenta? 
              <button 
                type="button" 
                className="toggle-btn"
                onClick={() => setIsRegistering(false)}
              >
                Inicia sesión aquí
              </button>
            </>
          ) : (
            <>
              ¿No tienes cuenta? 
              <button 
                type="button" 
                className="toggle-btn"
                onClick={() => setIsRegistering(true)}
              >
                Regístrate aquí
              </button>
            </>
          )}
        </p>
      </div>
    </div>
  );
}

export default Login;
