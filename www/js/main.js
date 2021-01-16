document.addEventListener("DOMContentLoaded", () => {

    const defTheme = document.body.dataset;
    document.cookie = `theme = ${defTheme.theme}`;
    const buttons = document.querySelectorAll(".btn");
    const changeTheme = ({value}) => {
        switch (value){
            case "light":
                defTheme.theme = "light";
                break;
            case "dark":
                defTheme.theme = "dark";
                break;
            case "contrast":
                defTheme.theme = "contrast";

                break;
            case "font-add":
                break;
            case "font-subtract":
                console.log()
                break;
            default:
                console.error("Header button error");
        };
    }
    for(const button of buttons){
        button.addEventListener('click', _ => {
            changeTheme(button);
        });
    };

    const burger = document.querySelector(".navbar-burger");
    const navbarMenu = document.querySelector("#navbar-burger-elements");
    burger.addEventListener("click", (e) => {
        navbarMenu.classList.toggle("is-active");
    })
});