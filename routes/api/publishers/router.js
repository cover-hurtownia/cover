import express from "express";

import { adminAuthorization } from "../../utilities.js";
import * as resources from "../resources/index.js";
import getPublisher from "./get.js";

export const router = express.Router();

router.get("", getPublisher);
router.post("", adminAuthorization, resources.post("publishers"));
router.put("", adminAuthorization, resources.put("publishers"));
router.delete("", adminAuthorization, resources.delete("publishers"));

router.get("/:publisher_id", resources.getById("publishers", "publisher_id"));
router.put("/:publisher_id", adminAuthorization, resources.putById("publishers", "publisher_id"));
router.delete("/:publisher_id", adminAuthorization, resources.deleteById("publishers", "publisher_id"));
