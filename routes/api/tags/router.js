import express from "express";

import { adminAuthorization } from "../../utilities.js";
import * as resources from "../resources/index.js";
import getTag from "./get.js";

export const router = express.Router();

router.get("", getTag);
router.post("", adminAuthorization, resources.post("tags"));
router.put("", adminAuthorization, resources.put("tags"));
router.delete("", adminAuthorization, resources.delete("tags"));

router.get("/:tag_id", resources.getById("tags", "tag_id"));
router.put("/:tag_id", adminAuthorization, resources.putById("tags", "tag_id"));
router.delete("/:tag_id", adminAuthorization, resources.deleteById("tags", "tag_id"));