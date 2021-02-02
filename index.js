import app from "./server.js";
import logger from "./logger.js";

if (process.env.PORT === undefined) {
    logger.warn("PORT not present in .env, using 8080");
}

if (process.env.HOST === undefined) {
    logger.warn("HOST not present in .env, using 0.0.0.0");
}

const PORT = process.env.PORT ?? 8080;
const HOST = process.env.HOST ?? "0.0.0.0";

app.listen(PORT, HOST);

logger.info(`Listening at http://${HOST}:${PORT}`);
