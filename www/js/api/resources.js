export const resources = name => ({
    get: query => fetch(`/api/${name}` + (query ? `?${new URLSearchParams(query).toString()}` : "")).then(_ => _.json()),

    getById: id => fetch(`/api/${name}/${id}`).then(_ => _.json()),
    
    create: resources => fetch(`/api/${name}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(Array.isArray(resources) ? resources : [resources])
    }).then(_ => _.json()),

    delete: ids => fetch(`/api/${name}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(Array.isArray(ids) ? ids : [ids])
    }).then(_ => _.json()),

    deleteById: id => fetch(`/api/${name}/${id}`, { method: "DELETE" }).then(_ => _.json()),

    update: resources => fetch(`/api/${name}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(Array.isArray(resources) ? resources : [resources])
    }).then(_ => _.json()),

    updateById: (id, body) => fetch(`/api/${name}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
    }).then(_ => _.json())
});

export default resources;