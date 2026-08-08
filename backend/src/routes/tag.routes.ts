import { Router } from "express";

import {
    createTag,
    getTags
} from "../controllers/tag.controller";

import {
    validateBody
} from "../middleware/validation.middleware";

import {
    tagSchema
} from "../validation/schemas";


const router = Router();


router.post(
    "/",
    validateBody(tagSchema),
    createTag
);


router.get(
    "/",
    getTags
);


export default router;