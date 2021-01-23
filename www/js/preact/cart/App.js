import * as Preact from "/js/lib/Preact.js";
import { useState, useEffect, useRef } from "/js/lib/PreactHooks.js";

import * as API from "/js/api/index.js";
import Product from "/js/preact/cart/components/Product.js";
import useShoppingCart from "/js/preact/hooks/useShoppingCart.js";

const h = Preact.h;

export const CartApp = _ => {
    const [toasts, setToasts] = useState([]);
    const shoppingCart = useShoppingCart();

    // useEffect(async () => {
    //     setToasts([...toasts, { type: "info", content: "Hello world." }]);
    // }, [])

    return h("div", {}, [
        h("h1", { className: "title" }, "Koszyk"),
        h("div", {}, [
            h("div", { className: "columns is-hidden-mobile" }, [
                h("div", { className: "column is-1" }),
                h("div", { className: "column is-7" }, h("span", { className: "subtitle" }, "Tytuł")),
                h("div", { className: "column is-2" }, h("span", { className: "subtitle" }, "Ilość")),
                h("div", { className: "column is-2" }, h("span", { className: "subtitle" }, "Cena"))
            ]),
            shoppingCart.products.length === 0
                ? h("div", { className: "notification is-warning" }, "Koszyk jest pusty.")
                : [
                    Object.entries(shoppingCart.products).map(([productId, _]) => h(Product, { productId })),
                    h("div", { className: "columns" }, [
                        h("div", { className: "column is-8" }),
                        h("div", { className: "column is-2" }, h("span", { className: "subtitle" }, "Razem:")),
                        h("div", { className: "column is-2" }, h("span", { className: "subtitle" }, [
                            // Object.entries(shoppingCart.products).map(([productId, quantity]) => )
                        ]))
                    ]),
                ]
        ])
    ]);
};

export default CartApp;