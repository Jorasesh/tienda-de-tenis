import { useNavigate } from 'react-router-dom';
import './Privacy.css';

function Privacy() {
  const navigate = useNavigate();

  return (
    <div className="page-container">
      <button className="back-btn" onClick={() => navigate('/')}>← Volver</button>
      
      <div className="page-content">
        <h1>Política de Privacidad</h1>
        
        <section className="about-section">
          <h2>Introducción</h2>
          <p>
            En 404-ERROR, la privacidad de nuestros clientes es muy importante para nosotros. 
            Esta política describe cómo recopilamos, usamos y protegemos tu información personal.
          </p>
        </section>

        <section className="about-section">
          <h2>Información que Recopilamos</h2>
          <p>Recopilamos la siguiente información:</p>
          <ul>
            <li>Nombre y apellido</li>
            <li>Dirección de correo electrónico</li>
            <li>Número de teléfono</li>
            <li>Dirección de envío</li>
            <li>Información de pago</li>
            <li>Historial de compras</li>
          </ul>
        </section>

        <section className="about-section">
          <h2>Cómo Usamos Tu Información</h2>
          <p>Utilizamos tu información para:</p>
          <ul>
            <li>Procesar tus pedidos y entregas</li>
            <li>Comunicarnos contigo sobre tu compra</li>
            <li>Mejorar nuestros servicios</li>
            <li>Enviar promociones y ofertas (con tu consentimiento)</li>
            <li>Prevenir fraude</li>
          </ul>
        </section>

        <section className="about-section">
          <h2>Protección de Datos</h2>
          <p>
            Implementamos medidas de seguridad técnicas y organizativas para proteger tu información 
            personal contra acceso no autorizado, alteración, divulgación o destrucción.
          </p>
        </section>

        <section className="about-section">
          <h2>Cookies</h2>
          <p>
            Nuestro sitio utiliza cookies para mejorar tu experiencia de usuario. 
            Puedes configurar tu navegador para rechazar cookies si lo deseas.
          </p>
        </section>

        <section className="about-section">
          <h2>Derechos del Usuario</h2>
          <p>Tienes derecho a:</p>
          <ul>
            <li>Acceder a tu información personal</li>
            <li>Solicitar la corrección de datos incorrectos</li>
            <li>Solicitar la eliminación de tus datos</li>
            <li>Retirar tu consentimiento en cualquier momento</li>
          </ul>
        </section>

        <section className="about-section">
          <h2>Contacto</h2>
          <p>
            Si tienes preguntas sobre esta política, contáctanos en: tellezjorgeariel@gmail.com
          </p>
        </section>

        <section className="about-section">
          <h2>Cambios en la Política</h2>
          <p>
            Nos reservamos el derecho de actualizar esta política de privacidad en cualquier momento. 
            Los cambios serán efectivos tan pronto como se publiquen en nuestro sitio web.
          </p>
        </section>
      </div>
    </div>
  );
}

export default Privacy;
