import express from "express";

import { adminAuthorization } from "../../utilities.js";
import * as resources from "../resources/index.js";
import getAuthor from "./get.js";

export const router = express.Router();

router.get("", getAuthor);
router.post("", adminAuthorization, resources.post("authors"));
router.put("", adminAuthorization, resources.put("authors"));
router.delete("", adminAuthorization, resources.delete("authors"));

router.get("/:id", resources.getById("authors"));
router.put("/:id", adminAuthorization, resources.putById("authors"));
router.delete("/:id", adminAuthorization, resources.deleteById("authors"));