export const logout = () => async (request, response) => {
    try {
        // Destroy the session.
        request.session.destroy((error) => {
            if (error) {
                console.error("/api/logout: request.session.destroy error:", error);
                throw "internal error";
            }
            else {
                response.status(200);
                response.clearCookie("session");
                response.clearCookie("session_username");
                response.send({
                    status: "ok"
                });
            }
        });
    }
    catch (error) {
        // Send 404 (bad request) on any error.
        response.status(400)
        response.send({
            status: "error",
            error
        });
    }
};