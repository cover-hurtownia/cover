export const show = content => {
    const modalEl = document.createElement("div");
    modalEl.classList.add("modal", "is-active");

    const modalBackgroundEl = document.createElement("div");
    modalBackgroundEl.classList.add("modal-background");

    const modalContentEl = document.createElement("div");
    modalContentEl.classList.add("modal-content");
    modalContentEl.append(...(Array.isArray(content) ? content : [content]));

    const buttonEl = document.createElement("button");
    buttonEl.classList.add("modal-close", "is-large");

    modalEl.append(modalBackgroundEl, modalContentEl, buttonEl);

    buttonEl.addEventListener("click", _ => {
        modalEl.remove();
    });

    document.body.append(modalEl);
    return modalEl;
};

export const showText = text => {
    const modalEl = document.createElement("div");
    modalEl.classList.add("modal", "is-active");

    const modalBackgroundEl = document.createElement("div");
    modalBackgroundEl.classList.add("modal-background");

    const modalContentEl = document.createElement("div");
    modalContentEl.classList.add("modal-content");
    modalContentEl.append(document.createTextNode(text));

    const buttonEl = document.createElement("button");
    buttonEl.classList.add("modal-close", "is-large");

    modalEl.append(modalBackgroundEl, modalContentEl, buttonEl);

    buttonEl.addEventListener("click", _ => {
        modalEl.remove();
    });

    document.body.append(modalEl);
    return modalEl;
};

export const showImage = src => {
    const modalEl = document.createElement("div");
    modalEl.classList.add("modal", "is-active");

    const modalBackgroundEl = document.createElement("div");
    modalBackgroundEl.classList.add("modal-background");

    const modalContentEl = document.createElement("div");
    modalContentEl.classList.add("modal-content");

    const pEl = document.createElement("p");
    pEl.classList.add("image");

    const imageEl = document.createElement("img");
    imageEl.src = src;

    pEl.append(imageEl);
    modalContentEl.append(pEl);

    const buttonEl = document.createElement("button");
    buttonEl.classList.add("modal-close", "is-large");

    modalEl.append(modalBackgroundEl, modalContentEl, buttonEl);

    buttonEl.addEventListener("click", _ => {
        modalEl.remove();
    });

    document.body.append(modalEl);
    return modalEl;
};

export const showMessage = (title, body, className, buttons = []) => {
    const modalEl = document.createElement("div");
    modalEl.classList.add("modal", "is-active");

    const messageEl = document.createElement("div");
    messageEl.classList.add("message", "box", "p-0", className);

    const messageHeaderEl = document.createElement("div");
    messageHeaderEl.classList.add("message-header");

    const messageTitleEl = document.createElement("p");
    messageTitleEl.textContent = title;

    const buttonEl = document.createElement("button");
    buttonEl.classList.add("delete");

    messageHeaderEl.append(messageTitleEl, buttonEl);

    const messageBodyEl = document.createElement("div");
    messageBodyEl.classList.add("message-body");
    messageBodyEl.textContent = body;

    messageEl.append(messageHeaderEl, messageBodyEl);

    const buttonsEl = document.createElement("footer");
    buttonsEl.classList.add("m-2");

    for (const button of buttons) {
        const buttonEl = document.createElement("button");
        buttonEl.classList.add("button", "is-small", ...(button.classList ?? []));
        buttonEl.textContent = button.textContent;

        if (button.onClick) buttonEl.addEventListener("click", button.onClick);
        buttonsEl.append(buttonEl);
    }

    messageEl.append(buttonsEl);

    modalEl.append(messageEl);

    buttonEl.addEventListener("click", _ => {
        modalEl.remove();
    });

    document.body.append(modalEl);
    return modalEl;
};

export const showCard = (title, body, buttons = []) => {
    const modalEl = document.createElement("div");
    modalEl.classList.add("modal", "is-active", "is-danger");

    const modalBackgroundEl = document.createElement("div");
    modalBackgroundEl.classList.add("modal-background");

    const modalCardEl = document.createElement("div");
    modalCardEl.classList.add("modal-card");

    const modalCardHeadEl = document.createElement("header");
    modalCardHeadEl.classList.add("modal-card-head");

    const modalCardTitleEl = document.createElement("p");
    modalCardTitleEl.classList.add("modal-card-title");
    modalCardTitleEl.textContent = title;

    const buttonEl = document.createElement("button");
    buttonEl.classList.add("delete");

    modalCardHeadEl.append(modalCardTitleEl, buttonEl);

    const modalCardBodyEl = document.createElement("section");
    modalCardBodyEl.classList.add("modal-card-body");
    modalCardBodyEl.textContent = body;

    modalCardEl.append(modalCardHeadEl, modalCardBodyEl);
    
    const modalCardFootEl = document.createElement("footer");
    modalCardFootEl.classList.add("modal-card-foot");

    for (const button of buttons) {
        const buttonEl = document.createElement("button");
        buttonEl.classList.add("button", ...(button.classList ?? []));
        buttonEl.textContent = button.textContent;

        if (button.onClick) buttonEl.addEventListener("click", button.onClick);
        modalCardFootEl.append(buttonEl);
    }

    modalCardEl.append(modalCardFootEl);

    modalEl.append(modalBackgroundEl);
    modalEl.append(modalCardEl);

    buttonEl.addEventListener("click", _ => {
        modalEl.remove();
    });

    document.body.append(modalEl);
    return modalEl;
};