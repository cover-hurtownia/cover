export const logout = () => async (request, response) => {
    try {
        // If session doesn't contain "username" key, then the user is probably logged out.
        if (!request.session.hasOwnProperty("username")) {
            throw "already logged out";
        };

        // Destroy the session.
        request.session.destroy();

        response.status(200);
        response.send({
            status: "ok"
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