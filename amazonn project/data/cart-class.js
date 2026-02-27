class Cart {
    cartItems ;
    #localStorageKey ;

    constructor(localStorageKey) {
        this.localStorageKey = localStorageKey;
        this.loadFromStorage();
    }

    getcart() {
        return JSON.parse(localStorage.getItem(this.#localStorageKey)) || [{
            productid: "e43638ce-6aa0-4b85-b27f-e1d07eb678c6",
            quantity: 2,
            deliveryOptionsId: 1
        }, {
            productid: "15b6fc6f-327a-4ec4-896f-486349e85a3d",
            quantity: 1,
            deliveryOptionsId: 2
        }];
    }

    loadFromStorage() {
        this.cartItems = this.getcart();
    }

    saveToStorage() {
        localStorage.setItem(this.#localStorageKey, JSON.stringify(this.cartItems));
    }



    updateDeliveryDate(productid, Id) {
        this.cartItems.forEach(cartItem => {
            if (cartItem.productid === productid) {
                cartItem.deliveryOptionsId = Id;
                this.saveToStorage();
                console.log('existing product');
            }
        });
    }

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
    }

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

    updateDeliveryDate(productid, Id) {
        this.cartItems.forEach(cartItem => {
            if (cartItem.productid === productid) {
                cartItem.deliveryOptionsId = Id;
                this.saveToStorage();
                console.log('existing product');
            }
        });
    }
}

const cart = new Cart('cart-oop');
const businessCart = new Cart('businessCart-oop');


console.log(cart);
console.log(businessCart);
console.log(businessCart instanceof Cart);
