// Importar las funciones que necesitas de Firebase
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';

// Configuración de Firebase - Credenciales hardcodeadas (se usan variables de entorno si están disponibles)
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyD_sD2Ibr8EkOW1S7WIwicMhGRmKsaUPCI",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "tienda-de-tenis-a65cf.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "tienda-de-tenis-a65cf",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "tienda-de-tenis-a65cf.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "163357815732",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:163357815732:web:519e30b99ab9afb12ff8e1"
};

console.log('Firebase Config:', {
  apiKey: firebaseConfig.apiKey ? 'OK' : 'MISSING',
  authDomain: firebaseConfig.authDomain ? 'OK' : 'MISSING',
  projectId: firebaseConfig.projectId ? 'OK' : 'MISSING'
});

// Inicializar Firebase
const app = initializeApp(firebaseConfig);

// Exportar servicios de Firebase
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);

export default app;
