import * as Preact from "/js/lib/Preact.js";
import * as utils from "/js/utils.js";
import * as modal from "/js/modal.js";

import useShoppingCart from "/js/preact/hooks/useShoppingCart.js";

const h = Preact.h;

export const BookCard = ({ book }) => {
    const shoppingCart = useShoppingCart();

    return h("div", { className: "column is-3" }, [
        h("div", { className: "card" }, [
            h("div", { className: "card-image" }, [
                h("figure", { className: "image", style: !book.is_purchasable || book.quantity_available === 0 ? { opacity: 0.5, filter: "grayscale(50%)" } : undefined }, [
                    h("img", { src: `/images/${book.image_id}`, loading: "lazy" })
                ])
            ]),
            h("div", { className: "card-content" }, [
                h("div", { className: "has-text-weight-bold has-text-centered" }, [
                    h("a", { href: `/book/${book.id}` }, book.name)
                ]),
                h("div", { className: "has-text-centered" }, [
                    h("span", {}, utils.intersperse(book.authors.map(author => h("a", {
                        href: `/books?author=${author}`
                    }, author)), ", "))
                ])
            ]),
            h("footer", { className: "card-footer" }, [
                h("p", { className: "card-footer-item has-text-centered" }, [
                    book.is_purchasable && book.quantity_available > 0
                        ? h("div", {}, [
                            h("div", {}, [
                                h("span", { className: "has-text-grey" }, "Cena: "),
                                "\u00A0",
                                h("span", { className: "has-text-weight-bold" }, utils.showPrice(book.price))
                            ]),
                            h("button", { className: "button is-small is-primary", onclick: _ => {
                                shoppingCart.add(book.product_id)
                                modal.showCard("Koszyk", `Produkt "${book.name}" został dodany do koszyka.`);
                            } }, "Dodaj do koszyka")
                        ])
                        : [
                            h("span", { className: "has-text-danger" }, "Produkt niedostępny.")
                        ]
                ])
            ])
        ])
    ])
};

export default BookCard;