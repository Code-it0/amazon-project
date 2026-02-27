import { renderOrderSummary } from "../../../amazonn project/scripts/checkout/OrderSummary.js";
import { renderPaymentSummary } from "../../../amazonn project/scripts/checkout/PaymentSummary.js";
import { loadFromStorage } from "../../../amazonn project/data/cart.js";
import { loadProductsFetch } from "../../../amazonn project/data/products.js";

describe('test suite: renderOrderSummary', () => {

    beforeAll(async () => {
        // Load products once before all tests
        await loadProductsFetch();
    });

    beforeEach(() => {
        // Spy on localStorage methods
        spyOn(localStorage, 'setItem');
        spyOn(localStorage, 'getItem').and.callFake(() => {
            return JSON.stringify([
                {
                    productid: '4df68c27-fd59-4a6a-bbd1-e754ddb6d53c',
                    quantity: 1,
                    deliveryOptionsId: 3
                },
                {
                    productid: '15b6fc6f-327a-4ec4-896f-486349e85a3d',
                    quantity: 2,
                    deliveryOptionsId: 3
                }
            ]);
        });

        // Set up DOM
        document.querySelector('.js-test-container').innerHTML = `
            <div class="js-order-summary"></div>
            <div class="js-checkout-header-quantity"></div>
            <div class="js-payment-summary"></div>
        `;

        // Load cart from mocked storage
        loadFromStorage();
        
        // Render order summary (products already loaded in beforeAll)
        renderOrderSummary();
        
    });

    afterEach(() => {
        // Clean up DOM after each test
        document.querySelector('.js-test-container').innerHTML = '';
    });

    it('displays the cart', () => {
        expect(
            document.querySelectorAll('.js-cart-item-container').length
        ).toEqual(2);
    });

    it('removes a product', () => {
        document.querySelector('.js-delete-link-4df68c27-fd59-4a6a-bbd1-e754ddb6d53c').click();
        
        expect(
            document.querySelectorAll('.js-cart-item-container').length
        ).toEqual(1);
    });
});