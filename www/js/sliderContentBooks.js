import * as API from "/js/api/index.js";
import * as utils from "/js/utils.js";

(async() => {
    const getPreviewBooks = await API.books.get({
        orderBy: "publicationDate",
        ordering: "desc",
        publicationDateFirst: utils.showDate(Date.now()),
        limit: 3,
    })
    const previewBooks = await getPreviewBooks.data.map(({id, title, authors, image_id})=> {
        return  {book_id:id, title:title, authors:authors[0], image_id: image_id}
    })

    const getNewBooks = await API.books.get({
        orderBy: "publicationDate",
        ordering: "desc",
        publicationDateLast: utils.showDate(Date.now()),
        limit: 3,
    })
    const newBooks = await getNewBooks.data.map(({id, title, authors, image_id})=> {
        return  {book_id:id, title:title, authors:authors[0], image_id: image_id}
    })
    
    const sliderBookComponents = () => {
        const firstSlide = document.getElementById("s1");
        firstSlide.innerHTML = ` 
        <div class="image">
            <img src="/assets/logo-wbgl-d.svg">
        </div>
        <div class="element-content">
            <h4 class="slider-font has-text-white">Cover jest najambitniejszym projektem założonym przez kilku pasjonatów czytelnictwa. Projekt, który z pewnością przerodzi się w jedną z lepszych sieci hurtowni na rynku.</h4>
        </div>
        
        `   
        const secondSlide = document.getElementById("s2");
        const secondSlideTitle = `Nowości`;
        
        const thirdSlide = document.getElementById("s3");
        const thirdSlideTitle = `Zapowiedzi`;

        const createSlideHeader = (title) => {
            const headerElement = document.createElement("h2");
            headerElement.classList.add("element-title","my-1");
            headerElement.innerText = `${title}`;
            return headerElement;
        }

        const secondSlideHeader = createSlideHeader(secondSlideTitle);
        const thirdSlideHeader = createSlideHeader(thirdSlideTitle);

        secondSlide.append(secondSlideHeader)
        thirdSlide.append(thirdSlideHeader)

        const createSlideContent = (booksObj) => {
            const elementContent = document.createElement("div");
            elementContent.classList.add("element-content","is-flex");

            booksObj.map(({book_id, title, authors, image_id}) => {

                const sliderContentColumn = document.createElement("div");
                sliderContentColumn.classList.add("slider-content-column");
                const sliderContentColumnCard = document.createElement("div");
                sliderContentColumnCard.classList.add("slider-content-column-card");

                const cardImage = document.createElement("div");
                cardImage.classList.add("slider-card-image");
                cardImage.innerHTML = `
                <a class="sliderA" href="/book/${book_id}}">
                    <img class="book-image" src="/images/${image_id}">
                </a>
                `;
                const cardText = document.createElement("div");
                cardText.classList.add("slider-card-text");
                const cardTextBookTitle = document.createElement("div");
                cardTextBookTitle.classList.add("has-text-weight-bold","has-text-centered");
                cardTextBookTitle.innerHTML = `<a class="sliderA" href="/book/${book_id}">${title}</a>`;
                
                const cardTextBookAuthors = document.createElement("div");
                cardTextBookAuthors.classList.add("has-text-centered");
                cardTextBookAuthors.innerHTML = `<a class="sliderA" href="/books?author=${authors}">${authors}</a>`;
        
                cardText.append(cardTextBookTitle);
                cardText.append(cardTextBookAuthors);
                sliderContentColumnCard.innerHTML += cardImage.outerHTML + cardText.outerHTML;

                sliderContentColumn.append(sliderContentColumnCard);
                elementContent.append(sliderContentColumn);
            })
            return elementContent;
        }
        const secondSlideContent = createSlideContent(newBooks);
        const thirdSlideContent = createSlideContent(previewBooks);
        secondSlide.append(secondSlideContent)
        thirdSlide.append(thirdSlideContent)
    }
    sliderBookComponents()
})();
