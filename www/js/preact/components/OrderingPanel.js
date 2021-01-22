import * as Preact from "/js/lib/Preact.js";

const h = Preact.h;

export const OrderingPanel = ({ getQueryField, setQueryField, updateSearch, options, children = [] })  => {
    return h("nav", { }, [
            h("form", { className: "is-flex ", style: { "justify-content": "space-between", "flex-wrap": "wrap" } }, [
                h("div", { className: "field has-addons" }, [
                    h("div", { className: "control" }, [
                        h("a", { className: "button is-static" }, "Sortuj")
                    ]),
                    h("div", { className: "control" }, [
                        h("div", { className: "select" }, [
                            h("select", {
                                name: "ordering",
                                value: getQueryField("ordering"),
                                onchange: event => updateSearch({ ordering: event.target.value, offset: 0 })
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
                                onchange: event => updateSearch({ orderBy: event.target.value, offset: 0 })
                            }, [
                                h("option", { value: "" }, "Domyślnie"),
                                ...Object.entries(options).map(([value, text]) => h("option", { value }, text))
                            ])
                        ])
                    ])
                ]),
                h("div", { className: "field has-addons" }, [
                    h("div", { className: "control" }, [
                        h("a", { className: "button is-static" }, "Wyników na stronie")
                    ]),
                    h("div", { className: "control" }, [
                        h("div", { className: "select" }, [
                            h("select", {
                                name: "limit",
                                value: getQueryField("limit"),
                                onchange: event => updateSearch({ limit: event.target.value, offset: 0 })
                            }, [
                                h("option", { value: "4" }, "4"),
                                h("option", { value: "8" }, "8"),
                                h("option", { value: "12" }, "12"),
                                h("option", { value: "24" }, "24"),
                                h("option", { value: "48" }, "48")
                            ])
                        ])
                    ]),
                ]),
                ...children
            ])
    ]);
};

export default OrderingPanel;