import logger from "../logger.js";

export const book = async (request, response) => {
    const database = request.app.get("database");
    
    const id = request.params.book_id;

    let query = database
        .select([
            "books.id", "books.title", "books.publication_date", "books.isbn", "books.pages",
            "books.product_id", "products.quantity_available", "products.name", "products.description", "products.price", "products.is_purchasable", "products.image_id",
            "publishers.name as publisher",
            "book_formats.format as book_format",
            database.raw("GROUP_CONCAT(DISTINCT authors.name SEPARATOR ?) as ?", [";", "authors"]),
            database.raw("GROUP_CONCAT(DISTINCT tags.tag SEPARATOR ?) as ?", [";", "tags"])
        ])
        .from("books")
        .where("books.id", id)
        .innerJoin("products", "books.product_id", "products.id")
        .innerJoin("publishers", "books.publisher_id", "publishers.id")
        .innerJoin("book_formats", "books.book_format_id", "book_formats.id")
        .leftJoin("book_authors", "books.id", "book_authors.book_id")
        .leftJoin("authors", "authors.id", "book_authors.author_id")
        .leftJoin("book_tags", "books.id", "book_tags.book_id")
        .leftJoin("tags", "tags.id", "book_tags.tag_id")
        .groupBy("books.id")
        .limit(1);

    logger.debug(`${request.method} ${request.originalUrl}: SQL: ${query.toString()}`);

    let books

    try {
        books = await query.then(books => books.map(book => ({ 
            ...book,
            authors: book.authors?.split(";") ?? [],
            tags: book.tags?.split(";") ?? []
        })))
    }
    catch (error) {
        logger.error(`${request.method} ${request.originalUrl}: database error: ${query.toString()}: ${error}`);
        
        response.status(503);
        response.render('message', {
            meta: {
                url: request.protocol + '://' + process.env.DOMAIN,
                title: "Cover Hurtownia - 503",
                description: "Błąd serwera",
                image: "/assets/banner.png",
                cookies: request.cookies
            },
            message: {
                className: "is-danger",
                title: "Błąd",
                content: "Błąd 503: Błąd bazy danych. Spróbuj ponownie później.",
                buttons: [
                    { href: "/", content: "Przejdź do strony głównej", className: "is-primary" }
                ]
            },
            session: request.session?.user
        });

        return;
    }

    if (books.length === 0) {
        response.status(404);
        response.render('message', {
            meta: {
                url: request.protocol + '://' + process.env.DOMAIN,
                title: "Cover Hurtownia - 404",
                description: "Błąd żądania",
                image: "/assets/banner.png",
                cookies: request.cookies
            },
            message: {
                className: "is-danger",
                title: "Błąd",
                content: "Błąd 404: Wybrana książka nie istnieje.",
                buttons: [
                    { href: "/", content: "Przejdź do strony głównej", className: "is-primary" }
                ]
            },
            session: request.session?.user
        });

        return;
    }

    const book = books[0];

    const similarProductsQuery = database
        .select(["products.*"])
        .from(database
            .select(["order_products.*"])
            .from("order_products")
            .where("order_products.product_id", "=", book.product_id)
            .as("orders_with_product")
        )
        .innerJoin("order_products", "orders_with_product.order_id", "order_products.order_id")
        .innerJoin("products", "products.id", "order_products.product_id")
        .where("products.id", "!=", book.product_id)
        .groupBy("products.id")
        .limit(12);

    logger.debug(`${request.method} ${request.originalUrl}: SQL: ${similarProductsQuery.toString()}`);

    let similarProducts;

    try { similarProducts = await similarProductsQuery; }
    catch (error) {
        logger.error(`${request.method} ${request.originalUrl}: database error: ${query.toString()}: ${error}`);

        response.status(503);
        response.render('message', {
            meta: {
                url: request.protocol + '://' + process.env.DOMAIN,
                title: "Cover Hurtownia - 503",
                description: "Błąd serwera",
                image: "/assets/banner.png",
                cookies: request.cookies
            },
            message: {
                className: "is-danger",
                title: "Błąd",
                content: "Błąd 503: Błąd bazy danych. Spróbuj ponownie później.",
                buttons: [
                    { href: "/", content: "Przejdź do strony głównej", className: "is-primary" }
                ]
            },
            session: request.session?.user
        });

        return;
    };

    response.status(200);
    response.render("book", {
        meta: {
            url: request.protocol + '://' + process.env.DOMAIN,
            title: `Cover Hurtownia - ${book.title}`,
            description: `${book.title} - ${book.authors.join(", ")} - ${book.publisher}`,
            image: `/images/${book.image_id}`,
            cookies: request.cookies
        },
        book,
        similarProducts,
        session: request.session?.user
    });
};

export default book;