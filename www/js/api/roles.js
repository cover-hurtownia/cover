export const roles = async () => {
    const response = await fetch("/api/roles", { method: "POST" });
    const json = await response.json();

    return json;
};