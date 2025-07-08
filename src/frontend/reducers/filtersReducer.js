import { SORT_TYPE } from '../constants/constants';
import { FILTERS_ACTION } from '../utils/actions';
import {
  convertArrayToObjectWithPropertyFALSE,
  givePaginatedList,
  lowerizeAndCheckIncludes,
} from '../utils/utils';

export const initialFiltersState = {
  allProducts: [],
  filteredProducts: [],
  minPrice: 0,
  maxPrice: Infinity, // will be handled
  filters: {
    search: '',
    category: null,
    company: 'all',
    price: [0, 0],
    rating: -1,
    sortByOption: '',
  },
  paginateIndex: 0,
  displayableProductsLength: 0,
};

/* 
  category: {
    laptop: false,
    tv: false,
    earphone: false,
    smartwatch: false,
    mobile: false
  }
*/

// FUNCIÓN COMPLETAMENTE MEJORADA PARA RANGOS DE PRECIO DINÁMICOS Y ADAPTATIVOS
const calculateSmartPriceRange = (products) => {
  console.log('🔍 Calculando rango inteligente de precios para', products?.length || 0, 'productos');
  
  if (!products || products.length === 0) {
    console.log('⚠️ No hay productos, usando rango mínimo por defecto');
    return { minPrice: 0, maxPrice: 1000 };
  }

  // Filtrar productos con precios válidos y mayores a 0
  const validProducts = products.filter(product => 
    product && 
    typeof product.price === 'number' && 
    product.price > 0 && 
    !isNaN(product.price) &&
    isFinite(product.price)
  );
  
  if (validProducts.length === 0) {
    console.log('⚠️ No hay productos con precios válidos, usando rango mínimo');
    return { minPrice: 0, maxPrice: 1000 };
  }

  const prices = validProducts.map(({ price }) => price).sort((a, b) => a - b);
  const realMinPrice = prices[0];
  const realMaxPrice = prices[prices.length - 1];
  
  console.log(`📊 Precios reales: Min=${realMinPrice.toLocaleString()}, Max=${realMaxPrice.toLocaleString()}`);
  
  // LÓGICA INTELIGENTE PARA RANGOS PEQUEÑOS Y GRANDES
  let minPrice, maxPrice, step;
  
  if (realMaxPrice <= 100) {
    // Productos muy baratos (0-100)
    minPrice = 0;
    maxPrice = Math.ceil(realMaxPrice / 10) * 10; // Redondear a decenas
    step = 5;
    console.log('💰 Rango detectado: MUY ECONÓMICO (0-100)');
    
  } else if (realMaxPrice <= 500) {
    // Productos económicos (100-500)
    minPrice = 0;
    maxPrice = Math.ceil(realMaxPrice / 50) * 50; // Redondear a 50s
    step = 25;
    console.log('💰 Rango detectado: ECONÓMICO (100-500)');
    
  } else if (realMaxPrice <= 2000) {
    // Productos de precio medio (500-2000)
    minPrice = 0;
    maxPrice = Math.ceil(realMaxPrice / 100) * 100; // Redondear a centenas
    step = 50;
    console.log('💰 Rango detectado: PRECIO MEDIO (500-2000)');
    
  } else if (realMaxPrice <= 10000) {
    // Productos caros (2000-10000)
    minPrice = 0;
    maxPrice = Math.ceil(realMaxPrice / 500) * 500; // Redondear a 500s
    step = 250;
    console.log('💰 Rango detectado: CARO (2000-10000)');
    
  } else if (realMaxPrice <= 50000) {
    // Productos muy caros (10000-50000)
    minPrice = 0;
    maxPrice = Math.ceil(realMaxPrice / 1000) * 1000; // Redondear a miles
    step = 500;
    console.log('💰 Rango detectado: MUY CARO (10000-50000)');
    
  } else {
    // Productos premium (50000+)
    minPrice = 0;
    maxPrice = Math.ceil(realMaxPrice / 5000) * 5000; // Redondear a 5000s
    step = 2500;
    console.log('💰 Rango detectado: PREMIUM (50000+)');
  }
  
  // Asegurar que el máximo sea al menos un paso mayor que el mínimo
  if (maxPrice <= minPrice) {
    maxPrice = minPrice + step * 4;
  }
  
  // Agregar un pequeño buffer al máximo para incluir todos los productos
  const buffer = Math.max(step, (realMaxPrice - realMinPrice) * 0.05);
  maxPrice = Math.max(maxPrice, realMaxPrice + buffer);
  
  console.log(`💰 Rango final optimizado: ${minPrice.toLocaleString()} - ${maxPrice.toLocaleString()} CUP`);
  console.log(`🎯 Paso recomendado: ${step.toLocaleString()}`);
  console.log(`📈 Buffer aplicado: ${buffer.toLocaleString()}`);
  
  return {
    minPrice: Math.floor(minPrice),
    maxPrice: Math.ceil(maxPrice),
    recommendedStep: step
  };
};

// Función para sincronizar el rango de precios con productos actualizados
const syncPriceRangeWithProducts = (state, newProducts) => {
  const { minPrice, maxPrice, recommendedStep } = calculateSmartPriceRange(newProducts);
  
  // Actualizar el rango de precios en los filtros si es necesario
  const currentPriceFilter = state.filters.price;
  const needsUpdate = 
    currentPriceFilter[0] < minPrice || 
    currentPriceFilter[1] > maxPrice ||
    (currentPriceFilter[0] === state.minPrice && currentPriceFilter[1] === state.maxPrice);
  
  const updatedPriceFilter = needsUpdate ? [minPrice, maxPrice] : currentPriceFilter;
  
  console.log(`🔄 Sincronización de precios: ${needsUpdate ? 'ACTUALIZADO' : 'MANTENIDO'}`);
  
  return {
    minPrice,
    maxPrice,
    priceFilter: updatedPriceFilter,
    recommendedStep
  };
};

export const filtersReducer = (state, action) => {
  switch (action.type) {
    case FILTERS_ACTION.GET_PRODUCTS_FROM_PRODUCT_CONTEXT:
      const allProductsCloned = structuredClone(action.payload?.products);

      const filteredProducts = givePaginatedList(allProductsCloned);

      const allCategoryNames = action.payload?.categories
        ?.filter(category => !category.disabled) // Solo categorías habilitadas
        ?.map(({ categoryName }) => categoryName) || [];

      // Calcular rango de precios inteligente y adaptativo
      const { minPrice, maxPrice, recommendedStep } = calculateSmartPriceRange(allProductsCloned);

      return {
        ...state,
        allProducts: allProductsCloned,
        filteredProducts,
        minPrice,
        maxPrice,
        recommendedStep,
        filters: {
          ...state.filters,
          category: convertArrayToObjectWithPropertyFALSE(allCategoryNames),
          price: [minPrice, maxPrice],
        },
      };

    case FILTERS_ACTION.UPDATE_CATEGORY:
      return {
        ...state,
        filters: {
          ...state.filters,
          category: {
            ...state.filters.category,
            [action.payloadCategory]:
              !state.filters.category[action.payloadCategory],
          },
        },
      };

    case FILTERS_ACTION.UPDATE_SEARCH_FILTER:
      return {
        ...state,
        filters: {
          ...state.filters,
          search: action.payloadSearch,
        },
      };

    // called onchange of filters
    case FILTERS_ACTION.UPDATE_FILTERS:
      return {
        ...state,
        filters: {
          ...state.filters,
          [action.payload.payloadName]: action.payload.payloadValue,
        },
        paginateIndex: 0,
      };

    case FILTERS_ACTION.CHECK_CATEGORY:
      return {
        ...state,
        filters: {
          ...state.filters,
          category: {
            ...state.category,
            [action.payloadCategory]: true,
          },
        },
      };

    case FILTERS_ACTION.CLEAR_FILTERS:
      const { category } = state.filters;
      const allUncheckedCategoryObj = convertArrayToObjectWithPropertyFALSE(
        Object.keys(category)
      );
      
      // Recalcular rango de precios al limpiar filtros para asegurar sincronización
      const { minPrice: resetMinPrice, maxPrice: resetMaxPrice, recommendedStep: resetStep } = calculateSmartPriceRange(state.allProducts);
      
      console.log('🧹 Limpiando filtros y recalculando rango de precios inteligente');
      
      return {
        ...state,
        minPrice: resetMinPrice,
        maxPrice: resetMaxPrice,
        recommendedStep: resetStep,
        filters: {
          ...state.filters,
          search: '',
          category: allUncheckedCategoryObj,
          company: 'all',
          price: [resetMinPrice, resetMaxPrice],
          rating: -1,
          sortByOption: '',
        },
        paginateIndex: 0,
      };

    case FILTERS_ACTION.UPDATE_PAGINATION:
      return {
        ...state,
        paginateIndex: action.payloadIndex,
      };

    case FILTERS_ACTION.APPLY_FILTERS:
      const { allProducts, filters } = state;

      const {
        search: searchText,
        category: categoryObjInState,
        company: companyInState,
        price: priceInState,
        rating: ratingInState,
        sortByOption,
      } = filters;

      const isAnyCheckboxChecked = Object.values(categoryObjInState).some(
        (categoryBool) => categoryBool
      );

      // this temp products will become filteredProducts
      let tempProducts = allProducts;

      // search handled here
      // company is not filtered here after submitting!!
      tempProducts = allProducts.filter(({ name }) => {
        const trimmedSearchText = searchText.trim();
        return lowerizeAndCheckIncludes(name, trimmedSearchText);
      });

      // category checkbox handled here
      if (isAnyCheckboxChecked) {
        tempProducts = tempProducts.filter(
          ({ category: categoryPropertyOfProduct }) =>
            categoryObjInState[categoryPropertyOfProduct]
        );
      }

      // company dropdown handled here
      if (companyInState !== 'all') {
        tempProducts = tempProducts.filter(
          ({ company: companyPropertyOfProduct }) =>
            companyPropertyOfProduct === companyInState
        );
      }

      // FILTRO DE PRECIO MEJORADO - MÁS PRECISO Y EFICIENTE
      tempProducts = tempProducts.filter(
        ({ price: pricePropertyOfProduct }) => {
          const [currMinPriceRange, currMaxPriceRange] = priceInState;
          return (
            pricePropertyOfProduct >= currMinPriceRange &&
            pricePropertyOfProduct <= currMaxPriceRange
          );
        }
      );

      // ratings handled here, no (if) condition, this will run always!!
      tempProducts = tempProducts.filter(({ stars }) => stars >= ratingInState);

      // sort handled here!!, if sortByOption is '', ignore sorting
      if (!!sortByOption) {
        switch (sortByOption) {
          case SORT_TYPE.PRICE_LOW_TO_HIGH: {
            tempProducts = [...tempProducts].sort((a, b) => a.price - b.price);
            break;
          }

          case SORT_TYPE.PRICE_HIGH_TO_LOW: {
            tempProducts = [...tempProducts].sort((a, b) => b.price - a.price);
            break;
          }

          case SORT_TYPE.NAME_A_TO_Z: {
            tempProducts = [...tempProducts].sort((a, b) => {
              a = a.name.toLowerCase();
              b = b.name.toLowerCase();

              if (a > b) return 1;

              if (a < b) return -1;

              return 0;
            });
            break;
          }

          case SORT_TYPE.NAME_Z_TO_A: {
            tempProducts = [...tempProducts].sort((a, b) => {
              a = a.name.toLowerCase();
              b = b.name.toLowerCase();

              if (a > b) return -1;
              if (a < b) return 1;
              return 0;
            });

            break;
          }

          default:
            throw new Error(`${sortByOption} is not defined`);
        }
      }

      // pagination logic
      tempProducts = givePaginatedList(tempProducts);

      // Verificar si necesitamos sincronizar el rango de precios después del filtrado
      const filteredProductsFlat = tempProducts.flat();
      if (filteredProductsFlat.length > 0) {
        const { minPrice: filteredMinPrice, maxPrice: filteredMaxPrice } = calculateSmartPriceRange(filteredProductsFlat);
        console.log(`🎯 Productos filtrados: rango ${filteredMinPrice.toLocaleString()} - ${filteredMaxPrice.toLocaleString()}`);
      }

      return {
        ...state,
        filteredProducts: tempProducts,
        displayableProductsLength: tempProducts.flat().length,
        paginateIndex: 0,
      };
    default:
      throw new Error(`Error: ${action.type} in filtersReducer does not exist`);
  }
};