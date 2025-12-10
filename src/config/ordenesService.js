import { 
  collection, 
  addDoc, 
  getDocs, 
  updateDoc, 
  deleteDoc, 
  doc,
  query,
  where,
  orderBy
} from 'firebase/firestore';
import { db } from './firebase';

// Referencia a la colección de órdenes/compras
const ordenesRef = collection(db, 'ordenes');

/**
 * Obtener todas las órdenes
 */
export const obtenerOrdenes = async () => {
  try {
    const q = query(ordenesRef, orderBy('fechaCreacion', 'desc'));
    const querySnapshot = await getDocs(q);
    const ordenes = [];
    querySnapshot.forEach((doc) => {
      ordenes.push({
        id: doc.id,
        ...doc.data()
      });
    });
    return ordenes;
  } catch (error) {
    console.error('Error obteniendo órdenes:', error);
    throw error;
  }
};

/**
 * Obtener órdenes de un cliente específico
 */
export const obtenerOrdenesPorCliente = async (clienteEmail) => {
  try {
    const q = query(
      ordenesRef, 
      where('clienteEmail', '==', clienteEmail),
      orderBy('fechaCreacion', 'desc')
    );
    const querySnapshot = await getDocs(q);
    const ordenes = [];
    querySnapshot.forEach((doc) => {
      ordenes.push({
        id: doc.id,
        ...doc.data()
      });
    });
    return ordenes;
  } catch (error) {
    console.error('Error obteniendo órdenes del cliente:', error);
    throw error;
  }
};

/**
 * Crear nueva orden/compra
 */
export const crearOrden = async (datosOrden) => {
  try {
    const docRef = await addDoc(ordenesRef, {
      ...datosOrden,
      estado: 'pendiente', // pendiente, procesando, enviado, entregado, cancelado
      fechaCreacion: new Date(),
      fechaActualizacion: new Date()
    });
    return {
      id: docRef.id,
      ...datosOrden
    };
  } catch (error) {
    console.error('Error creando orden:', error);
    throw error;
  }
};

/**
 * Actualizar estado de orden
 */
export const actualizarOrden = async (ordenId, datosActualizados) => {
  try {
    const docRef = doc(db, 'ordenes', ordenId);
    await updateDoc(docRef, {
      ...datosActualizados,
      fechaActualizacion: new Date()
    });
    return {
      id: ordenId,
      ...datosActualizados
    };
  } catch (error) {
    console.error('Error actualizando orden:', error);
    throw error;
  }
};

/**
 * Eliminar orden
 */
export const eliminarOrden = async (ordenId) => {
  try {
    const docRef = doc(db, 'ordenes', ordenId);
    await deleteDoc(docRef);
    return true;
  } catch (error) {
    console.error('Error eliminando orden:', error);
    throw error;
  }
};

/**
 * Obtener estadísticas de ventas
 */
export const obtenerEstadisticasVentas = async () => {
  try {
    const ordenes = await obtenerOrdenes();
    
    const estadisticas = {
      totalVentas: 0,
      totalOrdenes: ordenes.length,
      ordenesEntregadas: 0,
      ordenesEnviadas: 0,
      ordenesPendientes: 0,
      ordenesEnProcesamiento: 0,
      productosMasVendidos: {}
    };

    ordenes.forEach((orden) => {
      if (orden.estado === 'entregado') estadisticas.ordenesEntregadas++;
      if (orden.estado === 'enviado') estadisticas.ordenesEnviadas++;
      if (orden.estado === 'pendiente') estadisticas.ordenesPendientes++;
      if (orden.estado === 'procesando') estadisticas.ordenesEnProcesamiento++;
      
      estadisticas.totalVentas += orden.total || 0;

      // Contar productos más vendidos
      if (orden.productos) {
        orden.productos.forEach((producto) => {
          const key = producto.nombre;
          estadisticas.productosMasVendidos[key] = 
            (estadisticas.productosMasVendidos[key] || 0) + (producto.cantidad || 1);
        });
      }
    });

    return estadisticas;
  } catch (error) {
    console.error('Error obteniendo estadísticas:', error);
    throw error;
  }
};

/**
 * Registrar orden (alias para crearOrden)
 */
export const registrarOrden = async (datosOrden) => {
  try {
    const docRef = await addDoc(ordenesRef, {
      ...datosOrden,
      fechaCreacion: new Date(),
      fechaActualizacion: new Date()
    });
    return {
      id: docRef.id,
      ...datosOrden
    };
  } catch (error) {
    console.error('Error registrando orden:', error);
    throw error;
  }
};
