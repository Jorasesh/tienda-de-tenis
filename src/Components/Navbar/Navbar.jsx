import { useCart } from "../CartContext/CartContext";
import "./Navbar.css"
import { Link, useNavigate} from 'react-router-dom'
import { useState, useRef, useEffect } from 'react';

const Navbar = () => {
 const {carrito} = useCart();
 const navigate = useNavigate();
 const [showLogout, setShowLogout] = useState(false);
 const logoutMenuRef = useRef(null);
 const authUser = localStorage.getItem('authUser');
 const [userName, setUserName] = useState('');

 // Obtener el nombre del usuario logueado
 useEffect(() => {
   if (authUser) {
     try {
       const user = JSON.parse(authUser);
       setUserName(user.nombre || user.email || 'Usuario');
     } catch (e) {
       setUserName('Usuario');
     }
   }
 }, [authUser]);

 const totalProductos = carrito.reduce((acc, producto)  => 
  acc + producto.cantidad, 0
)

const handleHome = () => {
  navigate("/")
} 

const handleLoginClick = () => {
  navigate("/login");
}

const handleUserClick = () => {
  setShowLogout(!showLogout);
}

const handleLogout = () => {
  localStorage.removeItem('authUser');
  setShowLogout(false);
  navigate('/');
}

// Cerrar menú al hacer click fuera
useEffect(() => {
  const handleClickOutside = (event) => {
    if (logoutMenuRef.current && !logoutMenuRef.current.contains(event.target)) {
      setShowLogout(false);
    }
  };

  if (showLogout) {
    document.addEventListener('mousedown', handleClickOutside);
  }

  return () => {
    document.removeEventListener('mousedown', handleClickOutside);
  };
}, [showLogout]);

  return (
    <section className='header'>
      <h1 className='logo' onClick={handleHome}>
        <img src="/404.png" alt="404" className="logo-icon" />
        404-<span>ERROR</span>
      </h1>
      <div className="icons">
      <nav className='navbar'>
        <ul className='nav-links'>
          <li>
            <Link to = "/" >Home</Link>
          </li>

        </ul>
      </nav>
        <Link to="/" className='search-button'>  
          <i className='fas fa-search'></i>
        </Link>

        <Link to="/carrito" className='icon-button'>
          <i className='fas fa-shopping-cart'></i>
          <span className='counter' >{totalProductos}</span>
        </Link>

        {!authUser ? (
          <button className='login-button' onClick={handleLoginClick}>
            <i className='fas fa-user'></i> Ingresar
          </button>
        ) : (
          <div className='user-dropdown' ref={logoutMenuRef}>
            <button 
              className='user-button' 
              onClick={handleUserClick}
              title={`Usuario: ${userName}`}
            >
              <i className='fas fa-user-check'></i>
              <span className='user-name'>{userName}</span>
            </button>
            {showLogout && (
              <div className='logout-menu'>
                <button onClick={handleLogout} className='logout-btn'>
                  Cerrar Sesión
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  )
}

export default Navbar