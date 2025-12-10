import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { obtenerProductos, agregarProducto, actualizarProducto, eliminarProducto } from '../../config/productosService';
import { obtenerOrdenes } from '../../config/ordenesService';
import AdminUsers from './AdminUsers';
import './AdminDashboard.css';

function AdminDashboard() {
  const [products, setProducts] = useState([]);
  const [ordenes, setOrdenes] = useState([]);
  const [tab, setTab] = useState('productos'); // 'productos', 'ordenes' o 'usuarios'
  const [form, setForm] = useState({
    nombre: '',
    categoria: 'Hombres',
    descripcion: '',
    precio: '',
    image: '',
    tipo: ''
  });
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showLogout, setShowLogout] = useState(false);
  const logoutMenuRef = useRef(null);
  const navigate = useNavigate();

  // Cargar productos de Firebase
  useEffect(() => {
    cargarProductos();
    cargarOrdenes();
  }, []);

  // Cerrar menú al hacer click fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (logoutMenuRef.current && !logoutMenuRef.current.contains(event.target)) {
        setShowLogout(false);
      }
    };

    if (showLogout) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showLogout]);

  const cargarProductos = async () => {
    try {
      setLoading(true);
      const productosFirebase = await obtenerProductos();
      setProducts(productosFirebase);
    } catch (error) {
      console.error('Error cargando productos:', error);
      alert('Error cargando productos: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const cargarOrdenes = async () => {
    try {
      const ordenesFirebase = await obtenerOrdenes();
      setOrdenes(ordenesFirebase);
    } catch (error) {
      console.error('Error cargando órdenes:', error);
    }
  };

  // Guardar productos cuando cambien
  const handleUserClick = () => {
    setShowLogout(!showLogout);
  };

  const handleLogout = () => {
    localStorage.removeItem('authUser');
    setShowLogout(false);
    navigate('/');
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validar campos requeridos
    if (!form.nombre.trim() || !form.descripcion.trim() || !form.image.trim() || !form.categoria || !form.tipo) {
      alert('Por favor completa todos los campos requeridos (*)');
      return;
    }

    if (!form.precio || parseFloat(form.precio) <= 0) {
      alert('El precio debe ser mayor a 0');
      return;
    }

    try {
      const productoData = {
        nombre: form.nombre,
        categoria: form.categoria,
        descripcion: form.descripcion,
        image: form.image,
        precio: parseFloat(form.precio),
        tipo: form.tipo || 'Zapatillas Deportivas',
        stock: parseInt(form.stock) || 50
      };

      if (editingId) {
        // Actualizar producto en Firebase
        await actualizarProducto(editingId, productoData);
        alert('Producto actualizado correctamente');
      } else {
        // Agregar nuevo producto en Firebase
        await agregarProducto(productoData);
        alert('Producto agregado correctamente');
      }

      // Recargar lista de productos
      await cargarProductos();

      setForm({
        nombre: '',
        categoria: 'Hombres',
        descripcion: '',
        precio: '',
        image: '',
        tipo: ''
      });
      setEditingId(null);
      setShowForm(false);
    } catch (error) {
      alert('Error: ' + error.message);
      console.error('Error guardando producto:', error);
    }
  };

  const handleEdit = (product) => {
    setForm(product);
    setEditingId(product.id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este producto?')) {
      try {
        await eliminarProducto(id);
        alert('Producto eliminado correctamente');
        await cargarProductos();
      } catch (error) {
        alert('Error al eliminar: ' + error.message);
        console.error('Error eliminando producto:', error);
      }
    }
  };

  const handleCancel = () => {
    setForm({
      nombre: '',
      categoria: 'Hombres',
      descripcion: '',
      precio: '',
      image: '',
      tipo: ''
    });
    setEditingId(null);
    setShowForm(false);
  };

  const categories = ['Hombres', 'Mujeres', 'Niños'];
  const tipos = ['Deportivas', 'Urbanas', 'Running', 'Basketball', 'Infantiles', 'Entrenamiento', 'Premium'];

  if (loading) {
    return (
      <div className="admin-dashboard">
        <nav className="admin-navbar">
          <h1> Panel Administrativo - Tienda de Tenis</h1>
          <button onClick={handleLogout} className="logout-btn">Cerrar Sesión</button>
        </nav>
        <div className="admin-container">
          <p>Cargando productos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      <nav className="admin-navbar">
        <div className="navbar-content">
          <h1>Panel Administrativo</h1>
          <div className='user-dropdown' ref={logoutMenuRef}>
            <button 
              className='user-button' 
              onClick={handleUserClick}
              title="Administrador logueado"
            >
              <i className='fas fa-user-check'></i>
            </button>
            {showLogout && (
              <div className='logout-menu'>
                <button onClick={handleLogout} className='logout-btn-dropdown'>
                  Cerrar Sesión
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>

      <div className="admin-container">
        <div className="admin-tabs">
          <button 
            className={`admin-tab ${tab === 'productos' ? 'activo' : ''}`}
            onClick={() => setTab('productos')}
          >
            Productos
          </button>
          <button 
            className={`admin-tab ${tab === 'ordenes' ? 'activo' : ''}`}
            onClick={() => setTab('ordenes')}
          >
            Órdenes ({ordenes.length})
          </button>
          <button 
            className={`admin-tab ${tab === 'usuarios' ? 'activo' : ''}`}
            onClick={() => setTab('usuarios')}
          >
            Administradores
          </button>
        </div>

        {tab === 'productos' && (
        <>
        <div className="admin-header">
          <h2>Gestión de Productos</h2>
          <button 
            className="add-btn"
            onClick={() => setShowForm(!showForm)}
          >
            {showForm ? 'Cancelar' : '+ Agregar Producto'}
          </button>
        </div>

        {showForm && (
          <div className="form-container">
            <h3>{editingId ? 'Editar Producto' : 'Nuevo Producto'}</h3>
            <form onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <label>Nombre *</label>
                  <input
                    type="text"
                    name="nombre"
                    value={form.nombre}
                    onChange={handleInputChange}
                    required
                    placeholder="Nike Air Max 90"
                  />
                </div>
                <div className="form-group">
                  <label>Precio *</label>
                  <input
                    type="number"
                    name="precio"
                    value={form.precio}
                    onChange={handleInputChange}
                    required
                    placeholder="1500"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Categoría *</label>
                  <select
                    name="categoria"
                    value={form.categoria}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Seleccionar...</option>
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Tipo *</label>
                  <select
                    name="tipo"
                    value={form.tipo}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Seleccionar...</option>
                    {tipos.map(tipo => (
                      <option key={tipo} value={tipo}>{tipo}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>Descripción *</label>
                <textarea
                  name="descripcion"
                  value={form.descripcion}
                  onChange={handleInputChange}
                  required
                  placeholder="Descripción del producto..."
                  rows="4"
                />
              </div>

              <div className="form-group">
                <label>URL de Imagen *</label>
                <input
                  type="text"
                  name="image"
                  value={form.image}
                  onChange={handleInputChange}
                  required
                  placeholder="/images/producto.png"
                />
              </div>

              <div className="form-buttons">
                <button type="submit" className="submit-btn">
                  {editingId ? 'Actualizar' : 'Crear'} Producto
                </button>
                <button type="button" onClick={handleCancel} className="cancel-btn">
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="products-table">
          <h3>Total de Productos: {products.length}</h3>
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Categoría</th>
                <th>Precio</th>
                <th>Tipo</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {products.map(product => (
                <tr key={product.id}>
                  <td>{product.id}</td>
                  <td>{product.nombre}</td>
                  <td>{product.categoria}</td>
                  <td>${product.precio}</td>
                  <td>{product.tipo || '-'}</td>
                  <td>
                    <button 
                      className="edit-btn"
                      onClick={() => handleEdit(product)}
                    >
                       Editar
                    </button>
                    <button 
                      className="delete-btn"
                      onClick={() => handleDelete(product.id)}
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        </>
        )}

        {tab === 'ordenes' && (
        <div className="ordenes-container">
          <h2>Órdenes Registradas</h2>
          {ordenes.length === 0 ? (
            <div className="no-ordenes">
              <p>No hay órdenes registradas</p>
            </div>
          ) : (
            <table className="ordenes-tabla">
              <thead>
                <tr>
                  <th>ID Orden</th>
                  <th>Cliente</th>
                  <th>Email</th>
                  <th>Productos</th>
                  <th>Total</th>
                  <th>Estado</th>
                  <th>Fecha</th>
                </tr>
              </thead>
              <tbody>
                {ordenes.map((orden) => (
                  <tr key={orden.id}>
                    <td className="orden-id">{orden.id}</td>
                    <td>{orden.cliente?.nombre}</td>
                    <td className="orden-detalles">{orden.cliente?.email}</td>
                    <td className="orden-detalles">
                      {orden.productos?.length} producto(s)
                    </td>
                    <td><strong>${orden.total?.toFixed(2)}</strong></td>
                    <td>
                      <span className={`estado-badge estado-${orden.estado}`}>
                        {orden.estado}
                      </span>
                    </td>
                    <td className="orden-detalles">
                      {new Date(orden.fecha).toLocaleDateString('es-CO')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
        )}

        {tab === 'usuarios' && (
          <AdminUsers />
        )}
      </div>
    </div>
  );
}

export default AdminDashboard;
