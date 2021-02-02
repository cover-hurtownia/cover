export const echo = async data => {
    const response = await fetch("/api/echo", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    });
    
    const json = await response.json();

    return json;
};