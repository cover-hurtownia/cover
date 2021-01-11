import express from "express";

import * as resources from "../resources/index.js";
import getBook from "./get.js";
import getBookById from "./getById.js";

import getBookAuthors from "./authors/get.js";
import postBookAuthors from "./authors/post.js";
import putBookAuthors from "./authors/put.js";
import deleteBookAuthors from "./authors/delete.js";
import deleteBookAuthorById from "./authors/deleteById.js";

import getBookTags from "./tags/get.js";
import postBookTags from "./tags/post.js";
import putBookTags from "./tags/put.js";
import deleteBookTags from "./tags/delete.js";
import deleteBookTagById from "./tags/deleteById.js";

export const router = express.Router();

router.get("", getBook);
router.post("", resources.post("books"));
router.put("", resources.put("books"));
router.delete("", resources.delete("books"));

router.get("/:book_id", getBookById);
router.put("/:book_id", resources.putById("books", "book_id"));
router.delete("/:book_id", resources.deleteById("books", "book_id"));

router.get("/:book_id/authors", getBookAuthors);
router.post("/:book_id/authors", postBookAuthors);
router.put("/:book_id/authors", putBookAuthors);
router.delete("/:book_id/authors", deleteBookAuthors);
router.delete("/:book_id/authors/:author_id", deleteBookAuthorById);

router.get("/:book_id/tags", getBookTags);
router.post("/:book_id/tags", postBookTags);
router.put("/:book_id/tags", putBookTags);
router.delete("/:book_id/tags", deleteBookTags);
router.delete("/:book_id/tags/:tag_id", deleteBookTagById);