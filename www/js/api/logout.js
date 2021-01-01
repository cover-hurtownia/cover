export const logout = async () => {
    const response = await fetch("/api/logout", { method: "POST" });
    const json = await response.json();

    return json;
};