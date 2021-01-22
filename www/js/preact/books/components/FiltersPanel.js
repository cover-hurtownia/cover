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
                            h("a", { className: "button is-static" }, "więcej niż")
                        ]),
                        h("div", { className: "control" }, [
                            h("input", {
                                className: "input",
                                type: "number",
                                name: "priceAtLeast",
                                step: ".01",
                                min: "0",
                                value: getQueryField("priceAtLeast"),
                                oninput: event => setQueryField("priceAtLeast", Number(event.target.value))
                            })
                        ]),
                    ]),
                    h("div", { className: "field has-addons" }, [
                        h("div", { className: "control" }, [
                            h("a", { className: "button is-static" }, "mniej niż")
                        ]),
                        h("div", { className: "control" }, [
                            h("input", {
                                className: "input",
                                type: "number",
                                name: "priceAtMost",
                                step: ".01",
                                min: "0",
                                value: getQueryField("priceAtMost"),
                                oninput: event => setQueryField("priceAtMost", Number(event.target.value))
                            })
                        ]),
                    ]),
                ])
            ]),
            h("div", { className: "panel-block" }, [
                h("details", {}, [
                    h("summary", {}, "Kategorie"),
                    h("div", { className: "field" }, [
                        h("input", { type: "hidden", name: "tag", value: "", checked: true }),
                        ...Object.entries(constants.tags).map(([tag, tagShown]) => [
                            h("label", { className: "label" }, [
                                h("input", {
                                    type: "checkbox",
                                    name: "tag",
                                    value: tag,
                                    checked: getQueryField("tag").includes(tag),
                                    onchange: event => setQueryField("tag", arr => {
                                        if (event.target.checked && !arr.includes(tag)) return [...arr, tag];
                                        else if (!event.target.checked) return arr.filter(value => value !== tag);
                                        else return arr;
                                    })
                                }),
                                tagShown
                            ])
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
                                placeholder: " 9783161484100",
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
                            h("a", { className: "button is-static" }, "od dnia")
                        ]),
                        h("div", { className: "control is-expanded" }, [
                            h("input", {
                                className: "input",
                                type: "date",
                                name: "publicationDateFirst",
                                value: getQueryField("publicationDateFirst"),
                                oninput: event => setQueryField("publicationDateFirst", event.target.value)
                            })
                        ])
                    ]),
                    h("div", { className: "field has-addons" }, [
                        h("div", { className: "control" }, [
                            h("a", { className: "button is-static" }, "do dnia")
                        ]),
                        h("div", { className: "control is-expanded" }, [
                            h("input", {
                                className: "input",
                                type: "date",
                                name: "publicationDateLast",
                                value: getQueryField("publicationDateLast"),
                                oninput: event => setQueryField("publicationDateLast", event.target.value)
                            })
                        ])
                    ]),
                    h("div", { className: "field" }, [
                        h("label", { className: "label" }, "Rodzaj oprawy"),
                        h("input", { type: "hidden", name: "bookFormat", value: "", checked: true }),
                        ...Object.entries(constants.formats).map(([format, formatShown]) => [
                            h("label", { className: "label" }, [
                                h("input", {
                                    type: "checkbox",
                                    name: "bookFormat",
                                    value: format,
                                    checked: getQueryField("bookFormat").includes(format),
                                    onchange: event => setQueryField("bookFormat", arr => {
                                        if (event.target.checked && !arr.includes(format)) return [...arr, format];
                                        else if (!event.target.checked) return arr.filter(value => value !== format);
                                        else return arr;
                                    })
                                }),
                                formatShown
                            ])
                        ])
                    ]),
                    h("label", { className: "label" }, "Liczba stron"),
                    h("div", { className: "field has-addons" }, [
                        h("div", { className: "control" }, [
                            h("a", { className: "button is-static" }, "więcej niż")
                        ]),
                        h("div", { className: "control is-expanded" }, [
                            h("input", {
                                className: "input",
                                type: "number",
                                name: "pagesAtLeast",
                                step: "1",
                                min: "0",
                                value: getQueryField("pagesAtLeast"),
                                oninput: event => setQueryField("pagesAtLeast", event.target.value)
                            })
                        ])
                    ]),
                    h("div", { className: "field has-addons" }, [
                        h("div", { className: "control" }, [
                            h("a", { className: "button is-static" }, "mniej niż")
                        ]),
                        h("div", { className: "control is-expanded" }, [
                            h("input", {
                                className: "input",
                                type: "number",
                                name: "pagesAtMost",
                                step: "1",
                                min: "0",
                                value: getQueryField("pagesAtMost"),
                                oninput: event => setQueryField("pagesAtMost", event.target.value)
                            })
                        ])
                    ]),
                    h("label", { className: "label" }, "Dostępne sztuki"),
                    h("div", { className: "field has-addons" }, [
                        h("div", { className: "control" }, [
                            h("a", { className: "button is-static" }, "więcej niż")
                        ]),
                        h("div", { className: "control is-expanded" }, [
                            h("input", {
                                className: "input",
                                type: "number",
                                name: "quantityAtLeast",
                                step: "1",
                                min: "0",
                                value: getQueryField("quantityAtLeast"),
                                oninput: event => setQueryField("quantityAtLeast", event.target.value)
                            })
                        ])
                    ]),
                    h("div", { className: "field has-addons" }, [
                        h("div", { className: "control" }, [
                            h("a", { className: "button is-static" }, "mniej niż")
                        ]),
                        h("div", { className: "control is-expanded" }, [
                            h("input", {
                                className: "input",
                                type: "number",
                                name: "quantityAtMost",
                                step: "1",
                                min: "0",
                                value: getQueryField("quantityAtMost"),
                                oninput: event => setQueryField("quantityAtMost", event.target.value)
                            })
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