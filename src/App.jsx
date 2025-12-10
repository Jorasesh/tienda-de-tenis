 import {BrowserRouter as Router, Routes, Route } from "react-router-dom"
import Home from "./Components/Home/Home"
import Navbar from "./Components/Navbar/Navbar"
import DetailsProduct from "./Components/DetailsProduct/DetailsProduct"
import { CartProvider } from "./Components/CartContext/CartContext"
import Cart from "./Components/Cart/Cart"
import Checkout from "./Components/Checkout/Checkout"
import { useState } from "react"
import Filters from "./Components/Filters/Filters"
import Footer from "./Components/Footer/Footer"
import Login from "./Components/Login/Login"
import AdminDashboard from "./Components/AdminDashboard/AdminDashboard"
import ProtectedRoute from "./Components/ProtectedRoute/ProtectedRoute"
import About from "./Components/About/About"
import Delivery from "./Components/Delivery/Delivery"
import Privacy from "./Components/Privacy/Privacy"
 
function App() {
  const isAdminPage = window.location.pathname.includes('/admin');

  return (
    <>
      <CartProvider> 
     <Router>
     {!isAdminPage && <Navbar /> }
     <Routes> 
     <Route path="/" element ={  <Home /> }/>
     <Route path="/filtros" element ={  <Filters /> }/>
     <Route path="/producto/:id" element ={  <DetailsProduct/> }/>
     <Route path="/carrito" element ={  <Cart/> }/>
     <Route path="/checkout" element ={  <Checkout/> }/>
     <Route path="/login" element ={  <Login/> }/>
     <Route path="/admin/dashboard" element ={  <ProtectedRoute requiredType="admin"><AdminDashboard /></ProtectedRoute> }/>
     <Route path="/about" element ={  <About/> }/>
     <Route path="/delivery" element ={  <Delivery/> }/>
     <Route path="/privacy" element ={  <Privacy/> }/>
     </Routes> 
     {!isAdminPage && <Footer/> }
     </Router>
     </CartProvider>
    </>
  )
}

export default App
