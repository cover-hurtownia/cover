import express from "express";

import { adminAuthorization } from "../../utilities.js";
import * as resources from "../resources/index.js";
import getAuthor from "./get.js";

export const router = express.Router();

router.get("", getAuthor);
router.post("", adminAuthorization, resources.post("authors"));
router.put("", adminAuthorization, resources.put("authors"));
router.delete("", adminAuthorization, resources.delete("authors"));

router.get("/:author_id", resources.getById("authors", "author_id"));
router.put("/:author_id", adminAuthorization, resources.putById("authors", "author_id"));
router.delete("/:author_id", adminAuthorization, resources.deleteById("authors", "author_id"));