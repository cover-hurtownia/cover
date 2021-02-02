import logger from "../logger.js";

import { render } from "./utilities.js";

export const home = render(async (request, response) => {
    const database = request.app.get("database");

    const query = database
        .select([
            database.count("*").from("products").as("total_products"),
            database.count("*").from("users").as("total_users"),
            database.count("*").from("orders").as("total_orders")
        ]);
    
    logger.debug(`${request.method} ${request.originalUrl}: SQL: ${query.toString()}`);

    const [result] = await query.catch(error => {
        logger.error(`${request.method} ${request.originalUrl}: database error: ${query.toString()}: ${error}`);

        throw [503, "login", {
            meta: {
                title: "Cover Hurtownia",
                description: "Błąd bazy danych"
            },
            message: {
                className: "is-danger",
                title: "Błąd",
                content: "Błąd 503: Błąd bazy danych. Spróbuj ponownie później."
            }
        }];
    });

    const stats = {
        products: result.total_products,
        users: result.total_users,
        orders: result.total_orders
    };

    return [200, "home", {
        meta: {
            title: "Cover Hurtownia",
            description: "Lorem ipsum",
            image: "/assets/banner.png",
        },
        stats
    }];
});

export default home;