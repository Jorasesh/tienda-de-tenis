import { 
  collection, 
  addDoc, 
  getDocs, 
  updateDoc, 
  deleteDoc, 
  doc,
  query,
  where
} from 'firebase/firestore';
import { db } from './firebase';

// Referencia a la colección de productos
const productosRef = collection(db, 'productos');

/**
 * Obtener todos los productos
 */
export const obtenerProductos = async () => {
  try {
    const querySnapshot = await getDocs(productosRef);
    const productos = [];
    querySnapshot.forEach((doc) => {
      productos.push({
        id: doc.id,
        ...doc.data()
      });
    });
    return productos;
  } catch (error) {
    console.error('Error obteniendo productos:', error);
    throw error;
  }
};

/**
 * Obtener productos por categoría
 */
export const obtenerProductosPorCategoria = async (categoria) => {
  try {
    const q = query(productosRef, where('categoria', '==', categoria));
    const querySnapshot = await getDocs(q);
    const productos = [];
    querySnapshot.forEach((doc) => {
      productos.push({
        id: doc.id,
        ...doc.data()
      });
    });
    return productos;
  } catch (error) {
    console.error('Error obteniendo productos por categoría:', error);
    throw error;
  }
};

/**
 * Agregar nuevo producto
 */
export const agregarProducto = async (producto) => {
  try {
    const docRef = await addDoc(productosRef, {
      ...producto,
      fechaCreacion: new Date(),
      fechaActualizacion: new Date()
    });
    return {
      id: docRef.id,
      ...producto
    };
  } catch (error) {
    console.error('Error agregando producto:', error);
    throw error;
  }
};

/**
 * Actualizar producto
 */
export const actualizarProducto = async (productoId, datosActualizados) => {
  try {
    const docRef = doc(db, 'productos', productoId);
    await updateDoc(docRef, {
      ...datosActualizados,
      fechaActualizacion: new Date()
    });
    return {
      id: productoId,
      ...datosActualizados
    };
  } catch (error) {
    console.error('Error actualizando producto:', error);
    throw error;
  }
};

/**
 * Eliminar producto
 */
export const eliminarProducto = async (productoId) => {
  try {
    const docRef = doc(db, 'productos', productoId);
    await deleteDoc(docRef);
    return true;
  } catch (error) {
    console.error('Error eliminando producto:', error);
    throw error;
  }
};
