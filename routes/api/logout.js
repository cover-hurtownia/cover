import logger from "../../logger.js";
import { authenticated } from "../utilities.js";
import * as errorCodes from "../../www/js/common/errorCodes.js";

export const logout = [authenticated, async (request, response) => {
    try {
        const username = request.session.user.username;
        // Destroy the session.
        request.session.destroy((error) => {
            if (error) {
                logger.error(`${request.originalUrl}: request.session.destroy error: ${error.toString()}`);
                throw [500, errorCodes.INTERNAL_ERROR];
            }
            else {
                logger.info(`${request.originalUrl}: user logged out: ${username}`);

                response.status(200);
                response.clearCookie("session", { sameSite: true, httpOnly: true, secure: false });
                response.send({
                    status: "ok"
                });
            }
        });
    }
    catch ([status, errorCode]) {
        logger.warn(`${request.originalUrl}: [${status}]: ${errorCodes.asMessage(errorCode)}`);

        response.status(status)
        response.send({
            status: "error",
            error: {
                code: errorCode,
                message: errorCodes.asMessage(errorCode)
            }
        });
    }
}];