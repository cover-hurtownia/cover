import * as API from "./api/index.js";

document.getElementById("echo").addEventListener("submit", async event => {
    event.preventDefault();

    const data = Object.fromEntries(new FormData(event.target));
    const response = await API.echo(data);

    console.log("Received", response, "from /api/echo.");
});