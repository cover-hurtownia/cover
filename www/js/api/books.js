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

books.getTags = (book_id) => fetch(`/api/books/${book_id}/tags`).then(_ => _.json());

books.addTags = (book_id, tag_ids) => fetch(`/api/books/${book_id}/tags`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(Array.isArray(tag_ids) ? tag_ids : [tag_ids])
}).then(_ => _.json());

books.setTags = (book_id, tag_ids) => fetch(`/api/books/${book_id}/tags`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(Array.isArray(tag_ids) ? tag_ids : [tag_ids])
}).then(_ => _.json());

books.deleteTags = (book_id, tag_ids) => fetch(`/api/books/${book_id}/tags`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(Array.isArray(tag_ids) ? tag_ids : [tag_ids])
}).then(_ => _.json());

books.deleteTagById = (book_id, tag_id) => fetch(`/api/books/${book_id}/tags/${tag_id}`, {
    method: "DELETE"
}).then(_ => _.json());