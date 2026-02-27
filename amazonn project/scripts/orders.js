import { orders } from "../data/orders data.js";
import { loadProductsFetch } from "../data/products.js";
import dayjs from 'https://unpkg.com/dayjs@1.11.10/esm/index.js';
import { formatCurrency } from "./utils/money.js";
import { addToCart } from "../data/cart.js";
import { updateCartCounter } from "./utils/cartCounters.js";


function formatDate(isoDate) {
    return dayjs(isoDate).format('MMMM D');
}

export async function generateOrderHtml(orders) {
    let allProducts = [];
    allProducts = await loadProductsFetch();

    orders.map(order => {
        const { id, orderTime, totalCostCents, products } = order;
        let orderHtml = '';
        // Generating Header 
        const orderHeaderHtml = `
        <div class="order-container js-order-container">
            <div class="order-header js-order-header">
            <div class="order-header-left-section">
            <div class="order-date">
                    <div class="order-header-label">Order Placed:</div>
                    <div>${formatDate(orderTime)}</div>
                </div>
                <div class="order-total">
                    <div class="order-header-label">Total:</div>
                    <div>$${formatCurrency(totalCostCents)}</div>
                </div>
            </div>
            <div class="order-header-right-section">
            <div class="order-header-label">Order ID:</div>
            <div>${id}</div>
            </div>
            </div>
            </div>`;
        orderHtml += orderHeaderHtml

        //Generating Product Details
        orderHtml += `<div class="order-details-grid js-order-details-grid">`;
        products.map(product => {
            const { productId, quantity, estimatedDeliveryTime } = product; // Assuming one product per order for simplicity

            const productDetails = allProducts.find(p => p.id === productId); //searchiing for all the details of the product i.e searching for its object from all products
            const orderDetailsHtml = `
            <div class="product-image-container">
                <img src="${productDetails.image}">
            </div>
            <div class="product-details">
                <div class="product-name">
                    ${productDetails.name}
                </div>
                <div class="product-delivery-date">
                Arriving on: ${formatDate(estimatedDeliveryTime)}
                </div>
                <div class="product-quantity">
                Quantity: ${quantity}
                </div>
                <button class="buy-again-button button-primary js-buy-again-button" data-productId="${productId}">
                <img class="buy-again-icon" src="images/icons/buy-again.png">
                <span class="buy-again-message">Buy it again</span>
                </button>
                </div>
                <div class="product-actions">
                <a href="tracking.html?orderId=${encodeURIComponent(id)}&productId=${encodeURIComponent(productId)}">
                <button class="track-package-button button-secondary">
                Track package
                </button>
                </a>
                </div>`;
            orderHtml += orderDetailsHtml;
        });
        orderHtml += `</div>`;
        document.querySelector('.js-orders-grid').innerHTML += orderHtml;
    });

    updateCartCounter('.js-cart-quantity');//Updating the cart counter at the top left tho match the items in cart


    //Eventlistenr for buy again button
    document.querySelectorAll('.js-buy-again-button').forEach(button => {
        button.addEventListener('click', (event) => {
            console.log('clicked buy again');
            const productId = button.getAttribute('data-productId');
            let quantity = 0;
            orders.forEach(order => {
                const product = order.products.find(p => p.productId === productId);
                if (product) {
                    quantity = product.quantity;
                }
            });
            addToCart(productId, quantity);
            updateCartCounter('.js-cart-quantity');
        });
    });

    const searchBar = document.querySelector('.js-search-bar');

    searchBar.addEventListener('keydown', (event) => {
        // Check if the key pressed was 'Enter'
        if (event.key === 'Enter') {
            const searchTerm = searchBar.value.trim(); // .trim() removes spaces from start/end

            // Only run if the search term is NOT empty
            if (searchTerm !== '') {
                // 1. Simple redirect (per your request)
                // window.location.href = `amazon.html?search='${searchTerm}`; could cause error if user eneterd special characters like & / = 

                // 2. OR: If you want to actually pass the search text to the new page:
                window.location.href = `amazon.html?search=${encodeURIComponent(searchTerm)}`;
            }
        }
    });
}
document.addEventListener('DOMContentLoaded', () => {
    generateOrderHtml(orders);
});

