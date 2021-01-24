import * as Preact from "/js/lib/Preact.js";
import * as utils from "/js/utils.js";

import * as API from "/js/api/index.js";
import * as modal from "/js/modal.js";

const h = Preact.h;

export const Order = ({ order }) => h("div", { className: "box" }, [
    h("div", { className: "is-size-3 has-text-weight-light" }, [
        h("span", { className: "has-text-grey" }, `Zamówienie #`),
        h("span", { className: "is-family-monospace" }, order.id)
    ]),
    h("div", { className: "columns" }, [
        h("div", { className: "column is-size-5 has-text-weight-light" }, [
            h("span", { className: "has-text-grey" }, "Data zamówienia: "),
            h("time", { datetime: order.order_date }, utils.showDateTime(order.order_date))
        ]),
        h("div", { className: "column has-text-right is-size-5 has-text-weight-light" }, [
            h("span", { className: "has-text-grey" }, "Łączny koszt: "),
            h("span", { className: "is-family-monospace" }, utils.showPrice(order.total_cost))
        ])
    ]),
    h("div", { className: "columns" }, [
        h("div", { className: "column" }, [
            h("ul", {}, [
                h("li", {}, [
                    h("span", { className: "has-text-grey" }, "Imię: "),
                    h("span", {}, order.first_name)
                ]),
                h("li", {}, [
                    h("span", { className: "has-text-grey" }, "Nazwisko: "),
                    h("span", {}, order.last_name)
                ]),
                h("li", {}, [
                    h("span", { className: "has-text-grey" }, "Telefon: "),
                    h("span", { className: "is-family-monospace" }, order.phone_number)
                ]),
                h("li", {}, [
                    h("span", { className: "has-text-grey" }, "Email: "),
                    h("span", { className: "is-family-monospace" }, h("a", { href: `mailto:${order.email}` }, order.email))
                ]),
                h("li", {}, [
                    h("span", { className: "has-text-grey" }, "Użytkownik: "),
                    order.user_id === null
                        ? h("span", { className: "has-text-grey-light is-italic" }, "(brak)")
                        : h("span", { className: "is-family-monospace" }, h("a", { href: `/admin/orders?username=${order.username}` }, order.username))
                ])
            ])
        ]),
        h("div", { className: "column" }, [
            h("ul", {}, [
                h("li", {}, [
                    h("span", { className: "has-text-grey" }, "Adres: "),
                    h("span", {}, order.address)
                ]),
                h("li", {}, [
                    h("span", { className: "has-text-grey" }, "Lokal: "),
                    order.apartment === null
                        ? h("span", { className: "has-text-grey-light is-italic" }, "(brak)")
                        : h("span", {}, order.apartment)
                ]),
                h("li", {}, [
                    h("span", { className: "has-text-grey" }, "Kod pocztowy: "),
                    h("span", {}, order.postal_code)
                ]),
                h("li", {}, [
                    h("span", { className: "has-text-grey" }, "Miasto: "),
                    h("span", {}, order.city)
                ])
            ])
        ]),
        h("div", { className: "column" }, [
            h("ul", {}, [
                h("li", {}, [
                    h("span", { className: "has-text-grey" }, "Rodzaj dostawy: "),
                    h("span", {}, utils.showDelivery(order.delivery_type))
                ]),
                h("li", {}, [
                    h("span", { className: "has-text-grey" }, "Koszt dostawy: "),
                    h("span", { className: "is-family-monospace" }, utils.showPrice(order.delivery_cost))
                ]),
                h("li", {}, [
                    h("span", { className: "has-text-grey" }, "Numer przesyłki: "),
                    order.tracking_number === null
                        ? h("span", { className: "has-text-grey-light is-italic" }, "(brak)")
                        : h("span", { className: "is-family-monospace" }, order.tracking_number)
                ]),
                h("li", {}, [
                    h("span", { className: "has-text-grey" }, "Status zamówienia: "),
                    h("span", { className: `tag ${utils.getStatusClassName(order.order_status)} is-light` }, utils.showStatus(order.order_status))
                ])
            ])
        ])
    ]),
    order.order_status !== "delivered" && order.order_status !== "cancelled" ? h("div", { className: "block" }, [
        h("div", { className: "field has-addons"}, [
            h("div", { className: "control" }, [
                h("button", { className: "button is-static" }, "Zmień status zamówienia na ")
            ]),
            h("div", { className: "control" }, [
                order.order_status === "placed" ? h("button", {
                    className: `button ${utils.getStatusClassName("accepted")}`,
                    onclick: async _ => {
                        const response = await API.orders.accept(order.id);
        
                        if (response.status === "ok") {
                            modal.showCard("Sukces", `Zamówienie #${order.id} zostało zaakceptowane.`, [
                                {
                                    classList: ["is-primary"],
                                    textContent: "Odśwież",
                                    onClick: _ => window.location.reload()
                                }
                            ]);
                        }
                        else {
                            modal.showCard("Błąd", utils.capitalizeFirst(response.error.userMessage) + ".");
                            console.error(response.error.devMessage);
                        }
                    }
                }, "Zaakceptowane") :
                order.order_status === "accepted" ? h("button", {
                    className: `button ${utils.getStatusClassName("sent")}`,
                    onclick: async _ => {
                        const response = await API.orders.send(order.id);
        
                        if (response.status === "ok") {
                            modal.showCard("Sukces", `Zamówienie #${order.id} zostało wysłane.`, [
                                {
                                    classList: ["is-primary"],
                                    textContent: "Odśwież",
                                    onClick: _ => window.location.reload()
                                }
                            ]);
                        }
                        else {
                            modal.showCard("Błąd", utils.capitalizeFirst(response.error.userMessage) + ".");
                            console.error(response.error.devMessage);
                        }
                    }
                }, "Wysłane") :
                order.order_status === "sent" ? h("button", {
                    className: `button ${utils.getStatusClassName("delivered")}`,
                    onclick: async _ => {
                        const response = await API.orders.delivered(order.id);
        
                        if (response.status === "ok") {
                            modal.showCard("Sukces", `Zamówienie #${order.id} zostało dostarczone.`, [
                                {
                                    classList: ["is-primary"],
                                    textContent: "Odśwież",
                                    onClick: _ => window.location.reload()
                                }
                            ]);
                        }
                        else {
                            modal.showCard("Błąd", utils.capitalizeFirst(response.error.userMessage) + ".");
                            console.error(response.error.devMessage);
                        }
                    }
                }, "Dostarczone") : []
            ]),
            h("div", { className: "control" }, [
                h("button", {
                    className: `button ${utils.getStatusClassName("cancelled")}`,
                    onclick: async _ => {
                        const response = await API.orders.cancel(order.id);
        
                        if (response.status === "ok") {
                            modal.showCard("Sukces", `Zamówienie #${order.id} zostało anulowane.`, [
                                {
                                    classList: ["is-primary"],
                                    textContent: "Odśwież",
                                    onClick: _ => window.location.reload()
                                }
                            ]);
                        }
                        else {
                            modal.showCard("Błąd", utils.capitalizeFirst(response.error.userMessage) + ".");
                            console.error(response.error.devMessage);
                        }
                    }
                }, "Anulowane")
            ])
        ])
    ]) : [],
    order.comment
        ? h("div", { className: "block box" }, [
            h("h3", { className: "title is-size-3" }, "Wiadomość od klienta"),
            h("p", { className: "is-italic" }, order.comment)
        ])
        : [],
    h("div", { className: "block" }, [
        ...order.products.map(product => h("div", { className: "columns is-vcentered" }, [
            h("div", { className: "column is-2" }, [
                h("img", { className: "box p-1", src: `/images/${product.image_id}` })
            ]),
            h("div", { className: "column" }, [
                h("div", { className: "is-size-4 has-text-weight-light" }, h("a", { href: `/books?name=${product.name}`}, product.name)),
                h("ul", {}, [
                    h("li", {}, [
                        h("span", { className: "has-text-grey" }, "Cena za sztukę: "),
                        h("span", { className: "is-family-monospace" }, utils.showPrice(product.price_per_unit))
                    ]),
                    h("li", {}, [
                        h("span", { className: "has-text-grey" }, "Liczba sztuk: "),
                        h("span", { className: "is-family-monospace" }, product.quantity_ordered)
                    ]),
                    h("li", {}, [
                        h("span", { className: "has-text-grey" }, "Razem: "),
                        h("span", { className: "is-family-monospace" }, utils.showPrice(product.price_per_unit * product.quantity_ordered))
                    ]),
                    h("li", {}, [
                        h("span", { className: "has-text-grey" }, "ID produktu: "),
                        h("span", { className: "is-family-monospace" }, product.id)
                    ])
                ])   
            ])
        ]))
    ])
]);

export default Order;