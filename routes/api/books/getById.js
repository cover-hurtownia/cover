import logger from "../../../logger.js";
import * as errorCodes from "../../../www/js/common/errorCodes.js";

export const getBookById = async (request, response) => {
    const database = request.app.get("database");
    
    try {
        const id = request.params.id;

        let booksQuery = database
            .select([
                "books.id", "books.title", "books.publication_date", "books.isbn", "books.pages",
                "books.products_id", "products.quantity", "products.name", "products.description", "products.price", "products.available", "products.image",
                "publishers.publisher",
                "binding_types.type",
                database.raw("GROUP_CONCAT(authors.author SEPARATOR ?) as ?", [";", "authors"])
            ])
            .from("books")
            .where("books.id", id)
            .innerJoin("products", "books.product_id", "products.id")
            .innerJoin("publishers", "books.publisher_id", "publishers.id")
            .innerJoin("binding_types", "books.binding_type_id", "binding_types.id")
            .innerJoin("book_authors", "books.id", "book_authors.book_id")
            .innerJoin("authors", "authors.id", "book_authors.author_id")
            .groupBy("books.id");

        logger.debug(`${request.originalUrl}: SQL: ${booksQuery.toString()}`)

        const books = await booksQuery.then(books => books.map(book => ({ ...book, authors: book.authors.split(";") }))).catch(error => {
            logger.error(`${request.originalUrl}: database error: ${booksQuery.toString()}: ${error}`);
            throw [503, errorCodes.DATABASE_ERROR];
        });

        if (books.length === 0) throw [404, errorCodes.RESOURCE_NOT_FOUND];

        const book = books[0];

        response.status(200);
        response.send({
            status: "ok",
            data: book
        });
    }
    catch ([status, errorCode]) {
        logger.warn(`${request.originalUrl}: [${status}]: ${errorCodes.asMessage(errorCode)}`);

        response.status(status);
        response.send({
            status: "error",
            error: {
                code: errorCode,
                message: errorCodes.asMessage(errorCode)
            }
        });
    }
};

export default getBookById;