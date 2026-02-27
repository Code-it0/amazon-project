import { getcart } from "../../data/cart.js";
export const updateCartCounter =  (Class) => {
  //updating cart quantity display image
  let cart=getcart();
  console.log(cart);
  let cartQuantity = 0;
  cart.forEach(item => {
    cartQuantity += item.quantity;
  
  });
  document.querySelector(Class).innerHTML =  cartQuantity || '0';
  console.log('updated couter to: ' , cartQuantity);
  //calling the function once to intialize the true value when page is loaded
};