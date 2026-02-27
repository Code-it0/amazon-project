import { generatePostCart,getcart } from "../../data/cart.js";
import { getProduct } from "../../data/products.js";
import { formatCurrency } from "../utils/money.js";
import { addOrder } from "../../data/orders data.js";


export function renderPaymentSummary() {
  //M for Model
  const cart = getcart();
  let productPriceCents = 0;
  let deliveryTotalCost = 0;
  cart.forEach(cartItem => {
    const product = getProduct(cartItem.productid);
    productPriceCents += product.priceCents * cartItem.quantity;
    const deliveryCost = cartItem.deliveryOptionsId == 1 ? 999 :
      cartItem.deliveryOptionsId == 2 ? 499 : 0;
    deliveryTotalCost += deliveryCost;
  });
  let Cost = productPriceCents + deliveryTotalCost;
  let Tax = Math.round(Cost * 0.1);
  let TotalCost = Cost + Tax;
  const cartQuantity = document.querySelector(".js-checkout-header-quantity");
  //V for view
  const PaymentSummaryHtml = `
    <div class="payment-summary-title">
            Order Summary
          </div>

          <div class="payment-summary-row">
            <div>Items (${cartQuantity.textContent}):</div>
            <div class="payment-summary-money">$${formatCurrency(productPriceCents)}</div>
          </div>

          <div class="payment-summary-row">
            <div>Shipping &amp; handling:</div>
            <div class="payment-summary-money">$${formatCurrency(deliveryTotalCost)}</div>
          </div>

          <div class="payment-summary-row subtotal-row">
            <div>Total before tax:</div>
            <div class="payment-summary-money">$${formatCurrency(Cost)}</div>
          </div>

          <div class="payment-summary-row">
            <div>Estimated tax (10%):</div>
            <div class="payment-summary-money">$${formatCurrency(Tax)} </div>
          </div>

          <div class="payment-summary-row total-row">
            <div>Order total:</div>
            <div class="payment-summary-money">$${formatCurrency(TotalCost)}</div>
          </div>

          <button class="place-order-button button-primary js-place-order-button">
            Place your order
          </button>`;
  document.querySelector('.js-payment-summary').innerHTML = PaymentSummaryHtml;

  document.querySelector('.js-place-order-button').addEventListener('click', async () => {
    try{
    const response = await fetch('https://supersimplebackend.dev/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        cart: generatePostCart(getcart())
      })
    });
    const order = await response.json();
    console.log('Order placed successfully:', order);
    addOrder(order);
    // reseting cart after placing order
    localStorage.setItem('cart', JSON.stringify([]));

    // navigate only after successful placement and storing
    window.location.href = 'orders.html';
  } catch (error) {
    console.error('Error placing order:', error);
  }
   });
}
