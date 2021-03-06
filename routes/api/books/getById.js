import logger from "../../../logger.js";

import { respond } from "../../utilities.js";

export const getBookById = respond(async request => {
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

    const books = await query.then(books => books.map(book => ({ 
        ...book,
        authors: book.authors?.split(";") ?? [],
        tags: book.tags?.split(";") ?? []
    }))).catch(error => {
        logger.error(`${request.method} ${request.originalUrl}: database error: ${query.toString()}: ${error}`);
        throw [503, { userMessage: "błąd bazy danych", devMessage: error.toString() }];
    });

    if (books.length === 0) throw [404, {
        userMessage: "nie znaleziono zasobu",
        devMessage: `book with id ${id} doesn't exist`
    }];

    const book = books[0];

    return [200, {
        status: "ok",
        data: book
    }];
});

export default getBookById;