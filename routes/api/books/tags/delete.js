import logger from "../../../../logger.js";

import { respond } from "../../../utilities.js";

export const deleteBookTags = respond(async request => {
    const database = request.app.get("database");

    const book_id = request.params.book_id;

    const tag_ids = Array.isArray(request.body) ? request.body : [request.body];

    for (let i = 0; i < tag_ids.length; ++i) {
        const tag_id = tag_ids[i];

        if (typeof tag_id !== "number") throw [400, {
            userMessage: `błąd formularza`,
            devMessage: `tag id at index ${i} is not a number`
        }]; 
    } 

    await database.transaction(async trx => {
        const books = await trx("books").where({ id: book_id }).catch(error => {
            logger.error(`${request.method} ${request.originalUrl}: database error: ${query.toString()}: ${error}`);
            throw [503, { userMessage: "błąd bazy danych", devMessage: error.toString() }];
        });

        if (books.length === 0) throw [404, {
            userMessage: `książka o id ${book_id} nie istnieje`,
            devMessage: `book with id ${book_id} doesn't exist`
        }];
        
        const tags = await trx("tags").whereIn("id", tag_ids).catch(error => {
            logger.error(`${request.method} ${request.originalUrl}: database error: ${query.toString()}: ${error}`);
            throw [503, { userMessage: "błąd bazy danych", devMessage: error.toString() }];
        });

        for (const tag_id of tag_ids) {
            let ok = false;

            for (const tag of tags) {
                if (tag.id === tag_id) {
                    ok = true;
                    break;
                }
            }

            if (!ok) throw [404, {
                userMessage: `tag o id ${book_id} nie istnieje`,
                devMessage: `tag with id ${book_id} doesn't exist`
            }];

            let query = trx("book_tags").delete().where({ book_id, tag_id });

            logger.debug(`${request.method} ${request.originalUrl}: SQL: ${query.toString()}`)
    
            await query.catch(error => {
                logger.error(`${request.method} ${request.originalUrl}: database error: ${query.toString()}: ${error}`);
                throw [503, { userMessage: "błąd bazy danych", devMessage: error.toString() }];
            });
        }
    });

    return [200, { status: "ok" }];
});

export default deleteBookTags;