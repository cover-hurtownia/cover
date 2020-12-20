document.getElementById("echo").addEventListener("submit", async event => {
    event.preventDefault();

    const data = Object.fromEntries(new FormData(event.target));

    const response = await fetch("/api/echo", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    });
    
    const json = await response.json();

    console.log("Received", json, "from /api/echo.");
});