import { useAllProductsContext } from '../../contexts/ProductsContextProvider';
import Price from '../Price';
import styles from './CheckoutDetails.module.css';
import { useState } from 'react';
import { VscChromeClose } from 'react-icons/vsc';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';

import { CHARGE_AND_DISCOUNT, ToastType, SERVICE_TYPES, SANTIAGO_ZONES, STORE_WHATSAPP } from '../../constants/constants';
import CouponSearch from './CouponSearch';
import { toastHandler, Popper, generateOrderNumber } from '../../utils/utils';

import { useAuthContext } from '../../contexts/AuthContextProvider';
import { useNavigate } from 'react-router-dom';

const CheckoutDetails = ({
  timer,
  activeAddressId: activeAddressIdFromProps,
  updateCheckoutStatus,
}) => {
  const {
    cartDetails: {
      totalAmount: totalAmountFromContext,
      totalCount: totalCountFromContext,
    },
    addressList: addressListFromContext,
    cart: cartFromContext,
    clearCartDispatch,
  } = useAllProductsContext();

  const {
    user: { firstName, lastName, email },
  } = useAuthContext();
  const navigate = useNavigate();
  const [activeCoupon, setActiveCoupon] = useState(null);
  const [isProcessingOrder, setIsProcessingOrder] = useState(false);

  // Obtener la dirección seleccionada
  const selectedAddress = addressListFromContext.find(
    ({ addressId }) => addressId === activeAddressIdFromProps
  );

  // Calcular costo de entrega
  const deliveryCost = selectedAddress?.serviceType === SERVICE_TYPES.HOME_DELIVERY 
    ? (selectedAddress?.deliveryCost || 0)
    : 0;

  const priceAfterCouponApplied = activeCoupon
    ? -Math.floor((totalAmountFromContext * activeCoupon.discountPercent) / 100)
    : 0;

  const finalPriceToPay =
    totalAmountFromContext +
    deliveryCost +
    CHARGE_AND_DISCOUNT.discount +
    priceAfterCouponApplied;

  const updateActiveCoupon = (couponObjClicked) => {
    setActiveCoupon(couponObjClicked);
    toastHandler(ToastType.Success, 'Cupón aplicado exitosamente');
  };

  const cancelCoupon = () => {
    setActiveCoupon(null);
    toastHandler(ToastType.Warn, 'Cupón removido');
  };

  const sendToWhatsApp = async (orderData) => {
    const orderNumber = generateOrderNumber();
    
    let message = `🛒 *NUEVO PEDIDO #${orderNumber}*\n`;
    message += `═══════════════════════════════\n\n`;
    
    message += `👤 *INFORMACIÓN DEL CLIENTE*\n`;
    message += `• Nombre: ${firstName} ${lastName}\n`;
    message += `• Email: ${email}\n\n`;
    
    // Información del servicio
    if (selectedAddress.serviceType === SERVICE_TYPES.HOME_DELIVERY) {
      const zoneName = SANTIAGO_ZONES.find(z => z.id === selectedAddress.zone)?.name;
      message += `🚚 *SERVICIO DE ENTREGA*\n`;
      message += `• Tipo: Entrega a domicilio\n`;
      message += `• Zona: ${zoneName}\n`;
      message += `• Dirección: ${selectedAddress.addressInfo}\n`;
      message += `• Recibe: ${selectedAddress.receiverName}\n`;
      message += `• Teléfono: ${selectedAddress.receiverPhone}\n`;
      message += `• Costo entrega: $${deliveryCost} CUP\n`;
    } else {
      message += `🏪 *SERVICIO*\n`;
      message += `• Tipo: Recoger en local\n`;
      if (selectedAddress.additionalInfo) {
        message += `• Info adicional: ${selectedAddress.additionalInfo}\n`;
      }
    }
    
    message += `• Móvil contacto: ${selectedAddress.mobile}\n\n`;
    
    // Productos
    message += `📦 *PRODUCTOS SOLICITADOS*\n`;
    message += `═══════════════════════════════\n`;
    cartFromContext.forEach((item, index) => {
      const colorEmoji = item.colors[0]?.color === '#ff0000' ? '🔴' : 
                        item.colors[0]?.color === '#00ff00' ? '🟢' : 
                        item.colors[0]?.color === '#0000ff' ? '🔵' : 
                        item.colors[0]?.color === '#ffb900' ? '🟡' : 
                        item.colors[0]?.color === '#000' ? '⚫' : '⚪';
      
      message += `${index + 1}. *${item.name}*\n`;
      message += `   ${colorEmoji} Color seleccionado\n`;
      message += `   📊 Cantidad: ${item.qty} unidad${item.qty > 1 ? 'es' : ''}\n`;
      message += `   💰 Precio unitario: $${item.price.toLocaleString()} CUP\n`;
      message += `   💵 Subtotal: $${(item.price * item.qty).toLocaleString()} CUP\n`;
      message += `   ─────────────────────────\n`;
    });
    
    // Resumen de precios
    message += `\n💰 *RESUMEN FINANCIERO*\n`;
    message += `═══════════════════════════════\n`;
    message += `• Subtotal productos: $${totalAmountFromContext.toLocaleString()} CUP\n`;
    
    if (activeCoupon) {
      message += `• 🎟️ Descuento (${activeCoupon.couponCode}): -$${Math.abs(priceAfterCouponApplied).toLocaleString()} CUP\n`;
    }
    
    if (deliveryCost > 0) {
      message += `• 🚚 Costo entrega: $${deliveryCost.toLocaleString()} CUP\n`;
    }
    
    message += `═══════════════════════════════\n`;
    message += `💎 *TOTAL A PAGAR: $${finalPriceToPay.toLocaleString()} CUP*\n`;
    message += `═══════════════════════════════\n\n`;
    
    message += `⏰ *Fecha del pedido:* ${new Date().toLocaleString('es-CU', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })}\n\n`;
    
    message += `🏪 *Gada Electronics*\n`;
    message += `"Naam hi kaafi hai" ✨\n`;
    message += `¡Gracias por confiar en nosotros! 🙏`;

    // Codificar el mensaje para URL
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${STORE_WHATSAPP.replace(/\s+/g, '')}?text=${encodedMessage}`;
    
    // Abrir WhatsApp
    window.open(whatsappUrl, '_blank');
    
    return orderNumber;
  };

  const handlePlaceOrder = async () => {
    if (!selectedAddress) {
      toastHandler(ToastType.Error, 'Por favor selecciona una dirección');
      return;
    }

    setIsProcessingOrder(true);

    try {
      // Simular procesamiento del pedido
      await new Promise(resolve => setTimeout(resolve, 2000));

      const orderNumber = await sendToWhatsApp({
        orderNumber: generateOrderNumber(),
        customer: { firstName, lastName, email },
        address: selectedAddress,
        products: cartFromContext,
        pricing: {
          subtotal: totalAmountFromContext,
          deliveryCost,
          coupon: activeCoupon,
          total: finalPriceToPay
        }
      });

      await clearCartDispatch();
      updateCheckoutStatus({ showSuccessMsg: true });

      Popper();
      toastHandler(ToastType.Success, `¡Pedido #${orderNumber} enviado exitosamente! 🎉`);

      timer.current = setTimeout(() => {
        updateCheckoutStatus({ showSuccessMsg: false });
        navigate('/');
      }, 4000);

    } catch (error) {
      console.error('Error al procesar el pedido:', error);
      toastHandler(ToastType.Error, 'Error al procesar el pedido');
    } finally {
      setIsProcessingOrder(false);
    }
  };

  return (
    <article className={styles.checkout}>
      <h3 className='text-center'>Detalles del Precio</h3>

      <CouponSearch
        activeCoupon={activeCoupon}
        updateActiveCoupon={updateActiveCoupon}
      />

      <hr />

      <div className={styles.row}>
        <span>
          Precio ({totalCountFromContext} artículo{totalCountFromContext > 1 && 's'})
        </span>
        <Price amount={totalAmountFromContext} />
      </div>

      {activeCoupon && (
        <div className={styles.row}>
          <div className={styles.couponApplied}>
            <VscChromeClose
              type='button'
              className={styles.closeBtn}
              onClick={cancelCoupon}
            />{' '}
            <p className={styles.couponText}>
              Cupón {activeCoupon.couponCode} aplicado
            </p>
          </div>
          <Price amount={priceAfterCouponApplied} />
        </div>
      )}

      <div className={styles.row}>
        <span>
          {selectedAddress?.serviceType === SERVICE_TYPES.HOME_DELIVERY 
            ? `Entrega a domicilio` 
            : 'Gastos de Envío'
          }
        </span>
        <Price amount={deliveryCost} />
      </div>

      <hr />

      <div className={`${styles.row} ${styles.totalPrice}`}>
        <span>Precio Total</span>
        <Price amount={finalPriceToPay} />
      </div>

      <button 
        onClick={handlePlaceOrder} 
        className={`btn btn-width-100 ${styles.orderButton}`}
        disabled={isProcessingOrder}
      >
        {isProcessingOrder ? (
          <div className={styles.processingOrder}>
            <AiOutlineLoading3Quarters className={styles.spinner} />
            <span>Procesando pedido...</span>
          </div>
        ) : (
          '📱 Realizar Pedido por WhatsApp'
        )}
      </button>
    </article>
  );
};

export default CheckoutDetails;