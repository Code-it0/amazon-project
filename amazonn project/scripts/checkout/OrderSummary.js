import { getcart, addToCart, updateCart, removeFromCart, updateDeliveryDate } from "../../data/cart.js";
import { products } from "../../data/products.js";
import { updateCartCounter } from "../utils/cartCounters.js";
import { deliveryOptions } from "../deliveryOptions.js";
import dayjs from 'https://unpkg.com/dayjs@1.11.10/esm/index.js';
import { renderPaymentSummary } from "./PaymentSummary.js";


export function renderOrderSummary() {
    let cartSummaryHtml = ``;
    let cart = getcart();
    cart.forEach(cartItem => {
        let matchingProduct;
        let productId = cartItem.productid;
        products.forEach(product => {
            if (productId === product.id) {
                matchingProduct = product;
            }
        });
        const deliveryOptionsId = cartItem.deliveryOptionsId;
        // getting  the object where the corrosponding Id exists
        const deliveryOption = deliveryOptions.find(
            option => option.Id === Number(deliveryOptionsId)
        );

        const deliveryDays = deliveryOption ? deliveryOption.deliveryDays : null;
        const deliveryDate = getDate(deliveryDays);
        cartSummaryHtml += `
<div class="cart-item-container js-cart-item-container js-cart-item-container-${productId}">
    <div class="delivery-date js-delivery-date-${productId}">
        Delivery date: ${deliveryDate}
    </div>
    <div class="cart-item-details-grid">
        <img class="product-image" src="${matchingProduct.image}">
        <div class="cart-item-details">
            <div class="product-name">
                ${matchingProduct.name}
            </div>
            <div class="product-price">
                $${matchingProduct.getPrice()}
            </div>
            <div class="product-quantity">
                <span>
                    Quantity: <span class="quantity-label">${cartItem.quantity}</span>
                </span>
                <span class="update-quantity-link link-primary js-update-quantity-link" data-product-id = "${productId}">
                    Update
                </span>
                <span>
                    <input type="number" class="js-update-quantity-input-${productId}" min="1" value="${cartItem.quantity}" style="width: 30px; display: none;"> 
                    <span class="js-save-quantity-button-${productId}" style="margin-left: 10px; display: none;">save</span>
                </span>
                <span class="delete-quantity-link link-primary js-delete-link  js-delete-link-${productId}" data-product-id = "${productId}">
                    Delete
                </span>
            </div>
        </div>
        <div class="delivery-options">
            <div class="delivery-options-title">
                Choose a delivery option:
            </div>
            ${deliveryOptionsHtml(matchingProduct, cartItem)}
        </div>
    </div>
</div>
`;
    });
    document.querySelector('.js-order-summary').innerHTML = cartSummaryHtml;
    //calling the function once to intialize the true value when page is loaded
    updateCartCounter('.js-checkout-header-quantity');

    const cartItem = document.querySelector('.js-order-summary');
    if (!cartItem)
        cartItem.innerHTML = cartSummaryHtml;
    document.querySelectorAll('.js-delete-link').forEach(link => {
        link.addEventListener('click', () => {
            const deleteId = link.dataset.productId;// OR getAttribute('productId)
            removeFromCart(deleteId);
            document.querySelector(`.js-cart-item-container-${deleteId}`).remove();
            updateCartCounter('.js-checkout-header-quantity');
            renderPaymentSummary();
        });
    });

    function saveUpdatedQuantity(productId, newQuantity) {
        updateCart(productId, newQuantity);
        document.querySelector(`.js-cart-item-container-${productId} .quantity-label`).innerText = newQuantity;
        updateCartCounter('.js-checkout-header-quantity');
    }

    document.querySelectorAll('.js-update-quantity-link').forEach(link => {
        link.addEventListener('click', () => {
            const productId = link.getAttribute('data-product-id');
            const quantityInput = document.querySelector(`.js-update-quantity-input-${productId}`);
            const save = document.querySelector(`.js-save-quantity-button-${productId}`);
            quantityInput.style.display = 'inline-block';
            save.style.display = 'inline-block';
            quantityInput.addEventListener('keydown', (event) => {
                if (event.key === 'Enter') {
                    saveUpdatedQuantity(productId, parseInt(quantityInput.value));
                    quantityInput.style.display = 'none';
                    save.style.display = 'none';
                }
            });
            save.addEventListener('click', () => {
                saveUpdatedQuantity(productId, parseInt(quantityInput.value));
                quantityInput.style.display = 'none';
                save.style.display = 'none';
                //Reloading Payment Summary
                renderPaymentSummary();
            });
        });
    });

    function getDate(deliveryDays) {
        const today = dayjs();
        const deliveryDate = today.add(deliveryDays, 'days');
        //According to the documuentation this is the character combinations used to represent year (dddd) , month (MMMM) , day(D)
        const dateString = deliveryDate.format('dddd, MMMM D');
        return dateString;
    }
    //function for generating delivey options html
    function deliveryOptionsHtml(matchingProduct, cartItem) {
        let deliveryHtml = '';
        deliveryOptions.forEach(deliveryOption => {
            const dateString = getDate(deliveryOption.deliveryDays);
            const price = deliveryOption.priceCents === 0 ? 'Free' :
                deliveryOption.priceCents === 499 ? '$4.99' :
                    deliveryOption.priceCents === 999 ? '$9.99' : '';
            const isChecked = deliveryOption.Id === cartItem.deliveryOptionsId;
            deliveryHtml += `
            <div class="delivery-option">
                <input type="radio" ${isChecked ? "checked" : ""} class="delivery-option-input js-delivery-option-input js-delivery-option-${matchingProduct.id}-${deliveryOption.Id}" name="delivery-option-${matchingProduct.id}" data-product-id="${cartItem.productid}" data-delivery-id="${deliveryOption.Id}">
                <div>
                    <div class="delivery-option-date">
                        ${dateString}
                    </div>
                    <div class="delivery-option-price">
                        ${price} Shipping
                    </div>
                </div>
            </div>
`
        });
        return deliveryHtml;
    }


    document.querySelectorAll(".js-delivery-option-input").forEach(option => {
        option.addEventListener('click', () => {
            const productId = option.getAttribute('data-product-id');
            const deliveryId = Number(option.dataset.deliveryId);
            //dataset and get attribute() returns all values in string data type
            updateDeliveryDate(productId, deliveryId);
            // getting  the object where the corrosponding Id exists
            renderOrderSummary();
            //reloading Payment Summary
            renderPaymentSummary();
        });
    });
}


