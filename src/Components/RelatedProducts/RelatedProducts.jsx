// RelatedProducts.jsx
import { useNavigate } from "react-router-dom";
import "./RelatedProducts.css"

const RelatedProducts = ({ currentProduct, products }) => {
  const navigate = useNavigate();
    if (!currentProduct) {
        return <p>Cargando productos relacionados...</p>;
      }
    
      const relatedProducts = products.filter(
        (product) =>
          product.id !== currentProduct.id && 
          product.categoria === currentProduct.categoria
      );

      const handleImageClick = (id) => {
        navigate(`/producto/${id}`);
     }
    

  return (
    <div className="relate-container">
      <h2>Productos Relacionados</h2>
      <div className="products">
        {relatedProducts.map((product) => (
          <div key={product.id} className="product-card">
            <img src={product.image} alt={product.nombre} className="product-image"
                   onClick={() => handleImageClick(product.id)}
            />
            <h3>{product.nombre}</h3>
            <p>Precio: ${product.precio}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RelatedProducts;
