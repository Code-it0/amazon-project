import { addToCart, cart, loadFromStorage,removeFromCart } from "../../../amazonn project/data/cart.js";

describe('test suite : add to cart', () => {

    //  Use beforeEach to set up the spy before every test
    it('adds a product existing in cart', () => {
        spyOn(localStorage, 'getItem').and.callFake(() => {
            return JSON.stringify([]);
        });
        spyOn(localStorage, 'setItem');

        loadFromStorage();
        //looking if we got the correct data from local storage
        expect(cart).toEqual([]);
        addToCart('15b6fc6f-327a-4ec4-896f-486349e85a3d', 1);
        expect(cart.length).toEqual(1);
        expect(localStorage.setItem).toHaveBeenCalledTimes(1);
        expect(cart[0].productid).toEqual('15b6fc6f-327a-4ec4-896f-486349e85a3d');
        expect(cart[0].quantity).toEqual(1);
    });
    
    it('adds a product not existing in cart', () => {
        spyOn(localStorage, 'getItem').and.callFake(() => {
            return JSON.stringify([
                {
                    productid: '4df68c27-fd59-4a6a-bbd1-e754ddb6d53c',
                    quantity: 1,
                    deliveryOptionsId: 3
                }
            ]);
        });
        spyOn(localStorage, 'setItem');
        loadFromStorage();
        //looking if we got the correct data from local storage
        expect(cart).toEqual([
                {
                    productid: '4df68c27-fd59-4a6a-bbd1-e754ddb6d53c',
                    quantity: 1,
                    deliveryOptionsId: 3
                }
            ]);
        addToCart('4df68c27-fd59-4a6a-bbd1-e754ddb6d53c',1);
        expect(cart.length).toEqual(1);
        expect(localStorage.setItem).toHaveBeenCalledTimes(1);
        expect(cart[0].productid).toEqual('4df68c27-fd59-4a6a-bbd1-e754ddb6d53c');
        expect(cart[0].quantity).toEqual(2);
    });
});

describe('Test Suite: Remove from Cart',()=>{
    beforeEach(()=>{
        spyOn(localStorage, 'getItem').and.callFake(() => {
            return JSON.stringify([
                {
                    productid: '4df68c27-fd59-4a6a-bbd1-e754ddb6d53c',
                    quantity: 1,
                    deliveryOptionsId: 3
                }
            ]);
        });
        spyOn(localStorage, 'setItem');
        loadFromStorage();
    });
    it('removes an existing product from cart',()=>{
        const productIdToRemove = '4df68c27-fd59-4a6a-bbd1-e754ddb6d53c';
        expect(cart.length).toEqual(1);
        // Function to remove product from cart
        removeFromCart(productIdToRemove);
        expect(cart.length).toEqual(0);
        expect(localStorage.setItem).toHaveBeenCalledTimes(1);
    });
    it('removes an non-existing product from cart',()=>{
        const productIdToRemove = '15b6fc6f-327a-4ec4-896f-486349e85a3d';
        expect(cart.length).toEqual(1);
        // Function to remove product from cart
        removeFromCart(productIdToRemove);
        expect(cart.length).toEqual(1);
        expect(localStorage.setItem).toHaveBeenCalledTimes(1);
    });
});