import express from "express";

import * as resources from "../resources/index.js";
import getAuthor from "./get.js";

export const router = express.Router();

router.get("", getAuthor);
router.post("", resources.post("authors"));
router.put("", resources.put("authors"));
router.delete("", resources.delete("authors"));

router.get("/:id", resources.getById("authors"));
router.put("/:id", resources.putById("authors"));
router.delete("/:id", resources.deleteById("authors"));