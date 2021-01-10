import express from "express";

import * as resources from "../resources/index.js";
import getPublisher from "./get.js";

export const router = express.Router();

router.get("", getPublisher);
router.post("", resources.post("publishers"));
router.put("", resources.put("publishers"));
router.delete("", resources.delete("publishers"));

router.get("/:publisher_id", resources.getById("publishers", "publisher_id"));
router.put("/:publisher_id", resources.putById("publishers", "publisher_id"));
router.delete("/:publisher_id", resources.deleteById("publishers", "publisher_id"));