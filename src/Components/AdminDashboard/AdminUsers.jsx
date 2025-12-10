import { useState, useEffect } from 'react';
import { db, auth } from '../../config/firebase';
import { collection, addDoc, query, where, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import './AdminUsers.css';

function AdminUsers() {
  const [admins, setAdmins] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    nombre: '',
    email: '',
    contraseña: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  // Cargar administradores
  useEffect(() => {
    cargarAdmins();
  }, []);

  const cargarAdmins = async () => {
    try {
      setLoading(true);
      const usuariosRef = collection(db, 'usuarios');
      const q = query(usuariosRef, where('tipo', '==', 'admin'));
      const querySnapshot = await getDocs(q);
      
      const adminList = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      setAdmins(adminList);
      setLoading(false);
    } catch (err) {
      console.error('Error cargando admins:', err);
      setError('Error al cargar administradores');
      setLoading(false);
    }
  };

  const handleAddAdmin = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!form.nombre || !form.email || !form.contraseña) {
      setError('Por favor completa todos los campos');
      return;
    }

    if (form.contraseña.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email)) {
      setError('Email inválido');
      return;
    }

    try {
      setLoading(true);

      // Crear usuario en Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, form.email, form.contraseña);

      // Guardar en Firestore
      const usuariosRef = collection(db, 'usuarios');
      await addDoc(usuariosRef, {
        uid: userCredential.user.uid,
        nombre: form.nombre,
        email: form.email,
        tipo: 'admin',
        fechaRegistro: new Date(),
        activo: true,
        creadoPor: 'admin'
      });

      setSuccess('Administrador creado exitosamente');
      setForm({ nombre: '', email: '', contraseña: '' });
      setShowForm(false);
      
      // Recargar lista
      await cargarAdmins();
      setLoading(false);
    } catch (err) {
      console.error('Error creando admin:', err);
      if (err.code === 'auth/email-already-in-use') {
        setError('Este email ya está registrado');
      } else {
        setError('Error al crear administrador: ' + err.message);
      }
      setLoading(false);
    }
  };

  const handleDeleteAdmin = async (adminId, adminEmail) => {
    if (window.confirm(`¿Seguro que quieres eliminar al administrador ${adminEmail}?`)) {
      try {
        setLoading(true);
        
        // Eliminar de Firestore
        await deleteDoc(doc(db, 'usuarios', adminId));
        
        setSuccess('Administrador eliminado');
        await cargarAdmins();
        setLoading(false);
      } catch (err) {
        console.error('Error eliminando admin:', err);
        setError('Error al eliminar administrador');
        setLoading(false);
      }
    }
  };

  if (loading && admins.length === 0) {
    return <div className="admin-users-container">Cargando...</div>;
  }

  return (
    <div className="admin-users-container">
      <h2>Gestión de Administradores</h2>

      {error && <div className="alert alert-error">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      <button 
        className="btn btn-primary"
        onClick={() => setShowForm(!showForm)}
      >
        {showForm ? 'Cancelar' : '+ Crear Nuevo Admin'}
      </button>

      {showForm && (
        <form onSubmit={handleAddAdmin} className="admin-form">
          <div className="form-group">
            <label>Nombre</label>
            <input
              type="text"
              value={form.nombre}
              onChange={(e) => setForm({ ...form, nombre: e.target.value })}
              placeholder="Nombre del administrador"
              required
            />
          </div>

          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="Email"
              required
            />
          </div>

          <div className="form-group">
            <label>Contraseña</label>
            <input
              type="password"
              value={form.contraseña}
              onChange={(e) => setForm({ ...form, contraseña: e.target.value })}
              placeholder="Contraseña (mínimo 6 caracteres)"
              required
            />
          </div>

          <button type="submit" className="btn btn-success" disabled={loading}>
            {loading ? 'Creando...' : 'Crear Admin'}
          </button>
        </form>
      )}

      <div className="admins-list">
        <h3>Administradores Registrados</h3>
        {admins.length === 0 ? (
          <p>No hay administradores registrados</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Email</th>
                <th>Fecha Registro</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {admins.map(admin => (
                <tr key={admin.id}>
                  <td>{admin.nombre}</td>
                  <td>{admin.email}</td>
                  <td>{new Date(admin.fechaRegistro?.toDate()).toLocaleDateString()}</td>
                  <td>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => handleDeleteAdmin(admin.id, admin.email)}
                      disabled={loading}
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default AdminUsers;
