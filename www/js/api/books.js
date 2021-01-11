import resources from "./resources.js";

export const books = resources("books");

books.getAuthors = (book_id) => fetch(`/api/books/${book_id}/authors`).then(_ => _.json());

books.addAuthors = (book_id, author_ids) => fetch(`/api/books/${book_id}/authors`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(Array.isArray(author_ids) ? author_ids : [author_ids])
}).then(_ => _.json());

books.setAuthors = (book_id, author_ids) => fetch(`/api/books/${book_id}/authors`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(Array.isArray(author_ids) ? author_ids : [author_ids])
}).then(_ => _.json());

books.deleteAuthors = (book_id, author_ids) => fetch(`/api/books/${book_id}/authors`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(Array.isArray(author_ids) ? author_ids : [author_ids])
}).then(_ => _.json());

books.deleteAuthorById = (book_id, author_id) => fetch(`/api/books/${book_id}/authors/${author_id}`, {
    method: "DELETE"
}).then(_ => _.json());