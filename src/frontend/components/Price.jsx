import { useCurrencyContext } from '../contexts/CurrencyContextProvider';

/* eslint-disable react/prop-types */
const Price = ({ amount, showCurrency = true, showCurrencyCode = true, className = '' }) => {
  const { formatPriceWithCode, getCurrentCurrency } = useCurrencyContext();
  
  if (!amount && amount !== 0) {
    return <span className={className}>--</span>;
  }
  
  const isAmountNegative = amount < 0;
  const amountOnUI = isAmountNegative ? -1 * amount : amount;

  // SIEMPRE usar formatPriceWithCode para mostrar formato: $129.99 USD
  const formattedPrice = formatPriceWithCode(amountOnUI);

  return (
    <span className={className}>
      {isAmountNegative && '-'}{formattedPrice}
    </span>
  );
};

export default Price;