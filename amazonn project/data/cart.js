export function getcart() {
  return JSON.parse(localStorage.getItem('cart')) ||
    [{
      productid: "e43638ce-6aa0-4b85-b27f-e1d07eb678c6",
      quantity: 2,
      deliveryOptionsId: 1
    }, {
      productid: "15b6fc6f-327a-4ec4-896f-486349e85a3d",
      quantity: 1,
      deliveryOptionsId: 2
    }];
}

export let cart = getcart();
export function loadFromStorage() {
  cart = getcart();
}
console.log('loaded cart:', cart);

function saveToStorage() {
  localStorage.setItem('cart', JSON.stringify(cart));
  console.log(cart);
}

export function updateCart(productid, selectedQuantity) {
  cart.forEach(cartItem => {
    if (cartItem.productid === productid) {
      cartItem.quantity = Number(selectedQuantity);
      saveToStorage();
      console.log('existing product');
    }
  });
}

export function updateDeliveryDate(productid, Id) {
  cart.forEach(cartItem => {
    if (cartItem.productid === productid) {
      cartItem.deliveryOptionsId = Id;
      saveToStorage();
      console.log('existing product');
    }
  });
}
export function addToCart(productid, selectedQuantity) {
  let productFound = false;
  cart.forEach(cartItem => {
    if (cartItem.productid === productid) {
      cartItem.quantity += Number(selectedQuantity);
      productFound = true;
      saveToStorage();
      console.log('existing product');
    }
  });
  if (!productFound) {
    cart.push({
      productid,
      quantity: Number(selectedQuantity),
      deliveryOptionsId: 3
    });
    saveToStorage();
    console.log('newproduct');
  }
}

export function removeFromCart(productId) {
  const index = cart.findIndex(item => item.productid === productId);
  if (index !== -1) {
    cart.splice(index, 1);
    console.log('removed');
  }
  saveToStorage();
}

//example of closure
/*let add=(
    ()=>{
    let count = 0;
    count+=1;
    return (()=>{
        count+=1;
        console.log(`count: ${count}`);
        });
    }) ();
add();
add();*/



let products = '';

export async function loadCart() {
  const promise = fetch('https://supersimplebackend.dev/cart').then(response=>{
    products = response.text();
    console.log(products);
    console.log('Loaded cart from cart...');
  });
  return promise;
}


export function generatePostCart(cart) {
  let postcart = [];
  cart.forEach(cartItem => {
    postcart.push({
      productId: cartItem.productid,
      quantity: cartItem.quantity,
      deliveryOptionId: String(cartItem.deliveryOptionsId)
    });
  });
  return postcart;
}

