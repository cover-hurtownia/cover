const cookies = Object.fromEntries(document.cookie.split("; ").map(_ => _.split("=")));

/*
    themes
*/

const validThemes = ["light", "contrast"];
const isThemeValid = theme => validThemes.includes(theme);
const defaultTheme = "light";

const theme = isThemeValid(cookies.theme) ? cookies.theme : defaultTheme;
const themeLinkElement = document.getElementById("bulma-theme");

const themeButtons = document.querySelectorAll(".theme-button");
const changeTheme = theme => {
    if (isThemeValid(theme)) {
        document.cookie = `theme=${theme}; path=/`;
        themeLinkElement.href = `/css/bulma-${theme}.css`;
    }
};

for (const button of themeButtons) {
    button.addEventListener("click", _ => changeTheme(button.value));
};

/*
    font size
*/

const validFontSizes = ["normal", "large"];
const isFontSizeValid = font => validFontSizes.includes(font);
const defaultFontSize = "normal";

const fontSize = isFontSizeValid(cookies.font_size) ? cookies.font_size : defaultFontSize;

const fontSizeButtons = document.querySelectorAll(".font-size-button");
const changeFontSize = font => {
    if (isFontSizeValid(font)) {
        document.cookie = `fontSize=${font}; path=/`;
        document.documentElement.dataset.fontSize = font;
    }
};

for (const button of fontSizeButtons) {
    button.addEventListener("click", _ => changeFontSize(button.value));
};

/*
    navbar burger
*/

const burger = document.querySelector(".navbar-burger");
const navbarMenu = document.getElementById("navbar-burger-elements");

burger.addEventListener("click", _ => {
    navbarMenu.classList.toggle("is-active");
});

/*
    btn-to-top
*/

const toTopButton = document.querySelector("#btn-to-top");

toTopButton.addEventListener("click", _ => {
    window.scrollTo(0, 0);
});

document.addEventListener("scroll", _ => {
    if (window.scrollY > 200){
        toTopButton.classList.add("active");
    } else {
        toTopButton.classList.remove("active");
    }
});

/*
    navbar cart counters
*/

const cartCounters = document.getElementsByClassName("navbar-cart-counter");
const onCartChange = products => {
    const totalNumberOfProducts = Object.values(products).reduce((x, y) => x + y, 0);

    if (totalNumberOfProducts === 0) {
        for (const counter of cartCounters) {
            counter.classList.add("is-hidden");
            counter.textContent = "";
        }
    }
    else {
        for (const counter of cartCounters) {
            counter.classList.remove("is-hidden");
            counter.textContent = totalNumberOfProducts
        }
    }
};

window.addEventListener("storage", event => event.key === "shopping_cart" && onCartChange(JSON.parse(event.newValue)));
window.addEventListener("WINDOW_STORAGE", event => event.detail.key === "shopping_cart" && onCartChange(event.detail.value));

onCartChange((() => {
    const item = window.localStorage.getItem("shopping_cart");
    
    try { return item ? JSON.parse(item) : {}; }
    catch (_) { return {}; }
})());

/*
    toasts
*/

const toasts = document.getElementsByClassName("toast");

for (const toast of toasts) {
    toast.addEventListener("click", event => {
        toast.classList.add("sliding-out");

        setTimeout(() => toast.remove(), 500);
    });
}