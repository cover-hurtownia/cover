import logger from "../logger.js";

export const search = async (request, response) => {
    const database = request.app.get("database");
    
    try {
        const id = request.params.book_id;

        let query = database
            .select([
                "books.id", "books.title", "books.publication_date", "books.isbn", "books.pages",
                "books.product_id", "products.quantity", "products.name", "products.description", "products.price", "products.available", "products.image_id",
                "publishers.publisher",
                "binding_types.type",
                database.raw("GROUP_CONCAT(DISTINCT authors.author SEPARATOR ?) as ?", [";", "authors"]),
                database.raw("GROUP_CONCAT(DISTINCT tags.tag SEPARATOR ?) as ?", [";", "tags"])
            ])
            .from("books")
            .where("books.id", id)
            .innerJoin("products", "books.product_id", "products.id")
            .innerJoin("publishers", "books.publisher_id", "publishers.id")
            .innerJoin("binding_types", "books.binding_type_id", "binding_types.id")
            .innerJoin("book_authors", "books.id", "book_authors.book_id")
            .innerJoin("authors", "authors.id", "book_authors.author_id")
            .innerJoin("book_tags", "books.id", "book_tags.book_id")
            .innerJoin("tags", "tags.id", "book_tags.tag_id")
            .groupBy("books.id");

        logger.debug(`${request.method} ${request.originalUrl}: SQL: ${query.toString()}`);

        const books = await query.then(books => books.map(book => ({
            ...book,
            authors: book.authors.split(";"),
            tags: book.tags.split(";")
        }))).catch(error => {
            logger.error(`${request.method} ${request.originalUrl}: database error: ${query.toString()}: ${error}`);
            throw [503, errorCodes.DATABASE_ERROR];
        });

        if (books.length === 0) throw [404, errorCodes.RESOURCE_NOT_FOUND];

        const book = books[0];

        response.status(200);
        response.render("book", {
            meta: {
                title: `Hurtownia książek - ${book.title}`,
                url: request.originalUrl,
                description: `${book.title} - ${book.authors.join(", ")} - ${book.publisher}`,
                image: `/images/${book.image_id}`
            },
            book
        });
    }
    catch (error) {
        logger.warn(`${request.method} ${request.originalUrl}: ${error.toString()}`);

        response.status(400);
        response.render("error", {
            meta: {
                title: "Hurtownia książek",
                url: request.originalUrl,
                description: "Lorem ipsum",
                image: "/assets/banner.png"
            },
            error: error.toString()
        });
    }
};

export default search;