 
import { useEffect } from 'react'
import ProductList from '../ProductList/ProductList'
import Hero from '../Hero/Hero';
import BrandCarousel from '../BrandCarousel/BrandCarousel';
import Offers from '../Offers/Offers';
import Features from '../Features/Features';
import Suscribe from '../Suscribe/Suscribe';
import 'aos/dist/aos.css';
import AOS from "aos";

const Home = () => {
  useEffect(() => {
    AOS.init({ duration: 1000, once: true });
    AOS.refresh();
  }, []);
 
  return (
    <>
      <Hero/>
      <BrandCarousel />
      <ProductList />
      <Offers />
      <Features/>
      <Suscribe/>
    </>
  )
}

export default Home