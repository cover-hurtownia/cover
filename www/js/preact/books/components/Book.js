import * as Preact from "/js/lib/Preact.js";
import * as utils from "/js/utils.js";

const h = Preact.h;

export const Book = ({ book }) => h("div", { className: "column is-4" }, [
    h("div", { className: "card" }, [
        h("div", { className: "card-image" }, [
            h("figure", { className: "image" }, [
                h("img", { src: `/images/${book.image_id}` })
            ])
        ]),
        h("div", { className: "card-content" }, [
            h("div", { className: "title has-text-centered is-5" }, [
                h("a", { href: `/book/${book.id}` }, book.name)
            ]),
            h("ul", { className: "content" }, [
                h("li", {}, [
                    h("span", { className: "has-text-grey" }, "Autorzy: "),
                    h("span", {}, book.authors.map(author => h("a", { href: `/books.html?author=${author}` }, author)))
                ]),
                h("li", {}, [
                    h("span", { className: "has-text-grey" }, "Wydawnictwo: "),
                    h("span", {}, h("a", { href: `/books.html?publisher=${book.publisher}`}, book.publisher))
                ]),
                h("li", {}, [
                    h("span", { className: "has-text-grey" }, "Kategorie: "),
                    h("span", {}, book.tags.map(tag => h("a", { href: `/books.html?tag=${tag}`, className: "tag is-primary is-light mx-1" }, tag)))
                ])
            ]),
            h("footer", { className: "card-footer" }, [
                h("p", { className: "card-footer-item" }, [
                    book.available
                        ? [
                            h("span", { className: "has-text-grey" }, "Cena: "),
                            "\u00A0",
                            h("span", { className: "has-text-weight-bold" }, utils.showPrice(book.price))
                        ]
                        : [
                            h("span", { className: "has-text-danger" }, "Produkt niedostępny.")
                        ]
                ])
            ])
        ])
    ])
]);

export default Book;