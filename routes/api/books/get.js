import logger from "../../../logger.js";

import { respond } from "../../utilities.js";

export const getBook = respond(async request => {
    const database = request.app.get("database");
    
    let {
        quantity,
        quantityAtLeast,
        quantityAtMost,
        price,
        priceAtLeast,
        priceAtMost,
        title,
        description,
        available,
        bindingType,
        publisher,
        pages,
        pagesAtLeast,
        pagesAtMost,
        author,
        tag,
        isbn,
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
            database.raw("GROUP_CONCAT(DISTINCT authors.author SEPARATOR ?) as ?", [";", "authors"]),
            database.raw("GROUP_CONCAT(DISTINCT tags.tag SEPARATOR ?) as ?", [";", "tags"])
        ])
        .from("books")
        .innerJoin("products", "books.product_id", "products.id")
        .innerJoin("publishers", "books.publisher_id", "publishers.id")
        .innerJoin("binding_types", "books.binding_type_id", "binding_types.id")
        .leftJoin("book_authors", "books.id", "book_authors.book_id")
        .leftJoin("authors", "authors.id", "book_authors.author_id")
        .leftJoin("book_tags", "books.id", "book_tags.book_id")
        .leftJoin("tags", "tags.id", "book_tags.tag_id")
        .groupBy("books.id")
        .offset(Math.max(offset, 0)).limit(Math.min(limit, 50));

    if (quantity) query = query.andWhere("products.quantity", "=", quantity);
    if (quantityAtLeast) query = query.andWhere("products.quantity", ">=", quantityAtLeast);
    if (quantityAtMost) query = query.andWhere("products.quantity", "<=", quantityAtMost);

    if (price) query = query.andWhere("products.price", "=", price);
    if (priceAtLeast) query = query.andWhere("products.price", ">=", priceAtLeast);
    if (priceAtMost) query = query.andWhere("products.price", "<=", priceAtMost);

    if (title) query = query.andWhere("books.title", "like", `%${title}%`);
    if (description) query = query.andWhere("products.description", "like", `%${description}%`);
    if (isbn) query = query.andWhere("books.isbn", "=", isbn);

    if (available) query = query.andWhere("products.available", "=", 1);

    if (bindingType) query = query.andWhere("binding_types.id", "=", bindingType);
    
    if (publisher) query = query.andWhere("publishers.publisher", "like", publisher);

    if (pages) query = query.andWhere("books.pages", "=", pages);
    if (pagesAtLeast) query = query.andWhere("books.pages", ">=", pagesAtLeast);
    if (pagesAtMost) query = query.andWhere("books.pages", "<=", pagesAtMost);

    if (author) {
        if (Array.isArray(author)) {
            for (const a of author) {
                query = query.having("authors", "like", `%${a}%`);
            }
        }
        else {
            query = query.having("authors", "like", `%${author}%`);
        }
    }

    if (tag) {
        if (Array.isArray(tag)) {
            for (const t of tag) {
                query = query.having("tags", "like", `%${t}%`);
            }
        }
        else {
            query = query.having("tags", "like", `%${tag}%`);
        }
    }

    if (orderBy === "id") query = query.orderBy("books.id", ordering);
    else if (orderBy === "quantity") query = query.orderBy("products.quantity", ordering);
    else if (orderBy === "title") query = query.orderBy("books.title", ordering);
    else if (orderBy === "price") query = query.orderBy("products.price", ordering);
    else if (orderBy === "pages") query = query.orderBy("books.pages", ordering);
    else if (orderBy === "date") query = query.orderBy("books.publication_date", ordering);

    logger.debug(`${request.method} ${request.originalUrl}: SQL: ${query.toString()}`);

    const books = await query.then(books => books.map(book => ({ 
        ...book,
        authors: book.authors?.split(";") ?? [],
        tags: book.tags?.split(";") ?? []
    }))).catch(error => {
        logger.error(`${request.method} ${request.originalUrl}: database error: ${query.toString()}: ${error}`);
        throw [503, { userMessage: "błąd bazy danych", devMessage: error.toString() }];
    });

    return [200, {
        status: "ok",
        data: books,
        total,
        limit,
        offset,
        orderBy,
        ordering
    }];
});

export default getBook;