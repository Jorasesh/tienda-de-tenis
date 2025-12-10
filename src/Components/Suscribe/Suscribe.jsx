import React, { useState } from 'react';
import './Suscribe.css';

const Subscribe = () => {
  const [email, setEmail] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`Te has suscrito con el correo: ${email}`);
  };

  return (
    <section className="subscribe">
      <div className="subscribe-container">
        <h2 className="subscribe-title">Suscríbete y recibe un 10% de descuento</h2>
        <p className="subscribe-description">
         ¡Suscríbete ahora y recibe un 20% de descuento en tu primera compra! Mantente al tanto de nuestras últimas colecciones y ofertas exclusivas.
        </p>
        <form className="subscribe-form" onSubmit={handleSubmit}>
          <input 
            type="email" 
            placeholder="Ingresa tu correo" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            className="subscribe-input" 
            required 
          />
          <button type="submit" className="subscribe-btn">SUSCRÍBETE</button>
        </form>
      </div>
    </section>
  );
};

export default Subscribe;
