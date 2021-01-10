import express from "express";

import * as resources from "../resources/index.js";
import getBindingType from "./get.js";

export const router = express.Router();

router.get("", getBindingType);
router.post("", resources.post("binding_types"));
router.put("", resources.put("binding_types"));
router.delete("", resources.delete("binding_types"));

router.get("/:id", resources.getById("binding_types"));
router.put("/:id", resources.putById("binding_types"));
router.delete("/:id", resources.deleteById("binding_types"));