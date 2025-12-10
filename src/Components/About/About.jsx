import { useNavigate } from 'react-router-dom';
import './About.css';

function About() {
  const navigate = useNavigate();

  return (
    <div className="page-container">
      <button className="back-btn" onClick={() => navigate('/')}>← Volver</button>
      
      <div className="page-content">
        <div className="about-image-container">
          <img src="/images/tenis.jpg" alt="Tenis" className="about-hero-image" />
        </div>

        <h1>Sobre Nosotros</h1>
        
        <section className="about-section">
          <h2>Quiénes Somos</h2>
          <p>
            404-ERROR es una tienda online especializada en la venta de zapatillas deportivas de las mejores marcas del mundo.
            Nos dedicamos a ofrecer productos de calidad a precios competitivos.
          </p>
        </section>

        <section className="about-section">
          <h2>Nuestra Misión</h2>
          <p>
            Proporcionar a nuestros clientes acceso a los tenis más populares y de mejor calidad, 
            facilitando su compra en línea con un servicio rápido y confiable.
          </p>
        </section>

        <section className="about-section">
          <h2>Por Qué Elegirnos</h2>
          <ul>
            <li>✓ Marcas autorizadas (Nike, Adidas, Puma, etc.)</li>
            <li>✓ Precios competitivos</li>
            <li>✓ Envío rápido</li>
            <li>✓ Servicio al cliente profesional</li>
            <li>✓ Garantía de autenticidad</li>
          </ul>
        </section>

        <section className="about-section contact-section">
          <h2>Contacto</h2>
          <div className="contact-links">
            <p>
              <strong>Email:</strong> 
              <a href="mailto:tellezjorgeariel@gmail.com" target="_blank" rel="noopener noreferrer">
                tellezjorgeariel@gmail.com
              </a>
            </p>
            <p>
              <strong>Teléfono:</strong> 
              <a href="tel:+527321200246">+52 7321200246</a>
            </p>
            <p>
              <strong>Ubicación:</strong> Cuautla, Morelos, México
            </p>
            <div className="social-links">
              <a href="https://www.instagram.com/joras.esh_0/" target="_blank" rel="noopener noreferrer" className="social-btn instagram">
                <i className="fab fa-instagram"></i> Instagram
              </a>
              <a href="https://www.facebook.com/efe.kornat" target="_blank" rel="noopener noreferrer" className="social-btn facebook">
                <i className="fab fa-facebook"></i> Facebook
              </a>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default About;
