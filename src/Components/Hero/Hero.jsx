import "./Hero.css";
import { Link } from "react-router-dom";
import 'aos/dist/aos.css';
import { useEffect } from "react";
import AOS from 'aos';

const Hero = () => {
    useEffect(() => {
        AOS.refresh();
    }, []);

    return (
        <section className="hero">
            <div className="content" data-aos="fade-up">
                <h1 data-aos="fade-left">Tenis para Todos</h1>
                <p className="shipping" data-aos="fade-up">
                    Ofrecemos envío gratis en todos los pedidos superiores a <strong>$3500</strong>.
                </p>
                <Link className="btn" to="/filtros" data-aos="zoom-in">Ver Tenis</Link>
            </div>
            <div className="image-container" data-aos="fade-up">
                <img src="/images/TenisTodos.png" alt="Tenis" />
            </div>
        </section>
    );
};

export default Hero;
