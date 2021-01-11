export const images = {
    upload: file => {
        const formData = new FormData();
        formData.append("image", file);

        return fetch(`/api/images`, { method: "POST", body: formData }).then(_ => _.json());
    }
};