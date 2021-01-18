import * as Preact from "/js/lib/Preact.js";
import { useState, useEffect } from "/js/lib/PreactHooks.js";

import Pagination from "/js/preact/components/Pagination.js";
import Book from "/js/preact/books/components/Book.js";
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
    available: null,
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
    limit: 20,
    offset: 0
});

export const BooksApp = ({ query: initialQuery }) => {
    const [query, setQuery] = useState({ ...emptyQuery, ...initialQuery });
    const [response, setResponse] = useState(null);
    const [isLoading, setLoading] = useState(true);
    
    const getBooks = async query => {
        setLoading(true);
        setResponse(await API.books.get(query));
        setLoading(false);
    };

    const getNextPath = query => {
        const queryString = utils.ungroupParams(query).toString();

        if (queryString.length === 0) return document.location.pathname;
        else return document.location.pathname + "?" + queryString;
    };

    const search = async nextQuery => {
        const fixedQuery = { ...(nextQuery ?? query), offset: 0 };
        setQuery(fixedQuery);

        window.history.pushState(fixedQuery, null, getNextPath(fixedQuery));
        await getBooks(utils.ungroupParams(fixedQuery));
    };

    const goTo = async pagination => {
        const fixedQuery = { ...query, ...pagination };
        setQuery(fixedQuery);

        window.history.pushState(fixedQuery, null, getNextPath(fixedQuery));
        await getBooks(utils.ungroupParams(fixedQuery));
    };

    const resetQuery = async () => {
        setQuery(emptyQuery);

        window.history.pushState(emptyQuery, null, getNextPath(emptyQuery));
        await getBooks(utils.ungroupParams(emptyQuery));
    };

    const getQueryField = field => query[field];
    const setQueryField = (field, getValue) => {
        const value = (getValue instanceof Function) ? getValue(query[field]) : getValue;
        const nextQuery = { ...query, [field]: value };
        
        setQuery(nextQuery);
    };

    useEffect(async () => {
        window.history.replaceState(query, null, getNextPath(query));
    }, [query]);

    useEffect(async () => {
        window.history.replaceState(query, null, getNextPath(query));
        await getBooks(utils.ungroupParams(query));
    }, []);

    useEffect(async () => {
        const onPopState = ({ state: query }) => getBooks(utils.ungroupParams(query));
        window.addEventListener("popstate", onPopState);
        return () => window.removeEventListener("popstate", onPopState);
    }, []);

    return h("div", { className: "columns" }, [
        h("div", { className: "column is-narrow" }, [
            h(FiltersPanel, { getQueryField, setQueryField, resetQuery, search })
        ]),
        h("div", { className: "column" }, [
            h(OrderingPanel, { getQueryField, setQueryField, resetQuery, search, options: {
                publicationDate: "Daty publikacji",
                price: "Ceny",
                title: "Tytułu",
                pages: "Liczby stron",
                quantity: "Liczby sztuk"
            } }),
            response === null
                ? h("progress", { className: "progress is-primary", max: "100" }, "0%")
                : response.status !== "ok"
                    ? h("div", { className: "box notification is-danger" }, `Błąd: ${response.error.userMessage}.`)
                    : h("div", {}, [
                        isLoading
                            ? h("div", { className: "box notification is-size-4" }, "Ładowanie wyników...")
                            :   response.total === 0
                                ? h("div", { className: "box notification is-warning is-size-4" }, "Brak wyników.")
                                : h("div", { className: "box notification is-primary is-size-4" }, `Liczba wyników: ${response.total}`),
                        response.total !== 0 && [
                            h(Pagination, { total: response.total, limit: response.limit, offset: response.offset, delta: 2, goTo }),
                            h("div", { className: "columns is-multiline" }, response.data.map(book => h(Book, { book }))),
                            h(Pagination, { total: response.total, limit: response.limit, offset: response.offset, delta: 2, goTo })
                        ]
                    ])
        ])
    ]); 
};

export default BooksApp;