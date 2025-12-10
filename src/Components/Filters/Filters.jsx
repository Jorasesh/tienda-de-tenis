import { useState, useEffect } from "react";
import "./Filters.css";
import { useNavigate } from "react-router-dom";
import { obtenerProductos } from "../../config/productosService";
import AOS from 'aos';
import 'aos/dist/aos.css';

const Filters = ({ buscarTermino = "" }) => {
    const [productos, setProductos] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [orden, setOrden] = useState("Relevante");
    const [filtros, setFiltros] = useState({ categorias: [], tipos: [] });
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

    const toggleFiltros = (tipoFiltro, valor) => {
        setFiltros((prev) => ({
            ...prev,
            [tipoFiltro]: prev[tipoFiltro].includes(valor)
                ? prev[tipoFiltro].filter((item) => item !== valor)
                : [...prev[tipoFiltro], valor],
        }));
    };

    const normalizarTexto = (texto) => {
        return texto
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "");
    };

    const productosFiltrados = productos.filter((producto) => {
        const matchCategoria =
            filtros.categorias.length === 0 || filtros.categorias.includes(producto.categoria);
        const matchTipo =
            filtros.tipos.length === 0 || filtros.tipos.includes(producto.tipo);

        const matchBuscar = !buscarTermino ||
            normalizarTexto(producto.nombre).includes(normalizarTexto(buscarTermino)) ||
            normalizarTexto(producto.descripcion).includes(normalizarTexto(buscarTermino));

        return matchCategoria && matchTipo && matchBuscar;
    });

    const handleOrdenChange = (e) => {
        setOrden(e.target.value);
    };

    const productosOrdenados = [...productosFiltrados].sort((a, b) => {
        if (orden === "Precio: Menor a Mayor") {
            return a.precio - b.precio;
        }
        if (orden === "Precio: Mayor a Menor") {
            return b.precio - a.precio;
        }
        return 0;
    });

    const handleImageClick = (id) => {
        navigate(`/producto/${id}`);
    };

    const handleLimpiarFiltros = () => {
        setFiltros({ categorias: [], tipos: [] });
    };

    if (loading) {
        return (
            <section className="filters-page">
                <div style={{ textAlign: 'center', padding: '40px' }}>
                    <p>Cargando productos...</p>
                </div>
            </section>
        );
    }

    if (error) {
        return (
            <section className="filters-page">
                <div style={{ textAlign: 'center', padding: '40px', color: 'red' }}>
                    <p>{error}</p>
                </div>
            </section>
        );
    }

    return (
        <section className="filters-page">
            <aside className="filters">
                <div className="filters-header">
                    <h2>Filtros</h2>
                    {(filtros.categorias.length > 0 || filtros.tipos.length > 0) && (
                        <button className="clear-filters-btn" onClick={handleLimpiarFiltros}>
                            Limpiar
                        </button>
                    )}
                </div>

                <div className="filters-category">
                    <div className="filter-category">
                        <h3>Categorías</h3>
                        <label>
                            <input
                                type="checkbox"
                                checked={filtros.categorias.includes("Hombres")}
                                onChange={() => toggleFiltros("categorias", "Hombres")}
                            />
                            <span>Hombres</span>
                        </label>
                        <label>
                            <input
                                type="checkbox"
                                checked={filtros.categorias.includes("Mujeres")}
                                onChange={() => toggleFiltros("categorias", "Mujeres")}
                            />
                            <span>Mujeres</span>
                        </label>
                        <label>
                            <input
                                type="checkbox"
                                checked={filtros.categorias.includes("Niños")}
                                onChange={() => toggleFiltros("categorias", "Niños")}
                            />
                            <span>Niños</span>
                        </label>
                    </div>

                    <div className="filter-category">
                        <h3>Tipos</h3>
                        <label>
                            <input
                                type="checkbox"
                                checked={filtros.tipos.includes("Deportivos")}
                                onChange={() => toggleFiltros("tipos", "Deportivos")}
                            />
                            <span>Deportivos</span>
                        </label>
                        <label>
                            <input
                                type="checkbox"
                                checked={filtros.tipos.includes("Casuales")}
                                onChange={() => toggleFiltros("tipos", "Casuales")}
                            />
                            <span>Casuales</span>
                        </label>
                        <label>
                            <input
                                type="checkbox"
                                checked={filtros.tipos.includes("Running")}
                                onChange={() => toggleFiltros("tipos", "Running")}
                            />
                            <span>Running</span>
                        </label>
                        <label>
                            <input
                                type="checkbox"
                                checked={filtros.tipos.includes("Basketball")}
                                onChange={() => toggleFiltros("tipos", "Basketball")}
                            />
                            <span>Basketball</span>
                        </label>
                        <label>
                            <input
                                type="checkbox"
                                checked={filtros.tipos.includes("Training")}
                                onChange={() => toggleFiltros("tipos", "Training")}
                            />
                            <span>Training</span>
                        </label>
                    </div>
                </div>
                <div className="products-count">
                    <p>Mostrando {productosOrdenados.length} productos</p>
                </div>
            </aside>

            <main className="collections">
                <div className="options">
                    <p>Ordenar por:</p>
                    <select value={orden} onChange={handleOrdenChange}>
                        <option value="Relevante">Relevante</option>
                        <option value="Precio: Menor a Mayor">Precio: Menor a Mayor</option>
                        <option value="Precio: Mayor a Menor">Precio: Mayor a Menor</option>
                    </select>
                </div>

                <div className="collection">
                    {productosOrdenados.length === 0 ? (
                        <div className="no-products">
                            <p>No hay productos que coincidan con tus filtros</p>
                        </div>
                    ) : (
                        productosOrdenados.map((producto) => (
                            <div key={producto.id} className="collection-card" data-aos="fade-up">
                                <img
                                    src={producto.image}
                                    alt={producto.nombre}
                                    className="product-image"
                                    onClick={() => handleImageClick(producto.id)}
                                />
                                <h3>{producto.nombre}</h3>
                                <p className="descripcion">{producto.descripcion}</p>
                                <span className="price">${producto.precio}</span>
                            </div>
                        ))
                    )}
                </div>
            </main>
        </section>
    );
};

export default Filters;
