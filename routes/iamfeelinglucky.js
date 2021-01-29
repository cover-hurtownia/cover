import logger from "../logger.js";

export const IAmFeelingLucky = async (request, response) => {
    const database = request.app.get("database");

    let query = database
        .select(["books.id"])
        .from("books")
        .orderBy(database.raw("RAND()"))
        .limit(1)

    logger.debug(`${request.method} ${request.originalUrl}: SQL: ${query.toString()}`);

    const books = await query.then(books => books.map(book => ({ 
        ...book,
        authors: book.authors?.split(";") ?? [],
        tags: book.tags?.split(";") ?? []
    }))).catch(error => {
        logger.error(`${request.method} ${request.originalUrl}: database error: ${query.toString()}: ${error}`);
        throw [503, { userMessage: "błąd bazy danych", devMessage: error.toString() }];
    });

    const book = books[0];

    response.redirect(`/book/${book.id}`);
};

export default IAmFeelingLucky;