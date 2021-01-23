import * as Preact from "/js/lib/Preact.js";
import { useState, useEffect } from "/js/lib/PreactHooks.js";

import * as API from "/js/api/index.js";
import * as utils from "/js/utils.js";
import useShoppingCart from "/js/preact/hooks/useShoppingCart.js";

const h = Preact.h;

export const Product = ({ productId, response }) => {
    const shoppingCart = useShoppingCart();

    return h("div", { className: "box my-1" }, [
        response
            ? response.status === "ok"
                ? h("div", { className: "columns is-vcentered " }, [
                    h("div", { className: "column is-1" }, [
                        h("figure", { className: "image box p-1" }, [
                            h("img", { src: `/images/${response.data.image_id}`, loading: "lazy" })
                        ])
                    ]),
                    h("div", { className: "column is-5" }, [
                        h("span", { className: "title is-3" }, h("a", { href: `/books.html?name=${response.data.name}` }, response.data.name))
                    ]),
                    h("div", { className: "column is-3" }, [
                        h("div", { className: "field has-addons" }, [
                            h("div", { className: "control" }, [
                                h("input", {
                                    className: "input",
                                    type: "number",
                                    min: 1,
                                    max: response.data.quantity_available,
                                    value: shoppingCart.products[response.data.id],
                                    onchange: event => shoppingCart.set(response.data.id, event.target.value)
                                })
                            ]),
                            h("div", { className: "control" }, [
                                h("input", {
                                    className: "button is-danger",
                                    type: "button",
                                    value: "Usuń",
                                    onclick: _ => shoppingCart.removeAll(response.data.id)
                                })
                            ])
                        ]),
                        response.data.quantity_available !== 0
                            ?  h("div", { className: "is-italic" }, `(${response.data.quantity_available} dostępnych)`)
                            :  h("div", { className: "is-italic is-danger" }, `(produkt niedostępny)`)
                    ]),
                    h("div", { className: "column is-3" }, [
                        h("div", { className: "has-text-weight-bold is-size-5" }, utils.showPrice(shoppingCart.products[response.data.id] * response.data.price)),
                        h("div", { className: "is-italic" }, `(${utils.showPrice(response.data.price)} za sztukę)`)
                    ])
                ])
                : h("article", { className: "message is-danger" }, [
                    h("div", { className: "message-body" }, [
                        h("details", {}, [
                            h("summary", {}, `${utils.capitalizeFirst(response.error.userMessage)}.`),
                            h("p", {}, `${utils.capitalizeFirst(response.error.devMessage)}.`)
                        ]),
                        h("input", {
                            className: "button is-danger",
                            type: "button",
                            value: "Usuń",
                            onclick: _ => shoppingCart.removeAll(productId)
                        })
                    ])
                ])
            : []
    ]);
};

export default Product;