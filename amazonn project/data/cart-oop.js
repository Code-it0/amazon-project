function Cart(localStorageKey){
  const cart = {
    // 1. Initialize as undefined first
    cartItems: undefined,
  
    getcart() {
      return JSON.parse(localStorage.getItem(localStorageKey)) || [{
        productid: "e43638ce-6aa0-4b85-b27f-e1d07eb678c6",
        quantity: 2,
        deliveryOptionsId: 1
      }, {
        productid: "15b6fc6f-327a-4ec4-896f-486349e85a3d",
        quantity: 1,
        deliveryOptionsId: 2
      }];
    },
  
    loadFromStorage() {
      this.cartItems = this.getcart();
    },
  
    saveToStorage() {
      localStorage.setItem(localStorageKey, JSON.stringify(this.cartItems));
    },
  
    updateCart(productid, selectedQuantity) {
      this.cartItems.forEach(cartItem => {
        // 2. Fixed: removed 'this.' before cartItem
        if (cartItem.productid === productid) {
          cartItem.quantity = Number(selectedQuantity);
          this.saveToStorage();
          console.log('existing product');
        }
      });
    },
  
    updateDeliveryDate(productid, Id) {
      this.cartItems.forEach(cartItem => {
        if (cartItem.productid === productid) {
          cartItem.deliveryOptionsId = Id;
          this.saveToStorage();
          console.log('existing product');
        }
      });
    },
  
    addToCart(productid, selectedQuantity) {
      let productFound = false;
      this.cartItems.forEach(cartItem => {
        if (cartItem.productid === productid) {
          cartItem.quantity += Number(selectedQuantity);
          productFound = true;
          this.saveToStorage();
          console.log('existing product');
        }
      });
      if (!productFound) {
        // 3. Fixed: changed 'cart.push' to 'this.cartItems.push'
        this.cartItems.push({
          productid,
          quantity: Number(selectedQuantity),
          deliveryOptionsId: 3
        });
        this.saveToStorage();
        console.log('newproduct');
      }
    },
  
    removeFromCart(productId) {
      // 4. Fixed: changed 'cart.findIndex' to 'this.cartItems.findIndex'
      const index = this.cartItems.findIndex(item => item.productid === productId);
      
      if (index !== -1) {
        this.cartItems.splice(index, 1);
        console.log('removed');
        // Moved save outside the if check so it saves regardless? 
        // Actually keeping it inside or immediately after is fine.
        this.saveToStorage(); 
      }
    }
  };
  return cart;
}
let cart = Cart('cart-oop');
let businessCart = Cart('businessCart-oop');
// CRITICAL STEP: You must call this to initialize the data!
cart.loadFromStorage();

console.log(cart);
businessCart.loadFromStorage
console.log(businessCart);
