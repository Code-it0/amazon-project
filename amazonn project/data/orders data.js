export const orders = JSON.parse(localStorage.getItem('orders')) || [
    {
        "id": "0e3713e6-209f-4bef-a3e2-ca267ad830ea",
        "orderTime": "2026-02-24T20:57:02.235Z",
        "totalCostCents": 5800,
        "products": [
            {
                "productId": "e43638ce-6aa0-4b85-b27f-e1d07eb678c6",
                "quantity": 2,
                "estimatedDeliveryTime": "2026-02-24T21:57:02.235Z"
            },
            {
                "productId": "15b6fc6f-327a-4ec4-896f-486349e85a3d",
                "quantity": 1,
                "estimatedDeliveryTime": "2024-03-05T20:57:02.235Z"
            }
        ]
    }
];

//backend sends the data in the above format by taking the cart using a POST request it generates all by itself...

export function addOrder(order) {
    orders.unshift(order);
    saveToStorage();
}
function saveToStorage() {
    localStorage.setItem('orders', JSON.stringify(orders));
}