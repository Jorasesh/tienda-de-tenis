import { useState, useEffect } from 'react';
import { useCart } from '../CartContext/CartContext';
import { useNavigate } from 'react-router-dom';
import { registrarOrden } from '../../config/ordenesService';
import './Checkout.css';

function Checkout() {
  const { carrito, limpiarCarrito } = useCart();
  const navigate = useNavigate();
  const [usuarioLogueado, setUsuarioLogueado] = useState(false);

  useEffect(() => {
    const authUser = localStorage.getItem('authUser');
    if (!authUser) {
      navigate('/login');
    } else {
      setUsuarioLogueado(true);
    }
  }, [navigate]);
  const [paso, setPaso] = useState(1); // 1: Envío, 2: Pago, 3: Confirmación
  const [procesando, setProcesando] = useState(false);

  const costoDeEnvio = 100;
  const subTotal = carrito.reduce((acc, producto) => 
    acc + producto.precio * producto.cantidad, 0
  );
  const total = subTotal + costoDeEnvio;

  const [datosEnvio, setDatosEnvio] = useState({
    nombre: '',
    apellido: '',
    email: '',
    telefono: '',
    direccion: '',
    ciudad: '',
    codigoPostal: '',
    pais: ''
  });

  const [datosTarjeta, setDatosTarjeta] = useState({
    titular: '',
    numero: '',
    expiracion: '',
    cvv: ''
  });

  const [ordenConfirmada, setOrdenConfirmada] = useState(null);

  const handleDatosEnvioChange = (e) => {
    let { name, value } = e.target;

    // Teléfono: solo números
    if (name === 'telefono') {
      value = value.replace(/\D/g, '');
    }

    // Código Postal: solo números
    if (name === 'codigoPostal') {
      value = value.replace(/\D/g, '');
    }

    setDatosEnvio(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleDatosTarjetaChange = (e) => {
    let { name, value } = e.target;

    if (name === 'titular') {
      // Solo letras y espacios
      value = value.replace(/[^a-zA-Z\s]/g, '').toUpperCase();
    }

    if (name === 'numero') {
      // Solo números, máximo 16 dígitos
      value = value.replace(/\D/g, '').slice(0, 16);
      // Formatear en grupos de 4
      value = value.replace(/(\d{4})/g, '$1 ').trim();
    }

    if (name === 'expiracion') {
      // Solo números, máximo 4 dígitos
      value = value.replace(/\D/g, '').slice(0, 4);
      
      // Validar que el mes no sea mayor a 12
      if (value.length >= 2) {
        const mes = parseInt(value.slice(0, 2), 10);
        if (mes > 12) {
          // Si es mayor a 12, limitar a 12
          value = '12' + value.slice(2);
        }
      }
      
      // Formatear como MM/YY
      if (value.length >= 2) {
        value = value.slice(0, 2) + '/' + value.slice(2);
      }
    }

    if (name === 'cvv') {
      // Solo números, máximo 3 dígitos
      value = value.replace(/\D/g, '').slice(0, 3);
    }

    setDatosTarjeta(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validarDatosEnvio = () => {
    return (
      datosEnvio.nombre &&
      datosEnvio.apellido &&
      datosEnvio.email &&
      datosEnvio.telefono &&
      datosEnvio.direccion &&
      datosEnvio.ciudad &&
      datosEnvio.codigoPostal &&
      datosEnvio.pais
    );
  };

  const validarDatosTarjeta = () => {
    // Validar titular
    if (!datosTarjeta.titular || datosTarjeta.titular.trim().length < 3) {
      return false;
    }

    // Validar número (debe tener exactamente 16 dígitos)
    const numeroSinEspacios = datosTarjeta.numero.replace(/\s/g, '');
    if (numeroSinEspacios.length !== 16 || !/^\d{16}$/.test(numeroSinEspacios)) {
      return false;
    }

    // Validar expiración (formato MM/YY y mes válido)
    if (datosTarjeta.expiracion.length !== 5) {
      return false;
    }
    const [mes, año] = datosTarjeta.expiracion.split('/');
    const mesNum = parseInt(mes, 10);
    if (isNaN(mesNum) || mesNum < 1 || mesNum > 12) {
      return false;
    }

    // Validar CVV (exactamente 3 dígitos)
    if (datosTarjeta.cvv.length !== 3 || !/^\d{3}$/.test(datosTarjeta.cvv)) {
      return false;
    }

    return true;
  };

  const handleSiguiente = () => {
    if (paso === 1 && validarDatosEnvio()) {
      setPaso(2);
    } else if (paso === 1) {
      alert('Por favor completa todos los campos de envío');
    }
  };

  const handleConfirmarPago = async () => {
    if (!validarDatosTarjeta()) {
      alert('Por favor verifica los datos de tu tarjeta');
      return;
    }

    setProcesando(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 1000));

      const orden = {
        id: `ORD-${Date.now()}`,
        fecha: new Date().toISOString(),
        cliente: {
          nombre: `${datosEnvio.nombre} ${datosEnvio.apellido}`,
          email: datosEnvio.email,
          telefono: datosEnvio.telefono
        },
        envio: {
          direccion: datosEnvio.direccion,
          ciudad: datosEnvio.ciudad,
          codigoPostal: datosEnvio.codigoPostal,
          pais: datosEnvio.pais
        },
        productos: carrito,
        subtotal: subTotal,
        costoEnvio: costoDeEnvio,
        total: total,
        estado: 'Pendiente',
        metodoPago: 'Tarjeta de Crédito',
        ultimosCuatroDigitos: datosTarjeta.numero.replace(/\s/g, '').slice(-4)
      };

      await registrarOrden(orden);

      setOrdenConfirmada(orden);
      setPaso(3);
      limpiarCarrito();
    } catch (error) {
      alert('Error al procesar el pago: ' + error.message);
      console.error('Error:', error);
    } finally {
      setProcesando(false);
    }
  };

  if (!usuarioLogueado) {
    return null;
  }

  if (carrito.length === 0 && paso !== 3) {
    return (
      <div className="checkout-container">
        <div className="checkout-vacio">
          <h2>Tu carrito está vacío</h2>
          <p>Agrega productos antes de proceder al checkout</p>
          <button onClick={() => navigate('/')} className="btn-volver">
            Volver al inicio
          </button>
        </div>
      </div>
    );
  }

  if (paso === 3 && ordenConfirmada) {
    return (
      <div className="checkout-container">
        <div className="confirmacion">
          <div className="confirmacion-header">
            <i className="fas fa-check-circle"></i>
            <h2>¡Pago Exitoso!</h2>
            <p>Tu orden ha sido registrada correctamente</p>
          </div>

          <div className="detalles-orden">
            <h3>Detalles de tu Orden</h3>
            <div className="detalle-item">
              <span>Número de Orden:</span>
              <strong>{ordenConfirmada.id}</strong>
            </div>
            <div className="detalle-item">
              <span>Fecha:</span>
              <strong>{new Date(ordenConfirmada.fecha).toLocaleDateString('es-CO')}</strong>
            </div>
            <div className="detalle-item">
              <span>Total:</span>
              <strong>${ordenConfirmada.total.toFixed(2)}</strong>
            </div>
            <div className="detalle-item">
              <span>Estado:</span>
              <strong>{ordenConfirmada.estado}</strong>
            </div>
            <div className="detalle-item">
              <span>Entrega en:</span>
              <strong>{ordenConfirmada.envio.direccion}, {ordenConfirmada.envio.ciudad}</strong>
            </div>
          </div>

          <div className="productos-confirmacion">
            <h3>Productos Pedidos</h3>
            {ordenConfirmada.productos.map(producto => (
              <div key={producto.id} className="producto-confirmacion">
                <img 
                  src={producto.image || 'https://via.placeholder.com/80/00bfa5/FFFFFF?text=Prod'} 
                  alt={producto.nombre}
                  onError={(e) => {e.target.src = 'https://via.placeholder.com/80/00bfa5/FFFFFF?text=Img'}}
                />
                <div>
                  <p><strong>{producto.nombre}</strong></p>
                  <p>Cantidad: {producto.cantidad}</p>
                  <p>${(producto.precio * producto.cantidad).toFixed(2)}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="confirmacion-acciones">
            <button onClick={() => navigate('/')} className="btn-primario">
              Continuar Comprando
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-container">
      <div className="checkout-contenido">
        <div className="checkout-pasos">
          <div className={`paso ${paso >= 1 ? 'activo' : ''}`}>
            <span className="numero-paso">1</span>
            <span className="texto-paso">Envío</span>
          </div>
          <div className={`paso ${paso >= 2 ? 'activo' : ''}`}>
            <span className="numero-paso">2</span>
            <span className="texto-paso">Pago</span>
          </div>
          <div className={`paso ${paso >= 3 ? 'activo' : ''}`}>
            <span className="numero-paso">3</span>
            <span className="texto-paso">Confirmación</span>
          </div>
        </div>

        <div className="checkout-formulario">
          {paso === 1 && (
            <div className="formulario-envio">
              <h2>Datos de Envío</h2>
              
              <div className="form-row">
                <div className="form-group">
                  <label>Nombre *</label>
                  <input
                    type="text"
                    name="nombre"
                    value={datosEnvio.nombre}
                    onChange={handleDatosEnvioChange}
                    placeholder="Juan"
                  />
                </div>
                <div className="form-group">
                  <label>Apellido *</label>
                  <input
                    type="text"
                    name="apellido"
                    value={datosEnvio.apellido}
                    onChange={handleDatosEnvioChange}
                    placeholder="Pérez"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Email *</label>
                  <input
                    type="email"
                    name="email"
                    value={datosEnvio.email}
                    onChange={handleDatosEnvioChange}
                    placeholder="juan@example.com"
                  />
                </div>
                <div className="form-group">
                  <label>Teléfono *</label>
                  <input
                    type="tel"
                    name="telefono"
                    value={datosEnvio.telefono}
                    onChange={handleDatosEnvioChange}
                    placeholder="+57 300 123 4567"
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Dirección *</label>
                <input
                  type="text"
                  name="direccion"
                  value={datosEnvio.direccion}
                  onChange={handleDatosEnvioChange}
                  placeholder="Calle 10 #20-30"
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Ciudad *</label>
                  <input
                    type="text"
                    name="ciudad"
                    value={datosEnvio.ciudad}
                    onChange={handleDatosEnvioChange}
                    placeholder="Bogotá"
                  />
                </div>
                <div className="form-group">
                  <label>Código Postal *</label>
                  <input
                    type="text"
                    name="codigoPostal"
                    value={datosEnvio.codigoPostal}
                    onChange={handleDatosEnvioChange}
                    placeholder="110111"
                  />
                </div>
              </div>

              <div className="form-group">
                <label>País *</label>
                <input
                  type="text"
                  name="pais"
                  value={datosEnvio.pais}
                  onChange={handleDatosEnvioChange}
                  placeholder="México"
                />
              </div>
            </div>
          )}

          {paso === 2 && (
            <div className="formulario-pago">
              <h2>Datos de Pago</h2>

              <div className="form-group">
                <label>Titular de Tarjeta *</label>
                <input
                  type="text"
                  name="titular"
                  value={datosTarjeta.titular}
                  onChange={handleDatosTarjetaChange}
                  placeholder="JUAN PEREZ"
                  style={{ textTransform: 'uppercase' }}
                />
              </div>

              <div className="form-group">
                <label>Número de Tarjeta *</label>
                <input
                  type="text"
                  name="numero"
                  value={datosTarjeta.numero}
                  onChange={handleDatosTarjetaChange}
                  placeholder="0000 0000 0000 0000"
                  maxLength="19"
                />
                <small>Ej: 4532 1234 5678 9010</small>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Vencimiento *</label>
                  <input
                    type="text"
                    name="expiracion"
                    value={datosTarjeta.expiracion}
                    onChange={handleDatosTarjetaChange}
                    placeholder="MM/YY"
                    maxLength="5"
                  />
                </div>
                <div className="form-group">
                  <label>CVV *</label>
                  <input
                    type="text"
                    name="cvv"
                    value={datosTarjeta.cvv}
                    onChange={handleDatosTarjetaChange}
                    placeholder="123"
                    maxLength="3"
                  />
                </div>
              </div>

              <div className="resumen-pago">
                <h3>Resumen del Pedido</h3>
                <div className="resumen-item">
                  <span>Subtotal:</span>
                  <strong>${subTotal.toFixed(2)}</strong>
                </div>
                <div className="resumen-item">
                  <span>Costo de Envío:</span>
                  <strong>${costoDeEnvio.toFixed(2)}</strong>
                </div>
                <div className="resumen-item total">
                  <span>Total:</span>
                  <strong>${total.toFixed(2)}</strong>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="checkout-botones">
          {paso > 1 && (
            <button
              onClick={() => setPaso(paso - 1)}
              className="btn-secundario"
              disabled={procesando}
            >
              ← Atrás
            </button>
          )}

          {paso === 1 && (
            <button
              onClick={handleSiguiente}
              className="btn-primario"
            >
              Siguiente →
            </button>
          )}

          {paso === 2 && (
            <button
              onClick={handleConfirmarPago}
              className="btn-primario"
              disabled={procesando}
            >
              {procesando ? 'Procesando...' : `Confirmar Pago - $${total.toFixed(2)}`}
            </button>
          )}
        </div>
      </div>

      <div className="checkout-resumen">
        <h3>Resumen de Compra</h3>
        <div className="resumen-productos">
          {carrito.map(producto => (
            <div key={producto.id} className="resumen-producto">
              <img 
                src={producto.image || "https://via.placeholder.com/60/00bfa5/FFFFFF?text=Prod"} 
                alt={producto.nombre}
                onError={(e) => {e.target.src = "https://via.placeholder.com/60/00bfa5/FFFFFF?text=Img"}}
              />
              <div className="resumen-info">
                <p className="nombre">{producto.nombre}</p>
                <p className="cantidad">x{producto.cantidad}</p>
              </div>
              <p className="precio">${(producto.precio * producto.cantidad).toFixed(2)}</p>
            </div>
          ))}
        </div>
        <div className="resumen-totales">
          <div className="item">
            <span>Subtotal:</span>
            <span>${subTotal.toFixed(2)}</span>
          </div>
          <div className="item">
            <span>Envío:</span>
            <span>${costoDeEnvio.toFixed(2)}</span>
          </div>
          <div className="item total">
            <span>Total:</span>
            <span>${total.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Checkout;
