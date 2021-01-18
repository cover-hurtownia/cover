import * as Preact from "/js/lib/Preact.js";

const h = Preact.h;

export const OrderingPanel = ({ getQueryField, setQueryField, search, options })  => {
    return h("nav", { className: "panel" }, [
        h("p", { className: "panel-heading" }, "Sortowanie"),
        h("div", { className: "panel-block" }, [
            h("form", { className: "columns is-multiline is-justify-content-space-between" }, [
                h("div", { className: "column field has-addons" }, [
                    h("div", { className: "control" }, [
                        h("a", { className: "button is-static" }, "Sortuj")
                    ]),
                    h("div", { className: "control" }, [
                        h("div", { className: "select" }, [
                            h("select", {
                                name: "ordering",
                                value: getQueryField("ordering"),
                                onchange: event => setQueryField("ordering", event.target.value)
                            }, [
                                h("option", { value: "desc" }, "Malejąco"),
                                h("option", { value: "asc" }, "Rosnąco")
                            ])
                        ])
                    ]),
                    h("div", { className: "control" }, [
                        h("a", { className: "button is-static" }, "według")
                    ]),
                    h("div", { className: "control" }, [
                        h("div", { className: "select" }, [
                            h("select", {
                                name: "orderBy",
                                value: getQueryField("orderBy"),
                                onchange: event => setQueryField("orderBy", event.target.value)
                            }, [
                                h("option", { value: "" }, "Domyślnie"),
                                ...Object.entries(options).map(([value, text]) => h("option", { value }, text))
                            ])
                        ])
                    ])
                ]),
                h("div", { className: "column field has-addons" }, [
                    h("div", { className: "control" }, [
                        h("a", { className: "button is-static" }, "Wyników na stronie")
                    ]),
                    h("div", { className: "control" }, [
                        h("div", { className: "select" }, [
                            h("select", {
                                name: "limit",
                                value: getQueryField("limit"),
                                onchange: event => setQueryField("limit", event.target.value)
                            }, [
                                h("option", { value: "1" }, "1"),
                                h("option", { value: "5" }, "5"),
                                h("option", { value: "10" }, "10"),
                                h("option", { value: "20" }, "20"),
                                h("option", { value: "40" }, "40")
                            ])
                        ])
                    ]),
                ]),
                h("div", { className: "column field" }, [
                    h("div", { className: "control" }, [
                        h("input", { className: "button is-fullwidth is-primary", type: "button", value: "Zastosuj", onclick: _ => search() })
                    ])
                ])
            ])
        ])
    ]);
};

export default OrderingPanel;