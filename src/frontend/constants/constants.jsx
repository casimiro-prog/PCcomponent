import { AiFillGithub, AiFillLinkedin, AiOutlineTwitter } from 'react-icons/ai';
import { v4 as uuid } from 'uuid';

export const FOOTER_LINKS = [
  {
    id: 1,
    icon: <AiOutlineTwitter />,
    url: 'https://twitter.com/Swastik2001',
  },
  {
    id: 2,
    icon: <AiFillLinkedin />,
    url: 'https://www.linkedin.com/in/swastik-patro-2a54bb19b/',
  },
  {
    id: 3,
    icon: <AiFillGithub />,
    url: 'https://github.com/swastikpatro',
  },
];

export const ToastType = {
  Warn: 'warn',
  Info: 'info',
  Success: 'success',
  Error: 'error',
};

export const SORT_TYPE = {
  PRICE_LOW_TO_HIGH: 'precio: menor a mayor',
  PRICE_HIGH_TO_LOW: 'precio: mayor a menor',
  NAME_A_TO_Z: 'nombre: a a z',
  NAME_Z_TO_A: 'nombre: z a a',
};

export const RATINGS = [4, 3, 2, 1];

export const TEST_USER = {
  email: 'jethalal.gada@gmail.com',
  password: 'babitaji1234',
};

export const SUPER_ADMIN = {
  email: 'admin@gadaelectronics.com',
  password: 'root',
};

export const GUEST_USER = {
  email: 'invitado@tienda.com',
  password: '123456',
};

export const LOCAL_STORAGE_KEYS = {
  User: 'user',
  Token: 'token',
  StoreConfig: 'storeConfig',
};

export const LOGIN_CLICK_TYPE = {
  GuestClick: 'guest',
  RegisterClick: 'register',
  AdminClick: 'admin',
};

export const INCREMENT_DECRMENT_TYPE = {
  INCREMENT: 'increment',
  DECREMENT: 'decrement',
};

export const FILTER_INPUT_TYPE = {
  PRICE: 'price',
  COMPANY: 'company',
  SORT: 'sortByOption',
  RATING: 'rating',
  CATEGORY: 'category',
};

export const DELAY_TO_SHOW_LOADER = 500;
export const DELAY_DEBOUNCED_MS = 250;
export const TOTAL_SKELETONS_LENGTH = 10;
export const DELAY_BETWEEN_BLUR_AND_CLICK = 250;
export const CUSTOM_TOASTID = 1;
export const ITEMS_PER_PAGE = 9;

export const ALL_STATES = [
  'Andalucía',
  'Aragón',
  'Asturias',
  'Baleares',
  'Canarias',
  'Cantabria',
  'Castilla-La Mancha',
  'Castilla y León',
  'Cataluña',
  'Ceuta',
  'Comunidad de Madrid',
  'Comunidad Foral de Navarra',
  'Comunidad Valenciana',
  'Extremadura',
  'Galicia',
  'La Rioja',
  'Melilla',
  'País Vasco',
  'Región de Murcia',
];

export const SERVICE_TYPES = {
  HOME_DELIVERY: 'home_delivery',
  PICKUP: 'pickup'
};

// Zonas de Santiago de Cuba con costos de entrega - ACTUALIZADAS
export const SANTIAGO_ZONES = [
  {
    "id": "centro",
    "name": "Centro Histórico",
    "cost": 50
  },
  {
    "id": "vista_alegre",
    "name": "Vista Alegre",
    "cost": 75
  },
  {
    "id": "sueno",
    "name": "Sueño",
    "cost": 60
  },
  {
    "id": "san_pedrito",
    "name": "San Pedrito",
    "cost": 80
  },
  {
    "id": "altamira",
    "name": "Altamira",
    "cost": 70
  },
  {
    "id": "reparto_flores",
    "name": "Reparto Flores",
    "cost": 65
  },
  {
    "id": "chicharrones",
    "name": "Chicharrones",
    "cost": 85
  },
  {
    "id": "los_olmos",
    "name": "Los Olmos",
    "cost": 90
  },
  {
    "id": "santa_barbara",
    "name": "Santa Bárbara",
    "cost": 95
  },
  {
    "id": "micro_9",
    "name": "Micro 9",
    "cost": 100
  },
  {
    "id": "micro_4",
    "name": "Micro 4",
    "cost": 100
  },
  {
    "id": "alameda",
    "name": "Alameda",
    "cost": 55
  },
  {
    "id": "puerto",
    "name": "Puerto",
    "cost": 45
  },
  {
    "id": "siboney",
    "name": "Siboney",
    "cost": 120
  },
  {
    "id": "ciudamar",
    "name": "Ciudamar",
    "cost": 110
  }
];

// Cupones de descuento - ACTUALIZADOS
export const COUPONS = [
  {
    "couponCode": "PEPEP",
    "text": "100% Descuento",
    "discountPercent": 55,
    "minCartPriceRequired": 150000,
    "id": "b6c7a585-79a2-4fde-93cd-80422ef3acfa"
  },
  {
    "couponCode": "PEPE 2",
    "text": "20% Descuento",
    "discountPercent": 20,
    "minCartPriceRequired": 100000,
    "id": "ecdff7ad-f653-467f-9257-7fcd0fdea3a8"
  },
  {
    "couponCode": "PEPE 3",
    "text": "10% Descuento",
    "discountPercent": 10,
    "minCartPriceRequired": 50000,
    "id": "4898bd1c-7227-47b0-b6fe-32159f71072b"
  },
  {
    "couponCode": "PEPE 4",
    "text": "5% Descuento",
    "discountPercent": 5,
    "minCartPriceRequired": 20000,
    "id": "12ee6cb8-1d2d-463d-b9f7-78bcd415c2e4"
  }
];

export const CHARGE_AND_DISCOUNT = {
  deliveryCharge: 0,
  discount: 0,
};

export const MIN_DISTANCE_BETWEEN_THUMBS = 1000;
export const MAX_RESPONSES_IN_CACHE_TO_STORE = 50;

// WhatsApp de la tienda - ACTUALIZADO
export const STORE_WHATSAPP = '+53 54690878';

// Configuración por defecto de la tienda - ACTUALIZADA
export const DEFAULT_STORE_CONFIG = {
  "storeName": "Gada Electronics",
  "whatsappNumber": "+53 54690878",
  "storeAddressId": "store-main-address"
};

// CÓDIGOS DE PAÍSES ACTUALIZADOS CON CUBA INCLUIDO
export const COUNTRY_CODES = [
  { code: '+53', country: 'Cuba', flag: '🇨🇺', minLength: 8, maxLength: 8 },
  { code: '+1', country: 'Estados Unidos/Canadá', flag: '🇺🇸', minLength: 10, maxLength: 10 },
  { code: '+52', country: 'México', flag: '🇲🇽', minLength: 10, maxLength: 10 },
  { code: '+54', country: 'Argentina', flag: '🇦🇷', minLength: 10, maxLength: 11 },
  { code: '+55', country: 'Brasil', flag: '🇧🇷', minLength: 10, maxLength: 11 },
  { code: '+56', country: 'Chile', flag: '🇨🇱', minLength: 8, maxLength: 9 },
  { code: '+57', country: 'Colombia', flag: '🇨🇴', minLength: 10, maxLength: 10 },
  { code: '+58', country: 'Venezuela', flag: '🇻🇪', minLength: 10, maxLength: 10 },
  { code: '+34', country: 'España', flag: '🇪🇸', minLength: 9, maxLength: 9 },
  { code: '+33', country: 'Francia', flag: '🇫🇷', minLength: 10, maxLength: 10 },
  { code: '+39', country: 'Italia', flag: '🇮🇹', minLength: 10, maxLength: 10 },
  { code: '+49', country: 'Alemania', flag: '🇩🇪', minLength: 10, maxLength: 12 },
  { code: '+44', country: 'Reino Unido', flag: '🇬🇧', minLength: 10, maxLength: 10 },
  { code: '+7', country: 'Rusia', flag: '🇷🇺', minLength: 10, maxLength: 10 },
  { code: '+86', country: 'China', flag: '🇨🇳', minLength: 11, maxLength: 11 },
  { code: '+81', country: 'Japón', flag: '🇯🇵', minLength: 10, maxLength: 11 },
  { code: '+82', country: 'Corea del Sur', flag: '🇰🇷', minLength: 10, maxLength: 11 },
  { code: '+91', country: 'India', flag: '🇮🇳', minLength: 10, maxLength: 10 },
];

// ICONOS PARA PRODUCTOS POR CATEGORÍA
export const PRODUCT_CATEGORY_ICONS = {
  'laptop': '💻',
  'tv': '📺',
  'smartwatch': '⌚',
  'earphone': '🎧',
  'mobile': '📱',
  'smartphone': '📱',
  'tablet': '📱',
  'computer': '💻',
  'monitor': '🖥️',
  'keyboard': '⌨️',
  'mouse': '🖱️',
  'speaker': '🔊',
  'camera': '📷',
  'gaming': '🎮',
  'accessories': '🔌',
  'default': '📦'
};

// MENSAJES TRADUCIDOS AL ESPAÑOL
export const SPANISH_MESSAGES = {
  // Navegación
  'Explore': 'Explorar',
  'Login': 'Iniciar Sesión',
  'Profile': 'Perfil',
  'Addresses': 'Direcciones',
  'Admin Panel': 'Panel de Control',
  'Logout': 'Cerrar Sesión',
  
  // Productos
  'Featured Products': 'Productos Destacados',
  'Categories': 'Categorías',
  'In Stock': 'En Stock',
  'Out of Stock': 'Agotado',
  'Shipping Available': 'Envío Disponible',
  'Add to Cart': 'Agregar al Carrito',
  'Add to Wishlist': 'Agregar a Lista de Deseos',
  'Go to Cart': 'Ir al Carrito',
  'Go to Wishlist': 'Ir a Lista de Deseos',
  'Move to Wishlist': 'Mover a Lista de Deseos',
  'Move to Cart': 'Mover al Carrito',
  'Remove from Cart': 'Remover del Carrito',
  'Clear Cart': 'Limpiar Carrito',
  'Clear Wishlist': 'Limpiar Lista de Deseos',
  
  // Carrito y Lista
  'cart': 'carrito',
  'wishlist': 'lista de deseos',
  'Cart Price Details': 'Detalles del Precio del Carrito',
  'Total Price': 'Precio Total',
  'Checkout': 'Finalizar Compra',
  'Your cart is empty! ☹️': 'Tu carrito está vacío! ☹️',
  'Your wishlist is empty! ☹️': 'Tu lista de deseos está vacía! ☹️',
  
  // Checkout
  'Checkout': 'Finalizar Compra',
  'Choose delivery address': 'Elige una dirección de entrega',
  'Price Details': 'Detalles del Precio',
  'Home Delivery': 'Entrega a domicilio',
  'Store Pickup': 'Recoger en local',
  'Place Order via WhatsApp': 'Realizar Pedido por WhatsApp',
  'Your order has been placed successfully 🎉': 'Tu pedido se ha realizado exitosamente 🎉',
  
  // Formularios
  'Name': 'Nombre',
  'Last Name': 'Apellido',
  'Email': 'Correo Electrónico',
  'Password': 'Contraseña',
  'Confirm Password': 'Confirmar Contraseña',
  'Login': 'Iniciar Sesión',
  'Register': 'Registrarse',
  'Create New Account': 'Crear Nueva Cuenta',
  'Guest Login': 'Iniciar como Invitado',
  'Admin Access': 'Acceso Administrador',
  
  // Direcciones
  'New Address': 'Nueva Dirección',
  'Edit Address': 'Editar Dirección',
  'Add new address': 'Agregar nueva dirección',
  'Service Type': 'Tipo de Servicio',
  'Home delivery': 'Entrega a domicilio',
  'Store pickup order': 'Pedido para recoger en el local',
  'Address': 'Dirección',
  'Mobile Number': 'Número de Móvil',
  'Who receives the order?': '¿Quién recibe el pedido?',
  'Want to clarify something?': '¿Quieres aclararnos algo?',
  
  // Botones
  'Save': 'Guardar',
  'Cancel': 'Cancelar',
  'Edit': 'Editar',
  'Delete': 'Eliminar',
  'Update': 'Actualizar',
  'Reset': 'Restablecer',
  'Clear Filters': 'Limpiar Filtros',
  'Apply': 'Aplicar',
  'Export': 'Exportar',
  'Import': 'Importar',
  'Add': 'Agregar',
  
  // Notificaciones
  'Session closed successfully': 'Sesión cerrada exitosamente',
  'Product added to cart': 'Producto agregado al carrito',
  'Product added to wishlist': 'Producto agregado a lista de deseos',
  'Cart cleared successfully': 'Carrito limpiado exitosamente',
  'Wishlist cleared successfully': 'Lista de deseos limpiada exitosamente',
  'Please login to continue': 'Por favor inicia sesión para continuar',
  'Configuration saved successfully': 'Configuración guardada exitosamente',
  
  // Errores
  'Error': 'Error',
  'Error: Product Not Found': 'Error: Producto No Encontrado',
  'Please fill all required fields': 'Por favor completa todos los campos obligatorios',
  'Please enter a valid email': 'Por favor ingresa un email válido',
  'Password must be at least 6 characters': 'La contraseña debe tener al menos 6 caracteres',
  'Passwords do not match': 'Las contraseñas no coinciden'
};