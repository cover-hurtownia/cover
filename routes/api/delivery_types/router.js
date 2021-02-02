import express from "express";

import { adminAuthorization } from "../../utilities.js";
import * as resources from "../resources/index.js";
import getDeliveryType from "./get.js";

export const router = express.Router();

router.get("", getDeliveryType);
router.post("", adminAuthorization, resources.post("delivery_types"));
router.put("", adminAuthorization, resources.put("delivery_types"));
router.delete("", adminAuthorization, resources.delete("delivery_types"));

router.get("/:delivery_type_id", resources.getById("delivery_types", "delivery_type_id"));
router.put("/:delivery_type_id", adminAuthorization, resources.putById("delivery_types", "delivery_type_id"));
router.delete("/:delivery_type_id", adminAuthorization, resources.deleteById("delivery_types", "delivery_type_id"));