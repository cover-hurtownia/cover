import * as Preact from "/js/lib/Preact.js";
import { useState, useEffect, useRef } from "/js/lib/PreactHooks.js";

import * as API from "/js/api/index.js";
import useShoppingCart from "/js/preact/hooks/useShoppingCart.js";

const h = Preact.h;

export const CartApp = _ => {
    const [toasts, setToasts] = useState([]);
    const shoppingCart = useShoppingCart();

    useEffect(async () => {
        setToasts([...toasts, { type: "info", content: "Hello world." }]);
    }, [])

    return h("div", {}, [
        h("h1", { className: "title" }, "Koszyk"),
        h("div", {}, [
            shoppingCart.products.length === 0
                ? h("div", { className: "notification is-warning" }, "Koszyk jest pusty.")
                : shoppingCart.products.map(product => h("div", { className: "is-primary" }, product)),
            h("div", {}, toasts.map(({ type, content }) => h("div", { className: `notification is-${type}`}, [
                h("h1", { className: "title" }, content)
            ])))
        ])
    ]);
};

export default CartApp;