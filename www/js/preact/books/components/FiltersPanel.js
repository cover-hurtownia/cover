import * as Preact from "/js/lib/Preact.js";

const h = Preact.h;

export const FiltersPanel = ({ getQueryField, setQueryField, search, resetQuery }) => {
    return h("form", {}, [
        h("nav", { className: "panel" }, [
            h("p", { className: "panel-heading" }, "Filtry"),
            h("div", { className: "panel-block" }, [
                h("div", {}, [
                    h("div", { className: "field" }, [
                        h("label", { className: "label" }, "Tytuł"),
                        h("div", { className: "control" }, [
                            h("input", {
                                className: "input",
                                type: "text",
                                name: "title",
                                placeholder: "Tytuł",
                                value: getQueryField("title"),
                                oninput: event => setQueryField("title", event.target.value)
                            })
                        ])
                    ]),
                    h("div", { className: "field" }, [
                        h("label", { className: "label" }, "Autor"),
                        h("div", { className: "control" }, [
                            h("input", {
                                className: "input",
                                type: "text",
                                name: "author",
                                placeholder: "Autor",
                                value: getQueryField("author"),
                                oninput: event => setQueryField("author", event.target.value)
                            })
                        ])
                    ]),
                    h("label", { className: "label" }, "Cena"),
                    h("div", { className: "field has-addons" }, [
                        h("div", { className: "control" }, [
                            h("input", {
                                className: "input",
                                type: "number",
                                name: "priceAtLeast",
                                step: ".01",
                                min: "0",
                                value: getQueryField("priceAtLeast") / 100.0,
                                oninput: event => setQueryField("priceAtLeast", Number(event.target.value) * 100.0)
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
                                name: "priceAtMost",
                                step: ".01",
                                min: "0",
                                value: getQueryField("priceAtMost") / 100.0,
                                oninput: event => setQueryField("priceAtMost", Number(event.target.value) * 100.0)
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
                    h("summary", {}, "Szczegóły"),
                    h("div", { className: "field" }, [
                        h("label", { className: "label" }, "ISBN"),
                        h("div", { className: "control" }, [
                            h("input", {
                                className: "input",
                                type: "text",
                                name: "isbn",
                                placeholder: "ISBN",
                                value: getQueryField("isbn"),
                                oninput: event => setQueryField("isbn", event.target.value)
                            })
                        ])
                    ]),
                    h("div", { className: "field" }, [
                        h("label", { className: "label" }, "Wydawnictwo"),
                        h("div", { className: "control" }, [
                            h("input", {
                                className: "input",
                                type: "text",
                                name: "title",
                                placeholder: "Wydawnictwo",
                                value: getQueryField("publisher"),
                                oninput: event => setQueryField("publisher", event.target.value)
                            })
                        ])
                    ]),
                    h("label", { className: "label" }, "Data publikacji"),
                    h("div", { className: "field has-addons" }, [
                        h("div", { className: "control" }, [
                            h("input", {
                                className: "input",
                                type: "date",
                                name: "publicationDateFirst",
                                value: getQueryField("publicationDateFirst"),
                                oninput: event => setQueryField("publicationDateFirst", event.target.value)
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
                                name: "publicationDateLast",
                                value: getQueryField("publicationDateLast"),
                                oninput: event => setQueryField("publicationDateLast", event.target.value)
                            })
                        ]),
                        h("div", { className: "control" }, [
                            h("a", { className: "button is-static" }, "do dnia")
                        ])
                    ]),
                    h("div", { className: "field" }, [
                        h("label", { className: "label" }, "Rodzaj oprawy"),
                        h("input", { type: "hidden", name: "bindingType", value: "", checked: true }),
                        h("label", { className: "label" }, [
                            h("input", {
                                type: "checkbox",
                                name: "bindingType",
                                value: "hardcover",
                                onchange: event => setQueryField("bindingType", arr => {
                                    if (event.target.checked && !arr.includes("hardcover")) return [...arr, "hardcover"];
                                    else if (!event.target.checked) return arr.filter(value => value !== "hardcover");
                                    else return arr;
                                })
                            }),
                            "twarda oprawa"
                        ]),
                        h("input", { type: "hidden", name: "bindingType", value: "", checked: true }),
                        h("label", { className: "label" }, [
                            h("input", {
                                type: "checkbox",
                                name: "bindingType",
                                value: "softcover",
                                onchange: event => setQueryField("bindingType", arr => {
                                    if (event.target.checked && !arr.includes("softcover")) return [...arr, "softcover"];
                                    else if (!event.target.checked) return arr.filter(value => value !== "softcover");
                                    else return arr;
                                })
                            }),
                            "miękka oprawa"
                        ])
                    ]),
                    h("label", { className: "label" }, "Liczba stron"),
                    h("div", { className: "field has-addons" }, [
                        h("div", { className: "control" }, [
                            h("input", {
                                className: "input",
                                type: "number",
                                name: "pagesAtLeast",
                                step: "1",
                                min: "0",
                                value: getQueryField("pagesAtLeast"),
                                oninput: event => setQueryField("pagesAtLeast", event.target.value)
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
                                name: "pagesAtMost",
                                step: "1",
                                min: "0",
                                value: getQueryField("pagesAtMost"),
                                oninput: event => setQueryField("pagesAtMost", event.target.value)
                            })
                        ]),
                        h("div", { className: "control" }, [
                            h("a", { className: "button is-static" }, "mniej niż")
                        ])
                    ]),
                    h("label", { className: "label" }, "Dostępne sztuki"),
                    h("div", { className: "field has-addons" }, [
                        h("div", { className: "control" }, [
                            h("input", {
                                className: "input",
                                type: "number",
                                name: "quantityAtLeast",
                                step: "1",
                                min: "0",
                                value: getQueryField("quantityAtLeast"),
                                oninput: event => setQueryField("quantityAtLeast", event.target.value)
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
                                name: "quantityAtMost",
                                step: "1",
                                min: "0",
                                value: getQueryField("quantityAtMost"),
                                oninput: event => setQueryField("quantityAtMost", event.target.value)
                            })
                        ]),
                        h("div", { className: "control" }, [
                            h("a", { className: "button is-static" }, "mniej niż")
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