import express from "express";

import { adminAuthorization } from "../../utilities.js";
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
router.post("", adminAuthorization, resources.post("books"));
router.put("", adminAuthorization, resources.put("books"));
router.delete("", adminAuthorization, resources.delete("books"));

router.get("/:book_id", getBookById);
router.put("/:book_id", adminAuthorization, resources.putById("books", "book_id"));
router.delete("/:book_id", adminAuthorization, resources.deleteById("books", "book_id"));

router.get("/:book_id/authors", getBookAuthors);
router.post("/:book_id/authors", adminAuthorization, postBookAuthors);
router.put("/:book_id/authors", adminAuthorization, putBookAuthors);
router.delete("/:book_id/authors", adminAuthorization, deleteBookAuthors);
router.delete("/:book_id/authors/:author_id", adminAuthorization, deleteBookAuthorById);

router.get("/:book_id/tags", getBookTags);
router.post("/:book_id/tags", adminAuthorization, postBookTags);
router.put("/:book_id/tags", adminAuthorization, putBookTags);
router.delete("/:book_id/tags", adminAuthorization, deleteBookTags);
router.delete("/:book_id/tags/:tag_id", adminAuthorization, deleteBookTagById);