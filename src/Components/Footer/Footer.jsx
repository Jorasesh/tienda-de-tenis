import "./Footer.css";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        {/* Sección izquierda */}
        <div className="footer-section">
        <h1   className="logo">404-<span>ERROR</span></h1>
          <p className="footer-text">
            En 404-ERROR nos especializamos en ofrecer tenis modernos y de calidad para todos.
         </p>
        </div>

        {/* Sección del medio */}
        <div className="footer-section">
          <h3 className="footer-heading">COMPAÑÍA</h3>
          <ul className="footer-links">
            <li><Link to="/" style={{color: 'inherit', textDecoration: 'none'}}>Hogar</Link></li>
            <li><Link to="/about" style={{color: 'inherit', textDecoration: 'none'}}>Sobre nosotros</Link></li>
            <li><Link to="/delivery" style={{color: 'inherit', textDecoration: 'none'}}>Entrega</Link></li>
            <li><Link to="/privacy" style={{color: 'inherit', textDecoration: 'none'}}>Política de privacidad</Link></li>
          </ul>
        </div>

        {/* Sección derecha */}
        <div className="footer-section">
          <h3 className="footer-heading">CONTÁCTENOS</h3>
          <ul className="footer-links">
            <li>
              <a href="tel:+527321200246" target="_blank" rel="noopener noreferrer">
                +52 7321200246
              </a>
            </li>
            <li>Cuautla, Morelos, México</li>
            <li>
              <a href="mailto:tellezjorgeariel@gmail.com" target="_blank" rel="noopener noreferrer">
                tellezjorgeariel@gmail.com
              </a>
            </li>
            <li className="social-icons">
              <a href="https://www.instagram.com/joras.esh_0/" target="_blank" rel="noopener noreferrer" title="Instagram">
                <i className="fab fa-instagram"></i>
              </a>
              <a href="https://www.facebook.com/efe.kornat" target="_blank" rel="noopener noreferrer" title="Facebook">
                <i className="fab fa-facebook"></i>
              </a>
            </li>
          </ul>
        </div>
      </div>

      {/* Línea divisoria y pie inferior */}
      <div className="footer-bottom">
        <hr />
        <p>Copyright 2025© edukuk.dev - Todos los derechos reservados.</p>
      </div>
    </footer>
  );
};

export default Footer;