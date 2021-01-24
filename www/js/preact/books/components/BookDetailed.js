import * as Preact from "/js/lib/Preact.js";
import { useState } from "/js/lib/PreactHooks.js";
import * as utils from "/js/utils.js";
import useShoppingCart from "/js/preact/hooks/useShoppingCart.js";
import * as modal from "/js/modal.js";

const h = Preact.h;

export const BookDetailed = ({ book }) => {
    const shoppingCart = useShoppingCart();
    const [amount, setAmount] = useState(1);

    return h("div", { className: "columns box my-4" }, [
        h("div", { className: "column is-3" }, [
            h("figure", { className: "image box p-1", style: !book.is_purchasable || book.quantity_available === 0 ? { opacity: 0.5, filter: "grayscale(50%)" } : undefined }, [
                h("img", { className: "is-clickable", onclick: event => modal.showImage(event.target.src), src: `/images/${book.image_id}`, loading: "lazy" })
            ])
        ]),
        h("div", { className: "column is-9" }, [
            h("div", { className: "is-size-3" }, [
                h("a", { href: `/book/${book.id}` }, book.name)
            ]),
            h("div", { className: "" }, [
                utils.intersperse(book.authors.map(author => h("a", {
                    href: `/books?author=${author}`
                }, author)), ", ")
            ]),
            h("table", { className: "table is-fullwidth" }, [
                h("tr", {}, [
                    h("td", { className: "has-text-grey" }, "Wydawnictwo: "),
                    h("td", {}, h("a", { href: `/books?publisher=${book.publisher}` }, book.publisher))
                ]),
                h("tr", {}, [
                    h("td", { className: "has-text-grey" }, "Kategorie: "),
                    h("td", {}, book.tags.length === 0
                        ? h("span", { className: "is-italic has-text-grey" }, "(brak)")
                        : book.tags.map(tag => h("a", { className: "tag m-1", href: `/books?tag=${tag}` }, utils.showTag(tag))))
                ]),
                h("tr", {}, [
                    h("td", { className: "has-text-grey" }, "Format: "),
                    h("td", {}, utils.showFormat(book.book_format))
                ]),
                h("tr", {}, [
                    h("td", { className: "has-text-grey" }, "Data premiery: "),
                    h("td", {}, h("time", { datetime: book.publication_date }, utils.showDate(book.publication_date)))
                ]),
                h("tr", {}, [
                    h("td", { className: "has-text-grey" }, "ISBN: "),
                    h("td", {}, book.isbn)
                ]),
                h("tr", {}, [
                    h("td", { className: "has-text-grey" }, "Liczba stron: "),
                    h("td", {}, book.pages)
                ]),
                h("tr", {
                    className:
                        book.quantity_available > 25 ? "" :
                        book.quantity_available > 10 ? "has-background-warning-light" :
                        "has-background-danger-light"
                }, [
                    h("td", { className: "has-text-grey" }, "Liczba dostępnych sztuk: "),
                    h("td", {}, book.quantity_available)
                ])
            ]),
            book.is_purchasable && book.quantity_available > 0
                ? h("div", { className: "is-flex", style: { "align-items": "center", "flex-wrap": "wrap", "justify-content": "space-evenly" } }, [
                    h("div", { className: "is-size-5 mx-2" }, [
                        h("span", { className: "has-text-grey" }, "Cena: "),
                        "\u00A0",
                        h("span", { className: "has-text-weight-bold" }, utils.showPrice(book.price))
                    ]),
                    h("div", { className: "field has-addons" }, [
                        h("div", { className: "control" }, [
                            h("button", { className: "button is-primary", onclick: _ => {
                                shoppingCart.add(book.product_id, amount);
                                modal.showCard("Koszyk", `Produkt "${book.name}" (x${amount}) został dodany do koszyka.`);
                            } }, "Dodaj do koszyka")
                        ]),
                        h("div", { className: "control" }, [
                            h("input", {
                                className: "input",
                                value: amount,
                                type: "number",
                                min: 1,
                                max: book.quantity_available,
                                style: { width: "4em" },
                                onchange: event => setAmount(isNaN(Number(event.target.value)) ? 1 : Number(event.target.value))
                            })
                        ]),
                        h("div", { className: "control" }, [
                            h("div", { className: "button is-static" }, "sztuk")
                        ])
                    ])
                ])
                : [
                    h("div", { className: "has-text-danger has-text-centered has-text-weight-bold" }, "Produkt niedostępny.")
                ]
        ])
    ])
};

export default BookDetailed;