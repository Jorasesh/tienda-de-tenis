import { useNavigate } from 'react-router-dom';
import './Delivery.css';

function Delivery() {
  const navigate = useNavigate();

  return (
    <div className="page-container">
      <button className="back-btn" onClick={() => navigate('/')}>← Volver</button>
      
      <div className="page-content">
        <h1>Información de Entrega</h1>
        
        <section className="about-section">
          <h2>Métodos de Envío</h2>
          <p>
            Contamos con varias opciones de envío para satisfacer tus necesidades:
          </p>
          <ul>
            <li>📦 Envío Estándar: 5-7 días hábiles</li>
            <li>🚚 Envío Express: 2-3 días hábiles</li>
            <li>✈️ Envío Aéreo Internacional: 7-14 días</li>
          </ul>
        </section>

        <section className="about-section">
          <h2>Costo de Envío</h2>
          <ul>
            <li>✓ Envío GRATIS en pedidos superiores a $3500</li>
            <li>✓ Envío estándar: $100 (pedidos menores a $3500)</li>
            <li>✓ Envío express: $250</li>
          </ul>
        </section>

        <section className="about-section">
          <h2>Proceso de Entrega</h2>
          <ol style={{paddingLeft: '20px'}}>
            <li>Confirmar tu pedido</li>
            <li>Recibir número de rastreo</li>
            <li>Rastrear tu paquete en tiempo real</li>
            <li>Recibir en la dirección indicada</li>
          </ol>
        </section>

        <section className="about-section">
          <h2>Rastreo de Pedidos</h2>
          <p>
            Una vez confirmes tu compra, recibirás un email con el número de rastreo para que puedas 
            seguir tu paquete en tiempo real.
          </p>
        </section>

        <section className="about-section">
          <h2>Zonas de Cobertura</h2>
          <p>
            Realizamos envíos a todo México y países de Centro América.
            Consulta disponibilidad de envío a tu zona en el carrito.
          </p>
        </section>
      </div>
    </div>
  );
}

export default Delivery;
