import express from "express";

import { adminAuthorization } from "../../utilities.js";
import * as resources from "../resources/index.js";
import getBindingType from "./get.js";

export const router = express.Router();

router.get("", getBindingType);
router.post("", adminAuthorization, resources.post("book_formats"));
router.put("", adminAuthorization, resources.put("book_formats"));
router.delete("", adminAuthorization, resources.delete("book_formats"));

router.get("/:book_format_id", resources.getById("book_formats"));
router.put("/:book_format_id", adminAuthorization, resources.putById("book_formats", "book_format_id"));
router.delete("/:book_format_id", adminAuthorization, resources.deleteById("book_formats", "book_format_id"));