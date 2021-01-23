import * as Preact from "/js/lib/Preact.js";
import { useState, useEffect } from "/js/lib/PreactHooks.js";

import * as API from "/js/api/index.js";
import * as utils from "/js/utils.js";
import useShoppingCart from "/js/preact/hooks/useShoppingCart.js";

const h = Preact.h;

export const Product = ({ productId }) => {
    const shoppingCart = useShoppingCart();
    const [response, setResponse] = useState(null);
    
    useEffect(async () => {
        setResponse(await API.products.getById(productId));
    }, [productId]);

    console.log(response);

    return h("div", { className: "box" }, [
        response !== null
            ? response.status === "ok"
                ? h("div", { className: "columns is-vcentered" }, [
                    h("div", { className: "column is-1" }, [
                        h("figure", { className: "image box p-1" }, [
                            h("img", { src: `/images/${response.data.image_id}`, loading: "lazy" })
                        ])
                    ]),
                    h("div", { className: "column is-7" }, [
                        h("span", { className: "title is-3" }, h("a", { href: `/books.html?name=${response.data.name}` }, response.data.name))
                    ]),
                    h("div", { className: "column is-2" }, [
                        h("div", { className: "field has-addons" }, [
                            h("div", { className: "control" }, [
                                h("input", {
                                    className: "input",
                                    type: "number",
                                    min: 1,
                                    max: response.data.quantity_available,
                                    value: shoppingCart.products[productId],
                                    onchange: event => shoppingCart.set(productId, event.target.value)
                                })
                            ]),
                            h("div", { className: "control" }, [
                                h("input", {
                                    className: "button is-danger",
                                    type: "button",
                                    value: "Usuń",
                                    onclick: _ => shoppingCart.removeAll(productId)
                                })
                            ])
                        ]),
                        response.data.quantity_available !== 0
                            ?  h("div", { className: "is-italic" }, `(${response.data.quantity_available} dostępnych)`)
                            :  h("div", { className: "is-italic is-danger" }, `(produkt niedostępny)`)
                    ]),
                    h("div", { className: "column is-2" }, [
                        h("div", { className: "has-text-weight-bold is-size-3" }, utils.showPrice(shoppingCart.products[productId] * response.data.price)),
                        h("div", { className: "is-italic" }, `(${utils.showPrice(response.data.price)} za sztukę)`)
                    ])
                ])
                : h("h1", { className: "title" }, `Błąd: ${JSON.stringify(response)}`)
            : h("h1", { className: "title" }, "Ładowanie...")
    ]);
};

export default Product;