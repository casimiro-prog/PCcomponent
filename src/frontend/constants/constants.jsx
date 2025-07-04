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
  email: 'yero.shop@gmail.com',
  password: 'yeroi1234',
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
  Currency: 'selectedCurrency',
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
    "name": "Nuevo Vista Alegre",
    "cost": 100
  },
  {
    "id": "vista_alegre",
    "name": "Vista Alegre",
    "cost": 75
  },
  {
    "id": "sueno",
    "name": "Sueño",
    "cost": 300
  },
  {
    "id": "san_pedrito",
    "name": "San Pedrito",
    "cost": 250
  },
  {
    "id": "altamira",
    "name": "Altamira",
    "cost": 500
  },
  {
    "id": "reparto_flores",
    "name": "Reparto Flores",
    "cost": 350
  },
  {
    "id": "micro_9",
    "name": "Micro 7, 8 , 9",
    "cost": 300
  },
  {
    "id": "micro_4",
    "name": "Micro 4",
    "cost": 100
  },
  {
    "id": "alameda",
    "name": "Alameda",
    "cost": 300
  },
  {
    "id": "puerto",
    "name": "El Caney",
    "cost": 800
  },
  {
    "id": "siboney",
    "name": "Quintero",
    "cost": 500
  },
  {
    "id": "ciudamar",
    "name": "Distrito José Martí",
    "cost": 500
  },
  {
    "id": "marimon",
    "name": "Marimon",
    "cost": 300
  },
  {
    "id": "los_cangrejitos",
    "name": "Los cangrejitos",
    "cost": 350
  },
  {
    "id": "trocha",
    "name": "Trocha",
    "cost": 350
  },
  {
    "id": "versalles",
    "name": "Versalles",
    "cost": 800
  },
  {
    "id": "portuondo",
    "name": "Portuondo",
    "cost": 500
  },
  {
    "id": "30_de_noviembre",
    "name": "30 de Noviembre",
    "cost": 500
  },
  {
    "id": "rajayoga",
    "name": "Rajayoga",
    "cost": 600
  },
  {
    "id": "antonio_maceo",
    "name": "Antonio Maceo",
    "cost": 500
  },
  {
    "id": "los_pinos",
    "name": "Los Pinos",
    "cost": 400
  }
];

// Cupones de descuento - ACTUALIZADOS
export const COUPONS = [
  {
    "couponCode": "100% AHORRO",
    "text": "100% Descuento",
    "discountPercent": 55,
    "minCartPriceRequired": 300000,
    "id": "b6c7a585-79a2-4fde-93cd-80422ef3acfa"
  },
  {
    "couponCode": "20% REGALO",
    "text": "20% Descuento",
    "discountPercent": 20,
    "minCartPriceRequired": 200000,
    "id": "ecdff7ad-f653-467f-9257-7fcd0fdea3a8"
  },
  {
    "couponCode": "10% PROMO",
    "text": "10% Descuento",
    "discountPercent": 10,
    "minCartPriceRequired": 100000,
    "id": "4898bd1c-7227-47b0-b6fe-32159f71072b"
  },
  {
    "couponCode": "5% MENOS",
    "text": "5% Descuento",
    "discountPercent": 5,
    "minCartPriceRequired": 50000,
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
  "storeName": "Yero Shop!",
  "whatsappNumber": "+53 54690878",
  "storeAddress": "Santiago de Cuba, Cuba",
  "lastModified": "2025-07-04T06:02:08.139Z",
  "version": "1.0.0"
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

// CONSTANTES DE MONEDA
export const CURRENCIES = {
  CUP: {
    code: 'CUP',
    name: 'Peso Cubano',
    symbol: '$',
    flag: '🇨🇺',
    rate: 1,
  },
  USD: {
    code: 'USD',
    name: 'Dólar Estadounidense',
    symbol: '$',
    flag: '🇺🇸',
    rate: 320,
  },
  EUR: {
    code: 'EUR',
    name: 'Euro',
    symbol: '€',
    flag: '🇪🇺',
    rate: 340,
  },
  MLC: {
    code: 'MLC',
    name: 'Moneda Libremente Convertible',
    symbol: 'MLC',
    flag: '🏦',
    rate: 270,
  },
};

export const DEFAULT_CURRENCY = 'CUP';

// MAPEO DE COLORES HEXADECIMALES A NOMBRES
export const COLOR_NAMES = {
  '#000000': 'Negro',
  '#ffffff': 'Blanco',
  '#ff0000': 'Rojo',
  '#00ff00': 'Verde',
  '#0000ff': 'Azul',
  '#ffff00': 'Amarillo',
  '#ff00ff': 'Magenta',
  '#00ffff': 'Cian',
  '#800000': 'Marrón',
  '#808000': 'Oliva',
  '#008000': 'Verde Oscuro',
  '#800080': 'Púrpura',
  '#008080': 'Verde Azulado',
  '#000080': 'Azul Marino',
  '#c0c0c0': 'Plata',
  '#808080': 'Gris',
  '#ffa500': 'Naranja',
  '#ffc0cb': 'Rosa',
  '#a52a2a': 'Marrón Rojizo',
  '#dda0dd': 'Ciruela',
  '#98fb98': 'Verde Pálido',
  '#f0e68c': 'Caqui',
  '#deb887': 'Madera',
  '#5f9ea0': 'Azul Cadete',
  '#ff1493': 'Rosa Intenso',
  '#00bfff': 'Azul Cielo',
  '#32cd32': 'Verde Lima',
  '#ffd700': 'Dorado',
  '#dc143c': 'Carmesí',
  '#00ced1': 'Turquesa Oscuro',
  '#ff6347': 'Tomate',
  '#40e0d0': 'Turquesa',
  '#ee82ee': 'Violeta',
  '#90ee90': 'Verde Claro',
  '#ffb6c1': 'Rosa Claro',
  '#add8e6': 'Azul Claro',
  '#f0f8ff': 'Azul Alicia',
  '#faebd7': 'Blanco Antiguo',
  '#7fffd4': 'Aguamarina',
  '#f5f5dc': 'Beige',
  '#ffe4c4': 'Bizcocho',
  '#a52a2a': 'Marrón',
  '#deb887': 'Madera Clara',
  '#5f9ea0': 'Azul Cadete',
  '#7fff00': 'Verde Chartreuse',
  '#d2691e': 'Chocolate',
  '#ff7f50': 'Coral',
  '#6495ed': 'Azul Aciano',
  '#fff8dc': 'Seda de Maíz',
  '#dc143c': 'Carmesí',
  '#00008b': 'Azul Oscuro',
  '#008b8b': 'Cian Oscuro',
  '#b8860b': 'Vara de Oro Oscura',
  '#a9a9a9': 'Gris Oscuro',
  '#006400': 'Verde Oscuro',
  '#bdb76b': 'Caqui Oscuro',
  '#8b008b': 'Magenta Oscuro',
  '#556b2f': 'Verde Oliva Oscuro',
  '#ff8c00': 'Naranja Oscuro',
  '#9932cc': 'Orquídea Oscuro',
  '#8b0000': 'Rojo Oscuro',
  '#e9967a': 'Salmón Oscuro',
  '#8fbc8f': 'Verde Mar Oscuro',
  '#483d8b': 'Azul Pizarra Oscuro',
  '#2f4f4f': 'Gris Pizarra Oscuro',
  '#00ced1': 'Turquesa Oscuro',
  '#9400d3': 'Violeta Oscuro',
  '#ff1493': 'Rosa Intenso',
  '#00bfff': 'Azul Cielo Intenso',
  '#696969': 'Gris Tenue',
  '#1e90ff': 'Azul Dodger',
  '#b22222': 'Ladrillo Refractario',
  '#fffaf0': 'Blanco Floral',
  '#228b22': 'Verde Bosque',
  '#dcdcdc': 'Gainsboro',
  '#f8f8ff': 'Blanco Fantasma',
  '#ffd700': 'Oro',
  '#daa520': 'Vara de Oro',
  '#808080': 'Gris',
  '#008000': 'Verde',
  '#adff2f': 'Verde Amarillo',
  '#f0fff0': 'Rocío de Miel',
  '#ff69b4': 'Rosa Caliente',
  '#cd5c5c': 'Rojo Indio',
  '#4b0082': 'Índigo',
  '#fffff0': 'Marfil',
  '#f0e68c': 'Caqui',
  '#e6e6fa': 'Lavanda',
  '#fff0f5': 'Rubor Lavanda',
  '#7cfc00': 'Verde Césped',
  '#fffacd': 'Gasa de Limón',
  '#add8e6': 'Azul Claro',
  '#f08080': 'Coral Claro',
  '#e0ffff': 'Cian Claro',
  '#fafad2': 'Vara de Oro Clara',
  '#d3d3d3': 'Gris Claro',
  '#90ee90': 'Verde Claro',
  '#ffb6c1': 'Rosa Claro',
  '#ffa07a': 'Salmón Claro',
  '#20b2aa': 'Verde Mar Claro',
  '#87cefa': 'Azul Cielo Claro',
  '#778899': 'Gris Pizarra Claro',
  '#b0c4de': 'Azul Acero Claro',
  '#ffffe0': 'Amarillo Claro',
  '#00ff00': 'Lima',
  '#32cd32': 'Verde Lima',
  '#faf0e6': 'Lino',
  '#ff00ff': 'Magenta',
  '#800000': 'Granate',
  '#66cdaa': 'Aguamarina Medio',
  '#0000cd': 'Azul Medio',
  '#ba55d3': 'Orquídea Medio',
  '#9370db': 'Púrpura Medio',
  '#3cb371': 'Verde Mar Medio',
  '#7b68ee': 'Azul Pizarra Medio',
  '#00fa9a': 'Verde Primavera Medio',
  '#48d1cc': 'Turquesa Medio',
  '#c71585': 'Rojo Violeta Medio',
  '#191970': 'Azul Medianoche',
  '#f5fffa': 'Crema de Menta',
  '#ffe4e1': 'Rosa Brumoso',
  '#ffe4b5': 'Mocasín',
  '#ffdead': 'Blanco Navajo',
  '#000080': 'Azul Marino',
  '#fdf5e6': 'Encaje Antiguo',
  '#808000': 'Oliva',
  '#6b8e23': 'Verde Oliva Opaco',
  '#ffa500': 'Naranja',
  '#ff4500': 'Rojo Naranja',
  '#da70d6': 'Orquídea',
  '#eee8aa': 'Vara de Oro Pálida',
  '#98fb98': 'Verde Pálido',
  '#afeeee': 'Turquesa Pálido',
  '#db7093': 'Rojo Violeta Pálido',
  '#ffefd5': 'Látigo de Papaya',
  '#ffdab9': 'Melocotón',
  '#cd853f': 'Perú',
  '#ffc0cb': 'Rosa',
  '#dda0dd': 'Ciruela',
  '#b0e0e6': 'Azul Polvo',
  '#800080': 'Púrpura',
  '#ff0000': 'Rojo',
  '#bc8f8f': 'Rosa Marrón',
  '#4169e1': 'Azul Real',
  '#8b4513': 'Marrón Silla',
  '#fa8072': 'Salmón',
  '#f4a460': 'Marrón Arena',
  '#2e8b57': 'Verde Mar',
  '#fff5ee': 'Concha Marina',
  '#a0522d': 'Siena',
  '#c0c0c0': 'Plata',
  '#87ceeb': 'Azul Cielo',
  '#6a5acd': 'Azul Pizarra',
  '#708090': 'Gris Pizarra',
  '#fffafa': 'Nieve',
  '#00ff7f': 'Verde Primavera',
  '#4682b4': 'Azul Acero',
  '#d2b48c': 'Bronceado',
  '#008080': 'Verde Azulado',
  '#d8bfd8': 'Cardo',
  '#ff6347': 'Tomate',
  '#40e0d0': 'Turquesa',
  '#ee82ee': 'Violeta',
  '#f5deb3': 'Trigo',
  '#ffffff': 'Blanco',
  '#f5f5f5': 'Humo Blanco',
  '#ffff00': 'Amarillo',
  '#9acd32': 'Verde Amarillo'
};