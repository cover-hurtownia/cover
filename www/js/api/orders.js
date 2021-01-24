import resources from "./resources.js";

export const orders = resources("orders");

orders.placeOrder = order => fetch(`/api/orders/place_order`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(order)
}).then(_ => _.json());

orders.myOrders = query => fetch(`/api/orders/my_orders` + (query ? `?${new URLSearchParams(query).toString()}` : "")).then(_ => _.json()),
orders.accept = id => fetch(`/api/orders/${id}/accept`, { method: "POST" }).then(_ => _.json());
orders.cancel = id => fetch(`/api/orders/${id}/cancel`, { method: "POST" }).then(_ => _.json());
orders.send = id => fetch(`/api/orders/${id}/send`, { method: "POST" }).then(_ => _.json());
orders.delivered = id => fetch(`/api/orders/${id}/delivered`, { method: "POST" }).then(_ => _.json());