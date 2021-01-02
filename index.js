import app from "./server.js";
import logger from "./logger.js";

const PORT = process.env.PORT;
const HOST = process.env.HOST;

app.listen(PORT, HOST);

logger.info(`Listening at http://${HOST}:${PORT}`);
