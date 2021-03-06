import logger from "../../../logger.js";

import { respond } from "../../utilities.js";

export const getBook = respond(async request => {
    const database = request.app.get("database");
    
    let {
        id,
        quantity,
        quantityAtLeast,
        quantityAtMost,
        price,
        priceAtLeast,
        priceAtMost,
        name,
        title,
        description,
        isPurchasable,
        bookFormat,
        publisher,
        pages,
        pagesAtLeast,
        pagesAtMost,
        publicationDate,
        publicationDateFirst,
        publicationDateLast,
        author,
        tag,
        isbn,
        orderBy = "publicationDate",
        ordering = "desc",
        limit = 20,
        offset = 0,
    } = request.query;

    limit = Math.trunc(Math.max(1, Math.min(50, 
        typeof limit === "number"
            ? limit
            : typeof limit !== "string"
                ? 20
                : isNaN(Number(limit))
                    ? 20
                    : Number(limit)
    )));

    offset = Math.trunc(Math.max(0, 
        typeof offset === "number"
            ? offset
            : typeof offset !== "string"
                ? 0
                : isNaN(Number(offset))
                    ? 0
                    : Number(offset)
    ));

    ordering = (ordering !== "desc" && ordering !== "asc") ? "asc" : ordering;
    
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
        .groupBy("books.id");

    if (id) {
        if (Array.isArray(id)) query = query.whereIn("books.id", id);
        else query = query.andWhere("books.id", "=", id);
    }

    if (quantity) query = query.andWhere("products.quantity_available", "=", quantity);
    if (quantityAtLeast) query = query.andWhere("products.quantity_available", ">=", quantityAtLeast);
    if (quantityAtMost) query = query.andWhere("products.quantity_available", "<=", quantityAtMost);

    if (price) query = query.andWhere("products.price", "=", price);
    if (priceAtLeast) query = query.andWhere("products.price", ">=", priceAtLeast);
    if (priceAtMost) query = query.andWhere("products.price", "<=", priceAtMost);

    if (name) query = query.andWhere("products.name", "like", `%${name}%`);
    if (title) query = query.andWhere("books.title", "like", `%${title}%`);
    if (description) query = query.andWhere("products.description", "like", `%${description}%`);
    if (isbn) query = query.andWhere("books.isbn", "=", isbn);

    if (isPurchasable) query = query.andWhere("products.is_purchasable", "=", Number(Boolean(isPurchasable)));
    
    if (publisher) query = query.andWhere("publishers.name", "like", publisher);

    if (pages) query = query.andWhere("books.pages", "=", pages);
    if (pagesAtLeast) query = query.andWhere("books.pages", ">=", pagesAtLeast);
    if (pagesAtMost) query = query.andWhere("books.pages", "<=", pagesAtMost);

    if (publicationDate) query = query.andWhere("books.publication_date", "=", publicationDate);
    if (publicationDateFirst) query = query.andWhere("books.publication_date", ">=", publicationDateFirst);
    if (publicationDateLast) query = query.andWhere("books.publication_date", "<=", publicationDateLast);

    if (bookFormat) {
        if (Array.isArray(bookFormat)) query = query.whereIn("book_formats.format", bookFormat);
        else query = query.andWhere("book_formats.format", "=", bookFormat);
    }

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
    else if (orderBy === "quantity") query = query.orderBy("products.quantity_available", ordering);
    else if (orderBy === "title") query = query.orderBy("books.title", ordering);
    else if (orderBy === "price") query = query.orderBy("products.price", ordering);
    else if (orderBy === "pages") query = query.orderBy("books.pages", ordering);
    else if (orderBy === "publicationDate") query = query.orderBy("books.publication_date", ordering);
    else if (orderBy === "orders") query = query.orderBy("orders", ordering);

    const total = (await query.clone()).length;

    logger.debug(`${request.method} ${request.originalUrl}: SQL: ${query.toString()}`);

    const books = await query.offset(offset).limit(limit).then(books => books.map(book => ({ 
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