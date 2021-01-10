import logger from "../../../logger.js";
import * as errorCodes from "../../../www/js/common/errorCodes.js";

export const getBook = async (request, response) => {
    const database = request.app.get("database");
    
    try {
        let {
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
            author,
            orderBy,
            ordering = "desc",
            limit = 20,
            offset = 0,
        } = request.query;

        ordering = (ordering !== "desc" && ordering !== "asc") ? "asc" : ordering;

        const [{ total }] = await database("books").count("id", { as: "total" });
        
        let query = database
            .select([
                "books.id", "books.title", "books.publication_date", "books.isbn", "books.pages",
                "books.product_id", "products.quantity", "products.name", "products.description", "products.price", "products.available", "products.image_id",
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
            .groupBy("books.id")
            .offset(Math.min(offset, 0)).limit(Math.min(limit, 50));

        if (quantity) query = query.andWhere("products.quantity", "=", quantity);
        if (quantityAtLeast) query = query.andWhere("products.quantity", ">=", quantityAtLeast);
        if (quantityAtMost) query = query.andWhere("products.quantity", "<=", quantityAtMost);

        if (price) query = query.andWhere("products.price", "=", price);
        if (priceAtLeast) query = query.andWhere("products.price", ">=", priceAtLeast);
        if (priceAtMost) query = query.andWhere("products.price", "<=", priceAtMost);

        if (name) query = query.andWhere("products.name", "like", `%${name}%`);
        if (description) query = query.andWhere("products.description", "like", `%${description}%`);

        if (available) query = query.andWhere("products.available", "=", 1);

        if (bindingType) query = query.andWhere("binding_types.id", "=", bindingType);
        
        if (publisher) query = query.andWhere("publishers.publisher", "like", publisher);

        if (pages) query = query.andWhere("books.pages", "=", pages);
        if (pagesAtLeast) query = query.andWhere("books.pages", ">=", pagesAtLeast);
        if (pagesAtMost) query = query.andWhere("books.pages", "<=", pagesAtMost);

        if (author) query = query.having("authors", "like", `%${author}%`);

        if (orderBy === "id") query = query.orderBy("books.id", ordering);
        else if (orderBy === "quantity") query = query.orderBy("products.quantity", ordering);
        else if (orderBy === "title") query = query.orderBy("books.title", ordering);
        else if (orderBy === "price") query = query.orderBy("products.price", ordering);
        else if (orderBy === "pages") query = query.orderBy("books.pages", ordering);
        else if (orderBy === "date") query = query.orderBy("books.publication_date", ordering);

        logger.debug(`${request.originalUrl}: SQL: ${query.toString()}`)

        const books = await query.then(books => books.map(book => ({ ...book, authors: book.authors.split(";")}))).catch(error => {
            logger.error(`${request.originalUrl}: database error: ${query.toString()}: ${error}`);
            throw [503, errorCodes.DATABASE_ERROR];
        });

        response.status(200);
        response.send({
            status: "ok",
            data: books,
            total,
            limit,
            offset,
            orderBy,
            ordering
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