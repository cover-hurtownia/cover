import logger from "../logger.js";

import { render } from "./utilities.js";

export const logout = render(async (request, response) => {
    const username = request.session.user?.username ?? "???";

    request.session.destroy((error) => {
        if (error) {
            logger.error(`${request.method} ${request.originalUrl}: request.session.destroy error: ${error.toString()}`);
            
            throw [500, "message", {
                meta: {
                    title: "Cover Hurtownia",
                    description: "Błąd serwera"
                },
                message: {
                    className: "is-danger",
                    title: "Błąd",
                    content: "Błąd 500: Błąd serwera. Spróbuj ponownie później."
                }
            }];
        }
        else {
            logger.info(`${request.method} ${request.originalUrl}: user logged out: ${username}`);

            response.clearCookie("session", { sameSite: true, httpOnly: true, secure: false });
            response.redirect(request.get("referer"));
        }
    });
});

export default logout;