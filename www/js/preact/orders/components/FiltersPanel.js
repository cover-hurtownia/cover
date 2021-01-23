import * as Preact from "/js/lib/Preact.js";
import * as constants from "/js/constants.js";

const h = Preact.h;

export const FiltersPanel = ({ getQueryField, setQueryField, newSearch, resetSearch }) => {
    return h("form", {}, [
        h("nav", { className: "panel is-primary" }, [
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
                            h("a", { className: "button is-static" }, "od dnia")
                        ]),
                        h("div", { className: "control is-expanded" }, [
                            h("input", {
                                className: "input",
                                type: "date",
                                name: "orderDateFirst",
                                value: getQueryField("orderDateFirst"),
                                oninput: event => setQueryField("orderDateFirst", event.target.value)
                            })
                        ]),
                    ]),
                    h("div", { className: "field has-addons" }, [
                        h("div", { className: "control" }, [
                            h("a", { className: "button is-static" }, "do dnia")
                        ]),
                        h("div", { className: "control is-expanded" }, [
                            h("input", {
                                className: "input",
                                type: "date",
                                name: "orderDateLast",
                                value: getQueryField("orderDateLast"),
                                oninput: event => setQueryField("orderDateLast", event.target.value)
                            })
                        ])
                    ]),
                    h("label", { className: "label" }, "Łączny koszt"),
                    h("div", { className: "field has-addons" }, [
                        h("div", { className: "control" }, [
                            h("a", { className: "button is-static" }, "więcej niż")
                        ]),
                        h("div", { className: "control is-expanded" }, [
                            h("input", {
                                className: "input",
                                type: "number",
                                name: "totalCostAtLeast",
                                step: ".01",
                                min: "0",
                                value: getQueryField("totalCostAtLeast"),
                                oninput: event => setQueryField("totalCostAtLeast", Number(event.target.value))
                            })
                        ]),
                    ]),
                    h("div", { className: "field has-addons" }, [
                        h("div", { className: "control" }, [
                            h("a", { className: "button is-static" }, "mniej niż")
                        ]),
                        h("div", { className: "control is-expanded" }, [
                            h("input", {
                                className: "input",
                                type: "number",
                                name: "totalCostAtMost",
                                step: ".01",
                                min: "0",
                                value: getQueryField("totalCostAtMost"),
                                oninput: event => setQueryField("totalCostAtMost", Number(event.target.value))
                            })
                        ]),
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
                                name: "address",
                                placeholder: "ul. Kartuska 6",
                                value: getQueryField("address"),
                                oninput: event => setQueryField("address", event.target.value)
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
                        ...Object.entries(constants.delivery).map(([delivery, deliveryShown]) => [
                            h("label", { className: "label" }, [
                                h("input", {
                                    type: "checkbox",
                                    name: "deliveryType",
                                    value: delivery,
                                    checked: getQueryField("deliveryType").includes(delivery),
                                    onchange: event => setQueryField("deliveryType", arr => {
                                        if (event.target.checked && !arr.includes(delivery)) return [...arr, delivery];
                                        else if (!event.target.checked) return arr.filter(value => value !== delivery);
                                        else return arr;
                                    })
                                }),
                                deliveryShown
                            ])
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
                        ...Object.entries(constants.status).map(([status, statusShown]) => [
                            h("label", { className: "label" }, [
                                h("input", {
                                    type: "checkbox",
                                    name: "status",
                                    value: status,
                                    checked: getQueryField("status").includes(status),
                                    onchange: event => setQueryField("status", arr => {
                                        if (event.target.checked && !arr.includes(status)) return [...arr, status];
                                        else if (!event.target.checked) return arr.filter(value => value !== status);
                                        else return arr;
                                    })
                                }),
                                statusShown
                            ])
                        ])
                    ])
                ])
            ]),
            h("div", { className: "panel-block" }, [
                h("div", { className: "buttons" }, [
                    h("input", { type: "button", className: "button is-primary", value: "Pokaż wyniki", onClick: _ => newSearch() }),
                    h("input", { type: "button", className: "button is-primary is-light", value: "Wyczyść filtry", onClick: _ => resetSearch() })
                ])
            ])
        ])
    ]);
};

export default FiltersPanel;