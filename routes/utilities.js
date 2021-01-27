import logger from "../logger.js";

export const authenticated = async (request, response, next) => {
    if (request.session.hasOwnProperty("user")) next();
    else {
        logger.warn(`${request.method} ${request.originalUrl}: [401]`);

        response.status(401);
        response.send({
            status: "error",
            error: {
                userMessage: "wymagane zalogowanie",
                devMessage: "not authenticated"
            }
        });
    }
};

export const roleAuthorization = requiredRole => [authenticated, async (request, response, next) => {
    const database = request.app.get("database");

    try {
        const rolesQuery = database
            .select("roles.role")
            .from("user_roles")
            .join("users", "users.id", "user_roles.user_id")
            .join("roles", "roles.id", "user_roles.role_id")
            .where("users.username", "=", request.session.user.username);

        logger.debug(`${request.method} ${request.originalUrl}: SQL: ${rolesQuery.toString()}`);

        const roles = await rolesQuery.then(roles => roles.map(({ role }) => role)).catch(error => {
            logger.error(`/api/roles: database error: ${rolesQuery.toString()}: ${error}`);
            throw [503, { userMessage: "błąd bazy danych", devMessage: error.toString() }];
        });

        if (roles.includes(requiredRole)) next();
        else throw [403, { userMessage: "brak uprawnień", devMessage: `role required: ${requiredRole}, current roles: ${roles.join(", ")}` }];
    }
    catch (error) {
        if (error instanceof Error) {
            logger.error(`${request.method} ${request.originalUrl}: ${error.toString()}`);

            response.status(500);
            response.send({
                status: "error",
                error: {
                    userMessage: "błąd serwera",
                    devMessage: error.toString()
                }
            });
        }
        else {
            const [status, errorBody] = error;
            logger.warn(`${request.method} ${request.originalUrl}: [${status}]: ${JSON.stringify(errorBody)}`);

            const body = {
                status: "error",
                error: errorBody
            };

            response.status(status);
            response.send(body);
        }
    }
}];

export const adminAuthorization = roleAuthorization("admin");

export const respond = handler => async (request, response) => {
    logger.debug(`${request.method} ${request.originalUrl}`);

    try {
        const [status, body] = await handler(request, response);

        response.status(status);
        response.send(body);
    }
    catch (error) {
        if (error instanceof Error) {
            logger.error(`${request.method} ${request.originalUrl}: ${error.toString()}`);

            response.status(500);
            response.send({
                status: "error",
                error: {
                    userMessage: "błąd serwera",
                    devMessage: error.toString()
                }
            });
        }
        else {
            const [status, errorBody] = error;
            logger.warn(`${request.method} ${request.originalUrl}: [${status}]: ${JSON.stringify(errorBody)}`);

            const body = {
                status: "error",
                error: errorBody
            };

            response.status(status);
            response.send(body);
        }
    }
};

export const render = handler => async (request, response) => {
    logger.debug(`${request.method} ${request.originalUrl}`);

    try {
        const [status, view, data] = (await handler(request, response)) ?? [];

        if (status) response.status(status);
        if (view && data) response.render(view, {
            ...data,
            meta: {
                url: request.protocol + '://' + request.get('host') + request.originalUrl,
                image: "/assets/banner.png",
                cookies: request.cookies,
                ...data.meta
            },
            session: request.session?.user
        });
    }
    catch (error) {
        if (error instanceof Error) {
            logger.error(`${request.method} ${request.originalUrl}: ${error.toString()}`);

            response.status(500);
            response.render("message", {
                meta: {
                    url: request.protocol + '://' + request.get('host') + request.originalUrl,
                    title: "Cover Hurtownia",
                    description: "Błąd serwera",
                    image: "/assets/banner.png",
                    cookies: request.cookies
                },
                message: {
                    className: "is-danger",
                    title: "Błąd",
                    content: "Błąd 500: Błąd serwera. Spróbuj ponownie później.",
                    buttons: [
                        { href: "/", content: "Przejdź do strony głównej", className: "is-primary" }
                    ]
                },
                session: request.session?.user
            });
        }
        else {
            const [status, view, data] = error;
            logger.warn(`${request.method} ${request.originalUrl}: [${status}]`);

            response.status(status);
            response.render(view, {
                ...data,
                meta: {
                    url: request.protocol + '://' + request.get('host') + request.originalUrl,
                    image: "/assets/banner.png",
                    cookies: request.cookies,
                    ...data.meta
                },
                session: request.session?.user
            });
        }
    }
};