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