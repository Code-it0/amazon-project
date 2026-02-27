import { renderOrderSummary } from "./checkout/OrderSummary.js";
import { renderPaymentSummary } from "./checkout/PaymentSummary.js";
import { loadProductsFetch } from "../data/products.js";
import { loadCart } from "../data/cart.js";

async function loadPage() {
    try {
        await Promise.all([loadProductsFetch(), loadCart()]);  // await can only be used inside async functions
    } catch (error) {
        throw 'Unexpected error. Try again later!!';
    }
    console.log('returns a promise');
    renderOrderSummary();
    renderPaymentSummary();
}
loadPage();


/*Promise.all([
    loadProductsFetch(),
    new Promise((resolve) => {
        loadCart(() => {
            resolve();
        });
        
    })
]).then((value) => {
    renderOrderSummary();
    renderPaymentSummary();
    console.log('promise value :', value);
});*/

/*
new Promise((resolve) =>//better way to ensure products are loaded before proceeding
{
loadProducts(() => {
    resolve();
});

}).then(() => {
return new Promise((resolve) => {
    loadCart(() => {
        resolve();
    });
});

}).then(() => {
renderOrderSummary();
renderPaymentSummary();
});
*/