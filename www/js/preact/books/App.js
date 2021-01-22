import * as Preact from "/js/lib/Preact.js";
import { useState, useEffect, useRef } from "/js/lib/PreactHooks.js";

import Pagination from "/js/preact/components/Pagination.js";
import BookCard from "/js/preact/books/components/BookCard.js";
import BookDetailed from "/js/preact/books/components/BookDetailed.js";
import OrderingPanel from "/js/preact/components/OrderingPanel.js";
import FiltersPanel from "/js/preact/books/components/FiltersPanel.js";

import * as utils from "/js/utils.js";
import * as API from "/js/api/index.js";

const h = Preact.h;

const emptyQuery = Object.freeze({
    id: null,
    quantity: null,
    quantityAtLeast: null,
    quantityAtMost: null,
    price: null,
    priceAtLeast: null,
    priceAtMost: null,
    name: null,
    title: null,
    description: null,
    isPurchasable: null,
    bookFormat: [],
    publisher: null,
    pages: null,
    pagesAtLeast: null,
    pagesAtMost: null,
    author: null,
    tag: [],
    isbn: null,
    orderBy: null,
    ordering: "desc",
    limit: 12,
    offset: 0
});

export const BooksApp = ({ query: initialQuery }) => {
    const [query, setQuery] = useState(Object.fromEntries(Object.entries({
        ...emptyQuery,
        ...initialQuery
    }).filter(([name]) => name in emptyQuery)));
    const [view, setView] = useState(initialQuery?.view?.[0] ?? "cards");
    const [response, setResponse] = useState(null);
    const [isLoading, setLoading] = useState(true);
    const topRef = useRef(null);

    const getBooks = async query => {
        setLoading(true);
        try {
            setResponse(await API.books.get(query));
        }
        catch (error) {
            setResponse({
                status: "error",
                error: {
                    userMessage: "błąd żądania",
                    devMessage: error.toString()
                }
            });
        }
        setLoading(false);
    };

    const getNextPath = query => {
        const queryString = utils.ungroupParams({ ...query, view }).toString();

        if (queryString.length === 0) return document.location.pathname;
        else return document.location.pathname + "?" + queryString;
    };

    const search = async query => {
        setQuery(query);
        topRef.current.scrollIntoView();
        window.history.pushState({ query, view }, null, getNextPath(query));
        await getBooks(utils.ungroupParams(query));
    };

    const newSearch = nextQuery => search({ ...(nextQuery ?? query), offset: 0 });
    const updateSearch = updated => search({ ...query, ...updated });
    const resetSearch = () => search(emptyQuery);

    const getQueryField = field => query[field];
    const setQueryField = (field, getValue) => {
        const value = (getValue instanceof Function) ? getValue(query[field]) : getValue;
        const nextQuery = { ...query, [field]: value };
        
        setQuery(nextQuery);
    };

    useEffect(async () => {
        window.history.replaceState({ query, view }, null, getNextPath(query));
    }, [view]);

    useEffect(async () => {
        window.history.replaceState({ query, view }, null, getNextPath(query));
        await getBooks(utils.ungroupParams(query));
    }, []);

    useEffect(async () => {
        const onPopState = async ({ state: { query, state } }) => {
            setQuery(query);
            await getBooks(utils.ungroupParams(query));
        };

        window.addEventListener("popstate", onPopState);
        return () => window.removeEventListener("popstate", onPopState);
    }, []);

    return h("div", { ref: topRef, className: "columns" }, [
        h("div", { className: "column is-narrow" }, [
            h(FiltersPanel, { getQueryField, setQueryField, resetSearch, newSearch })
        ]),
        h("div", { className: "column" }, [
            h(OrderingPanel, {
                getQueryField,
                setQueryField,
                updateSearch,
                options: {
                    publicationDate: "Daty publikacji",
                    price: "Ceny",
                    title: "Tytułu",
                    pages: "Liczby stron",
                    quantity: "Liczby sztuk"
                },
            }, [
                h("div", { className: "field has-addons" }, [
                    h("div", { className: "control" }, [
                        h("a", { className: "button is-static" }, "Widok")
                    ]),
                    h("div", { className: "control" }, [
                        h("div", { className: "select" }, [
                            h("select", {
                                name: "view",
                                value: view,
                                onchange: event => setView(event.target.value)
                            }, [
                                h("option", { value: "cards" }, "Karty"),
                                h("option", { value: "detailed" }, "Szczegółowy")
                            ])
                        ])
                    ]),
                ])
            ]),
            response === null
                ? h("progress", { className: "progress is-primary", max: "100" }, "0%")
                : response.status !== "ok"
                    ? h("article", { className: "message is-danger" }, [
                            h("div", { className: "message-body" }, [
                                h("details", {}, [
                                    h("summary", {}, `${utils.capitalizeFirst(response.error.userMessage)}.`),
                                    h("p", {}, `${utils.capitalizeFirst(response.error.devMessage)}.`)
                                ])
                            ])
                        ])
                    : h("div", {}, [
                        isLoading
                            ? h("article", { className: "message" }, [
                                h("div", { className: "message-body" }, "Ładowanie wyników...")
                            ])
                            :   response.total === 0
                                ? h("article", { className: "message is-warning" }, [
                                    h("div", { className: "message-body" }, "Brak wyników.")
                                ])
                                : h("article", { className: "message" }, [
                                    h("div", { className: "message-body" }, `Liczba wyników: ${response.total}.`)
                                ]),
                        response.total !== 0 && [
                            h(Pagination, { topRef, total: response.total, limit: response.limit, offset: response.offset, delta: 2, updateSearch }),
                            view === "cards"
                                ? h("div", { className: "columns is-multiline" }, response.data.map(book => h(BookCard, { book })))
                                : h("div", {}, response.data.map(book => h(BookDetailed, { book }))),
                            h(Pagination, { topRef, total: response.total, limit: response.limit, offset: response.offset, delta: 2, updateSearch })
                        ]
                    ])
        ])
    ]); 
};

export default BooksApp;