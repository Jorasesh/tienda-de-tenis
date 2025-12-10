import { useParams, useNavigate } from "react-router-dom"
import "./DetailsProduct.css"
import { useEffect, useState } from "react"
import { useCart } from "../CartContext/CartContext"
import { obtenerProductos } from "../../config/productosService";
import RelatedProducts from "../RelatedProducts/RelatedProducts";
import Notification from "../Notification/Notification";
import Features from "../Features/Features";
 

const DetailsProduct = () => {
    const {id} = useParams()
    const navigate = useNavigate()
    const [producto, setProducto] = useState(null)
    const [error, setError] = useState(null)
    const [todosProductos, setTodosProductos] = useState([])
    const {agregarAlCarrito} = useCart();
    const [notification, setNotification] = useState("");
    const [notificationType, setNotificationType] = useState("success");
    
    // Scroll al top cuando cambie el producto
    useEffect(() => {
      window.scrollTo(0, 0);
    }, [id]);
    
    const handleAgregarAlCarrito = () => {
      const authUser = localStorage.getItem('authUser');
      
      if (!authUser) {
        navigate('/login');
        return;
      }
      
      if (producto) {
        agregarAlCarrito({
          id: producto.id,
          image: producto.image,
          nombre: producto.nombre,
          precio: producto.precio,
          cantidad: 1,
        });
        setNotification("Producto agregado al carrito");
        setNotificationType("success");
      } else {
        setNotification("No se pudo agregar el producto");
        setNotificationType("error");
      }
    };
  
  

    //codigo cuando se consume una api, este useEffect siver para ver los detalles del producto
    /*
      useEffect(() => {
        const fetchProducto = async () => {
            try {
              const response = await fetch(`https://api-ten-jet.vercel.app/products/${id}`);
              if (!response.ok) {
                throw new Error("Error al cargar los detalles del producto");
              }
              const data = await response.json();
              setProducto(data); // Guarda el producto en el estado
            } catch (err) {
              setError(err.message); // Maneja errores
            } 
          };
      
          fetchProducto();
    }, [id])
    */
  
    useEffect(() => {
      const cargarProducto = async () => {
        try {
          const productos = await obtenerProductos();
          setTodosProductos(productos);
          
          // Busca el producto por ID (puede ser string o number)
          const productoEncontrado = productos.find(
            (prod) => prod.id === id || prod.id === parseInt(id, 10)
          );
  
          if (!productoEncontrado) {
            throw new Error("Producto no encontrado");
          }
  
          setProducto(productoEncontrado);
        } catch (err) {
          setError(err.message);
        }
      };
      
      cargarProducto();
    }, [id]);
  
    if (error) {
      return <h2 className="error-message">{error}</h2>;
    }


    if (error) {
        return <h2 className="error-message">{error}</h2>;  
    }

 
  return (
    <>
   <Notification
        message={notification}
        type={notificationType}
        onClose={() => setNotification("")} // Limpia el mensaje al cerrar
      />
     <div className="product-details">
        {
            producto ? (
                <>
                <img src={producto.image} alt={producto.nombre} className="image-small"/>
                <div className="product-infos">
                    <h1>{producto.nombre}</h1>
                    <p className="price">${producto.precio}</p>
                    <p className="description">{producto.descripcion}</p>
                    <button className="add-to-cart"
                    onClick={handleAgregarAlCarrito}
                    >Añadir al carrito</button>
                    <p className="note">
                Producto 100% original. El pago contra reembolso está 
                disponible para este producto.
                Política de devolución y cambio fácil dentro de los 7 días.
                </p>
                </div>
             
                </>
            ) : (
                <p>Cargando producto ...</p>
            )
        }
     </div>
     <RelatedProducts currentProduct={producto} products={todosProductos} />
     <Features/>
     </>
  )
}

export default DetailsProduct