import React, {  createContext, useContext, useState } from 'react'

const CartContext = createContext();

export const CartProvider = ({children}) => {
    const [carrito, setCarrito] = useState([])

    const agregarAlCarrito = (producto)  => {
        setCarrito((carritoAnterior)  =>  {
            const yaExisteElproducto = carritoAnterior.findIndex(
                (articulo)  =>  articulo.id === producto.id
            );
            if(yaExisteElproducto  >= 0) {
                const carritoActualizado = [...carritoAnterior];
                carritoActualizado[yaExisteElproducto].cantidad += 1;
                return carritoActualizado;
            }  else {
                return [...carritoAnterior, {...producto, cantidad: 1}]
            }
        })
    }

    const actualizarCantidad = (productoId, cantidad) =>  {
        setCarrito((carritoAnterior) => 
            carritoAnterior.map((producto) => 
                producto.id === productoId
        ? {...producto, cantidad: producto.cantidad + cantidad}
        : producto
            )
        )
    }

    const eliminarProducto = (productoId) => {
        setCarrito((carritoAnterior) => 
        carritoAnterior.filter((producto) => 
            producto.id !== productoId
    ))};

    const limpiarCarrito = () => {
        setCarrito([]);
    };

  return (
    <CartContext.Provider value={{carrito, agregarAlCarrito, actualizarCantidad, eliminarProducto, limpiarCarrito}}>
        {children}
    </CartContext.Provider>
  )
}

export const useCart = () => useContext(CartContext);