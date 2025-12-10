# 404-ERROR - Tienda de Tenis Online

Plataforma de e-commerce especializada en la venta de zapatillas deportivas con autenticación, carrito de compras y panel administrativo.

## 🚀 Características Principales

- ✅ Catálogo de productos con filtros (Hombres, Mujeres, Niños)
- ✅ Carrito de compras con gestión de cantidades
- ✅ Sistema de autenticación (Login/Registro)
- ✅ Checkout de 3 pasos (Envío, Pago, Confirmación)
- ✅ Panel administrativo para visualizar órdenes
- ✅ Integración con Firebase Firestore
- ✅ Búsqueda de productos
- ✅ Página de detalles de productos
- ✅ Responsivo y optimizado

## 📋 Credenciales de Acceso

### Usuarios Regulares
| Email | Contraseña | Tipo |
|-------|-----------|------|
| daejmz@gmail.com | user123 | Usuario |
| jvfuez@gmail.com | user123 | Usuario |

### Administrador
| Email | Contraseña | Tipo |
|-------|-----------|------|
| tellezjorgeariel@gmail.com | admin123 | Admin |

## 🛠 Tecnologías Utilizadas

- **React 18.3.1** - Framework de UI
- **React Router 7.0.2** - Enrutamiento
- **Vite 6.4.1** - Build tool
- **Firebase 12.6.0** - Backend y Firestore
- **Font Awesome** - Iconografía
- **CSS3** - Estilos

## 📁 Estructura del Proyecto

```
ecommerce/
├── src/
│   ├── Components/
│   │   ├── Navbar/
│   │   ├── Hero/
│   │   ├── ProductList/
│   │   ├── Cart/
│   │   ├── Checkout/
│   │   ├── Login/
│   │   ├── AdminDashboard/
│   │   └── ... (más componentes)
│   ├── config/
│   │   ├── firebase.js
│   │   ├── productosService.js
│   │   └── ordenesService.js
│   ├── App.jsx
│   └── main.jsx
├── public/
│   ├── images/
│   └── 404.png (favicon)
├── package.json
└── vite.config.js
```

## 🚀 Instalación y Ejecución

### Desarrollo
```bash
npm install
npm run dev
```

### Producción
```bash
npm install
npm run build
npm preview
```

## 📊 Rutas Disponibles

| Ruta | Descripción |
|------|-------------|
| `/` | Página de inicio |
| `/login` | Login/Registro de usuarios |
| `/filtros` | Catálogo con filtros |
| `/producto/:id` | Detalle de producto |
| `/carrito` | Carrito de compras |
| `/checkout` | Proceso de compra (3 pasos) |
| `/about` | Sobre nosotros |
| `/admin/dashboard` | Panel administrativo (solo admin) |

## 🔐 Autenticación

- Los usuarios deben estar logueados para agregar productos al carrito
- Los administradores acceden automáticamente al panel de control
- Las sesiones se guardan en localStorage
- Firebase autentica y valida las credenciales

## 💳 Proceso de Compra

1. **Envío:** Recoge datos de dirección
2. **Pago:** Información de tarjeta (simulado)
3. **Confirmación:** Resumen de la orden y confirmación

Las órdenes se guardan automáticamente en Firebase Firestore.

## 📝 Variables de Entorno

Crear archivo `.env` con:
```
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
```

## 📞 Contacto

- **Email:** tellezjorgeariel@gmail.com
- **Teléfono:** +52 7321200246
- **Instagram:** https://www.instagram.com/joras.esh_0/
- **Facebook:** https://www.facebook.com/efe.kornat

## 📄 Licencia

Proyecto desarrollado para 404-ERROR Tienda de Tenis.

---

**Última actualización:** Diciembre 2025
