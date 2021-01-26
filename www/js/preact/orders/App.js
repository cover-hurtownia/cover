import * as Preact from "/js/lib/Preact.js";
import { useState, useEffect, useRef } from "/js/lib/PreactHooks.js";

import Pagination from "/js/preact/components/Pagination.js";
import Order from "/js/preact/orders/components/Order.js";
import OrderingPanel from "/js/preact/components/OrderingPanel.js";
import FiltersPanel from "/js/preact/orders/components/FiltersPanel.js";

import * as utils from "/js/utils.js";
import * as API from "/js/api/index.js";

const h = Preact.h;

const emptyQuery = Object.freeze({
    id: null,
    orderDateFirst: null,
    orderDateLast: null,
    trackingNumber: null,
    deliveryType: [],
    status: [],
    totalCostAtLeast: null,
    totalCostAtMost: null,
    orderBy: null,
    ordering: "desc",
    limit: 12,
    offset: 0
});

export const OrdersApp = ({ query: initialQuery }) => {
    const [query, setQuery] = useState({ ...emptyQuery, ...initialQuery });
    const [response, setResponse] = useState(null);
    const [isLoading, setLoading] = useState(true);
    const topRef = useRef(null);
    
    const getOrders = async query => {
        setLoading(true);
        setResponse(await API.orders.myOrders(query));
        setLoading(false);
    };

    const getNextPath = query => {
        const queryString = utils.ungroupParams({ ...query }).toString();

        if (queryString.length === 0) return document.location.pathname;
        else return document.location.pathname + "?" + queryString;
    };

    const search = async query => {
        setQuery(query);
        topRef.current.scrollIntoView();
        window.history.pushState({ query }, null, getNextPath(query));
        await getOrders(utils.ungroupParams(query));
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
        window.history.replaceState({ query }, null, getNextPath(query));
        await getOrders(utils.ungroupParams(query));
    }, []);

    useEffect(async () => {
        const onPopState = async ({ state: { query } }) => {
            setQuery(query);
            await getOrders(utils.ungroupParams(query));
        };

        window.addEventListener("popstate", onPopState);
        return () => window.removeEventListener("popstate", onPopState);
    }, []);

    return h("div", { className: "columns" }, [
        h("div", { className: "column is-narrow" }, [
            h(FiltersPanel, { getQueryField, setQueryField, resetSearch, newSearch })
        ]),
        h("div", { ref: topRef, className: "column" }, [
            h(OrderingPanel, {
                getQueryField,
                setQueryField,
                updateSearch,
                options: {
                    orderDate: "Daty zamówienia",
                    totalCost: "Kosztu"
                }
            }),
            response === null
                ? h("progress", { className: "progress is-primary", max: "100" }, "0%")
                : response.status !== "ok"
                    ? h("div", { className: "box notification is-danger" }, `Błąd: ${response.error.userMessage}.`)
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
                            ...response.data.map(order => h(Order, { order })),
                            h(Pagination, { topRef, total: response.total, limit: response.limit, offset: response.offset, delta: 2, updateSearch })
                        ]
                    ])
        ])
    ]); 
};

export default OrdersApp;