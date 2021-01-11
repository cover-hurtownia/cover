import express from "express";

import * as resources from "../resources/index.js";

import getImage from "./get.js";
import getImageById from "./getById.js";
import postImage from "./post.js";
import putImageById from "./putById.js";

export const router = express.Router();

router.get("", getImage);
router.post("", postImage);
router.delete("", resources.delete("images"));

router.get("/:image_id", getImageById);
router.put("/:image_id", putImageById);
router.delete("/:image_id", resources.deleteById("images", "image_id"));