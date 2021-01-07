export const register = async (username, password) => {
    const response = await fetch("/api/register", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ username, password })
    });
    
    const json = await response.json();

    return json;
};