import { getcart, addToCart } from "../data/cart.js";
import { products, loadProductsFetch } from "../data/products.js";
import { formatCurrency } from "./utils/money.js";
import { updateCartCounter } from "./utils/cartCounters.js";

console.log("Amazon project script loaded");
// creating a function that uses the product data to generate HTML

// Load products from backend, then render products on the page
loadProductsFetch().then((products) => {
  let Products = Searching(products)||products; //if normal loading searching return NULL if searched and no       products it returns [] which is truthy hence no products on page...
  generateProductHTML(Products);
  if(Products.length ===0)generateHomeButton();
}); //waitng for the function to completely complete before generating the HTML
function generateProductHTML(products) {
  let productshtml = ``;
  products.forEach(product => {
    productshtml += `<div class="product-container">
          <div class="product-image-container">
            <img class="product-image"
              src="${product.image}">
          </div>

          <div class="product-name limit-text-to-2-lines">
            ${product.name}
          </div>

          <div class="product-rating-container">
            <img class="product-rating-stars"
              src=${product.getStarsUrl()}>
            <div class="product-rating-count link-primary">
                ${product.rating.count}
            </div>
          </div>

          <div class="product-price">
            ${product.getPrice()}
          </div>

          <div class="product-quantity-container">
            <select class = "js-quantity-selector-${product.id}">
              <option selected value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
              <option value="5">5</option>
              <option value="6">6</option>
              <option value="7">7</option>
              <option value="8">8</option>
              <option value="9">9</option>
              <option value="10">10</option>
            </select>
          </div>
          
          <!-- example of POLYMORPHISM -->
          ${product.extraInfoHtml()}
          <div class="product-spacer"></div>

          <div class="added-to-cart">
            <img src="images/icons/checkmark.png">
            Added
          </div>

          <button class="add-to-cart-button button-primary js-add-to-cart"
          data-product-id="${product.id}">
            Add to Cart
          </button>
        </div>`;
  });
  document.querySelector(".products-grid").innerHTML = productshtml;

  //adding event listeners to add to cart buttons
  document.querySelectorAll('.js-add-to-cart').forEach(button => {
    button.addEventListener('click', () => {
      const productid = button.dataset.productId;
      //adding products to cart according to the quantity selected
      const selectedQuantity = document.querySelector(`.js-quantity-selector-${productid}`).value;
      console.log('added to cart');

      addToCart(productid, selectedQuantity);
      updateCartCounter('.js-cart-quantity');
    });
  });

  //adding event listener for search bar
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


updateCartCounter('.js-cart-quantity');


function Searching(products) {
  const url = new URL(window.location.href);
  let search = url.searchParams.get('search'); // to lower case for normalization of search word i.e making the comparing case Insensitive
  if (search) {
    search = search.toLowerCase();
    return products.filter(
      p => {
        let { name } = p;
        if ((name.toLowerCase()).includes(search)) {
          return true;
        }
        else {
          let { keywords } = p;
          if (keywords.some(k => k.toLowerCase() == search)) return true; //.some return true if inside arrow function return true
          else return false;
        }
      }
    );
  }
}

function generateHomeButton(){
  console.log("executed!!");
  const url = new URL(window.location.href);
  const searchTerm = url.searchParams.get('search');

  const html = `<div class="empty-results-container">
        <p>No products matched your search for "<strong>${searchTerm}</strong>".</p>
        
        <a href="amazon.html">
          <button class="button-primary view-all-button">View all products</button>
        </a>
      </div>`;
  document.querySelector(".products-grid").innerHTML = html; 
}