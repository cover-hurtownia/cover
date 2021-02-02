class Slider {
    constructor(elemSelector, opts) {
        this.sliderSelector = elemSelector;
        this.currentSlide = 0;
        this.time = null;
        this.element = null;
        this.slider = null;
        this.slides = null;
        this.prev = null;
        this.next = null;
        this.icons = [];

        const defaultOpts = {
            changeTime: 5000,
            prevText : "<",
            nextText : ">",
            generateDots : true,
            generatePrevNext : true
        };
        this.options = Object.assign({}, defaultOpts, opts);
        this.generateSlider();
        this.slideChange(this.currentSlide);
    }
    
    generateSlider(){
        this.slider = document.querySelector(this.sliderSelector);
        this.slider.classList.add("slider");
        const slidesContainer = document.createElement("div");
        slidesContainer.classList.add("slides-container")
        this.slides = this.slider.children;

        while(this.slides.length){
            this.slides[0].classList.add("slider-slide");
            slidesContainer.append(this.slides[0]);
        }

        this.slides = slidesContainer.querySelectorAll(".slider-slide");
        this.slider.append(slidesContainer);
        if (this.options.generatePrevNext) this.createButtons();
        if (this.options.generateDots) this.createPagination();
    }

    createButtons() {
        const prevNavCont = document.createElement("div");
        prevNavCont.classList.add("prev-slide-button");
        const nextNavCont = document.createElement("div");
        nextNavCont.classList.add("next-slide-button");
        this.prev = document.createElement("div");
        this.prev.classList.add("material-icons");
        this.prev.classList.add("slider-button-icon");
        this.prev.innerHTML = this.options.prevText;
        prevNavCont.addEventListener("mousedown", this.slidePrev.bind(this));
        this.next = document.createElement("div");
        this.next.classList.add("material-icons");
        this.next.classList.add("slider-button-icon");
        this.next.innerHTML = this.options.nextText;
        nextNavCont.addEventListener("mousedown", this.slideNext.bind(this));
        prevNavCont.appendChild(this.prev);
        nextNavCont.appendChild(this.next);
        this.slider.appendChild(prevNavCont);
        this.slider.appendChild(nextNavCont);
    }

    slideChange(index){
        this.slides.forEach(slide => {
            slide.classList.remove("slider-slide-active");
            slide.setAttribute("aria-hidden", true);
        });
        this.slides[index].classList.add("slider-slide-active");
        this.slides[index].setAttribute("aria-hidden", false);
        this.icons.forEach(icon => {
            icon.classList.remove("slider-pagination-element-active");
        });
        this.icons[index].classList.add("slider-pagination-element-active");
        this.currentSlide = index;
        if (this.options.changeTime !== 0) {
            clearInterval(this.time);
            this.time = setTimeout(() => this.slideNext(), this.options.changeTime)
        }
    }
    
    slidePrev() {
        this.currentSlide--;
        if(this.currentSlide < 0){
            this.currentSlide = this.slides.length - 1;
        }
        this.slideChange(this.currentSlide);
    }

    slideNext(){
        this.currentSlide++;
        if(this.currentSlide > this.slides.length - 1){
            this.currentSlide = 0;
        }
        this.slideChange(this.currentSlide);
    }

    createPagination(typeOfIcon) {
        const pagiantionContainer = document.createElement("div");
        pagiantionContainer.classList.add("pagination");
        const paginationIcon = document.createElement("ul");
        paginationIcon.classList.add("slider-pagination");
        paginationIcon.setAttribute("aria-label", "slider pagination");
        const slidesNumber = this.slides.length;
        for (let i = 0; i < slidesNumber; i++){
            const li = document.createElement("li");
            li.classList.add("slider-pagination-element");
            const btn = document.createElement("button");
            btn.classList.add("slider-pagination-button");
            btn.type = "button";
            btn.innerText = i+1;
            btn.setAttribute("aria-label", "Set slide "+(i+1));
            btn.addEventListener("click", () => this.slideChange(i));
            li.appendChild(btn);
            paginationIcon.appendChild(li);
            this.icons.push(li);
        }
        const heightbutton = document.getElementsByClassName("slider-pagination-button:before")
        if (typeOfIcon !== null){
            if(typeOfIcon === "dots"){
                heightbutton.style.setProperty("height", "0.9 rem");
                heightbutton.style.setProperty("width", "0.1 rem");
            }else if(typeOfIcon === "lines"){
                heightbutton.style.setProperty("height", "0.1 rem");
                heightbutton.style.setProperty("width", "0.9 rem");
            }
        }
        pagiantionContainer.append(paginationIcon)
        this.slider.appendChild(pagiantionContainer);
    }

    
}

const firstSlide = new Slider("#slider1");