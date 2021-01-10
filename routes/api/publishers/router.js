import express from "express";

import * as resources from "../resources/index.js";
import getPublisher from "./get.js";

export const router = express.Router();

router.get("", getPublisher);
router.post("", resources.post("publishers"));
router.put("", resources.put("publishers"));
router.delete("", resources.delete("publishers"));

router.get("/:id", resources.getById("publishers"));
router.put("/:id", resources.putById("publishers"));
router.delete("/:id", resources.deleteById("publishers"));