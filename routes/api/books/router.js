import express from "express";

import * as resources from "../resources/index.js";
import getBook from "./get.js";
import getBookById from "./getById.js";

export const router = express.Router();

router.get("", getBook);
router.post("", resources.post("books"));
router.put("", resources.put("books"));
router.delete("", resources.delete("books"));

router.get("/:id", getBookById);
router.put("/:id", resources.putById("books"));
router.delete("/:id", resources.deleteById("books"));