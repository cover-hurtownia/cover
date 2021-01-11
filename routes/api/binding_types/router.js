import express from "express";

import { adminAuthorization } from "../../utilities.js";
import * as resources from "../resources/index.js";
import getBindingType from "./get.js";

export const router = express.Router();

router.get("", getBindingType);
router.post("", adminAuthorization, resources.post("binding_types"));
router.put("", adminAuthorization, resources.put("binding_types"));
router.delete("", adminAuthorization, resources.delete("binding_types"));

router.get("/:binding_type_id", resources.getById("binding_types"));
router.put("/:binding_type_id", adminAuthorization, resources.putById("binding_types", "binding_type_id"));
router.delete("/:binding_type_id", adminAuthorization, resources.deleteById("binding_types", "binding_type_id"));