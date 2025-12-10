import "./Offers.css";
import ofertaUno from "../../assets/oferta1.png";
import ofertaDos from "../../assets/oferta2.png";
import { useCart } from "../CartContext/CartContext";
import { useNavigate } from "react-router-dom";
import Notification from "../Notification/Notification";
import { useEffect, useState } from "react";
import AOS, { refresh } from "aos";
import "aos/dist/aos.css";

const Offers = () => {
  const { agregarAlCarrito } = useCart();
  const navigate = useNavigate();
  const [notification, setNotification] = useState("");  
  const [notificationType, setNotificationType] = useState("success")
  const [ofertas, setOfertas] = useState([]);
  
  // Datos de las ofertas
  useEffect(() => {
  AOS.refresh();
  }, []);

  useEffect(() => {
    // Cargar 2 productos de tenis destacados de db.json
    fetch('/db.json')
      .then(res => res.json())
      .then(data => {
        const productosDestacados = data.products.slice(0, 2).map(p => ({
          id: p.id,
          nombre: p.nombre,
          precio: p.precio,
          image: p.image,
          descripcion: p.descripcion,
          oferta: "Tenis Destacado"
        }));
        setOfertas(productosDestacados);
      })
      .catch(err => console.error('Error:', err));
  }, []);

  const handleAgregarAlCarrito = (oferta) => {
    const authUser = localStorage.getItem('authUser');
    
    if (!authUser) {
      navigate('/login');
      return;
    }
    
    agregarAlCarrito({
      id: oferta.id,
      nombre: oferta.nombre,
      precio: oferta.precio,
      image: oferta.image,
      cantidad: 1,
    });
    setNotification("Producto agregado al carrito");
    setNotificationType("success");
  };

  return (
    <>
      <Notification
        message={notification}
        type={notificationType}
        onClose={() => setNotification("")} // Limpia el mensaje al cerrar
      />
    <section className="offers">
      {ofertas.map((oferta, index) => (
        <div className="offer-card" key={oferta.id}
        data-aos="fade-up"
        data-aos-delay={index * 200} // Añade un retraso progresivo
        >
          <p className="category">{oferta.nombre.toUpperCase()}</p>
          <h2>{oferta.descripcion}</h2>
          <p  className="sale">{oferta.oferta}</p>
          <button
            className="btn"
            onClick={() => handleAgregarAlCarrito(oferta)}
          >
            COMPRAR AHORA
          </button>
          <img src={oferta.image} className="offer-image" alt={oferta.nombre} />
        </div>
      ))}
    </section>
    </>
  );
};

export default Offers;
