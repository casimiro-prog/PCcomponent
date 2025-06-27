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

// Usuario de prueba predefinido para login como invitado
export const TEST_USER = {
  email: 'jethalal.gada@gmail.com',
  password: 'babitaji1234',
};

// Usuario alternativo para pruebas
export const GUEST_USER = {
  email: 'invitado@tienda.com',
  password: '123456',
};

export const LOCAL_STORAGE_KEYS = {
  User: 'user',
  Token: 'token',
};

export const LOGIN_CLICK_TYPE = {
  GuestClick: 'guest',
  RegisterClick: 'register',
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

// Tipos de servicio
export const SERVICE_TYPES = {
  HOME_DELIVERY: 'home_delivery',
  PICKUP: 'pickup'
};

// Zonas de Santiago de Cuba con costos de entrega
export const SANTIAGO_ZONES = [
  { id: 'centro', name: 'Centro Histórico', cost: 50 },
  { id: 'vista_alegre', name: 'Vista Alegre', cost: 75 },
  { id: 'sueno', name: 'Sueño', cost: 60 },
  { id: 'san_pedrito', name: 'San Pedrito', cost: 80 },
  { id: 'altamira', name: 'Altamira', cost: 70 },
  { id: 'reparto_flores', name: 'Reparto Flores', cost: 65 },
  { id: 'chicharrones', name: 'Chicharrones', cost: 85 },
  { id: 'los_olmos', name: 'Los Olmos', cost: 90 },
  { id: 'santa_barbara', name: 'Santa Bárbara', cost: 95 },
  { id: 'micro_9', name: 'Micro 9', cost: 100 },
  { id: 'micro_4', name: 'Micro 4', cost: 100 },
  { id: 'alameda', name: 'Alameda', cost: 55 },
  { id: 'puerto', name: 'Puerto', cost: 45 },
  { id: 'siboney', name: 'Siboney', cost: 120 },
  { id: 'ciudamar', name: 'Ciudamar', cost: 110 },
];

export const COUPONS = [
  {
    id: uuid(),
    couponCode: 'DAYA01',
    text: '30% Descuento',
    discountPercent: 30,
    minCartPriceRequired: 150000,
  },
  {
    id: uuid(),
    couponCode: 'BABITA02',
    text: '20% Descuento',
    discountPercent: 20,
    minCartPriceRequired: 100000,
  },
  {
    id: uuid(),
    couponCode: 'TAPU03',
    text: '10% Descuento',
    discountPercent: 10,
    minCartPriceRequired: 50000,
  },
  {
    id: uuid(),
    couponCode: 'BAPUJI04',
    text: '5% Descuento',
    discountPercent: 5,
    minCartPriceRequired: 20000,
  },
];

export const CHARGE_AND_DISCOUNT = {
  deliveryCharge: 0, // Gratis por defecto
  discount: 0, // Sin descuento por defecto
};

export const MIN_DISTANCE_BETWEEN_THUMBS = 1000;

export const MAX_RESPONSES_IN_CACHE_TO_STORE = 50;

// WhatsApp de la tienda
export const STORE_WHATSAPP = '+53 54690878';