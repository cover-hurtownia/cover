export const session = async () => {
    const response = await fetch("/api/session", { method: "POST" });
    const json = await response.json();
    
    return json;
};