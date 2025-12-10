import { useCart } from "../CartContext/CartContext"
import { useNavigate } from "react-router-dom"
import "./Cart.css"

const Cart = () => {
    const {carrito,  actualizarCantidad, eliminarProducto} = useCart(); 
    const navigate = useNavigate();

    const costoDeEnvio = 100;
    const subTotal = carrito.reduce((acc, producto) => 
        acc + producto.precio *  producto.cantidad, 0)

    const total = subTotal + costoDeEnvio
 
    

    const handleAumentarCantidad = (productoId) => {
        actualizarCantidad(productoId, 1)
    }

    const handleDisminuirCantidad = (productoId) => {
        const producto = carrito.find((item) =>  item.id === productoId)
        if(producto.cantidad > 1) {
            actualizarCantidad(productoId, -1)
        }
    }

    const handlePasarPorCaja = () => {
        navigate('/checkout');
    }

  return (
    <div className="cart-container">
        <h2>TU <span>CARRITO</span></h2>
        { carrito.length === 0 ? (
            <p>Tu carrito está vacío</p>
        ):(
            <>
            <div className="cart-header">
                <p>Producto</p>
                <p>Precio</p>
                <p>Cantidad</p>
                <p>Total</p>
                <p>Accíon</p>
            </div>
            <ul className="cart-items">
                {
                    carrito.map((producto) => {
                       const totalPrecio = producto.precio * producto.cantidad
                        return(
                            <li className="cart-item" key={producto.id}>
                                <div className="product-info">
                                    <img 
                                      src={producto.image || "https://via.placeholder.com/150/00bfa5/FFFFFF?text=Producto"} 
                                      alt={producto.nombre}
                                      className="product-images"
                                      onError={(e) => {e.target.src = "https://via.placeholder.com/150/00bfa5/FFFFFF?text=Imagen"}}
                                    />
                                    <span>{producto.nombre}</span>
                                </div>
                                <p>${producto.precio.toFixed(2)}</p>

                                <div className="quantity-controls">
                                    <button className="quantity-btn"
                                    onClick={()=> handleDisminuirCantidad(producto.id)}
                                    >
                                        -
                                    </button>

                                    <input type="number"
                                    className="quantity-input"
                                    readOnly
                                    value={producto.cantidad}
                                    />
                                    <button className="quantity-btn"
                                    onClick={()=>  handleAumentarCantidad(producto.id)}
                                    >
                                        +
                                    </button>
                                </div>

                                <p>${totalPrecio.toFixed(2)}</p>
                                <button className="delete-btn"
                                onClick={()=> eliminarProducto(producto.id)}
                                >
                                <i className="fas fa-trash"></i>
                                </button>
                            </li>
                        )
                    })
                }
            </ul>
            </>
        )}
  
        <div className="cart-summary">
        <h2>TU <span>CARRITO</span></h2>
        <p>Total Parcial: <span>${subTotal.toFixed(2)}</span></p>
        <p>Tarifa de envío: <span>${costoDeEnvio.toFixed(2)}</span></p>
        <p className="total">Total: <span>${total.toFixed(2)}</span></p>
        <button className="checkout-btn" onClick={handlePasarPorCaja} disabled={carrito.length === 0}>PASAR POR LA CAJA</button>
        </div>


    </div>
  )
}

export default Cart