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
                
                break;
            default:
                console.error("Header button error");
        };
    };
    buttons.forEach(button => {
        button.addEventListener('click', _ => {
            changeTheme(button);
        });
    })

    const burger = document.querySelector(".navbar-burger");
    const navbarMenu = document.querySelector("#navbar-burger-elements");
    burger.addEventListener("click", (e) => {
        navbarMenu.classList.toggle("is-active");
    });

    const toTopButton = document.querySelector(".btn-to-top");
    if(toTopButton !== null){toTopButton.addEventListener("click", _ => {
        window.scrollTo(0, 0);
    });}

    document.addEventListener("scroll", _ => {
        if(this.scrollY > 200){
            toTopButton.classList.add("active");
        } else {
            toTopButton.classList.remove("active");
        }
    });
});