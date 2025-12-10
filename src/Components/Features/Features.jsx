import React, { useEffect } from 'react';
import './Features.css';
import AOS from 'aos';
import 'aos/dist/aos.css'; 

const Features = () => {
  useEffect(() => {
    AOS.refresh()
  }, []);

  return (
    <section className="features">
      <div className="feature-card" data-aos="fade-up">
        <i className="fas fa-shoe-prints feature-icon"></i>
        <h3>Tenis de Calidad</h3>
        <p>Encuentra tenis para todas las ocasiones, con la mejor calidad y los mejores precios.</p>
      </div>
      <div className="feature-card" data-aos="fade-up" data-aos-delay="200">
        <i className="fas fa-running feature-icon"></i>
        <h3>Tenis de Moda</h3>
        <p>Tenis cómodos y elegantes para cada temporada, siempre a la vanguardia con las marcas líderes.</p>
      </div>
      <div className="feature-card" data-aos="fade-up" data-aos-delay="400">
        <i className="fas fa-gift feature-icon"></i>
        <h3>Regalos Perfectos</h3>
        <p>Encuentra el regalo ideal para esa persona especial, tenis de todos los estilos.</p>
      </div>
      <div className="feature-card" data-aos="fade-up" data-aos-delay="600">
        <i className="fas fa-truck feature-icon"></i>
        <h3>Envíos Rápidos</h3>
        <p>Realizamos envíos rápidos a cualquier parte para que recibas tus productos a tiempo.</p>
      </div>
    </section>
  );
};

export default Features;
