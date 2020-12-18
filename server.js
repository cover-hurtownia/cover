import express from "express";

const PORT = 8080;
const HOST = "0.0.0.0";

const app = express();
app.use("/", express.static("www"));
app.listen(PORT, HOST);

console.log(`Listening at http://${HOST}:${PORT}.`);