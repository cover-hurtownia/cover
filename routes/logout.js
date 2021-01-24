import logger from "../logger.js";

export const logout = async (request, response) => {
    const username = request.session.user?.username ?? "???";

    // Destroy the session.
    request.session.destroy((error) => {
        if (error) {
            logger.error(`${request.method} ${request.originalUrl}: request.session.destroy error: ${error.toString()}`);
            
            response.status(500);
            response.render('message', {
                meta: {
                    url: request.protocol + '://' + request.get('host') + request.originalUrl,
                    title: "Cover Hurtownia",
                    description: "Błąd serwera",
                    image: "/assets/banner.png"
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
            logger.info(`${request.method} ${request.originalUrl}: user logged out: ${username}`);

            response.clearCookie("session", { sameSite: true, httpOnly: true, secure: false });
            
            response.status(200);
            response.render('message', {
                meta: {
                    url: request.protocol + '://' + request.get('host') + request.originalUrl,
                    title: "Cover Hurtownia",
                    description: "Wylogowano",
                    image: "/assets/banner.png"
                },
                message: {
                    className: "is-success",
                    title: "Sukces",
                    content: "Wylogowano pomyślnie.",
                    buttons: [
                        { href: "/", content: "Przejdź do strony głównej", className: "is-primary" }
                    ]
                },
                session: request.session?.user
            });
        }
    });
};

export default logout;