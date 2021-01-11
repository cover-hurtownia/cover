export const images = {
    upload: file => {
        const formData = new FormData();
        formData.append("image", file);

        return fetch(`/api/images`, { method: "POST", body: formData }).then(_ => _.json());
    },

    update: file => {
        const formData = new FormData();
        formData.append("image", file);

        return fetch(`/api/images`, { method: "PUT", body: formData }).then(_ => _.json());
    },

    get: query => fetch(`/api/images` + (query ? `?${new URLSearchParams(query).toString()}` : "")).then(_ => _.json()),
    
    getById: id => fetch(`/api/images/${id}`).then(_ => _.json()),

    delete: ids => fetch(`/api/images`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(Array.isArray(ids) ? ids : [ids])
    }).then(_ => _.json()),

    deleteById: id => fetch(`/api/images/${id}`, { method: "DELETE" }).then(_ => _.json()),
};