import logger from "../../../logger.js";
import * as errorCodes from "../../../www/js/common/errorCodes.js";

export const getBook = async (request, response) => {
    const database = request.app.get("database");
    
    try {
        let booksQuery = database
            .select([
                "books.id", "books.title", "books.publication_date", "books.isbn", "books.pages",
                "books.product_id", "products.quantity", "products.name", "products.description", "products.price", "products.available", "products.image",
                "publishers.publisher",
                "binding_types.type",
                database.raw("GROUP_CONCAT(authors.author SEPARATOR ?) as ?", [";", "authors"])
            ])
            .from("books")
            .innerJoin("products", "books.product_id", "products.id")
            .innerJoin("publishers", "books.publisher_id", "publishers.id")
            .innerJoin("binding_types", "books.binding_type_id", "binding_types.id")
            .innerJoin("book_authors", "books.id", "book_authors.book_id")
            .innerJoin("authors", "authors.id", "book_authors.author_id")
            .groupBy("books.id");

        const {
            quantity,
            quantityAtLeast,
            quantityAtMost,
            price,
            priceAtLeast,
            priceAtMost,
            name,
            description,
            available,
            bindingType,
            publisher,
            pages,
            pagesAtLeast,
            pagesAtMost,
            author
        } = request.query;

        if (quantity) booksQuery = booksQuery.andWhere("products.quantity", "=", quantity);
        if (quantityAtLeast) booksQuery = booksQuery.andWhere("products.quantity", ">=", quantityAtLeast);
        if (quantityAtMost) booksQuery = booksQuery.andWhere("products.quantity", "<=", quantityAtMost);

        if (price) booksQuery = booksQuery.andWhere("products.price", "=", price);
        if (priceAtLeast) booksQuery = booksQuery.andWhere("products.price", ">=", priceAtLeast);
        if (priceAtMost) booksQuery = booksQuery.andWhere("products.price", "<=", priceAtMost);

        if (name) booksQuery = booksQuery.andWhere("products.name", "like", `%${name}%`);
        if (description) booksQuery = booksQuery.andWhere("products.description", "like", `%${description}%`);

        if (available) booksQuery = booksQuery.andWhere("products.available", "=", 1);

        if (bindingType) booksQuery = booksQuery.andWhere("binding_types.id", "=", bindingType);
        
        if (publisher) booksQuery = booksQuery.andWhere("publishers.publisher", "like", publisher);

        if (pages) booksQuery = booksQuery.andWhere("books.pages", "=", pages);
        if (pagesAtLeast) booksQuery = booksQuery.andWhere("books.pages", ">=", pagesAtLeast);
        if (pagesAtMost) booksQuery = booksQuery.andWhere("books.pages", "<=", pagesAtMost);

        if (author) booksQuery = booksQuery.having("authors", "like", `%${author}%`);

        logger.debug(`${request.originalUrl}: SQL: ${booksQuery.toString()}`)

        const books = await booksQuery.then(books => books.map(book => ({ ...book, authors: book.authors.split(";")}))).catch(error => {
            logger.error(`${request.originalUrl}: database error: ${booksQuery.toString()}: ${error}`);
            throw [503, errorCodes.DATABASE_ERROR];
        });

        response.status(200);
        response.send({
            status: "ok",
            data: books
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

export default getBook;