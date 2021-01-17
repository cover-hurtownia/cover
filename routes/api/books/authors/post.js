import logger from "../../../../logger.js";

import { respond } from "../../../utilities.js";

export const postBookAuthors = respond(async request => {
    const database = request.app.get("database");

    const book_id = request.params.book_id;

    const author_ids = Array.isArray(request.body) ? request.body : [request.body];

    for (let i = 0; i < author_ids.length; ++i) {
        const author_id = author_ids[i];

        if (typeof author_id !== "number") throw [400, {
            userMessage: `błąd formularza`,
            devMessage: `author id at index ${i} is not a number`
        }];
    } 

    await database.transaction(async trx => {
        const books = await trx("books").where({ id: book_id }).catch(error => {
            logger.error(`${request.method} ${request.originalUrl}: database error: ${query.toString()}: ${error}`);
            throw [503, { userMessage: "błąd bazy danych", devMessage: error.toString() }];
        });

        if (books.length === 0) throw [400, {
            userMessage: `książka o id ${book_id} nie istnieje`,
            devMessage: `book with id ${book_id} doesn't exist`
        }];
        
        const authors = await trx("authors").whereIn("author", author_ids).catch(error => {
            logger.error(`${request.method} ${request.originalUrl}: database error: ${query.toString()}: ${error}`);
            throw [503, { userMessage: "błąd bazy danych", devMessage: error.toString() }];
        });

        for (const author_id of author_ids) {
            let ok = false;

            for (const author of authors) {
                if (author.id === author_id) {
                    ok = true;
                    break;
                }
            }

            if (!ok) throw [400, {
                userMessage: `autor o id ${book_id} nie istnieje`,
                devMessage: `author with id ${book_id} doesn't exist`
            }];

            let query = trx("book_authors").insert({ book_id, author_id });

            logger.debug(`${request.method} ${request.originalUrl}: SQL: ${query.toString()}`)
    
            const [inserted_id] = await query.catch(error => {
                logger.error(`${request.method} ${request.originalUrl}: database error: ${query.toString()}: ${error}`);
                throw [503, { userMessage: "błąd bazy danych", devMessage: error.toString() }];
            });
    
            logger.info(`${request.method} ${request.originalUrl}: inserted: ${inserted_id}`);
        }
    });

    return [201, {
        status: "ok"
    }];
});

export default postBookAuthors;