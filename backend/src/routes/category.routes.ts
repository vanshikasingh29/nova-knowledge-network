import { Router } from "express";

import {
    createCategory,
    getCategories
} from "../controllers/category.controller";

import {
    validateBody
} from "../middleware/validation.middleware";

import {
    categorySchema
} from "../validation/schemas";


const router = Router();


router.post(
    "/",
    validateBody(categorySchema),
    createCategory
);


router.get(
    "/",
    getCategories
);


export default router;