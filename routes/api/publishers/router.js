import express from "express";

import { adminAuthorization } from "../../utilities.js";
import * as resources from "../resources/index.js";
import getPublisher from "./get.js";

export const router = express.Router();

router.get("", getPublisher);
router.post("", adminAuthorization, resources.post("publishers"));
router.put("", adminAuthorization, resources.put("publishers"));
router.delete("", adminAuthorization, resources.delete("publishers"));

router.get("/:id", resources.getById("publishers"));
router.put("/:id", adminAuthorization, resources.putById("publishers"));
router.delete("/:id", adminAuthorization, resources.deleteById("publishers"));
