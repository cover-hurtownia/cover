import * as Preact from "/js/lib/Preact.js";
import { useState, useEffect, useRef } from "/js/lib/PreactHooks.js";

import Pagination from "/js/preact/components/Pagination.js";
// import Order from "/js/preact/orders/components/Order.js";
import OrderingPanel from "/js/preact/components/OrderingPanel.js";
// import FiltersPanel from "/js/preact/orders/components/FiltersPanel.js";

import * as utils from "/js/utils.js";
import * as API from "/js/api/index.js";

const h = Preact.h;

const emptyQuery = Object.freeze({ offset: 0, read: null });

export const ClientMessagesApp = ({ query: initialQuery }) => {
    const [query, setQuery] = useState({ ...emptyQuery, ...initialQuery });
    const [response, setResponse] = useState(null);
    const [currentMessage, setCurrentMessage] = useState(null);
    const topRef = useRef(null);
    
    const getQueryField = field => query[field];
    const getMessages = async query => setResponse(await API.clientMessages.get(query));

    const getNextPath = query => {
        const queryString = utils.ungroupParams({ ...query }).toString();

        if (queryString.length === 0) return document.location.pathname;
        else return document.location.pathname + "?" + queryString;
    };

    const search = async query => {
        setQuery(query);
        window.history.pushState({ query }, null, getNextPath(query));
        await getMessages(utils.ungroupParams(query));
    };

    const newSearch = nextQuery => search({ ...(nextQuery ?? query), offset: 0 });
    const updateSearch = updated => search({ ...query, ...updated });

    const readMessage = async message => {
        message.read = true;
        setCurrentMessage(message);

        const response = await API.clientMessages.updateById(message.id, { read: 1 });

        console.log(response);
    };

    useEffect(async () => {
        window.history.replaceState({ query }, null, getNextPath(query));
        await getMessages(utils.ungroupParams(query));
    }, []);

    useEffect(async () => {
        const onPopState = async ({ state: { query } }) => {
            setQuery(query);
            await getMessages(utils.ungroupParams(query));
        };

        window.addEventListener("popstate", onPopState);
        return () => window.removeEventListener("popstate", onPopState);
    }, []);

    return h("div", { className: "columns is-vcentered is-align-items-stretch" }, [
        h("div", { ref: topRef, className: "column is-4" }, [
            response === null
                ? []
                : response.status !== "ok"
                    ? h("div", { className: "box notification is-danger" }, `Błąd: ${response.error.userMessage}.`)
                    : h("nav", { className: "panel" }, [
                        h("p", { className: "panel-heading" }, "Wiadomości"),
                        h("div", { className: "panel-tabs" }, [
                            h("a", {
                                className: getQueryField("read") === null ? "is-active" : "",
                                onclick: _ => newSearch({ read: null })
                            }, "Wszystkie"),
                            h("a", {
                                className: getQueryField("read") === 0 ? "is-active" : "",
                                onclick: _ => newSearch({ read: 0 })
                            }, "Nieprzeczytane"),
                            h("a", {
                                className: getQueryField("read") === 1 ? "is-active" : "",
                                onclick: _ => newSearch({ read: 1 })
                            }, "Przeczytane")
                        ]),
                        h("div", { style: { maxHeight: "40vh", overflowY: "scroll" } }, response.data.map(message => h("a", {
                            className: "panel-block is-flex-direction-column is-align-items-stretch" + (message.read ? " has-text-grey-light " : ""),
                            onclick: event => readMessage(message)
                        }, [
                            h("div", { className: "columns p-0 m-0" }, [
                                h("div", { className: "column p-1" }, [
                                    h("span", { className: "has-text-weight-bold" }, message.name)
                                ]),
                                h("div", { className: "column p-1 is-narrow" }, [
                                    utils.showDateTime(message.date)
                                ])
                            ]),
                            message.title
                                        ? h("div", { className: "is-size-6" }, message.title)
                                        : h("div", { className: "is-size-6 is-italic" }, "(brak tytułu)")
                        ]))),
                        h("div", { className: "panel-block is-flex is-justify-content-center" }, [
                            h(Pagination, { topRef, className: "is-small", total: response.total, limit: response.limit, offset: response.offset, delta: 1, updateSearch })
                        ])
                    ])
        ]),
        h("div", { className: "column is-8" }, [
            currentMessage === null
                ? h("div", { className: "notification box" }, "Wybierz wiadomość.")
                : h("div", { className: "message box p-0" }, [
                    h("div", { className: "message-header" }, [
                        h("div", { className: "is-flex-grow-1" }, [
                            currentMessage.title && h("div", { className: "block is-size-3 is-italic" }, [
                                currentMessage.title
                            ]),
                            h("div", { className: "columns block is-size-5" }, [
                                h("div", { className: "column" }, [
                                    h("span", {}, [
                                        h("span", { className: "has-text-weight-normal" }, "Klient: "),
                                        h("span", { className: "has-text-weight-bold" }, currentMessage.name)
                                    ]),
                                    h("span", { className: "has-text-weight-normal is-family-monospace" }, [
                                        "(", h("a", { href: `mailto:${currentMessage.email}` }, currentMessage.email), ")"
                                    ])
                                ]),
                                h("div", { className: "column is-narrow" }, [
                                    utils.showDateTime(currentMessage.date)
                                ])
                            ])
                        ])
                        
                    ]),
                    h("div", { className: "message-body" }, [
                        utils.intersperse(currentMessage.message.split("\n"), h("br"))
                    ])
                ])
        ])
    ]); 
};

export default ClientMessagesApp;