import { loadProductsFetch } from "../data/products.js";
import { orders } from "../data/orders data.js";
import dayjs from 'https://unpkg.com/dayjs@1.11.10/esm/index.js';

const url = new URL(window.location.href);
const orderId = url.searchParams.get('orderId');
const productId = url.searchParams.get('productId');

const order = orders.find(order => order.id === orderId);

async function generateTrackingHtml() {
  // 1. FIX: Use await to ensure products are loaded BEFORE generating HTML
  let products;
  try {
    products = await loadProductsFetch();
  } catch (error) {
    console.error('Error loading products:', error);
    return;
  }

  // Now we have the products, we can find the specific one
  const product = products.find(product => product.id === productId);

  // Check if product exists to avoid crashing
  if (!product) {
    console.error('Product not found');
    return;
  }

  const { name, image } = product;

  let { orderTime, products: orderedProducts } = order;

  // .find() returns the array item itself. You cannot reshape the data inside .find()
  const productDetailsInOrder = orderedProducts.find(p => p.productId === productId);

  // We access the properties directly from the found item. 
  // data has 'quantity' and 'deliveryTime'
  const quantityOrdered = productDetailsInOrder.quantity;
  let deliveryTime = productDetailsInOrder.estimatedDeliveryTime || productDetailsInOrder.deliveryTime; // Adjust key based on your real data

  // --- Date Calculations ---
  const orderTimeObj = dayjs(orderTime);
  const deliveryTimeObj = dayjs(deliveryTime);
  const currentTime = dayjs();

  const totalMinutes = deliveryTimeObj.diff(orderTimeObj, 'minute');
  const elapsedMinutes = currentTime.diff(orderTimeObj, 'minute');

  const progress = totalMinutes > 0
    ? Math.min(100, Math.max(5, (elapsedMinutes / totalMinutes) * 100))
    : 0;
  let status = ['', '', ''];
  if (progress < 49) status[0] = "current-status";
  else if (progress < 99) status[1] = "current-status";
  else status[2] = "current-status";

  // Formatting dates for display
  const deliveryDateString = deliveryTimeObj.format('dddd, MMMM D');

  // --- Generate HTML ---
  // Note: I used the variables defined above (name, image, quantityOrdered)
  let trackingHtml = `
      <div class="order-tracking">
        <a class="back-to-orders-link link-primary" href="orders.html">
          View all orders
        </a>

        <div class="delivery-date">
          Arriving on ${deliveryDateString}
        </div>

        <div class="product-info">
          ${name}
        </div>

        <div class="product-info">
          Quantity: ${quantityOrdered}
        </div>

        <img class="product-image" src="${image}">

        <div class="progress-labels-container">
          <div class="progress-label ${status[0]}">
            Preparing
          </div>
          <div class="progress-label ${status[1]}">
            Shipped
          </div>
          <div class="progress-label ${status[2]}">
            Delivered
          </div>
        </div>

        <div class="progress-bar-container">
          <div class="progress-bar js-progress-bar"></div>
        </div>
      </div>
    `;

  document.querySelector('.main').innerHTML = trackingHtml;

  // Update the progress bar width
  // setTimeout is sometimes helpful to ensure the DOM is ready for the transition
  setTimeout(() => {
    document.querySelector('.js-progress-bar').style.width = `${progress}%`;
  }, 0); //allows css animation to play by using setTimeout

  //adding event listenrs for search bar
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


generateTrackingHtml();