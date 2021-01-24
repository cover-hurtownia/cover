import * as Preact from "/js/lib/Preact.js";

const h = Preact.h;

export const Pagination = ({ total, limit, offset, delta, updateSearch, topRef }) => {
    const pages = Math.ceil(total / limit);
    const current = Math.ceil(offset / limit);

    const left = current - delta + 1;
    const right = current + delta + 1;

    const list = [];

    for (let page = left; page <= right; ++page) {
        if (page >= 1 && page <= pages) {
            if (page !== current + 1) {
                list.push(h("li", {}, h("button", {
                    className: "button pagination-link",
                    onclick: _ => {
                        updateSearch({ offset: limit * (page - 1), limit });
                        topRef.current.scrollIntoView();
                    }
                }, page.toString()))); 
            }
            else {
                list.push(h("li", {}, h("button", {
                    className: "button pagination-link is-primary is-light",
                    disabled: true
                }, page.toString()))); 
            }
        }
    }

    if (right + 1 < pages) {
        list.push(h("li", {}, h("span", { className: "pagination-ellipsis" }, "…")));
    }

    if (right < pages) {
        list.push(h("li", {}, h("a", {
            className: "pagination-link",
            onclick: _ => {
                updateSearch({ offset: pages - limit, limit });
                topRef.current.scrollIntoView();
            }
        }, pages)));
    }
    
    if (1 < left - 1) {
        list.unshift(h("li", { className: "pagination-ellipsis" }, h("span", {}, "…")));
    }

    if (1 < left) {
        list.unshift(h("li", {}, h("a", {
            className: "pagination-link",
            onclick: _ => {
                updateSearch({ offset: 0, limit });
                topRef.current.scrollIntoView();
            }
        }, "1")));
    }

    return h("nav", { className: "pagination is-centered m-2" }, [
        h("a", {
                className: "pagination-previous",
                disabled: current <= 0,
                onclick: current > 0
                    ? _ => {
                        updateSearch({ offset: offset - limit, limit });
                        topRef.current.scrollIntoView();
                    }
                    : _ => _
            },
            "<"
        ),
        h("a", {
                className: "pagination-next",
                disabled: current >= pages - 1,
                onclick: current < pages - 1
                    ? _ => {
                        updateSearch({ offset: offset + limit, limit });
                        topRef.current.scrollIntoView();
                    }
                    : _ => _
            },
            ">"
        ),
        h("ul", { className: "pagination-list" }, list)
    ]);
};

export default Pagination;
