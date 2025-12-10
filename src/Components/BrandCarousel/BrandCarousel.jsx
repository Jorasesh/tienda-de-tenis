import { useState, useEffect } from 'react';
import './BrandCarousel.css';
import AOS from 'aos';
import 'aos/dist/aos.css';

const BrandCarousel = () => {
    const [currentSlide, setCurrentSlide] = useState(0);

    const brands = [
        {
            name: 'Nike',
            logo: 'http://pngimg.com/uploads/nike/nike_PNG12.png',
            color: '#FF6B35'
        },
        {
            name: 'Adidas',
            logo: 'https://freepnglogo.com/images/all_img/1729263756_Old_Adidas_Logo_PNG.png',
            color: '#004B87'
        },
        {
            name: 'Converse',
            logo: 'https://logospng.org/download/converse/converse-4096.png',
            color: '#000000'
        },
        {
            name: 'Reebok',
            logo: 'http://pluspng.com/img-png/reebok-logo-png-reebok-logo-png-photos-736.png',
            color: '#221E22'
        },
        {
            name: 'Puma',
            logo: 'https://logos-world.net/wp-content/uploads/2020/04/Puma-Logo.png',
            color: '#EF3B36'
        },
        {
            name: 'New Balance',
            logo: 'https://www.freepnglogos.com/uploads/new-balance-png-logo/new-balance-logo-png-white-0.png',
            color: '#CE1126'
        },
        {
            name: 'Vans',
            logo: 'http://pngimg.com/uploads/vans/vans_PNG45.png',
            color: '#1D1D1D'
        },
        {
            name: 'ASICS',
            logo: 'https://cdn.freebiesupply.com/logos/large/2x/asics-6-logo-png-transparent.png',
            color: '#000000'
        }
    ];

    useEffect(() => {
        AOS.refresh();
        const interval = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % brands.length);
        }, 4000);
        return () => clearInterval(interval);
    }, []);

    const goToPrevious = () => {
        setCurrentSlide((prev) => (prev - 1 + brands.length) % brands.length);
    };

    const goToNext = () => {
        setCurrentSlide((prev) => (prev + 1) % brands.length);
    };

    const getVisibleBrands = () => {
        const visibleBrands = [];
        for (let i = 0; i < 3; i++) {
            visibleBrands.push(brands[(currentSlide + i) % brands.length]);
        }
        return visibleBrands;
    };

    return (
        <section className="brand-carousel" data-aos="fade-up">
            <div className="carousel-container">
                <h2>Marcas Disponibles</h2>
                <div className="carousel-wrapper">
                    <button className="carousel-btn prev-btn" onClick={goToPrevious}>
                        &#10094;
                    </button>
                    
                    <div className="carousel-slides">
                        {getVisibleBrands().map((brand, index) => (
                            <div 
                                key={index} 
                                className="brand-card"
                                style={{ '--brand-color': brand.color }}
                            >
                                <img src={brand.logo} alt={brand.name} />
                                <h3>{brand.name}</h3>
                            </div>
                        ))}
                    </div>

                    <button className="carousel-btn next-btn" onClick={goToNext}>
                        &#10095;
                    </button>
                </div>

                <div className="carousel-indicators">
                    {brands.map((_, index) => (
                        <button
                            key={index}
                            className={`indicator ${index === currentSlide ? 'active' : ''}`}
                            onClick={() => setCurrentSlide(index)}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default BrandCarousel;
