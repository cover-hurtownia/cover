import logger from "../../logger.js";
import { authenticated } from "../utilities.js";

import { respond } from "../utilities.js";

export const logout = [authenticated, async (request, response) => {
    const username = request.session.user.username;
    // Destroy the session.
    request.session.destroy((error) => {
        if (error) {
            logger.error(`${request.method} ${request.originalUrl}: request.session.destroy error: ${error.toString()}`);
            
            response.status(500);
            response.send({ userMessage: "błąd serwera", devMessage: error.toString() });
        }
        else {
            logger.info(`${request.method} ${request.originalUrl}: user logged out: ${username}`);

            response.clearCookie("session", { sameSite: true, httpOnly: true, secure: false });
            
            response.status(200);
            response.send({ status: "ok" });
        }
    });
}];