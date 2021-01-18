import * as Preact from "/js/lib/Preact.js";

const h = Preact.h;

export const FiltersPanel = ({ getQueryField, setQueryField, search, resetQuery }) => {
    return h("form", {}, [
        h("nav", { className: "panel" }, [
            h("p", { className: "panel-heading" }, "Filtry"),
            h("div", { className: "panel-block" }, [
                h("div", {}, [
                    h("div", { className: "field" }, [
                            h("label", { className: "label" }, "ID zamówienia"),
                            h("div", { className: "control" }, [
                                h("input", {
                                    className: "input is-family-monospace",
                                    type: "text",
                                    name: "id",
                                    placeholder: "1",
                                    value: getQueryField("id"),
                                    oninput: event => setQueryField("id", event.target.value)
                                })
                            ])
                    ]),
                    h("label", { className: "label" }, "Data zamówienia"),
                    h("div", { className: "field has-addons" }, [
                        h("div", { className: "control" }, [
                            h("input", {
                                className: "input",
                                type: "date",
                                name: "orderDateFirst",
                                value: getQueryField("orderDateFirst"),
                                oninput: event => setQueryField("orderDateFirst", event.target.value)
                            })
                        ]),
                        h("div", { className: "control" }, [
                            h("a", { className: "button is-static" }, "od dnia")
                        ])
                    ]),
                    h("div", { className: "field has-addons" }, [
                        h("div", { className: "control" }, [
                            h("input", {
                                className: "input",
                                type: "date",
                                name: "orderDateLast",
                                value: getQueryField("orderDateLast"),
                                oninput: event => setQueryField("orderDateLast", event.target.value)
                            })
                        ]),
                        h("div", { className: "control" }, [
                            h("a", { className: "button is-static" }, "do dnia")
                        ])
                    ]),
                    h("label", { className: "label" }, "Łączny koszt"),
                    h("div", { className: "field has-addons" }, [
                        h("div", { className: "control" }, [
                            h("input", {
                                className: "input",
                                type: "number",
                                name: "totalCostAtLeast",
                                step: ".01",
                                min: "0",
                                value: getQueryField("totalCostAtLeast") / 100.0,
                                oninput: event => setQueryField("totalCostAtLeast", Number(event.target.value) * 100.0)
                            })
                        ]),
                        h("div", { className: "control" }, [
                            h("a", { className: "button is-static" }, "więcej niż")
                        ])
                    ]),
                    h("div", { className: "field has-addons" }, [
                        h("div", { className: "control" }, [
                            h("input", {
                                className: "input",
                                type: "number",
                                name: "totalCostAtMost",
                                step: ".01",
                                min: "0",
                                value: getQueryField("totalCostAtMost") / 100.0,
                                oninput: event => setQueryField("totalCostAtMost", Number(event.target.value) * 100.0)
                            })
                        ]),
                        h("div", { className: "control" }, [
                            h("a", { className: "button is-static" }, "mniej niż")
                        ])
                    ])
                ])
            ]),
            h("div", { className: "panel-block" }, [
                h("details", {}, [
                    h("summary", {}, "Klient"),
                    h("div", { className: "field" }, [
                        h("label", { className: "label" }, "Imię"),
                        h("div", { className: "control" }, [
                            h("input", {
                                className: "input",
                                type: "text",
                                name: "firstName",
                                placeholder: "Imię",
                                value: getQueryField("firstName"),
                                oninput: event => setQueryField("firstName", event.target.value)
                            })
                        ])
                    ]),
                    h("div", { className: "field" }, [
                        h("label", { className: "label" }, "Nazwisko"),
                        h("div", { className: "control" }, [
                            h("input", {
                                className: "input",
                                type: "text",
                                name: "lastName",
                                placeholder: "Nazwisko",
                                value: getQueryField("lastName"),
                                oninput: event => setQueryField("lastName", event.target.value)
                            })
                        ])
                    ]),
                    h("div", { className: "field" }, [
                        h("label", { className: "label" }, "Telefon"),
                        h("div", { className: "control" }, [
                            h("input", {
                                className: "input is-family-monospace",
                                type: "tel",
                                name: "phoneNumber",
                                placeholder: "+48123456789",
                                value: getQueryField("phoneNumber"),
                                oninput: event => setQueryField("phoneNumber", event.target.value)
                            })
                        ])
                    ]),
                    h("div", { className: "field" }, [
                        h("label", { className: "label" }, "Email"),
                        h("div", { className: "control" }, [
                            h("input", {
                                className: "input is-family-monospace",
                                type: "email",
                                name: "email",
                                placeholder: "Email",
                                value: getQueryField("email"),
                                oninput: event => setQueryField("email", event.target.value)
                            })
                        ])
                    ]),
                    h("div", { className: "field" }, [
                        h("label", { className: "label" }, "Użytkownik"),
                        h("div", { className: "control" }, [
                            h("input", {
                                className: "input is-family-monospace",
                                type: "text",
                                name: "username",
                                placeholder: "username",
                                value: getQueryField("username"),
                                oninput: event => setQueryField("username", event.target.value)
                            })
                        ])
                    ]),
                ]),  
            ]),
            h("div", { className: "panel-block" }, [
                h("details", {}, [
                    h("summary", {}, "Lokalizacja"),
                    h("div", { className: "field" }, [
                        h("label", { className: "label" }, "Adres"),
                        h("div", { className: "control" }, [
                            h("input", {
                                className: "input",
                                type: "text",
                                name: "street",
                                placeholder: "ul. Kartuska 6",
                                value: getQueryField("street"),
                                oninput: event => setQueryField("street", event.target.value)
                            })
                        ])
                    ]),
                    h("div", { className: "field" }, [
                        h("label", { className: "label" }, "Lokal"),
                        h("div", { className: "control" }, [
                            h("input", {
                                className: "input",
                                type: "text",
                                name: "apartment",
                                placeholder: "420",
                                value: getQueryField("apartment"),
                                oninput: event => setQueryField("apartment", event.target.value)
                            })
                        ])
                    ]),
                    h("div", { className: "field" }, [
                        h("label", { className: "label" }, "Kod pocztowy"),
                        h("div", { className: "control" }, [
                            h("input", {
                                className: "input",
                                type: "text",
                                name: "postalCode",
                                placeholder: "85-000",
                                value: getQueryField("apartment"),
                                oninput: event => setQueryField("apartment", event.target.value)
                            })
                        ])
                    ]),
                    h("div", { className: "field" }, [
                        h("label", { className: "label" }, "Miasto"),
                        h("div", { className: "control" }, [
                            h("input", {
                                className: "input",
                                type: "text",
                                name: "city",
                                placeholder: "Bydgoszcz",
                                value: getQueryField("city"),
                                oninput: event => setQueryField("city", event.target.value)
                            })
                        ])
                    ])
                ])
            ]),
            h("div", { className: "panel-block" }, [
                h("details", {}, [
                    h("summary", {}, "Dostawa"),
                    h("div", { className: "field" }, [
                        h("label", { className: "label" }, "Rodzaj dostawy"),
                        h("input", { type: "hidden", name: "deliveryType", value: "", checked: true }),
                        h("label", { className: "label" }, [
                            h("input", {
                                type: "checkbox",
                                name: "deliveryType",
                                value: "pigeon",
                                onchange: event => setQueryField("deliveryType", arr => {
                                    if (event.target.checked && !arr.includes("pigeon")) return [...arr, "pigeon"];
                                    else if (!event.target.checked) return arr.filter(value => value !== "pigeon");
                                    else return arr;
                                })
                            }),
                            "gołąb pocztowy"
                        ])
                    ]),
                    h("div", { className: "field" }, [
                        h("label", { className: "label" }, "Numer przesyłki"),
                        h("div", { className: "control" }, [
                            h("input", {
                                className: "input is-family-monospace",
                                type: "text",
                                name: "trackingNumber",
                                placeholder: "0015900773312345678",
                                value: getQueryField("trackingNumber"),
                                oninput: event => setQueryField("trackingNumber", event.target.value)
                            })
                        ])
                    ]),
                    h("div", { className: "field" }, [
                        h("label", { className: "label" }, "Status zamówienia"),
                        h("input", { type: "hidden", name: "status", value: "", checked: true }),
                        h("label", { className: "label" }, [
                            h("input", {
                                type: "checkbox",
                                name: "status",
                                value: "placed",
                                onchange: event => setQueryField("status", arr => {
                                    if (event.target.checked && !arr.includes("placed")) return [...arr, "placed"];
                                    else if (!event.target.checked) return arr.filter(value => value !== "placed");
                                    else return arr;
                                })
                            }),
                            "złożone"
                        ]),
                        h("label", { className: "label" }, [
                            h("input", {
                                type: "checkbox",
                                name: "status",
                                value: "accepted",
                                onchange: event => setQueryField("status", arr => {
                                    if (event.target.checked && !arr.includes("accepted")) return [...arr, "accepted"];
                                    else if (!event.target.checked) return arr.filter(value => value !== "accepted");
                                    else return arr;
                                })
                            }),
                            "przyjęte"
                        ]),
                        h("label", { className: "label" }, [
                            h("input", {
                                type: "checkbox",
                                name: "status",
                                value: "sent",
                                onchange: event => setQueryField("status", arr => {
                                    if (event.target.checked && !arr.includes("sent")) return [...arr, "sent"];
                                    else if (!event.target.checked) return arr.filter(value => value !== "sent");
                                    else return arr;
                                })
                            }),
                            "wysłane"
                        ]),
                        h("label", { className: "label" }, [
                            h("input", {
                                type: "checkbox",
                                name: "status",
                                value: "delivered",
                                onchange: event => setQueryField("status", arr => {
                                    if (event.target.checked && !arr.includes("delivered")) return [...arr, "delivered"];
                                    else if (!event.target.checked) return arr.filter(value => value !== "delivered");
                                    else return arr;
                                })
                            }),
                            "dostarczone"
                        ]),
                        h("label", { className: "label" }, [
                            h("input", {
                                type: "checkbox",
                                name: "status",
                                value: "cancelled",
                                onchange: event => setQueryField("status", arr => {
                                    if (event.target.checked && !arr.includes("cancelled")) return [...arr, "cancelled"];
                                    else if (!event.target.checked) return arr.filter(value => value !== "cancelled");
                                    else return arr;
                                })
                            }),
                            "anulowane"
                        ])
                    ])
                ])
            ]),
            h("div", { className: "panel-block" }, [
                h("div", { className: "buttons" }, [
                    h("input", { type: "button", className: "button is-primary", value: "Zastosuj", onClick: _ => search() }),
                    h("input", { type: "button", className: "button is-primary is-light", value: "Zresetuj", onClick: resetQuery })
                ])
            ])
        ])
    ]);
};

export default FiltersPanel;