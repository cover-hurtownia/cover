import fs from "fs/promises";
import path from "path";
import mimetype from "mime-types";
import bcrypt from "bcryptjs";

import logger from "../logger.js";
import * as constants from "../www/js/constants.js";

const randomNames = [
    "Mercedes Redmond",
    "Nikola Bright",
    "Harriet Holden",
    "Sydney Davie",
    "Nyah Hartley",
    "Evelyn Dickens",
    "Jeremy Mckenzie",
    "Diogo Evans",
    "Michele Sanders",
    "Rio Galvan",
    "Habibah Choi",
    "Laura Bird",
    "Tashan Marin",
    "Louise Singh",
    "Wilma Churchill",
    "Arbaaz Barnard",
    "Alberto Devine",
    "Keegan Marshall",
    "Mattie Douglas",
    "Rhydian Diaz",
    "Sorcha Holt",
    "Logan Reed",
    "William Trevino",
    "Rahul Thomas",
    "Fergus Coles"
];

const randomEmails = randomNames.map(name => name.split(" ").map(_ => _.toLowerCase()).join("@") + ".com");

const messages = Array(0xFF).fill().map((_, i) => {
    const rngValue = Math.floor(Math.random() * randomNames.length);

    return {
        name: randomNames[rngValue],
        email: randomEmails[rngValue],
        title: Boolean(Math.floor(Math.random() * 2)) ? `Wiadomość wygenerowana automatycznie #${i}` : null,
        read: Boolean(Math.floor(Math.random() * 2)),
        message: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. In augue sem, lobortis et finibus vel, finibus vel purus. Maecenas non neque auctor, feugiat nisl non, tincidunt tellus. Aenean volutpat, ligula id interdum aliquam, turpis metus porttitor lorem, quis mollis massa nisi ac turpis. Vestibulum vehicula massa a turpis lobortis, vitae molestie turpis scelerisque. Donec malesuada in metus id semper. Nam elementum tellus ac magna posuere euismod. Maecenas vel tincidunt risus. Cras congue nunc eu leo efficitur, vitae tempus eros vulputate. Nunc vitae feugiat nibh. Vivamus porttitor pretium ante eu maximus. Pellentesque elementum elit a dui pretium efficitur. Duis ac mollis leo, ac aliquam mi. Praesent efficitur nisi urna, in maximus lectus feugiat a.
        
        In dui purus, lobortis sed eros et, bibendum commodo mi. Fusce in vestibulum nibh. Nam vel lobortis arcu. Duis facilisis accumsan commodo. Sed vitae malesuada nibh. Suspendisse a tellus sollicitudin, eleifend nibh at, malesuada urna. Vestibulum at nunc pellentesque lorem posuere dictum ac quis ex.
        
        Mauris rutrum purus non massa laoreet rhoncus. Phasellus ultricies quam enim, quis vehicula lacus varius a. Sed bibendum dui at libero faucibus, at auctor quam pharetra. Etiam porta finibus orci, non blandit nunc egestas sit amet. Maecenas vehicula orci eu leo venenatis, et blandit neque gravida. Integer porttitor gravida nisi porttitor fermentum. Cras egestas laoreet arcu eu condimentum.
        
        Aliquam quis nisl tincidunt, pellentesque erat non, elementum elit. Maecenas in porttitor nunc. Ut nulla dui, luctus in varius eget, vulputate non purus. Cras sit amet feugiat enim. Quisque tempor justo vitae diam tempus, in tincidunt nibh hendrerit. Praesent euismod laoreet tellus, at rhoncus nunc pretium eget. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam ac quam ipsum. Fusce condimentum, leo eget fermentum ultricies, diam felis elementum sapien, euismod aliquam sem nisi vel odio. Ut auctor aliquet pellentesque.
        
        Pellentesque vehicula vehicula nunc, in faucibus eros malesuada id. Suspendisse potenti. Aliquam varius, enim ut blandit porttitor, ligula leo volutpat neque, non lobortis orci elit nec urna. Aliquam vitae elit eu sem aliquet condimentum quis ut orci. In hac habitasse platea dictumst. Integer nisl risus, blandit a ex et, fermentum suscipit risus. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Ut leo diam, finibus ut dignissim at, lacinia quis dui. In gravida tellus eu augue lobortis, nec luctus ligula blandit.`
    };
});

const books = [
    
    {
        product: {
            name: "Praktyczny kurs SQL. Wydanie III",
            price: "40.00",
            quantity_available: 49,
            quantity_on_hand: 49,
            is_purchasable: true
        },
        book: {
            title: "Praktyczny kurs SQL. Wydanie III",
            publication_date: "2015-03-26",
            isbn: "9788324694952",
            pages: 336
        },
        authors: ["Marcin Szeliga", "Danuta Mendrala"],
        publisher: "Helion",
        book_format: "paperback",
        tags: ["computer_science"],
        image: "./seeds/images/9788324694952.jpg"
    },

    {
        product: {
            name: "Czysty kod. Podręcznik dobrego programisty",
            price: "99.00",
            quantity_available: 55,
            quantity_on_hand: 55,
            is_purchasable: true
        },
        book: {
            title: "Czysty kod. Podręcznik dobrego programisty",
            publication_date: "2010-02-19",
            isbn: "9788328302341",
            pages: 424
        },
        authors: ["Robert C. Martin"],
        publisher: "Helion",
        book_format: "paperback",
        tags: ["computer_science"],
        image: "./seeds/images/9788328302341.jpg"
    },

    {
        product: {
            name: "HTML i CSS. Zaprojektuj i zbuduj witrynę WWW. Podręcznik Front-End Developera",
            price: "99.00",
            quantity_available: 123,
            quantity_on_hand: 123,
            is_purchasable: true
        },
        book: {
            title: "HTML i CSS. Zaprojektuj i zbuduj witrynę WWW. Podręcznik Front-End Developera",
            publication_date: "2017-12-21",
            isbn: "9788328344808",
            pages: 512
        },
        authors: ["Jon Duckett"],
        publisher: "Helion",
        book_format: "paperback",
        tags: ["computer_science"],
        image: "./seeds/images/9788328344808.jpg"
    },

    {
        product: {
            name: "JavaScript i jQuery. Interaktywne strony WWW dla każdego. Podręcznik Front-End Developera",
            price: "99.00",
            quantity_available: 5,
            quantity_on_hand: 5,
            is_purchasable: true
        },
        book: {
            title: "JavaScript i jQuery. Interaktywne strony WWW dla każdego. Podręcznik Front-End Developera",
            publication_date: "2015-04-27",
            isbn: "9788328344785",
            pages: 648
        },
        authors: ["Jon Duckett"],
        publisher: "Helion",
        book_format: "paperback",
        tags: ["computer_science", "horror"],
        image: "./seeds/images/9788328344785.jpg"
    },

    {
        product: {
            name: "Przebudzenie",
            price: "42.00",
            quantity_available: 0,
            quantity_on_hand: 0,
            is_purchasable: true
        },
        book: {
            title: "Przebudzenie",
            publication_date: "2014-01-01",
            isbn: "9788379610709",
            pages: 536
        },
        authors: ["Stephen King"],
        publisher: "Prószyński Media",
        book_format: "paperback",
        tags: ["fantasy"],
        image: "./seeds/images/9788379610709.jpg"
    },

    {
        product: {
            name: "Lśnienie",
            price: "36.00",
            quantity_available: 3,
            quantity_on_hand: 3,
            is_purchasable: true
        },
        book: {
            title: "Lśnienie",
            publication_date: "2009-10-13",
            isbn: "9788376488097",
            pages: 520
        },
        authors: ["Stephen King"],
        publisher: "Prószyński Media",
        book_format: "paperback",
        tags: ["fantasy"],
        image: "./seeds/images/9788376488097.jpg"
    },

    {
        product: {
            name: "H.P. Lovecraft: OGAR i inne opowiadania",
            price: "29.90",
            quantity_available: 15,
            quantity_on_hand: 15,
            is_purchasable: true
        },
        book: {
            title: "H.P. Lovecraft: OGAR i inne opowiadania",
            publication_date: "2015-10-02",
            isbn: "9788380010895",
            pages: 172
        },
        authors: ["Tanabe Gou"],
        publisher: "Studio JG",
        book_format: "paperback",
        tags: ["fantasy", "horror", "comic"],
        image: "./seeds/images/9788380010895.jpg"
    },

    {
        product: {
            name: "H.P. Lovecraft: Kolor z innego wszechświata",
            price: "29.90",
            quantity_available: 25,
            quantity_on_hand: 25,
            is_purchasable: true
        },
        book: {
            title: "H.P. Lovecraft: Kolor z innego wszechświata",
            publication_date: "2017-01-01",
            isbn: "9788380012134",
            pages: 188
        },
        authors: ["Tanabe Gou"],
        publisher: "Studio JG",
        book_format: "paperback",
        tags: ["fantasy", "horror", "comic"],
        image: "./seeds/images/9788380012134.jpg"
    },
    
    {
        product: {
            name: "ZGROZA W DUNWICH i inne przerażające opowieści (miękka oprawa)",
            price: "59.90",
            quantity_available: 35,
            quantity_on_hand: 35,
            is_purchasable: true
        },
        book: {
            title: "ZGROZA W DUNWICH i inne przerażające opowieści",
            publication_date: "2013-01-01",
            isbn: "9788377311578",
            pages: 792
        },
        authors: ["Howard Phillips Lovecraft"],
        publisher: "Vesper",
        book_format: "paperback",
        tags: ["fantasy", "horror"],
        image: "./seeds/images/9788377310984.jpg"
    },

    {
        product: {
            name: "ZGROZA W DUNWICH i inne przerażające opowieści (twarda oprawa)",
            price: "69.90",
            quantity_available: 40,
            quantity_on_hand: 40,
            is_purchasable: true
        },
        book: {
            title: "ZGROZA W DUNWICH i inne przerażające opowieści",
            publication_date: "2013-01-01",
            isbn: "9788377310984",
            pages: 800
        },
        authors: ["Howard Phillips Lovecraft"],
        publisher: "Vesper",
        book_format: "hardcover",
        tags: ["fantasy", "horror"],
        image: "./seeds/images/9788377310984.jpg"
    },

    {
        product: {
            name: "Gambit królowej",
            price: "39.90",
            quantity_available: 20,
            quantity_on_hand: 20,
            is_purchasable: true
        },
        book: {
            title: "Gambit królowej",
            publication_date: "2020-08-26",
            isbn: "9788381911252",
            pages: 360
        },
        authors: ["Walter Tevis"],
        publisher: "Czarne",
        book_format: "paperback",
        tags: ["belles_lettres"],
        image: "./seeds/images/9788381911252.jpg"
    },

    {
        product: {
            name: "Bramy ze złota. Zmierzch bogów",
            price: "29.90",
            quantity_available: 16,
            quantity_on_hand: 16,
            is_purchasable: true
        },
        book: {
            title: "Bramy ze złota. Zmierzch bogów",
            publication_date: "2019-11-13",
            isbn: "9788379644520",
            pages: 760
        },
        authors: ["Michał Gołkowski"],
        publisher: "Fabryka Słów",
        book_format: "paperback",
        tags: ["fantasy"],
        image: "./seeds/images/9788379644520.jpg"
    },

    {
        product: {
            name: "Stalowe Szczury: Otto",
            price: "35.90",
            quantity_available: 13,
            quantity_on_hand: 13,
            is_purchasable: true
        },
        book: {
            title: "Stalowe Szczury: Otto",
            publication_date: "2019-01-25",
            isbn: "9788379643929",
            pages: 480
        },
        authors: ["Michał Gołkowski"],
        publisher: "Fabryka Słów",
        book_format: "hardcover",
        tags: ["fantasy", "historical_novel"],
        image: "./seeds/images/9788379643929.jpg"
    },

    {
        product: {
            name: "Stalowe Szczury: Königsberg",
            price: "37.90",
            quantity_available: 20,
            quantity_on_hand: 20,
            is_purchasable: true
        },
        book: {
            title: "Stalowe Szczury: Königsberg",
            publication_date: "2016-11-18",
            isbn: "9788379642021",
            pages: 624
        },
        authors: ["Michał Gołkowski"],
        publisher: "Fabryka Słów",
        book_format: "hardcover",
        tags: ["fantasy", "historical_novel"],
        image: "./seeds/images/9788379642021.jpg"
    },

    {
        product: {
            name: "Ja i moje przyjaciółki idiotki",
            price: "29.90",
            quantity_available: 7,
            quantity_on_hand: 7,
            is_purchasable: true
        },
        book: {
            title: "Ja i moje przyjaciółki idiotki",
            publication_date: "2020-10-05",
            isbn: "9788395894602",
            pages: 525
        },
        authors: ["Joanna Okuniewska"],
        publisher: "TuOkuniewska",
        book_format: "paperback",
        tags: [],
        image: "./seeds/images/9788395894602.jpg"
    },

    {
        product: {
            name: "Król",
            price: "55.00",
            quantity_available: 15,
            quantity_on_hand: 15,
            is_purchasable: true
        },
        book: {
            title: "Król",
            publication_date: "2016-01-01",
            isbn: "9788308070956",
            pages: 525
        },
        authors: ["Szczepan Twardoch"],
        publisher: "Wydawnictwo Literackie",
        book_format: "hardcover",
        tags: [],
        image: "./seeds/images/9788308070956.jpg"
    },

    {
        product: {
            name: "Rok 1984",
            price: "20.00",
            quantity_available: 33,
            quantity_on_hand: 33,
            is_purchasable: true
        },
        book: {
            title: "Rok 1984",
            publication_date: "2014-01-01",
            isbn: "9788328706507",
            pages: 360
        },
        authors: ["George Orwell"],
        publisher: "Muza",
        book_format: "paperback",
        tags: [],
        image: "./seeds/images/9788328706507.jpg"
    },

    {
        product: {
            name: "Człowiek w poszukiwaniu sensu",
            price: "20.90",
            quantity_available: 25,
            quantity_on_hand: 25,
            is_purchasable: true
        },
        book: {
            title: "Człowiek w poszukiwaniu sensu",
            publication_date: "2011-03-01",
            isbn: "9788381433563",
            pages: 224
        },
        authors: ["Viktor E. Frankl"],
        publisher: "Czarna Owca",
        book_format: "paperback",
        tags: [],
        image: "./seeds/images/9788381433563.jpg"
    },

    {
        product: {
            name: "Metro 2033",
            price: "32.90",
            quantity_available: 25,
            quantity_on_hand: 25,
            is_purchasable: true
        },
        book: {
            title: "Metro 2033",
            publication_date: "2010-02-24",
            isbn: "9788366071308",
            pages: 578
        },
        authors: ["Dmitry Glukhovsky"],
        publisher: "Insignis",
        book_format: "hardcover",
        tags: [],
        image: "./seeds/images/9788366071308.jpg"
    },

    {
        product: {
            name: "Ukochane równanie profesora",
            price: "25.00",
            quantity_available: 25,
            quantity_on_hand: 25,
            is_purchasable: true
        },
        book: {
            title: "Ukochane równanie profesora",
            publication_date: "2010-01-01",
            isbn: "9788395243325",
            pages: 240
        },
        authors: ["Yoko Ogawa"],
        publisher: "Tajfuny",
        book_format: "paperback",
        tags: [],
        image: "./seeds/images/9788395243325.jpg"
    },

    {
        product: {
            name: "Zaginiona dziewczyna",
            price: "29.90",
            quantity_available: 4,
            quantity_on_hand: 4,
            is_purchasable: true
        },
        book: {
            title: "Zaginiona dziewczyna",
            publication_date: "2012-06-05",
            isbn: "9788377787915",
            pages: 652
        },
        authors: ["Gillian Flynn"],
        publisher: "Burda Publishing Polska",
        book_format: "paperback",
        tags: [],
        image: "./seeds/images/9788377787915.jpg"
    },

    {
        product: {
            name: "Luca",
            price: "21.80",
            quantity_available: 4,
            quantity_on_hand: 4,
            is_purchasable: true
        },
        book: {
            title: "Luca",
            publication_date: "2020-12-30",
            isbn: "9788381784412",
            pages: 203
        },
        authors: ["Agnieszka Siepielska"],
        publisher: "NieZwykłe",
        book_format: "paperback",
        tags: [],
        image: "./seeds/images/9788381784412.jpg"
    },

    {
        product: {
            name: "Ikabog",
            price: "21.80",
            quantity_available: 18,
            quantity_on_hand: 18,
            is_purchasable: true
        },
        book: {
            title: "Ikabog",
            publication_date: "2020-11-01",
            isbn: "9788380088788",
            pages: 288
        },
        authors: ["Joanne K. Rowling"],
        publisher: "Media Rodzina",
        book_format: "hardcover",
        tags: [],
        image: "./seeds/images/9788380088788.jpg"
    },

    {
        product: {
            name: "Zabić drozda",
            price: "30.90",
            quantity_available: 10,
            quantity_on_hand: 10,
            is_purchasable: true
        },
        book: {
            title: "Zabić drozda",
            publication_date: "1960-07-11",
            isbn: "9788378187929",
            pages: 424
        },
        authors: ["Harper Lee"],
        publisher: "Rebis",
        book_format: "paperback",
        tags: [],
        image: "./seeds/images/9788378187929.jpg"
    },
    
    {
        product: {
            name: "Mały Książę",
            price: "5.00",
            quantity_available: 25,
            quantity_on_hand: 25,
            is_purchasable: true
        },
        book: {
            title: "Mały Książę",
            publication_date: "2020-05-04",
            isbn: "9788327499301",
            pages: 128 
        },
        authors: ["Antoine de Saint-Exupéry"],
        publisher: "Firma Księgarska Olesiejuk",
        book_format: "paperback",
        tags: [],
        image: "./seeds/images/9788327499301.jpg"
    },

    {
        product: {
            name: "Mistrz i Małgorzata",
            price: "15.19",
            quantity_available: 45,
            quantity_on_hand: 45,
            is_purchasable: true
        },
        book: {
            title: "Mistrz i Małgorzata",
            publication_date: "2018-11-29",
            isbn: "9788311150614",
            pages: 584 
        },
        authors: ["Michaił Bułhakow"],
        publisher: "Bellona",
        book_format: "paperback",
        tags: [],
        image: "./seeds/images/9788311150614.jpg"
    },

    {
        product: {
            name: "Igrzyska śmierci",
            price: "21.19",
            quantity_available: 8,
            quantity_on_hand: 8,
            is_purchasable: true
        },
        book: {
            title: "Igrzyska śmierci",
            publication_date: "2018-10-17",
            isbn: "9788372783578",
            pages: 378 
        },
        authors: ["Suzanne Collins"],
        publisher: "Media Rodzina",
        book_format: "paperback",
        tags: [],
        image: "./seeds/images/9788372783578.jpg"
    },

    {
        product: {
            name: "W pierścieniu ognia",
            price: "21.19",
            quantity_available: 12,
            quantity_on_hand: 12,
            is_purchasable: true
        },
        book: {
            title: "W pierścieniu ognia",
            publication_date: "2018-10-17",
            isbn: "9788372783950",
            pages: 360 
        },
        authors: ["Suzanne Collins"],
        publisher: "Media Rodzina",
        book_format: "paperback",
        tags: [],
        image: "./seeds/images/9788372783950.jpg"
    },

    {
        product: {
            name: "Kosogłos",
            price: "21.19",
            quantity_available: 12,
            quantity_on_hand: 12,
            is_purchasable: true
        },
        book: {
            title: "Kosogłos",
            publication_date: "2018-10-17",
            isbn: "9788372784919",
            pages: 367 
        },
        authors: ["Suzanne Collins"],
        publisher: "Media Rodzina",
        book_format: "paperback",
        tags: [],
        image: "./seeds/images/9788372784919.jpg"
    },

    {
        product: {
            name: "Zbrodnia i kara",
            price: "15.00",
            quantity_available: 445,
            quantity_on_hand: 445,
            is_purchasable: true
        },
        book: {
            title: "Zbrodnia i kara",
            publication_date: "2018-05-23",
            isbn: "9788328055971",
            pages: 608 
        },
        authors: ["Fiodor Dostojewski"],
        publisher: "W.A.B.",
        book_format: "paperback",
        tags: ["belles_lettres"],
        image: "./seeds/images/9788328055971.jpg"
    },

    {
        product: {
            name: "Oskar i pani Róża",
            price: "14.80",
            quantity_available: 145,
            quantity_on_hand: 145,
            is_purchasable: true
        },
        book: {
            title: "Oskar i pani Róża",
            publication_date: "2021-01-20",
            isbn: "9788324074280",
            pages: 96 
        },
        authors: ["Éric-Emmanuel Schmitt"],
        publisher: "Znak Literanova",
        book_format: "paperback",
        tags: ["belles_lettres"],
        image: "./seeds/images/9788324074280.jpg"
    },

    {
        product: {
            name: "Hobbit",
            price: "14.80",
            quantity_available: 85,
            quantity_on_hand: 85,
            is_purchasable: true
        },
        book: {
            title: "Hobbit",
            publication_date: "2018-02-12",
            isbn: "9788381162647",
            pages: 304 
        },
        authors: ["J.R.R. Tolkien"],
        publisher: "Zysk i S-ka",
        book_format: "paperback",
        tags: ["fantasy"],
        image: "./seeds/images/9788381162647.jpg"
    },

    {
        product: {
            name: "Kamienie na szaniec",
            price: "18.90",
            quantity_available: 85,
            quantity_on_hand: 85,
            is_purchasable: true
        },
        book: {
            title: "Kamienie na szaniec",
            publication_date: "2018-02-12",
            isbn: "9788310126542",
            pages: 256 
        },
        authors: ["Aleksander Kamiński"],
        publisher: "Nasza Księgarnia",
        book_format: "paperback",
        tags: ["historical_novel"],
        image: "./seeds/images/9788310126542.jpg"
    },

    {
        product: {
            name: "Folwark zwierzęcy",
            price: "8.99",
            quantity_available: 35,
            quantity_on_hand: 35,
            is_purchasable: true
        },
        book: {
            title: "Folwark zwierzęcy",
            publication_date: "2021-01-15",
            isbn: "9788379982837",
            pages: 128 
        },
        authors: ["George Orwell"],
        publisher: "Vis-a-Vis Etiuda",
        book_format: "paperback",
        tags: [],
        image: "./seeds/images/9788379982837.jpg"
    },

    {
        product: {
            name: "Buszujący w zbożu",
            price: "29.00",
            quantity_available: 315,
            quantity_on_hand: 315,
            is_purchasable: true
        },
        book: {
            title: "Buszujący w zbożu",
            publication_date: "2016-11-02",
            isbn: "9788379859115",
            pages: 304 
        },
        authors: ["J.D. Salinger"],
        publisher: "Albatros",
        book_format: "paperback",
        tags: [],
        image: "./seeds/images/9788379859115.jpg"
    },
    
    {
        product: {
            name: "Romeo i Julia",
            price: "4.75",
            quantity_available: 31,
            quantity_on_hand: 31,
            is_purchasable: true
        },
        book: {
            title: "Romeo i Julia",
            publication_date: "2017-08-24",
            isbn: "9788380731882",
            pages: 240 
        },
        authors: ["William Shakespeare"],
        publisher: "Zielona Sowa",
        book_format: "paperback",
        tags: ["belles_lettres"],
        image: "./seeds/images/9788380731882.jpg"
    },

    {
        product: {
            name: "Pan Tadeusz",
            price: "7.50",
            quantity_available: 87,
            quantity_on_hand: 87,
            is_purchasable: true
        },
        book: {
            title: "Pan Tadeusz",
            publication_date: "2020-01-01",
            isbn: "9788373271920",
            pages: 344 
        },
        authors: ["Adam Mickiewicz"],
        publisher: "Greg",
        book_format: "paperback",
        tags: [],
        image: "./seeds/images/9788373271920.jpg"
    },

    {
        product: {
            name: "Koniec świata. Krótki przewodnik po tym, co nas czeka",
            price: "29.50",
            quantity_available: 71,
            quantity_on_hand: 71,
            is_purchasable: true
        },
        book: {
            title: "Koniec świata. Krótki przewodnik po tym, co nas czeka",
            publication_date: "2021-01-27",
            isbn: "9788381432733",
            pages: 384 
        },
        authors: ["Bryan Walsh"],
        publisher: "Czarna Owca",
        book_format: "paperback",
        tags: [],
        image: "./seeds/images/9788381432733.jpg"
    },

    {
        product: {
            name: "PHP7. Praktyczny kurs",
            price: "69.00",
            quantity_available: 77,
            quantity_on_hand: 77,
            is_purchasable: true
        },
        book: {
            title: "PHP7. Praktyczny kurs",
            publication_date: "2017-04-18",
            isbn: "9788328324787",
            pages: 464 
        },
        authors: ["Marcin Lis"],
        publisher: "Helion",
        book_format: "paperback",
        tags: ["computer_science", "horror"],
        image: "./seeds/images/9788328324787.jpg"
    },

    {
        product: {
            name: "WordPress 5 dla początkujących",
            price: "59.00",
            quantity_available: 55,
            quantity_on_hand: 55,
            is_purchasable: true
        },
        book: {
            title: "WordPress 5 dla początkujących",
            publication_date: "2019-07-02",
            isbn: "9788328355583",
            pages: 352 
        },
        authors: ["Agnieszka Ciborowska", "Jarosław Lipiński"],
        publisher: "Helion",
        book_format: "paperback",
        tags: ["computer_science"],
        image: "./seeds/images/9788328355583.jpg"
    }
];

export const seed = async db => {
    await db.transaction(async db => {
        /*
            clear all tables
        */

        await db("order_products").delete();
        await db("orders").delete();
        await db("order_status").delete();
        await db("delivery_types").delete();
        await db("book_tags").delete();
        await db("book_authors").delete();
        await db("books").delete();
        await db("tags").delete();
        await db("book_formats").delete();
        await db("publishers").delete();
        await db("authors").delete();
        await db("products").delete();
        await db("images").delete();
        await db("user_roles").delete();
        await db("roles").delete();
        await db("users").delete();
        await db("sessions").delete();
        await db("client_messages").delete();


        /*
            tags
        */

        const TAGS = {};

        for (const tag of Object.keys(constants.tags)) {
            const [id] = await db("tags").insert({ tag });
            TAGS[tag] = id;
        }

        /*
            book formats
        */

        const FORMATS = {};

        for (const format of Object.keys(constants.formats)) {
            const [id] = await db("book_formats").insert({ format });
            FORMATS[format] = id;
        }

        const addBook = async ({
            product,
            book,
            authors,
            publisher,
            book_format,
            tags,
            image
        }) => {
            logger.info(`Adding book "${book.title}"...`);

            let image_id;
            let publisher_id;
            const author_ids = [];

            if (image) {
                const imageFilename = path.basename(image);

                try {
                    const imagesInDb = await db("images").where({ original_filename: imageFilename });

                    if (imagesInDb.length > 0) {
                        image_id = imagesInDb[0].id;
                        logger.info(`\tImage with filename "${imageFilename}" is already in the database, reusing.`);
                    }
                    else {
                        const imageData = await fs.readFile(image);

                        [image_id] = await db("images").insert({
                            binary_data: imageData,
                            content_type: mimetype.lookup(imageFilename),
                            original_filename: imageFilename
                        });
                    }
                }
                catch (error) {
                    logger.warn(`\tImage: ${error.toString()}`);
                }
            }

            if (authors.length > 0) {
                const authorsInDb = await db("authors").whereIn("name", authors);

                for (const author of authors) {
                    let found = false;

                    for (const authorInDb of authorsInDb) {
                        if (author === authorInDb.name) {
                            author_ids.push(authorInDb.id);
                            found = true;

                            logger.info(`\tAuthor "${author}" is already in the database, reusing.`);
                            break;
                        }
                    }

                    if (!found) {
                        const [author_id] = await db("authors").insert({ name: author });
                        author_ids.push(author_id);
                    }
                }
            }

            {
                const publishersInDb = await db("publishers").where({ name: publisher });

                if (publishersInDb.length > 0) {
                    publisher_id = publishersInDb[0].id;
                    logger.info(`\tPublisher with name "${publisher}" is already in the database, reusing.`);
                }
                else {
                    [publisher_id] = await db("publishers").insert({ name: publisher });
                }
            }

            const [product_id] = await db("products").insert({ ...product, image_id });
            const [book_id] = await db("books").insert({
                ...book,
                publisher_id,
                product_id,
                book_format_id: FORMATS[book_format]
            });

            for (const author_id of author_ids) {
                await db("book_authors").insert({ book_id, author_id });
            }

            for (const tag of tags) {
                await db("book_tags").insert({ book_id, tag_id: TAGS[tag] });
            }

            return book_id;
        };

        const addMessage = async ({
            name,
            email,
            message,
            title,
            date,
            read = false
        }) => {
            await db("client_messages").insert({ name, email, message, title, date: date ? date : db.fn.now(), read });
        };


        /*
            users
            1. username: admin, password: admin, with admin role
            2. username: user, password: password, without any role
        */

        const [admin_user_id] = await db("users").insert({ username: "admin", password_hash: await bcrypt.hash("admin", await bcrypt.genSalt()) });
        const [user_user_id] = await db("users").insert({ username: "user", password_hash: await bcrypt.hash("password", await bcrypt.genSalt()) });
        const [admin_role_id] = await db("roles").insert({ role: "admin" });
        await db("user_roles").insert({ user_id: admin_user_id, role_id: admin_role_id });

        /*
            order status
        */

        const [STATUS_PLACED] = await db("order_status").insert({ status: "placed" });
        const [STATUS_ACCEPTED] = await db("order_status").insert({ status: "accepted" });
        const [STATUS_SENT] = await db("order_status").insert({ status: "sent" });
        const [STATUS_DELIVERED] = await db("order_status").insert({ status: "delivered" });
        const [STATUS_CANCELLED] = await db("order_status").insert({ status: "cancelled" });

        /*
            delivery type
        */

        const [DELIVERY_COURIER] = await db("delivery_types").insert({ type: "courier", price: "15.00" });
        const [DELIVERY_MESSENGER_PIGEON] = await db("delivery_types").insert({ type: "messengerpigeon", price: "5.00" });
        const [DELIVERY_PERSONAL_PICKUP] = await db("delivery_types").insert({ type: "personalpickup", price: "0.00" });

        //
        // here
        // be
        // dragons
        //

        for (const book of books) {
            await addBook(book);
        }

        for (const message of messages) {
            await addMessage(message);
        }
    });
};