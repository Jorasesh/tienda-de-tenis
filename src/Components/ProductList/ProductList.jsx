
import { useState, useEffect } from "react"
import "./ProductList.css"
import { useNavigate } from "react-router-dom";
import { obtenerProductos } from "../../config/productosService";
import AOS from 'aos';
import 'aos/dist/aos.css';

const ProductList = () => {
    const [productos, setProductos] = useState([]);
    const [error, setError] = useState(null)
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const cargarProductos = async () => {
            try {
                setLoading(true);
                window.scrollTo(0, 0);
                const productosFirebase = await obtenerProductos();
                setProductos(productosFirebase);
                AOS.refresh();
            } catch (err) {
                console.error('Error:', err);
                setError("Error al cargar los productos desde Firebase");
            } finally {
                setLoading(false);
            }
        };

        cargarProductos();
    }, []);

    const handleImageClick = (id) => {
        navigate(`/producto/${id}`);
    }

    if (loading) {
        return (
            <section className="main-content-simple">
                <div style={{ textAlign: 'center', padding: '40px' }}>
                    <p>Cargando productos...</p>
                </div>
            </section>
        );
    }

    if (error) {
        return (
            <section className="main-content-simple">
                <div style={{ textAlign: 'center', padding: '40px', color: 'red' }}>
                    <p>{error}</p>
                </div>
            </section>
        );
    }

    return (
        <section className="main-content-simple">
            <div className="products-header">
                <h2>DESTACADOS</h2>
                <button className="view-all-btn" onClick={() => navigate('/filtros')}>
                    Ver todos →
                </button>
            </div>

            <div className="products">
                {productos.length > 0 ? (
                    productos
                        .sort(() => Math.random() - 0.5)
                        .slice(0, 14)
                        .map((producto, index) => (
                        <div
                            className="product-card"
                            key={producto.id}
                            data-aos="fade-up"
                            data-aos-delay={index * 100}
                            data-aos-duration="800"
                        >
                            <img
                                src={producto.image}
                                alt={producto.nombre}
                                className="product-image"
                                onClick={() => handleImageClick(producto.id)}
                            />
                            <h3>{producto.nombre}</h3>
                            <p className="product-descripcion">{producto.descripcion}</p>
                            <p className="product-price">${producto.precio}</p>
                        </div>
                    ))
                ) : (
                    <p className="no-results">
                        No hay productos disponibles
                    </p>
                )}
            </div>
        </section>
    )
}

export default ProductList
