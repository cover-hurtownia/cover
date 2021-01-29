import logger from "../logger.js";

export const ranking = async (request, response) => {
    const database = request.app.get("database");
    
    let query = database
        .select([
            "books.id", "books.title", "books.publication_date", "books.isbn", "books.pages",
            "books.product_id", "products.quantity_available", "products.name", "products.description", "products.price", "products.is_purchasable", "products.image_id",
            "publishers.name as publisher",
            "book_formats.format as book_format",
            database.raw("GROUP_CONCAT(DISTINCT authors.name SEPARATOR ?) as ?", [";", "authors"]),
            database.raw("GROUP_CONCAT(DISTINCT tags.tag SEPARATOR ?) as ?", [";", "tags"])
        ])
        .count("order_products.product_id", { as: "orders" })
        .from("books")
        .innerJoin("products", "books.product_id", "products.id")
        .innerJoin("publishers", "books.publisher_id", "publishers.id")
        .innerJoin("book_formats", "books.book_format_id", "book_formats.id")
        .leftJoin("book_authors", "books.id", "book_authors.book_id")
        .leftJoin("authors", "authors.id", "book_authors.author_id")
        .leftJoin("book_tags", "books.id", "book_tags.book_id")
        .leftJoin("tags", "tags.id", "book_tags.tag_id")
        .leftJoin("order_products", "order_products.product_id", "products.id")
        .groupBy("books.id")
        .orderBy("orders", "desc")
        .limit(10);

    logger.debug(`${request.method} ${request.originalUrl}: SQL: ${query.toString()}`);

    const books = await query.then(books => books.map(book => ({ 
        ...book,
        authors: book.authors?.split(";") ?? [],
        tags: book.tags?.split(";") ?? []
    }))).catch(error => {
        logger.error(`${request.method} ${request.originalUrl}: database error: ${query.toString()}: ${error}`);
        throw [503, { userMessage: "błąd bazy danych", devMessage: error.toString() }];
    });

    response.status(200);
    response.render("ranking", {
        meta: {
            url: process.env.PROTOCOL + '://' + process.env.DOMAIN,
            title: "Cover Hurtownia - Ranking",
            description: "Najczęściej kupowane produkty",
            image: `/assets/banner.png`,
            cookies: request.cookies
        },
        books,
        session: request.session?.user
    });
};

export default ranking;