import express from "express";

import { adminAuthorization } from "../../utilities.js";
import * as resources from "../resources/index.js";
import getTag from "./get.js";

export const router = express.Router();

router.get("", getTag);
router.post("", adminAuthorization, resources.post("tags"));
router.put("", adminAuthorization, resources.put("tags"));
router.delete("", adminAuthorization, resources.delete("tags"));

router.get("/:id", resources.getById("tags"));
router.put("/:id", adminAuthorization, resources.putById("tags"));
router.delete("/:id", adminAuthorization, resources.deleteById("tags"));