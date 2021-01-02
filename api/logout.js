import logger from "../logger.js";

export const logout = () => async (request, response) => {
    try {
        // Destroy the session.
        request.session.destroy((error) => {
            if (error) {
                logger.error("/api/logout: request.session.destroy error:", error);
                throw "internal error";
            }
            else {
                response.status(200);
                response.clearCookie("session", { sameSite: true, httpOnly: true, secure: false });
                response.send({
                    status: "ok"
                });
            }
        });
    }
    catch (error) {
        // Send 400 (bad request) on any error.
        logger.warn(`/api/logout: ${error}`);
        response.status(400)
        response.send({
            status: "error",
            error
        });
    }
};